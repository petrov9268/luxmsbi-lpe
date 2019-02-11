/**
 Copyright (c) 2019 Luxms Inc.

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the Software
 is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import console from './console/console';
import {parse} from './lpep';
import {db_quote_literal} from './utils/utils';
import {eval_lisp} from './lisp';


/*
where - всегда возвращает слово WHERE, а потом условия. На пустом вхоже вернёт WHERE TRUE
filter - на пустом входе вернёт пустую строку
*/

export function sql_where_context(_vars) {
  var _context = _vars;

  var try_to_quote_column = function(colname) {
    if (typeof _vars['_columns'] == 'object') {
      var h = _vars['_columns'][colname];
      if (typeof h == "object") {
        h = h['name'].toString();
        // console.log("-: try_to_quote_column " + JSON.stringify(h));
        // console.log("-: try_to_quote_column " + (typeof h));
        if (h.length > 0) {
          // return '"' + h + '"';
          return h;
        }
      }
    }
    return colname.toString();
  };

  var try_to_quote_order_by_column = function(colname) {
    if (typeof _vars['_columns'] == 'object') {
      var h = _vars['_columns'][colname];
      if (typeof h == "object") {
        var o = h['order'];
        if (o === undefined) {
          o = h['name'];
        }
        console.log("-: try_to_quote_order_by_column " + JSON.stringify(o));
        console.log("-: try_to_quote_order_by_column " + (typeof o));
        if (o !== undefined && o.length > 0) {
          //return '"' + o.toString() + '"';
          return o.toString();
        }
      }
    }
    return colname.toString();
  };

  var resolve_literal = function(lit) {
    console.log('LITERAL ', lit, '  CONTEXT:', _vars[lit]);
    if (_vars[lit] == undefined ) {
      return try_to_quote_column(lit);
    } else {
      // есть возможность переименовать имена столбцов! или сделать ещё какие-то подстановки
      return eval_lisp(lit, _vars);
    }
  };

  var resolve_order_by_literal = function(lit) {
    console.log('OB LITERAL ', lit, ' CONTEXT:', _vars[lit]);

    if (_vars[lit] === undefined ) {
      return try_to_quote_order_by_column(lit);
    } else {
      // есть возможность переименовать имена столбцов! или сделать ещё какие-то подстановки
      return eval_lisp(lit, _vars);
    }
  };

  /* заполняем контекст функциями и макросами, заточенными на SQL */
  _context['order_by'] = function () {
    var ret = [];
    var ctx = {};
    for(var key in _vars) ctx[key] = _vars[key];
    // так как order_by будет выполнять eval_lisp, когда встретит имя стольба с минусом -a, то мы
    // с помощью макросов + и - в этом случае перехватим вызов и сделаем обработку.
    // а вот когда работает обработчик аргументов where - там eval_lisp почти никогда не вызывается...
    ctx['+'] = function (a) {
      if (a instanceof Array) {
        throw("recursive +..-");
      } else {
        return resolve_order_by_literal(a);
      }
    }
    ctx['+'].ast = [[],{},[],1]; // mark as macro

    ctx['-'] = function (a) {
      //console.log("-: call " + JSON.stringify(a));
      if (a instanceof Array) {
        throw("recursive -..+");
      } else {
        return resolve_order_by_literal(a) + ' ' + 'DESC';
      }
    }
    ctx['-'].ast = [[],{},[],1]; // mark as macro

    for(var i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Array) {
          ret.push(eval_lisp(arguments[i], ctx) );
        } else {
          // try_to_quote_column берёт текст в двойные кавычки для известных столбцов!!!
          ret.push(resolve_order_by_literal(arguments[i].toString()));
        }
    }

    if (ret.length > 0) {
      return 'ORDER BY ' + ret.join(',');
    } else {
      return '';
    }
  };

  _context['order_by'].ast = [[],{},[],1]; // mark as macro


  _context['pg_interval'] = function (cnt, period_type) {
    var pt;
    if (period_type instanceof Object) {
      pt = period_type["unit"];
    } else {
      pt = period_type;
    }

    if (/^\d+$/.test(pt)) {
      // all numbers....
      switch(pt){
        case 1: pt = 'second'; break;
        case 2: pt = 'minute'; break;
        case 3: pt = 'hour'; break;
        case 4: pt = 'day'; break;
        case 5: pt = 'week'; break;
        case 6: pt = 'month'; break;
        case 7: pt = 'quarter'; break;
        case 8: pt = 'year'; break;
        default: throw("wrong period type:" + pt)
      }
    } else {
      var reg = new RegExp("['\"]+","g");
      pt = pt.replace(reg,"");
    }

    var regExp = new RegExp(/quarter/, "i");
    if (regExp.test(pt)){
      return "'" + (cnt * 3) + " month'::interval" ;
    }
    return "'" + cnt + " " + pt + "'::interval";
  }

  // filter
  _context['filter'] = function () {
      var ctx = {};
      for(var key in _vars) ctx[key] = _vars[key];

      var prnt = function(ar) {
        if (ar instanceof Array) {
          if (  ar[0] === '$' ||  
                ar[0] === '"' || 
                ar[0] === "'" || 
                ar[0] === "[" || 
                ar[0] === 'parse_kv' || 
                ar[0] === "=" ||
                ar[0] === "pg_interval") {
            return eval_lisp(ar, ctx);
          } else {
              if (ar.length == 2) {
                // unary
                if (ar[0] == "not") {
                  return ar[0] + ' ' + prnt(ar[1]);
                } else if (ar[0] == "()") {
                  return "(" + prnt(ar[1]) + ")";
                } else if (ar[0].match(/^[^\w]+$/)){
                  return ar[0] + prnt(ar[1]);
                } else {
                  return prnt(ar[0]) + "(" + prnt(ar[1]) + ")";
                }
              } else if (ar.length == 3) {
                if (ar[0] == "->") {
                  // наш LPE использует точку, как разделитель вызовов функций и кодирует её как ->
                  // в логических выражениях мы это воспринимаем как ссылку на <ИМЯ СХЕМЫ>.<ИМЯ ТАБЛИЦЫ>
                  //return '"' + ar[1]+ '"."' + ar[2] + '"';
                  return ar[1] + '.' + ar[2];
                } else if (ar[0] == "and" || ar[0] == "or" || ar[0] == "ilike" || ar[0] == "like" || 
                           ar[0] == "in" || ar[0] == "is" || ar[0].match(/^[^\w]+$/)) {
                  // имя функции не начинается с буквы
                  return prnt(ar[1]) + ' ' + ar[0] + ' ' + prnt(ar[2]);
                } else {
                  return ar[0] + '(' + prnt(ar[1]) + ',' + prnt(ar[2]) + ')';
                }
              } else {
                // это неизвестная функция с неизвестным кол-вом аргументов
                return ar[0] + '(' + ar.slice(1).map(
                  function(argel){return prnt(argel)}
                ).join(',') + ')';
              }
            }
        } else {
            return ar;
        }
      };

      ctx['"'] = function (el) {
        return '"' + el.toString() + '"';
      }
    
      ctx["'"] = function (el) {
        return "'" + el.toString() + "'";
      }
    
      ctx["["] = function (el) {
        return "[" + Array.prototype.slice.call(arguments).join(',') + "]";
      }

      ctx['='] = function (l,r) {
        if (r instanceof Array && r[0] == 'vector') {
          return prnt(l) + " in (" + r.slice(1).map(function(el){return prnt(el)}).join(',') + ")";
        }
        return prnt(l) + " = " + prnt(r);
      }
      ctx['='].ast = [[],{},[],1]; // mark as macro

      // $(name) will quote text elements !!! suitable for generating things like WHERE title in ('a','b','c')
      // also, we should evaluate expression, if any.
      ctx['$'] = function(inexpr) {
        var expr = eval_lisp(inexpr, _context); // evaluate in a normal LISP context without vars, not in WHERE context
        if (expr instanceof Array) {
          // try to print using quotes, use plv8 !!!
          return expr.map(function(el){
              if (typeof(el)==="string") {
                return db_quote_literal(el);
              } else if (typeof(el) === "number") {
                return el;
              } else {
                return db_quote_literal(JSON.stringify(el));
              }
            }).join(',');
        }
        return db_quote_literal(expr);
      }
      ctx['$'].ast = [[],{},[],1]; // mark as macro

      //  пока что считаем что у нас ОДИН аргумент и мы его интерпретируем как таблица.столбец
      ctx['parse_kv'] = function(expr) {
        if (expr instanceof Array) {
          if (expr[0] === '->') {
            var sql = 'select "' + expr[2]+ '" from "'+ expr[1] +'" where id = $1::INT';
            var id_val = resolve_literal(expr[1].replace(/.$/,"_id"));

            //console.log('SQL: ', sql, " val:", id_val);

            var res_json = plv8.execute(sql, [ id_val ] );
            //var res_json = [{"src_id":"$a:Вася:$b:Петя"}];
            var frst = res_json[0];

            //console.log('SQL RES: ', frst);

            if (frst !== undefined && frst[expr[2]] !== null && frst[expr[2]].length > 0) {
                var axis_condition = function(e){
                  var result = e.split(':').map(function(e2){
                      e2 = e2.replace(/\'/g , "''"); //' be safe
                      return (e2.indexOf('$') == 0 ? ' AND '+e2.substr(1)+'=' : "'"+e2+"'");
                  }).join('').substr(5);
                  return result;
                };

                var result =  axis_condition(frst[expr[2]]);
                if(result === undefined || result.length == 0) return '(/*kv not resolved*/ 0=1)';
                return result;
            }
          }
        }
        return '(/*parse_kv EMPTY*/ 1=0)';
      };
      ctx['parse_kv'].ast = [[],{},[],1]; // mark as macro

      var ret = [];
      //console.log("where IN: ", JSON.stringify(Array.prototype.slice.call(arguments)));

      var fts = _vars['fts'];
      var tree = arguments;

      if ( fts !== undefined && fts.length > 0) {
        fts = fts.replace(/\'/g , "''"); //' be safe
        // Full Text Search based on column_list
        if (typeof _vars['_columns'] == 'object') {

          //console.log("FTS: ",  JSON.stringify(fts));

          var ilike = Object.values(_vars['_columns']).map(function(col){
            col["search"] !== undefined
            ? ["ilike", col["search"], ["str", '%' + fts + '%']]
            : null
            }).reduce(function(ac, el) {el == null ? ac : ['or',ac,el]});

          //console.log( "FTS PARSED: ",  JSON.stringify(ilike));

          if (ilike !== undefined && ilike.length > 0) {
            // добавляем корень AND с нашим поиском
            tree = [["and",tree[0],['()',ilike]]];
          }
        }
      }

      for(var i = 0; i < tree.length; i++) {
          // console.log("array ", JSON.stringify(Array.prototype.slice.call(tree[i])));
          ret.push(prnt( tree[i], ctx));
      }

      var r = ret[0]; // у нас только один результат должен быть !!!
      if (r == undefined) {
        r = '';
      }
      return r;
    };
    _context['filter'].ast = [[],{},[],1]; // mark as macro


    // where - we should not eval arguments, so we must mark where as macro!!!
    _context['where'] = function () {
      // we should always get ONE argument, for example: ["=",["$",["->","period","title"]],3]
      // BUT if we get two, or more arguments, we eval them one by one, AND combine later with AND operand, skipping empty results...
      var tree = arguments;
      var ret = [];
      for(var i = 0; i < tree.length; i++) {
        // console.log("array ", JSON.stringify(Array.prototype.slice.call(tree[i])));
        var r = eval_lisp(["filter", tree[i]], _context); // r should be string
        if (r.length > 0) {
          ret.push(r);
        }
      }

      if (ret.length > 0) {
        if (ret.length > 1) {
          return 'WHERE (' + ret.join(') AND (') + ')'; 
        } else {
          return 'WHERE ' + ret[0]; 
        }
      } else {
        return 'WHERE TRUE';
      }
    };
    _context['where'].ast = [[],{},[],1]; // mark as macro

  return _context;
}









export function eval_sql_where(_expr, _vars) {
  if (typeof _vars === 'string') _vars = JSON.parse(_vars);

  var sexpr = parse(_expr);


  console.log('sql_where parse: ', JSON.stringify(sexpr));

  if ((sexpr instanceof Array) &&
     ((sexpr[0]==='filter' && (sexpr.length <=2)) || (sexpr[0]==='order_by') || (sexpr[0]==='if') || (sexpr[0]==='where') )) {
    // ok
  } else {
    throw("only single where() or order_by() could be evaluated.")
  }


  var _context = sql_where_context(_vars);

  var ret = eval_lisp(sexpr, _context);

  // console.log('ret: ',  JSON.stringify(ret));
  return ret;
}
