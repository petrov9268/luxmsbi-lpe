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
import {tokenize_sql_template} from './utils/lpe_sql_tokenizer.js';

import {eval_lisp, isString, isArray, isHash, isFunction, makeSF, isNumber, STDLIB} from './lisp';
import {sql_where_context} from './sql_where';
//import {eval_sql_where} from './sql_where';

import {parse} from './lpep';
import {
  reports_get_columns,
  reports_get_table_sql, 
  get_data_source_info,
  db_quote_literal,
  db_quote_ident
} from './utils/utils';

import { isObject } from 'core-js/fn/object';
import { has } from 'core-js/fn/dict';
import { part } from 'core-js/core/function';
import { forEach } from 'core-js/core/dict';


import { generateAggContext } from './funcs/agg.js';
import { generateCalendarContext } from './funcs/calendar.js';
import { generateWindowContext } from './funcs/window.js';

//console.log( JSON.stringify(generate_agg_funcs.init({"a":"b"})) );

//import util from 'license-report/lib/util';

//const SQL_where_context = sql_where_context({});

/* Постановка
На входе имеем структуру данных из браузера:
          { "with":"czt.fot",
              "filters": {
              "dor1": ["=", "ГОРЬК"],
              "dor2": ["=", "ПОДГОРЬК"],
              "dor4": ["=", null],
              "dor5": ["=", null],
              "Пол":  ["or", ["!="], ["ilike", "Муж"]],
              "dt": ["BETWEEN", "2020-01", "2020-12"],
              "sex_name": ["=", "Мужской"],
              "": [">", ["+",["col1", "col2"]], 100]
            },
            "having": {
              "dt": [">","2020-08"],
            },
            "return": "count", // возможно такое!!!
            "columns": ["dor3", "czt.fot.dor4", "fot.dor5", 'sum((val3+val1)/100):summa', {"new":"old"}, ["sum", ["column","val2"]],  {"new":  ["avg", ["+",["column","val2"],["column","val3"]]]} ],
            "sort": ["-dor1","val1",["-","val2"],"-czt.fot.dor2", "summa"]
          }

Требуется 
1) тексты отпарсить в скоботу и сделать готовые для eval структуры.
2) на основе with сходить в базу и получить всю инфу про столбцы куба, подготовить context для поиска столбцов по короткому и длинному имени.
3) выполнить eval для части columns -> получить массив структур, готовых к построению части SELECT.
   'sum((val3+val1)/100):summa' ===> 
   {
     expr: 'sum((fot.val3+fot.val1)/100)',
     alias: "summa",
     columns: ["czt.fot.val3","czt.fot.val1"],
     agg: true
     cubes: ["czt.fot"]
   }
   можно также в процессе вычисления определить тип столбца из базы, и автоматом навесить agg, например sum
4) на основе columns_struct вычислить group_by, проверить, требуется ли JOIN.
5) при вычислении фильтров, учесть group_by и сделать дополнение для столбцов, у которых в конфиге указано как селектить ALL (memberALL)
6) создать какое-то чудо, которое будет печатать SQL из этих структур.
7) при генерации SQL в ПРОСТОМ случае, когда у нас один единственный куб, генрим КОРОТКИЕ имена столбцов
*/


// из клиента приходят имена столбов в разных регистрах, и ответ клиент ждёт тоже в разных
// регистрах...
function should_quote_alias(name) {
  return name.match(/^[_a-z][_a-z0-9]*$/) === null
}

function upper_by_default(db) {
  return db === 'oracle' || db === 'teradata' || db === 'sap'
}

/**
 * возвращает строку `col AS alias`
 * @param {*} db 
 * @param {*} src 
 * @param {*} alias 
 * @returns 
 */
function quot_as_expression(db, src, alias) {
  // 1 определяем, нужно ли квотировать 
  let should_quote = false;

  if (upper_by_default(db)) {
    should_quote = true
    // `select col from dual` вернёт в JDBC `COL` заглавными буквами !!!
    // это ломает клиент, который ждёт lowercase названия объектов


    // teradata не понимает max(a) as max
    // Поэтому, для оракла будем брать в кавычки все абсолютно столбцы и делать из них алиасы!
    // потом в условиях order by надо будет добавить кавычки тоже!
    /*if (alias.match(/^[a-zA-Z]\w*$/) === null) {
      should_quote = true
    }*/
  } else {
    // если есть хоть одна заглавная буква, пробел или не ASCII символ
    if (should_quote_alias(alias)) {
      should_quote = true
    }
  }

  if (!should_quote) {
    return `${src} as ${alias}`
  }


  if (db === 'mysql'){
    return `${src} as ` + "`" + `${alias}` + "`"
  } else {
    return `${src} as "${alias}"`
  }
}

/***************************************************************
 * Дописывает имена столбцов в структуре _cfg, до полных имён, используя префикс cube_prefix, там, где это очевидно.
 * простые тексты переводит в LPE скоботу
 * Считаем, что любой встреченный литерал является именем столбца.
 * в контексте ctx[_columns] должны быть описания столбцов из базы
 */
function normalize_koob_config(_cfg, cube_prefix, ctx) {
  var parts = cube_prefix.split('.')
  var ds = parts[0]
  var cube = parts[1]
  var ret = {
    "ds":ds, "cube":cube, "filters":{}, "having":{}, "columns":[], "sort": [], 
    "limit": _cfg["limit"], "offset": _cfg["offset"], "subtotals": _cfg["subtotals"],
    "options": isArray(_cfg["options"]) ? _cfg["options"] : [],
    "return": _cfg["return"], "config": _cfg["config"]
  }
  var aliases = {}

  if (_cfg["distinct"]) ret["distinct"]=[]

  /* expand_column также будем делать в процессе выполнения LPE, там будет вся инфа про куб, и про его дименшены. 
     мы будем точно знать, является ли суффикс именем столбца из куба или нет.
     То есть нужна правильная реализация функции column и правильная реализация для неизвестного литерала, с учётом алиасов !!!
  */

  var expand_column = (col) => {
    return col.match(/("[^"]+"|[^\.]+)\.("[^"]+"|[^\.]+)/) === null
      ? (ctx._columns[`${cube_prefix}.${col}`] ? `${cube_prefix}.${col}` : col )
      : col
  }


  // для фильтров заменяем ключи на полные имена
  if (isHash(_cfg["filters"])) {
    Object.keys(_cfg["filters"]).filter(k => k !== "").map( 
      key => {ret["filters"][expand_column(key)] = _cfg["filters"][key]} )
    ret["filters"][""] = _cfg["filters"][""]
  }

  // для having заменяем ключи на полные имена
  if (isHash(_cfg["having"])) {
    Object.keys(_cfg["having"]).filter(k => k !== "").map( 
      key => {ret["having"][expand_column(key)] = _cfg["having"][key]} )
    ret["having"][""] = _cfg["having"][""]
  }

  // для фильтров заменяем ключи на полные имена, но у нас может быть массив [{},{}]
  if (isArray(_cfg["filters"])) {
    var processed = _cfg["filters"].map(obj => {
        var result = {}
        if (isHash(obj)) {
          Object.keys(obj).filter(k => k !== "").map( 
              key => {result[expand_column(key)] = obj[key]})
          result[""] = obj[""]
        }
        return result
        }
    )
    ret["filters"] = processed; // [{},{}]
  }


  // probably we should use aliased columns a AS b!!
  if (isArray(_cfg["having"])) {
    Object.keys(_cfg["having"]).filter(k => k !== "").map( 
      key => ret["having"][expand_column(key)] = _cfg["having"][key] )
  }



  // "sort": ["-dor1","val1",["-","val2"],"-czt.fot.dor2", ["-",["column","val3"]]]
  // FIXME: нужна поддержка "sort": [1,3,-2]
  // FIXME: может быть лучше перейти на ORDER BY 2, 1 DESC, 4 ???? 
  // FIXME: тогда не надо будет париться с квотацией
  if (isArray(_cfg["sort"])) {
    ret["sort"] = _cfg["sort"].map(el => {
      if(Array.isArray(el)){
        if (el.length === 2){
          if (el[0] === "-" || el[0] === "+"){
            if (Array.isArray(el[1])){
              if (el[1][0] === "column") {
                return [el[0], ["column", expand_column(el[1][1])]]
              }
            } else {
              return [el[0], ["colref", el[1]]]
            }
          }
        }
      } else if (el && typeof el === 'string') {
        // тут может быть ссылка как на столбец, так и на alias, надо бы научиться отличать одно от другого
        // чтобы отличить alias от столбца - не делаем expand_column сейчас, и используем вызов colref!
        // FIXME: colref сейчас объявлен только для контекста sort!
        // FIXME: мы теряем имя куба: cube_prefix
        if (el.startsWith("-")) {
          return ["-", ["colref", el.substring(1)]]
        } else if (el.startsWith("+")) {
          return ["+", ["colref", el.substring(1)]]
        } else {
          return ["+", ["colref", el]]
        }
      }
    })
  }

  // "columns": ["dor3", "src.cube.dor4", "cube.col", 'sum((val3+val1)/100):summa', {"new":"old"}, ["sum", ["column","val2"]],  {"new":  ["avg", ["+",["column","val2"],["column","val3"]]]} ],
  /* возвращает примерно вот такое:
  [["column","ch.fot_out.dor3"],["->","src","cube","dor4"],["->","cube","col"],[":",["sum",["/",["()",["+","val3","val1"]],100]],"summa"],[":",["column","ch.fot_out.old"],"new"],["sum",["column","val2"]],[":",["avg",["+",["column","val2"],["column","val3"]]],"new"]]
  простые случаи раскладывает в скоботу сразу, чтобы не запускать eval_lisp
  */
  var expand_column_expression = function(el) {
    if (isString(el)) {
      // do not call parse on simple strings, which looks like column names !!!
      if (el.match(/^[a-zA-Z_][\w ]*$/) !== null) {
        return ["column", expand_column( el )]
      }

      // exactly full column name, но может быть лучше это скинуть в ->
      if (el.match(/^([a-zA-Z_][\w ]*\.){1,2}[a-zA-Z_][\w ]*$/) !== null) {
        return ["column",  el]
      }

      // can throw exceptions
      try {
        // try parsing
        var ast = parse(`expr(${el})`)
        if (typeof ast === 'string') {
          // but if it was string, try to expand
          return ["column", expand_column( ast )]
        }

        return ast
      } catch {
        // if failed, return as is
        return ["column",  el]
      }
    } else if (Array.isArray(el)){
      return el
    } else {
      throw new Error(`Wrong element in the columns array: ${el.toString()}`)
    }
  } 

  // turn text lpe representations into AST, keep AST as is...
  ret["columns"] = _cfg["columns"].map(el => {
    if (isHash(el)) {
      return [":", expand_column_expression(Object.values(el)[0]), Object.keys(el)[0]]
    } else {
      return expand_column_expression(el)
    }
  })

  //console.log(`COLUMNS: ${JSON.stringify(ret["filters"])}`)

  return ret;
}


/* _c = контекст, откуда берём на выбор функции */
function init_udf_args_context(_cube, _vars, _target_database, _c) {
  // ожидаем на вход хэш с фильтрами _vars прямо из нашего запроса koob...
  // _context._target_database === 'postgresql'
  /*
   {"dt":["between",2019,2022],"id":["=",23000035],"regions":["=","Moscow","piter","tumen"]}
  udf_args:  ["dir","regions","id","id","dt","dt"]
  udf_args:  ["dir",["ql","regions"],"id","id","dt","dt"]
  для квотации уже не работает, нужен кастомный резолвер имён ;-) а значит специальный контекст, в котором
  надо эвалить каждый второй аргумент: TODO

  если ключ (нечётный аргумент - пустой, то пишем без имени аргумента...)

  where @dir = 'Moscow@piter@tumen', @id = 23000035 => sep(@)
  'VAL1, VAL2, VAL3'                                => sep(,)
  '''VAL1'',''VAL2'',''VAL3'''                      => sep(,), quot( ql2 )
  */

  let udf_arg_cfg = {
    "sqlserver":{
      "arg_prefix": "",
      "arg_suffix": "",
      "arg_sep": ", ",
      "array_val_sep": "@",
      "array_val_quot": "",
      "array_val_quot_enforced": true, // always quoting, ignore what user wants
      "array_quot": "ql",
      "varname_prefix": "@",
      "varname_suffix": " = "
    },
    "sap":{
      "arg_prefix": "'PLACEHOLDER' = (",
      "arg_suffix": ")",
      "arg_sep": ", ",
      "array_val_sep": ",",
      "array_val_quot": "ql", // if ql() provided in template we call this func
      "array_val_quot_enforced": false, 
      "array_quot": "ql", // hard coded func called in any case !
      "varname_prefix": "'$$",
      "varname_suffix": "$$', "
    },
    "postgresql":{
      "arg_prefix": "",
      "arg_suffix": "",
      "arg_sep": ", ",
      "array_val_sep": ",",
      "array_val_quot": "qj", // quot JSON val with "" 
      "array_val_quot_enforced": true, // always quoting, ignore what user wants
      "array_quot": "", // if empty, then try array_prefix
      "array_prefix": "$lpe_array_quot$[",
      "array_suffix": "]$lpe_array_quot$", // '["val1","val2","val\"123"]'
      "varname_prefix": null, // means that var name should be skipped!!!
      "varname_suffix": null
    }
  }

  let c = udf_arg_cfg[_target_database]
  let generate_array_literal = function(list, is_in_ql_call){
    let possible_quot = c.array_val_quot
    if (!c.array_val_quot_enforced && !is_in_ql_call) {
      possible_quot = ""
    }
    if (possible_quot === "") {
      return list.join(c.array_val_sep);
    } else if (possible_quot === "ql"){
      return list.map(v=> db_quote_literal(v)).join(c.array_val_sep)
    } else if (possible_quot === "qj"){
      // json quoting
      return list.map(v=> JSON.stringify(v)).join(c.array_val_sep)
    } 
  } 
  let _cctx = {};

  if (isFunction(_c["get_in"])) {
    _cctx["get_in"] = _c["get_in"]
  }

  let quote_array_literal = function(v) {
    if (c.array_quot==="ql") {
      return db_quote_literal(v)
    } else if (c.array_prefix){
      return `${c.array_prefix}${v}${c.array_suffix}`
    } else {
      return v
    }
  }

  /* we may need to query database to generate val list
  for example: ["between", '2001-01-01','2002-02-01'] should generate list of dates...
  for now this part is buggy and very limited...
  basically it either return one value, or list value


  */
  function eval_filters_expr(filters, name) {
    if (filters[0] === '=') {
      if (filters.length > 2){
        // return array
        return filters.slice(1);
      } else {
        if (filters.length === 2) {
          // return just value
          return filters[1]
        }
      }
    }
    throw new Error(`udf_args() can not handle filter op ${filters[0]} yet`)
  }

  // возвращает JSON запрос целиком! 
  _cctx["koob_filters"] = function() {
    //console.log(JSON.stringify(_vars))
    //return JSON.stringify(_vars)
    return _vars
  }

  _cctx["udf_args"] = makeSF((ast,ctx) => {
      // аргументы = пары значениий, 
      //console.log(`udf_args: `, JSON.stringify(ast))

      if (udf_arg_cfg[_target_database] === undefined) {
        throw new Error("udf_args() is not yet supported for: ".concat(_target_database));
      }

      let print_val_var_pair = function(k,v, is_array) {
        //console.log(`KV: ${k} = ${v}`)
        let s = c.arg_prefix
        if (c.varname_prefix === null) {
          // skip var name completely !!! usefull for postgresql??
          // and other positional arg functions
          s = `${s}`;
        } else {
          s = `${s}${c.varname_prefix}${k}${c.varname_suffix}`;
        }
        if (is_array) {
          return `${s}${quote_array_literal(v)}${c.arg_suffix}`
        } else {
          return `${s}${v}${c.arg_suffix}`
        }
      }

      let pairs = ast.reduce((list, _, index, source) => {
        if (index % 2 === 0) {
          let name = source[index];
          let filter_ast = source[index+1];
          //console.log(`SRC: ${name}` + JSON.stringify(source));
          name = eval_lisp(name, _cctx); // should eval to itself !
          //console.log(`filtername: ${name} filters AST ` + JSON.stringify(filter_ast))
          // FIXME!! тут нужен собственный резолвер ИМЁН, который понимает wantCallable
          // и ищет имена в _vars как запасной вариант!!!

          let filters = eval_lisp(filter_ast, ctx, {"resolveString":false}); // включая _vars !
          //console.log('filters evaled to ' + JSON.stringify(filters))
          if (filters !== undefined) {
            if (isArray(filters)){
              let vallist = eval_filters_expr(filters)
              if (isArray(vallist)){
                let expr = generate_array_literal(vallist, false);
                if (expr.length>0) {
                  list.push( print_val_var_pair(name, expr, true) )
                } else {
                  throw new Error(`udf_args() has filter without value, only op ${filters[0]}`)
                }
              } else {
                list.push( print_val_var_pair(name, vallist) )
              }
            } else {
              //console.log(`NEVER BE HERE! ${filters}`)
              if (filters.length > 0) {
                if (name && name.length > 0){
                  list.push(print_val_var_pair(name, filters))
                } else {
                  // postgresql might skip names ???
                  list.push(`${filters}`)
                }
              }
            }
          }
        }
        return list;
      }, []);

    return pairs.join(c.arg_sep)
  });

  _cctx["ql"] = function(arg) {
    //console.log(`QL: ${arg}`  + JSON.stringify(arg))
    if (isArray(arg)){
      //console.log('QL:'  + JSON.stringify(arg))
      let vallist = eval_filters_expr(arg)
      if (isArray(vallist)){
        let expr = generate_array_literal(vallist, true); // enforce quoting as it is ql() call
        return quote_array_literal(expr)
      } else {
        return db_quote_literal(vallist)
      }
    } else {
      if (arg !== undefined) {
        //console.log(`QUOT FOR ${arg}`)
        if (isHash(arg)){
          // This is JSON as hash, we should quote it as string!
          return db_quote_literal(JSON.stringify(arg))
        }
        return db_quote_literal(arg)
      } 
    }
    return undefined
  }

  return [ 
    _cctx,
    // функция, которая резолвит имена столбцов для случаев, когда имя функции не определено в явном виде в _vars/_context
    // а также пытается зарезолвить коэффициенты
    (key, val, resolveOptions) => {
      //console.log("RESOLVER : " + key + " " + JSON.stringify(resolveOptions))
      if (resolveOptions && resolveOptions.wantCallable) {
        return undefined // try standard context in _cctx
      }
      let fullname = `${_cube}.${key}`
      //console.log("RESOLVER2:" + `CUBE: ${_cube} FULLNAME: ${fullname}  _vars: ${JSON.stringify(_vars)}` + _vars[fullname])
      return _vars[fullname]
    }    
];

}
 

/*********************************
 * 
 * init_koob_context
 * на входе контекст может быть массивом, а может быть хэшем. Стало сложнее с этим работать!
 * Cчитаем, что на входе может быть только хэш с уже прочитанными именами столбцов!!
 */



function init_koob_context(_vars, default_ds, default_cube) {
  let _ctx = [] // это контекст где будет сначала список переменных, включая _columns, и функции
  if (isHash(_vars)){
    //_ctx = [{..._vars}]
    _ctx = [{}, _vars]
  }
  let _context = _ctx[0];
  let _variables = _ctx[1];

  let agg_funcs = generateAggContext(_variables)
  let cal_funcs = generateCalendarContext(_variables)
  let win_funcs = generateWindowContext(_variables)
  
  //_context["lpe_median"] = agg_funcs["lpe_median"]



  // пытается определить тип аргумента, если это похоже на столбец, то ищет про него инфу в кэше и определяет тип,
  // а по типу можно уже думать, квотировать значения или нет.
  var shouldQuote = function(col, v) {
    if (isArray(col) && col[0] === 'column') {
      //try to detect column type
      var c = _variables["_columns"][col[1]]
      if (c) {
        return (c.type !== 'NUMBER')
      }
      return isString(v);
    }

    // это формула над какими-то столбцами...
    // смотрим на тип выражения v, если это текст, то возвращаем true,
    // но сначала проверим, вдруг это alias???
    if (_variables["_aliases"][v]) {
      return false;
    }


    // left and right side looks like a column names, don't quote
    if ( isString(col) && isString(v) &&
         (col.match(/^[A-Za-z_]+\w*$/) || col.match(/^[A-Za-z_]+\w*\.[A-Za-z_]+\w*$/))
         &&
         (v.match(/^[A-Za-z_]+\w*$/) || v.match(/^[A-Za-z_]+\w*\.[A-Za-z_]+\w*$/))
    ) {
      return false
    }

    return isString(v);
  }
  
  var quoteLiteral = function (lit) {
    if (isString(lit) || isNumber(lit) || (isArray(lit) && lit[0] !== "ql")) {
      return ["ql", lit]
    }
    return lit
  }

  /* если нужно, берёт в кавычки, но не делает eval для первого аргумента! */
  /* Считается, что первый аргумент - строка или число но не ast */
  var evalQuoteLiteral = function(lit) {
      return lit === null ? null : db_quote_literal(lit)
  }

  // функция, которая резолвит имена столбцов для случаев, когда имя функции не определено в явном виде в _vars/_context
  // а также пытается зарезолвить коэффициенты
  _ctx.push(
    (key, val, resolveOptions) => {
      // console.log(`WANT to resolve ${key} ${val}`, JSON.stringify(resolveOptions));
      // console.log(`COLUMN: `, JSON.stringify(_variables["_columns"][key]));
      // вызываем функцию column(ПолноеИмяСтолбца) если нашли столбец в дефолтном кубе
      if (_variables["_columns"][key]) return _context["column"](key)
      //console.log('NOT HERE?')
      if (_variables["_columns"][default_ds][default_cube][key]) return _context["column"](`${default_ds}.${default_cube}.${key}`)
      // reference to alias!
      //console.log("DO WE HAVE SUCH ALIAS?" , JSON.stringify(_variables["_aliases"]))
      // алиас не должен переопределять функции с таким же именем
      if (_variables["_aliases"][key] && (resolveOptions === undefined || !resolveOptions["wantCallable"])) {
        if (!isHash(_variables["_result"])) {
          _variables["_result"] = {}
        }
        if (!isArray(_variables["_result"]["columns"])){
          _variables["_result"]["columns"] = []
        }
        // remeber reference to alias as column name!
        _variables["_result"]["columns"].push(key)

        // mark our expression same as target
        // FIXME: setting window will result in BUGS
        //_variables["_result"]["window"] = _variables["_aliases"][key]["window"]
        _variables["_result"]["agg"] = _variables["_aliases"][key]["agg"]

        // Mark agg function to display expr as is
        _variables["_result"]["outerVerbatim"] = true 

        return key;
      }

      if (resolveOptions && resolveOptions.wantCallable){
        if (key.match(/^\w+$/) ) {
          if (_variables["_result"]){
            //console.log("HUY!! " + JSON.stringify(key))
            // в этом списке только стандартные вещи, которые во всех базах одинаково пишутся
            if (['sum','avg','min','max','count'].find(el => el === key)){
              _variables["_result"]["agg"] = true
            }
          }

          return function() {
            var a = Array.prototype.slice.call(arguments);
            //console.log(`FUNC RESOLV ${key}`, JSON.stringify(a))
            if (key.match(/^between$/i)) {
              //console.log(`between(${a.join(',')})`)
              var e = eval_lisp(["between"].concat(a),_ctx)
              return e
            }

            if (key === 'count') {
              if (_variables._target_database == 'clickhouse') {
                // console.log('COUNT:' + JSON.stringify(a))
                // у нас всегда должен быть один аргумент и он уже прошёл eval !!!
                // Это БАГ в тыкдоме v21 = отдаёт текстом значения, если count делать :-()
                return `toUInt32(count(${a[0]}))`
              }
            }

            if (key === 'only1' || key === 'on1y') {
              // особый режим выполнения SQL.
              // ставим флаг, потом будем оптимизировать запрос!
              _variables["_result"]["only1"] = true
              return a[0]
            }

            return `${key}(${a.join(',')})`
          }
        } else {
          // -> ~ > < != <> and so on,
          //  FIXME: мы должны вернуть более умный макрос, который будет искать вызовы column в левой и правой части и делать ql при необходимости
          return makeSF((ast,ctx) => {
            //console.log(`ANY FUNC ${key}`, JSON.stringify(ast))
            var k = key
            var col = ast[0]

            //FIXME: надо бы тоже quoteLiteral вызывать для c
            var c = eval_lisp(col,ctx)

            if (ast.length === 1) {
              // например `-1 * sum(col)`
              return `${k}${c}`
            }
            var v = ast[1]
            if (!(isString(v) && v.startsWith('$'))) {
              // коэфициент не надо квотировать, оно должно замениться на конкретное число!
              if (shouldQuote(col,v)) v = quoteLiteral(v)
            }
            
            v = eval_lisp(v,ctx)
            
            return `${c} ${k} ${v}`
          })
        }
      }

      if (key.startsWith('$')) {
        // возможно, это коэффициент?
        let val = _variables["_coefficients"][key]
        if (isNumber(val)) {
          return val
        }
      }


      // We may have references to yet unresolved aliases....
      if (isHash(_variables["_result"])){
        if (key.match(/^[A-Za-z_]+\w*$/)) {
          if (!isArray(_variables["_result"]["unresolved_aliases"])){
            _variables["_result"]["unresolved_aliases"] = []
          }
          _variables["_result"]["unresolved_aliases"].push(key)
        }
      }

      return key
    }
  ) // end of _ctx.push()


  _context["::"] = function(col, type) {
    if (_variables._target_database === 'postgresql' ||
    _variables._target_database === 'clickhouse'
    ) {
      return `${col}::${type}`
    } else {
      return `CAST(${col} AS ${type})`
    }
  }
  
  _context["to_char"] = function(col, fmt) {
    if (_variables._target_database  === 'clickhouse') {
      if (fmt === "'YYYY'") {
        return `leftPad(toString(toYear(${col})), 4, '0')`
      } else if (fmt === "'YYYY-\"Q\"Q'" ) {
        return `format('{}-Q{}', leftPad(toString(toYear(${col})), 4, '0'), toString(toQuarter(${col})))`
      } else if (fmt === "'YYYY-MM'" ) {
        return `format('{}-{}', leftPad(toString(toYear(${col})), 4, '0'), leftPad(toString(toMonth(${col})), 2, '0'))`
      } else if (fmt === "'YYYY-\"W\"WW'" ) {
        return `format('{}-W{}', leftPad(toString(toYear(${col})), 4, '0'), leftPad(toString(toISOWeek(${col})), 2, '0'))`
      }
    } else {
      return `to_char(${col}, ${fmt})`
    }
  }

  _context["window"] = win_funcs["window"]

  _context["median"] = agg_funcs["median"]
  _context["quantile"] = agg_funcs["quantile"]
  _context["mode"] = agg_funcs["mode"]
  _context["varPop"] = agg_funcs["varPop"]
  _context["stddevPop"] = agg_funcs["stddevPop"]
  _context["varSamp"] = agg_funcs["varSamp"]
  _context["stddevSamp"] = agg_funcs["stddevSamp"]
  _context["corr"] = agg_funcs["corr"]
  _context["countIf"] = agg_funcs["countIf"]
 
  // deprecated REMOVE in v.11
  _context["var_pop"] = _context["varPop"]

  // deprecated REMOVE in v.11
  _context["var_samp"] = _context["varSamp"]

  // deprecated REMOVE in v.11
  _context["stddev_samp"] = _context["stddevSamp"];
 
  // deprecated REMOVE in v.11
  _context["stddev_pop"] = _context["stddevPop"]


  _context["dateShift"] = cal_funcs["dateShift"]
  _context["today"] = cal_funcs["today"]
  _context["now"] = cal_funcs["now"]
  _context["bound"] = cal_funcs["bound"]
  _context["extend"] = cal_funcs["extend"]
  _context["toStart"] = cal_funcs["toStart"]
  _context["toEnd"] = cal_funcs["toEnd"]


  _context["isoy"] = cal_funcs["isoy"]
  _context["isoq"] = cal_funcs["isoq"]
  _context["isom"] = cal_funcs["isom"]
  _context["isow"] = cal_funcs["isow"]
  _context["isod"] = cal_funcs["isod"]

  _context["year"] = cal_funcs["year"]
  _context["hoty"] = cal_funcs["hoty"]
  _context["qoty"] = cal_funcs["qoty"]
  _context["moty"] = cal_funcs["moty"]
  _context["woty"] = cal_funcs["woty"]
  _context["doty"] = cal_funcs["doty"]

  _context["_sequence"] = 0; // magic sequence number for uniq names generation
  
  // специальная обёртка для вычисления lpe выражений.
  // Например, в lpe есть count(), split() которые сейчас транслируются в SQL.
  // у lpe должен быть только один аргумент!  lpe(get_in().map(ql))
  _context["lpe"] = makeSF((ast, ctx, rs) => {
    let _v = {
      "user": _variables["_user_info"], 
      "koob" : {"query": _variables["_koob_api_request_body"]}
    };
    let c = eval_lisp(ast[0],[STDLIB, _v, ctx], rs)
    return c
  })
  /* добавляем модификатор=второй аргумент, который показывает в каком месте SQL используется столбец:
  where, having, group, template_where
  */
  _context["column"] = makeSF((ast, ctx, rs) => {
    /* col = строка, которую не нужно eval!!!! иначе уйдём в резолвер по умолчанию
    а он вызовет нас опять.
    sql_context = строка 
    на вход может приходить всякое
COLUMN CALLED "ch.fot_out.v_rel_pp"
COLUMN CALLED ["ch.fot_out.group_pay_name"]
COLUMN CALLED ["sum","where"]
    */
    if (isString(ast)){
      ast = [ast]
    }
    let col = ast[0]
    let sql_context = ast[1]

    //console.log(`COLUMN CALLED ${ JSON.stringify(ast) }`)
    // считаем, что сюда приходят только полностью резолвенные имена с двумя точками...
    let c
    let parts = col.split('.')

    if (parts.length === 3) {
      c = _variables["_columns"][col]
    }

    if (!isHash(c)) {
      // пробуем добавить датасорс и куб и найти столбец по его полному id
      // ну и такие вещи попадаются: 
      //      LOOKING FOR: ch.fot_out.(round(v_main,2))
      //      LOOKING FOR: ch.fot_out."My version"
      let fullCol = `${_variables["_ds"]}.${_variables["_cube"]}.${col}`

      c = _variables["_columns"][fullCol]
      if (isHash(c)){
        col = fullCol
      }
    }

    //console.log(`[${sql_context}] column func: ${col} ${sql_context} resolved to ${JSON.stringify(c)}`)
    if (c) {
      // side-effect to return structure (one per call)
      if (_variables["_result"]){
        _variables["_result"]["columns"].push(col)
        //console.log(`PUSH ${col}` + JSON.stringify(_variables["_result"]))
        if (c["type"] === "AGGFN") {
          _variables["_result"]["agg"] = true
        }
      }
      let parts = col.split('.')
      let colname = parts[2]
      //console.log(`COMPARE ${colname} = ${JSON.stringify(c)}`)
      if (
        (colname.localeCompare(c.sql_query, undefined, { sensitivity: 'accent' }) === 0 ||
      /*`"${colname}"`.localeCompare(c.sql_query, undefined, { sensitivity: 'accent' }) === 0 */
      (c.sql_query.length>2 && /^"([^"]+|"{2})+"$/.test(c.sql_query)))
      //FIXME: handle "a"."b" as well?
      ) {
        // we have just column name or one column alias, prepend table alias !
        if (_variables._target_database == 'clickhouse') {
          if (sql_context == 'where') { // enable table prefixing for now 
            // template_where не должен подставлять имя таблицы!
            return `${parts[1]}.${c.sql_query}`
          } else {
            return `${c.sql_query}`
          }
        } else {
          return `${c.sql_query}`
        }
        
        // temporarily disabled by DIMA FIXME, but at least clickhouse need reference to table name !
        // without it clickhouse uses alias!
        //return `${parts[1]}.${c.sql_query}`
      } else {
        //console.log(`OPANKI: ${c.sql_query}`)
        // FIXME: WE JUST TRY TO match getDict, if ANY. there should be a better way!!!
        // dictGet('gpn.group_pay_dict', some_real_field, tuple(pay_code))
        //console.log(`OPANKI: ${c.sql_query}`, JSON.stringify(_context))
        if (_variables._target_database == 'clickhouse') {
          // for the SELECT part make sure we produce different things for INNER and OUTER SQL
          // SELECT part is denoted by _variables["_result"]
          if (_variables["_result"] && c.sql_query.match(/dictGet\(/)){
            //console.log(`OPANKI1: ${c.sql_query}`)
            _variables["_result"]["outer_expr"] = c.sql_query
            _variables["_result"]["outer_alias"] = parts[2]
            var m = c.sql_query.match(/,[^,]+,(.*)/)
            if (m) {
              m = m[1]
              //console.log(`OPANKI11: ${m}`)
              // ' tuple(pay_code))'
              var t = m.match(/tuple\((\w+)\)/)
              if (t) {
                //console.log(`OPANKI22: ${c.sql_query}  ${t[1]}`)
                _variables["_result"]["alias"] = t[1]
                return t[1]
              } else {
                t = m.match(/(\w+)/)
                if (t) {
                  _variables["_result"]["alias"] = t[1]
                  return t[1]
                }
              }
            }
          }
        }
        if (_variables["_result"]) {
          // make alias for calculated columns
          let parts = col.split('.')
          if (parts.length === 3) {
            _variables["_result"]["alias"] = parts[2]
          }
        }
        return `(${c.sql_query})`
      }
    } else {
      // это был алиас, и его надо поискать, если это where
      //console.log("NOT FOUND" + col)
      if (sql_context == 'where') { 
        // в фильтрах использовали алиасы или вообще ошиблись.
        // если ключ в фильтрах совпал с именем столбца, то мы это отработали в if() выше
        // нужно найти алиас
        let c = _variables["_aliases"][col]
        //console.log(`RESOLVED ALIAS: ${JSON.stringify(c)}`)
        if (isHash(c)){
          // если это просто переименование, то мы можем написать правильный WHERE
          // иначе - это ошибка и нужно использовать HAVING!!!
          // {"columns":["ch.fot_out.group_pay_name"],"unresolved_aliases":["sum"],"agg":true,"alias":"sum","expr":null,"outer_expr":"sum(group_pay_name)"}
          //  {"columns":["ch.fot_out.group_pay_name"],"alias":"xxx","expr":"group_pay_name"}
          if (c["columns"].length === 1){
            let idName = c["columns"][0]
            let parts = idName.split('.')
            let colname = parts[2]
            
            if (colname.localeCompare(c.expr, undefined, { sensitivity: 'accent' }) === 0 ||
            `"${colname}"`.localeCompare(c.expr, undefined, { sensitivity: 'accent' }) === 0 ) {
              // это просто переименование
              if (_variables._target_database == 'clickhouse') {
                col = `${parts[1]}.${c.expr}`
              } else {
                col = c.expr
              }
            } else {
              throw new Error(`Resolving key [${col}] for filters, but it resolved to complex expression [${c.expr?c.expr:c.outer_expr}] which can not be searched at row data level :-()`)
            }
          }
        }
      }
      

    }
    //console.log("COL FAIL", col)
    // возможно кто-то вызовет нас с коротким именем - нужно знать дефолт куб!!!
    //if (_context["_columns"][default_ds][default_cube][key]) return `${default_cube}.${key}`;
    // на самом деле нас ещё вызывают из фильтров, и там могут быть алиасы на столбцы не в кубе,
    // а вообще в другой таблице, пробуем просто квотировать по ходу пьессы.
    
    return col;
  })

  /*
     expr: "initializeAggregation('sumState',sum(s2.deb_cre_lc )) as mnt",
     alias: "mnt",
     columns: ["czt.fot.val3","czt.fot.val1"],
     agg: true,
     window: true,
     outer_expr: "runningAccumulate(mnt, (comp_code,gl_account)) as col1",
     outer_alias: 'col1'
  */

     /* DEPRECATED!!!! */
  _context["running"] = function() {
    _context["_result"]["agg"] = true // mark that we are aggregate function for correct 'group by'
    _context["_result"]["window"] = true

    var a = Array.prototype.slice.call(arguments)
    //console.log("RUNNING" , JSON.stringify(a))
    //console.log("Flavor" , JSON.stringify(_context._target_database))

    if (_context._target_database !== 'clickhouse') {
      throw Error('running function is only supported for clickhouse SQL flavour')
    }

    //
    // we have 3 args ["sum","v_main",["-","hcode_name"]]
    // or we have 2 args: ["lead","rs"]
    // and should generate: initializeAggregation('sumState',sum(s2.deb_cre_lc )) as mnt 
    var fname = a[0];
    var colname = a[1];

    var order_by = ''
    var expr = ''
    if (fname === 'sum') {
      order_by = a[2]; // array!
      order_by = order_by[1]; // FIXME! may crash on wrong input!!! use eval !!!
      // We have 2 phases, inner and outer.
      // For inner phase we should generate init:
      expr = `initializeAggregation('${fname}State',${fname}(${colname}))`;

      // For outer phase we should generate 
      // runningAccumulate(wf1, (comp_code,gl_account)) AS end_lc,
      // BUT WIITHOUT AS end_lc
      var alias = '_w_f_' + ++_context["_sequence"]
      _context["_result"]["expr"] = expr
      _context["_result"]["columns"] = [colname]
      _context["_result"]["inner_order_by_excl"] = order_by
      _context["_result"]["outer_expr"] = `runningAccumulate(${alias}, partition_columns())` //it should not be used as is
      _context["_result"]["outer_expr_eval"] = true // please eval outer_expr !!!
      _context["_result"]["outer_alias"] = alias
    } else if (fname === 'lead'){
      // or we have 2 args: ["lead","rs"]
      // if this column is placed BEFORE referenced column, we can not create correct outer_expr
      // in this case we provide placeholder...

      var init = _context["_aliases"][colname]
      if (isHash(init) && init["alias"]) {
        _context["_result"]["outer_expr"] = `finalizeAggregation(${init["alias"]})`
      } else {
        _context["_result"]["outer_expr"] = `finalizeAggregation(resolve_alias())`
        _context["_result"]["outer_expr_eval"] = true 
        _context["_result"]["eval_reference_to"] = colname
      } 
      expr = null // no inner expr for this func!
    }
      return expr
  }
  _context['running'].ast = [[],{},[],1]; // mark as macro


  // сюда должны попадать только хитрые варианты вызова функций с указанием схемы типа utils.smap()
  // но нет, [["dateShift","dt",["-",3],"month"],["bound",["'","q"]]]
  // можно сделать эвристику, если первый элемент литерал или функция ",что значит имя SQL
  // то не делаем thread, а иначе делаем!!!
  _context["->"] = function() {
    var a = Array.prototype.slice.call(arguments);

    if ( (isArray(a[0]) && a[0][0] === '"') || !isArray(a[0])){ 
      //console.log("-> !" , JSON.stringify(a))
      return a.map(el => isArray(el) ? eval_lisp(el, _ctx, {"resolveColumn":false}) : el).join('.');
    } else {
      // нужно сделать настоящий ->
      let [acc, ...ast] = a
      for (let arr of ast) {
        if (!isArray(arr)) {
          arr = [".-", acc, arr];  // это может быть обращение к хэшу или массиву через индекс или ключ....
        } else if (arr[0] === "()" && arr.length === 2 && (isString(arr[1]) || isNumber(arr[1]))) {
          arr = [".-", acc, arr[1]];
        } else {
          arr = arr.slice(0); // must copy array before modify
          arr.splice(1, 0, acc);
          //console.log("AST !!!!" + JSON.stringify(arr))
          // AST[["filterit",[">",1,0]]]
          // AST !!!!["filterit","locations",[">",1,0]]
          // подставляем "вычисленное" ранее значение в качестве первого аргумента... классика thread first
        }
        acc = arr;
      }
      //console.log("AST !!!!" + JSON.stringify(acc))
      if (!isArray(acc)){
        return ["resolve", acc]
      }
      return acc;
    }
  }
  _context['->'].ast = [[],{},[],1]; // mark as macro

  _context[':'] = function(o, n) {
    //var a = Array.prototype.slice.call(arguments);
    //console.log(":   " + JSON.stringify(o) + ` ${JSON.stringify(n)}`);
    //return a[0] + ' as ' + a[1].replace(/"/,'\\"');


    // если нам придёт вот такое "count(v_rel_pp):'АХТУНГ'",
    var al = n
    if (isArray(n) && n[0] === "'" || n[0] === '"') {
      al= n[1]
    }
    //console.log("AS   " + JSON.stringify(_ctx));
    var otext = eval_lisp(o, _ctx)
    if (_variables["_result"]){
      // мы кидаем значение alias в _result, это подходит для столбцов
      // для TABLE as alias не надо вызывать _result

      // также есть outer_alias для оконных функций, мы его поменяем!!!
      if (_variables["_result"]["outer_alias"]) {
        _variables["_result"]["alias"] = _variables["_result"]["outer_alias"]
        _variables["_result"]["outer_alias"] = al
      } else {
        _variables["_result"]["alias"] = al

      }
      return otext
    }
    // FIXME: кажется это вообще не работает, так как ожидается n в виде текста, а он может быть []
    // но сюда мы не попадаем, так как _variables["_result"]
    return quot_as_expression(_variables["_target_database"], otext, n)
  }
  _context[':'].ast = [[],{},[],1]; // mark as macro


  _context['toString'] = makeSF( (ast,ctx) => {
    // we need to use makeSF, as normal LISP context will not evaluate column names ???
    //console.log(JSON.stringify(ast))
    var col = ast[0]
    var s = eval_lisp(col,_ctx)
    if (_variables._target_database === 'clickhouse'){
      return `toString(${s})`
    } else if (_variables._target_database === 'postgresql'){
      return `${s}::TEXT`
    } else {
      return `cast(${s} AS VARCHAR)`
    }
  })

  // Clickhouse way.... will create extra dataset
  // range(end), range([start, ] end [, step])
  // Returns an array of UInt numbers from start to end - 1 by step.
  // either 1 or 3 args !!!
  _context['range'] = function(from, to, step) {
    if (_variables._target_database === 'clickhouse'){
      let r
      if (to === undefined) {
        r = `arrayJoin(range(${from}))`
      } else {
        if (step === undefined){
          r = `arrayJoin(range(${from},${to}))`
        } else {
          r = `arrayJoin(range(${from},${to}, ${step}))`
        }
      }
      _variables["_result"]["is_range_column"] = true
      return r
    } else if (_variables._target_database === 'postgresql'){
      let s = ''
      if (to === undefined) {
        s = `generate_series(0, ${from}-1)`
      } else {
        if (step === undefined){
          s = `generate_series(${from}, ${to}-1)`
        } else {
          s = `generate_series(${from}, ${to}-1, ${step})`
        }
      }
      _variables["_result"]["is_range_column"] = true
      _variables["_result"]["expr"] = 'koob__range__'
      _variables["_result"]["columns"] = ["koob__range__"]
      _variables["_result"]["join"] = { "type":"inner",
                                      "alias":"koob__range__",
                                      "expr":`${s}`
                                    }
        return 'koob__range__'

    } else if (_variables._target_database === 'teradata'){
      // возвращаем здесь просто имя столбца, но потом нужно будет сгенерить
      // JOIN и WHERE!!!
      // select  _koob__range__table__.day_of_calendar, procurement_subject 
      // FROM bi.fortests, sys_calendar.CALENDAR as koob__range__table__
      // where purch_id = 8585 and day_of_calendar BETWEEN 1 AND 10;
      // max count is limited to 73414
      if (step !== undefined) {
        throw Error(`range(with step argument) is not supported for ${_variables._target_database}`)
      }
      let f;
      if (to === undefined) {
        f = ['<=', from]
      } else {
        f = ['between', from+1, to]
      }
      _variables["_result"]["is_range_column"] = true
      _variables["_result"]["expr"] = 'koob__range__table__.day_of_calendar - 1'
      _variables["_result"]["columns"] = ["day_of_calendar"]
      _variables["_result"]["alias"] = 'koob__range__'
      _variables["_result"]["join"] = { "type":"inner",
                                      "table": "sys_calendar.CALENDAR",
                                      "alias":"koob__range__table__",
                                      "filters": {"koob__range__table__.day_of_calendar": f}
                                    }
      return 'koob__range__table__.day_of_calendar - 1'
      // FIXME: это попадает в GROUP BY !!!
    } else if (_variables._target_database === 'oracle'){
      // возвращаем здесь просто имя столбца, но потом нужно будет сгенерить
      // JOIN и WHERE!!!
      // ONLY FOR Oracle 10g and above!
      if (step === undefined) {
        step = ''
      } else {
        step = ` and MOD(LEVEL, ${step}) = 0`
      }

      if (to === undefined) {
        to = from
        from = 0
      } 
      _variables["_result"]["is_range_column"] = true
      _variables["_result"]["expr"] = 'koob__range__'
      _variables["_result"]["columns"] = ["koob__range__"]
      _variables["_result"]["join"] = { "type":"inner",
                                      "expr":`(
      select LEVEL-1 AS koob__range__ from dual
      where LEVEL between ${from}+1 and ${to}${step}
      connect by LEVEL <= ${to}
      )`
                                    }
      return 'koob__range__'
      // FIXME: это автоматически попадает в GROUP BY !!!
    } else if (_variables._target_database === 'sqlserver'){
      // возвращаем здесь просто имя столбца, но потом нужно будет сгенерить
      // только JOIN 
      // 
      if (step === undefined) {
        step = 1
      }

      if (to === undefined) {
        to = from
        from = 0
      } 
      let numbers = [];
      for (let i = from; i < to; i += step) {
        numbers.push(`(${i})`);
      }

      _variables["_result"]["is_range_column"] = true
      _variables["_result"]["expr"] = 'koob__range__'
      _variables["_result"]["columns"] = ["koob__range__"]
      _variables["_result"]["join"] = { "type":"inner",
                                      "alias":"koob__range__table__",
                                      "expr":`(
      select koob__range__ FROM (VALUES ${numbers.join(", ")}) vals(koob__range__)
      )`

      // (select n FROM (VALUES (0), (1), (2)) v1(n)) as t
                                    }
      return 'koob__range__'
      // FIXME: это автоматически попадает в GROUP BY !!!
    } else if (_variables._target_database === 'vertica'){
      // возвращаем здесь просто имя столбца, но потом нужно будет сгенерить
      // только JOIN 
      // 
      if (step === undefined) {
        step = ''
      } else {
        step = ` WHERE MOD(koob__range__, ${step}) = 0`
      }

      if (to === undefined) {
        to = from - 1
        from = 0
      } else {
        to = to - 1
      }

      _variables["_result"]["is_range_column"] = true
      _variables["_result"]["expr"] = 'koob__range__'
      _variables["_result"]["columns"] = ["koob__range__"]
      _variables["_result"]["join"] = { "type":"inner",
                                      "alias":"koob__range__table__",
                                      "expr":`(
          WITH koob__range__table__seq AS (
            SELECT ROW_NUMBER() OVER() - 1 AS koob__range__ FROM (
                SELECT 1 FROM (
                    SELECT date(0) + INTERVAL '${from} second' AS se UNION ALL
                    SELECT date(0) + INTERVAL '${to} seconds' AS se ) a
                TIMESERIES tm AS '1 second' OVER(ORDER BY se)
            ) b  
        )
        SELECT koob__range__ FROM koob__range__table__seq${step})`
                                    }
      return 'koob__range__'
      // FIXME: это автоматически попадает в GROUP BY !!!
    } else if (_variables._target_database === 'sap') {
      // SAP HANA
      if (step === undefined) {
        step = '1'
      } else {
        step = `${step}`
      }

      if (to === undefined) {
        to = from
        from = 0
      } 
      _variables["_result"]["is_range_column"] = true
      _variables["_result"]["expr"] = 'koob__range__'
      _variables["_result"]["columns"] = ["koob__range__"]
      _variables["_result"]["join"] = { "type":"inner",
                                      "expr":`(
      select GENERATED_PERIOD_START AS koob__range__ from SERIES_GENERATE_INTEGER(${step}, ${from}, ${to})
      )`
                                    }
      return 'koob__range__'
      // FIXME: это автоматически попадает в GROUP BY !!!
    } else {
      throw Error(`range() is not supported in ${_variables._target_database}`)
    }
  }

  _context['pointInPolygon'] = makeSF( (ast,ctx) => {
    //console.log(JSON.stringify(ast))
    // [["tuple","lat","lng"],["[",["tuple",0,0],["tuple",0,1],["tuple",1,0],["tuple",1,1]]]
    var point = ast[0]

    var pnt = eval_lisp(point,_ctx) // point as first argument
    
    var poly = eval_lisp(ast[1],_ctx)
    if (_variables._target_database === 'clickhouse'){
      return `pointInPolygon(${pnt}, [${poly}])`
    } else if (_variables._target_database === 'postgresql'){
      // circle '((0,0),2)' @> point '(1,1)'        	polygon '((0,0),(1,1))'
      return `polygon '(${poly})' @> point${pnt}`
    } else {
      throw Error(`pointInPolygon is not supported in ${_variables._target_database}`)
    }
  })

  _context['pointInEllipses'] = function() {
    if (_variables._target_database !== 'clickhouse'){
      throw Error(`pointInEllipses is not supported in ${_variables._target_database}`)
    }

    var a = Array.prototype.slice.call(arguments)
    if ( (a.length - 2) % 4 != 0) {
      throw Error(`pointInEllipses should contain correct number of coordinates!`)
    }
    return `pointInEllipses(${a.join(',')})`
  }

  _context['pointInCircle'] = makeSF( (ast,ctx) => {
    // ["lat","lng", 0,0,R]
    var point = ast[0]

    var x = eval_lisp(ast[0],ctx) // point x
    var y = eval_lisp(ast[1],ctx)
    var cx = eval_lisp(ast[2],ctx) // center of circle 
    var cy = eval_lisp(ast[3],ctx) // center of circle 
    var R = eval_lisp(ast[4],ctx) 
    if (_context._target_database === 'clickhouse'){
      return `pointInEllipses(${x},${y},${cx},${cy},${R},${R})`
    } else if (_variables._target_database === 'postgresql'){
      return `circle(point(${cx},${cy}),${R}) @> point(${x},${y})`
    } else {
      throw Error(`pointInPolygon is not supported in ${_variables._target_database}`)
    }
  })

  _context['()'] = function(a) {
    return `(${a})`
  }

/*
  _context['if'] = function(cond, truthy, falsy) {
    return `CASE WHEN ${cond} THEN ${truthy} ELSE ${falsy} END`
  }
*/

  _context['if'] = function() {
    let a = Array.prototype.slice.call(arguments)
    if (a.length < 2) {
      throw Error(`ifs() requires some arguments (at least 2)`)
    }
    let expr = ''
    let diff;
    if (a.length % 2 === 0) {
      expr = `CASE WHEN ${a[a.length-2]} THEN ${a[a.length-1]} END`
      diff = 4
    } else {
      expr = `${a[a.length-1]}`
      diff = 3
    }
    for (let i = a.length - diff; i >= 0; i = i - 2 ) {
      // i = cond, i+1 = action
      expr = `CASE WHEN ${a[i]} THEN ${a[i+1]} ELSE ${expr} END`
    }

    return expr
  }


  _context['concatWithSeparator'] = function() {
    let a = Array.prototype.slice.call(arguments)
    let head = 'concat_ws'
    if (_variables._target_database === 'clickhouse'){
      head = `concatWithSeparator(`
    } else if (_variables._target_database === 'postgresql') {
      head = `concat_ws(`
    } else {
      throw Error(`No concatWithSeparator() function support for flavor: ${_variables._target_database}`)
    }
    head = head.concat(a.join(',')).concat(')');
    return head;
  }

  _context['substring'] = function(str, offset, len) {
    if (_variables._target_database === 'clickhouse'){
      return `substringUTF8(${str}, ${offset}, ${len})`
    } else {
      return `substring(${str}, ${offset}, ${len})`
    }
  }

  _context['initcap'] = function(str) {
    if (_variables._target_database === 'clickhouse'){
      return `initcapUTF8(${str})`
    } else {
      return `initcap(${str})`
    }
  }

  _context['length'] = function(str) {
    if (_variables._target_database === 'clickhouse'){
      return `lengthUTF8(${str})`
    } else {
      return `length(${str})`
    }
  }

  _context['left'] = function(str, len) {
    if (_variables._target_database === 'clickhouse'){
      return `leftUTF8(${str}, ${len})`
    } else {
      return `left(${str}, ${len})`
    }
  }

  _context['right'] = function(str, len) {
    if (_variables._target_database === 'clickhouse'){
      return `rightUTF8(${str}, ${len})`
    } else {
      return `right(${str}, ${len})`
    }
  }

  _context['/'] = function(l, r) {
    if (_variables._target_database === 'clickhouse'){
      return `CAST(${l} AS Nullable(Float64)) / ${r}`
    } else {
      return `CAST(${l} AS FLOAT) / ${r}`
    }
  }


  _context['tuple'] = function(first, second) {
    if (_variables._target_database === 'clickhouse'){
      return `tuple(${first},${second})`
    } else {
      return `(${first},${second})`
    }
  }

  _context['expr'] = function(a) {
    // Just placeholder for logical expressions, which should keep ()
    return a
  }


  _context['get_in'] = makeSF((ast, ctx, rs) => {
    // FIXME, кажется это вызывается из sql_where
    // возвращаем переменные, которые в нашем контексте, вызывая стандартный get_in
    // при этом наши переменные фильтруем!!пока что есть только _user_info и koob.request
    let _v = {
      "user": _variables["_user_info"], 
      "koob" : {"query": _variables["_koob_api_request_body"]}
    };
    //console.log(JSON.stringify(_v))
    //console.log(JSON.stringify(eval_lisp(["get_in"].concat(ast), _v, rs)))
    return eval_lisp(["get_in"].concat(ast), _v, rs);
  });



    var partial_filter = function(a) {
    if (isArray(a[0]) && a[0][0] === "ignore(me)") {
      var ignoreme = a.shift()
      a = a.map(el => {if (isArray(el)) {
                        el.splice(1,0, ignoreme); return el
                      } else {
                        return el
                      }})
    }
    //console.log("OR->OR->OR", JSON.stringify(a))
    a = a.map(el => eval_lisp(el,_ctx))
    return a;
  }

  _context['or'] = function() {
    // Первый аргумент может быть ["ignore(me)",[]] = и надо его передать дальше!!!!
    // #244
    var a = Array.prototype.slice.call(arguments)
    //console.log("OR OR OR", JSON.stringify(a))
    // [["ignore(me)",["column","ch.fot_out.pay_code"]],["!="],["ilike","Муж"]]
    a = partial_filter(a)
    if (isArray(a)){
      if (a.length>0){
        return `(${a.join(') OR (')})`
      }
    }
    // https://mathematica.stackexchange.com/questions/264386/logical-functions-with-no-arguments
    return '1=0'
  }
  _context['or'].ast = [[],{},[],1]; // mark as macro


  _context['and'] = function() {
    var a = Array.prototype.slice.call(arguments)
    a = partial_filter(a)
    //console.log('AND:' + JSON.stringify(a))
    if (isArray(a)){
      if (a.length>0){
        return `(${a.join(') AND (')})`
      }
    }
    // https://mathematica.stackexchange.com/questions/264386/logical-functions-with-no-arguments
    return '1=1'
  }
  _context['and'].ast = [[],{},[],1]; // mark as macro

  _context['not'] = function() {
    var a = Array.prototype.slice.call(arguments)
    a = partial_filter(a)
    return `NOT ${a[0]}`
  }
  _context['not'].ast = [[],{},[],1]; // mark as macro


  /**
   * resolveOptions может иметь ключ resolveString, но мы добавляем опцию
   * reolveColumn и если ЯВНО равно false, то неделаем поиска столбцов,которые былипо-умолчанию
   */
  _context["'"] = makeSF((ast, ctx, rs) => {
    //console.log(`QUOT ${JSON.stringify(ast)} ${JSON.stringify(_variables["_result"])}`)
    // try to check if it is a column?
    let a = ast[0];

    if ( rs.resolveColumn === false) {
      //console.log(`SINGLE QUOT resolveColumn: false ==${db_quote_literal(a)}==`)
      return db_quote_literal(a)
    }
    
    //console.log(`QUOT ${JSON.stringify(ast)} ==${c}== ${JSON.stringify(_variables["_result"])}`)
    //console.log(`CMP: ${c} !== ${a}\n ${JSON.stringify(_variables)}`)
    // FIXME: нужно искать именно этот столбец!!! в _variables???
    let resolvedColumn = _variables["_columns"]
    
    if (isHash(resolvedColumn)) {
      resolvedColumn = resolvedColumn[_variables["_ds"]]
      if (isHash(resolvedColumn)) {
        resolvedColumn = resolvedColumn[_variables["_cube"]]
        if (isHash(resolvedColumn)) {
          resolvedColumn = resolvedColumn[a]
        }
      }
    }
    if (isHash(resolvedColumn)) {
      // значит уже есть sql выражение, например ("рус яз")
      let c = _context["column"](a)
      return c
    } else {
      return db_quote_literal(a)
    }
  })

 /**
   * resolveOptions может иметь ключ resolveString, но мы добавляем опцию
   * reolveColumn и если ЯВНО равно false, то неделаем поиска столбцов,которые былипо-умолчанию
   */

  _context['"'] = makeSF((ast, ctx, rs) => {
    //console.log(`QUOT ${JSON.stringify(ast)} ${JSON.stringify(_variables["_result"])}`)
    // try to check if it is a column?
    let a = ast[0];
    if ( rs.resolveColumn === false) {
      //console.log(`QUOT resolveColumn: false ==${db_quote_ident(a)}==`)
      return db_quote_ident(a)
    } else {
      let c = _context["column"](a);
      //console.log(`QUOT ${JSON.stringify(ast)} ==${c}== ${JSON.stringify(_variables["_result"])}`)
      if (c != a) {
        // значит уже есть sql выражение, например ("рус яз")
        return c
      } else {
        return db_quote_ident(a)
      }
    }
  })

  // overwrite STDLIB! or we will treat (a = 'null') as (a = null) which is wrong in SQL !
  _context['null'] = 'null'
  _context['true'] = 'true'
  _context['false'] = 'false'

  // FIXME: в каких-то случаях вызывается эта версия ql, а есть ещё одна !!!
  // _ctx.ql
  _context["ql"] = function(el) {
    // NULL values should not be quoted
    // plv8 version of db_quote_literal returns E'\\d\\d' for '\d\d' which is not supported in ClickHose :-()
    // so we created our own version...
    // console.log("QL: " + el)
    return el === null ? null : db_quote_literal(el)
  }

  // специальная функция, видя которую не делаем магию и не подставляем имена столбцов куда попало 
  _context["ensureThat"] = function(el) {
    return el
  }

  /* тут мы не пометили AGG !!!
  _context['count'] = makeSF( (ast,ctx) => {
    var a;
    if (ast.length == 1) {
      a = ast[0]
    } else {
      a = ast
    }
    if (_context._target_database == 'clickhouse') {
      // Это БАГ в тыкдоме = отдаёт текстом значения, если count делать Ж-()
      return `toUInt32(count(${eval_lisp(a, ctx)}))`
    } else {
      return `count(${eval_lisp(a, ctx)})`
    }
  });*/

  _context['between'] = function(col, var1, var2) {
    if (shouldQuote(col,var1)) var1 = quoteLiteral(var1)
    if (shouldQuote(col,var2)) var2 = quoteLiteral(var2)

    let l = eval_lisp(var1, _ctx); // if we use _context -> we have now unknown function names passing to SQL level
    let r
    if (isArray(l)) {
      r = l[1]
      l = l[0]
    } else {
      r = eval_lisp(var2, _ctx);
    }

    if (l === null || (isString(l) && (l.length === 0 || l === "''"))) {
      if (r === null || (isString(r) && (r.length === 0 || r === "''"))) {
        // both are empty, we should not generate any conditions!
        // FIXME: Should we return null?
        return '1=1'
      } else {
        // l is null, r is real
        return `${eval_lisp(col,_ctx)} <= ${r}`
      }
    } else {
      if (r === null || (isString(r) && (r.length === 0 || r === "''"))) {
        // l is real, r is null
        return `${eval_lisp(col,_ctx)} >= ${l}`
      } else {
        // both l and r is real
        return `${eval_lisp(col,_ctx)} BETWEEN ${l} AND ${r}`
      }
    }
    
  }
  _context['between'].ast = [[],{},[],1]; // mark as macro

  _context['~'] = function(col, tmpl) {
    if (shouldQuote(col,tmpl)) tmpl = quoteLiteral(tmpl)
    // в каждой базе свои regexp
    if (_vars["_target_database"] === 'oracle') {
      return `REGEXP_LIKE( ${eval_lisp(col,_ctx)} , ${eval_lisp(tmpl,_ctx)} )` 
    } else if (_vars["_target_database"] === 'mysql') {
      return `${eval_lisp(col,_ctx)} REGEXP ${eval_lisp(tmpl,_ctx)}` 
    } else if (_vars["_target_database"] === 'clickhouse') {
      // case is important !!!
      return `match( ${eval_lisp(col,_ctx)} , ${eval_lisp(tmpl,_ctx)} )` 
    } else {
      return `${eval_lisp(col,_ctx)} ~ ${eval_lisp(tmpl,_ctx)}`
    }
  }
  _context['~'].ast = [[],{},[],1]; // mark as macro


  _context['~*'] = function(col, tmpl) {
    if (shouldQuote(col,tmpl)) tmpl = quoteLiteral(tmpl)
    // в каждой базе свои regexp
    if (_vars["_target_database"] === 'oracle') {
      return `REGEXP_LIKE( ${eval_lisp(col,_ctx)} , ${eval_lisp(tmpl,_ctx)}, 'i')` 
    } else if (_vars["_target_database"] === 'mysql') {
      return `REGEXP_LIKE( ${eval_lisp(col,_ctx)}, ${eval_lisp(tmpl,_ctx)}, 'i')` 
    } else if (_vars["_target_database"] === 'clickhouse') {
      // case is not important !!!
      var pattern = eval_lisp(tmpl,_ctx); // should be in quotes! 'ddff'
      pattern = `(?i:${pattern.slice(1,-1)})` 
      return `match( ${eval_lisp(col,_ctx)} , '${pattern}' )` 
    } else {
      return `${eval_lisp(col,_ctx)} ~* ${eval_lisp(tmpl,_ctx)}`
    }
  }
  _context['~*'].ast = [[],{},[],1]; // mark as macro


  _context['!~'] = makeSF( (ast,ctx) => {
    return "NOT " + eval_lisp(["~"].concat(ast), ctx);
  });

  _context['!~*'] = makeSF( (ast,ctx) => {
    return "NOT " + eval_lisp(["~*"].concat(ast), ctx);
  });


  _context['like'] = function(col, tmpl) {
    if (shouldQuote(col,tmpl)) tmpl = quoteLiteral(tmpl)
    return `${eval_lisp(col,_ctx)} LIKE ${eval_lisp(tmpl,_ctx)}` 
  }
  _context['like'].ast = [[],{},[],1]; // mark as macro

  _context['ilike'] = function(col, tmpl) {
    if (shouldQuote(col,tmpl)) tmpl = quoteLiteral(tmpl)
    if (_vars["_target_database"] === 'clickhouse') {
      // FIXME: detect column type !!!
      return `toString(${eval_lisp(col,_ctx)}) ILIKE ${eval_lisp(tmpl,_ctx)}`
    } else if (_vars["_target_database"] === 'oracle' ||
               _vars["_target_database"] === 'sqlserver') 
    {
      // FIXME! Oracle has something similar to ilike in v12 only :-()
      // FIXME: use regexp
      return `UPPER(${eval_lisp(col,_ctx)}) LIKE UPPER(${eval_lisp(tmpl,_ctx)})`
    } else if (_vars["_target_database"] === 'mysql') {
      // https://www.oreilly.com/library/view/mysql-cookbook/0596001452/ch04s11.html
      return `${eval_lisp(col,_ctx)} LIKE ${eval_lisp(tmpl,_ctx)}`
    } else {
      return `${eval_lisp(col,_ctx)} ILIKE ${eval_lisp(tmpl,_ctx)}`
    } 
  }
  _context['ilike'].ast = [[],{},[],1]; // mark as macro

  _context['ignore(me)'] = function(arg){
    return arg;
  }


  /*
  f1 / lpe_total(sum, f2)
  We should make subselect with full aggregation, but using our local WHERE!!!
  local WHERE is not Yet known, so we should post=pone execution???

  But we probably can inject EVAL part into _context["_result"]["expr"] ??
  if (_context["_result"]){

  */

    /* DEPRECATED!!! */
  _context['lpe_subtotal'] = makeSF( (ast,ctx) => {
    if (_context["_result"]){
      var seq = ++_context["_sequence"]
      if (!isHash(_context["_result"]["lpe_subtotals"])){
        _context["_result"]["lpe_subtotals"] = {}
      }
      //console.log("AST: ", ast)
      // FIXME: please check that we have agg func in the AST, overwise we will get SQL errors from the DB
      //AST:  [ [ 'sum', 'v_rel_pp' ] ]
      //AST:  [ [ '+', [ 'avg', 'v_rel_pp' ], 99 ] ]
      _context["_result"]["lpe_subtotals"][`lpe_subtotal_${seq}`] = {"ast": ast, "expr": `${eval_lisp(ast[0], ctx)}`}
      // in simple cases we wil have this: {"lpe_totals":{
      // "lpe_total_2":{"ast":[["avg", "v_rel_pp"]],"expr":"avg(fot_out.v_rel_pp)"}}

      _context["_result"]["eval_expr"] = true
    }
    // naive!!!
    return `lpe_subtotal_${seq}()` // ${ast[0]}, ${ast[1]}
  });

  _context['='] = makeSF( (ast,ctx,rs) => {
    // понимаем a = [null] как a is null
    // a = [] просто пропускаем, А кстати почему собственно???
    // a = [null, 1,2] как a in (1,2) or a is null

    // ["=",["column","vNetwork.cluster"],SPB99-DMZ02","SPB99-ESXCL02","SPB99-ESXCL04","SPB99-ESXCLMAIL"]
    // var a = Array.prototype.slice.call(arguments)
    // console.log("=========" + JSON.stringify(ast))
    var col = ast[0]

    /* FIXME !!! AGHTUNG !!!!
    было var c = eval_lisp(col, _context) и сложные выражения типа if ( sum(v_rel_pp)=0, 0, sum(pay_code)/sum(v_rel_pp)):d
    не резолвились, так как функции sum,avg,min и т.д. сделаны в общем виде!!!
    Видимо, надо везде переходить на _ctx !!!!
    */
    var c = eval_lisp(col, ctx, rs)
    var resolveValue = function(v) {
//console.log(`GGggggggg ${JSON.stringify(v)}`)
      // FIXME, возможно уже нужно перейти на quoteLiteral() ???
      if (shouldQuote(col, v)) v = evalQuoteLiteral(v)
      return v
      // [["ignore(me)",["column","ch.fot_out.hcode_name"]],"-","2020-03-01"]
      // если делать eval, то - будет читаться как функция!!!
      //return eval_lisp(v,_context)
    }
    let already_quoted = false


    let clickhouseArray = _variables["_columns"][`${_variables["_ds"]}.${c}`]
    if (clickhouseArray===undefined) {
      clickhouseArray = _variables["_columns"][`${_variables["_ds"]}.${_variables["_cube"]}.${c}`]
    }
    if (isHash(clickhouseArray)){
      clickhouseArray = clickhouseArray["config"]
      if (isHash(clickhouseArray)){
        clickhouseArray = clickhouseArray["clickhouseArray"] // assume = true
      }
    }

    if (ast.length === 1) {
      return '1=0'
    } else if (ast.length === 2) {
      // For clickhouse we have table name already applied!!!
      //console.log(`COLUMN: ${_variables["_ds"]}.${c}`)
      //console.log(`CFG: ${JSON.stringify(clickhouseArray)}`)
      
      if (isArray(ast[1])) {
        if (ast[1][0] === "["){
          // это массив значений, который мы превращаем в "col IN ()"
          // это значит, что мы не должны квотировать элементы cпециально!!! Но для фильтров у нас уже готовый LPE, и там нет никаких функций '
          // FIXME: мы должны пройти весь массив и индивидуально евалить каждый элемент.
          // Если элемент - это ["'","txt"], то его не надо больше проверять ни на что, он уже заквотирован.
          // Иначе, надо проверить...
          // также надо проверить, что есть NULL прямо здесь!
          let detect = ast[1].slice(1).find((element) => element !== null);

          var a = eval_lisp(ast[1], ctx, rs)
          ast = [c].concat(a)
          if (detect !== undefined) {
            if (isArray(detect) && detect[0] === "'"){
              // есть как минимум одна кавычка, ожидаем, что eval всё закавычит !
              already_quoted = true
            }
          }
        } else {
          // assuming if (ast[1][0] === "'")
          let v = eval_lisp(ast[1], ctx, rs)

          return v === null 
          ? `${c} IS NULL` 
          : (clickhouseArray === true ? `arrayIntersect(${c}, [${v}]) != []` : `${c} = ${v}`)
        }
      } else {
        let v = resolveValue(ast[1])
        return v === null 
        ? `${c} IS NULL` 
        : (clickhouseArray === true ? `arrayIntersect(${c}, [${v}]) != []` : `${c} = ${v}`)
      }
    }
      // check if we have null in the array of values...
      let resolvedV;
      if (already_quoted) {
        resolvedV = ast.slice(1).filter(el => el !== null)
      } else {
        resolvedV = ast.slice(1).map(el => resolveValue(el)).filter(el => el !== null)
      }
      const hasNull = resolvedV.length < ast.length - 1;
      var ret = clickhouseArray === true ? `arrayIntersect(${c},[${resolvedV.join(', ')}]) != []` : `${c} IN (${resolvedV.join(', ')})`
      if(hasNull) ret = `${ret} OR ${c} IS NULL`
      return ret
  })

  _context["["] = (...args) => args;

  _context['!='] = makeSF( (ast,ctx,rs) => {
    // понимаем a != [null] как a is not null
    // a != [] просто пропускаем, А кстати почему собственно???
    // a != [null, 1,2] как a not in (1,2) and a is not null

    // ["!=",["column","vNetwork.cluster"],SPB99-DMZ02","SPB99-ESXCL02","SPB99-ESXCL04","SPB99-ESXCLMAIL"]
    // var a = Array.prototype.slice.call(arguments)
    // console.log("!=!=!=" , JSON.stringify(ast))
    var col = ast[0]
    var c = eval_lisp(col,ctx,rs)
    var resolveValue = function(v) {

      if (shouldQuote(col, v)) v = quoteLiteral(v)
      return eval_lisp(v,ctx,rs)
    }

    let clickhouseArray = _variables["_columns"][`${_variables["_ds"]}.${c}`]
    if (clickhouseArray===undefined) {
      clickhouseArray = _variables["_columns"][`${_variables["_ds"]}.${_variables["_cube"]}.${c}`]
    }
    if (isHash(clickhouseArray)){
      clickhouseArray = clickhouseArray["config"]
      if (isHash(clickhouseArray)){
        clickhouseArray = clickhouseArray["clickhouseArray"] // assume = true
      }
    }

    if (ast.length === 1) {
      return '1=1'
    } else if (ast.length === 2) {
      
      if (isArray(ast[1]) && ast[1][0] === "[") {
        var a = eval_lisp(ast[1], ctx, rs)
        ast = [c].concat(a)
      } else {
        var v = resolveValue(ast[1])
        return v === null 
        ? `${c} IS NOT NULL` 
        : (clickhouseArray === true ? `arrayIntersect(${c}, [${v}]) = []` : `${c} != ${v}`)
      }
    } 

    // check if we have null in the array of values...
    
    var resolvedV = ast.slice(1).map(el => resolveValue(el)).filter(el => el !== null)
    const hasNull = resolvedV.length < ast.length - 1;
    var ret = clickhouseArray === true ? `arrayIntersect(${c},[${resolvedV.join(', ')}]) = []` : `${c} NOT IN (${resolvedV.join(', ')})`
    if(hasNull) ret = `${ret} AND ${c} IS NOT NULL`
    return ret

  })

  //console.log('CONTEXT RETURN!', _ctx[0]['()']);
  return _ctx;
} 

function extend_context_for_order_by(_context, _cfg) {
  
  // создаём контекст с двумя макросами + и -, а они вызовут обычный контекст....
  // можно пробовать переопределить реализацию функции column и поиска литералов/алиасов
  // но пока что будет так 

  var aliasContext = [
    // 
    {
      "colref": makeSF((col) => {
        /* col[0] содержит ровно то, что было в изначальном конфиге на входе!
        */
          //console.log("NEW COLREF!!!:", JSON.stringify(col))
            /*
              Postgresql: order by random()
              Greenplum:  order by random()
              Oracle:     order by dbms_random.value()
              MS SQL:     order by newid()
              Mysql:      order by rand()
              Clickhouse: order by rand()
              DB2:        order by rand()
              */
          if (col[0] === 'rand()') {
            var tdb = _context[1]._target_database
            if (tdb === 'postgresql'){
              return 'random()'
            } else if (tdb === 'oracle'){
              return 'dbms_random.value()'
            } else if (tdb === 'sqlserver'){
              return 'newid()'
            } else {
              return 'rand()'
            }
          }


          if (col[0] in _cfg["_aliases"]) {
            if ( upper_by_default(_context[1]._target_database) ||
              should_quote_alias(col[0])
            ){
              return `"${col[0]}"`
            } else {
              return col[0]
            }
          }
  
          var parts = col[0].split('.')
  
          if (parts.length === 3) {
            return `${parts[1]}.${parts[2]}`
            //return parts[2]
          } else {
            if ( upper_by_default(_context[1]._target_database) || should_quote_alias(col[0])){
              // пытаемся полечить проблему Oracle UPPER CASE имён
              //console.log(`HOPP ${JSON.stringify(_cfg["_aliases"])}`)
              // в алиасах у нас нет такого столбца
              return `"${col[0]}"`
            }
          }
          return col[0]
  
  
          /*
          if (_context[1]["_columns"][key]) return _context["column"](key)
          if (_context[1]["_columns"][default_ds][default_cube][key]) return _context["column"](`${default_ds}.${default_cube}.${key}`)
          
        return col*/
      }),
      "column": makeSF((col) => {
      /* примерно на 222 строке есть обработчик-резолвер литералов, там хардкодный вызов функции 
        if (_context["_columns"][key]) return _context["column"](key)
        то есть вызывается функция column в явном виде, а тут мы просто печатаем, что нам прислали.

        FIXME: ИМЕЕТ смысл сделать функцию colref() и типа ссылаться на какой-то столбец.
        И тут мы можем умно резолвить имена столбцов и алиасы и подставлять то, что нам надо.
        ЛИБО объявить тут функцию как МАКРОС и тогда уже правильно отработать column
        NEW COL: ["ch.fot_out.dor1"]
        console.log("NEW COL", col)

        _context[1]["_columns"] содержит описания из БД
      */
        var parts = col[0].split('.')

        if (parts.length === 3) {
          return `${parts[1]}.${parts[2]}`
          //return parts[2]
        } else {
          return col[0]
        }


        /*
        if (_context[1]["_columns"][key]) return _context["column"](key)
        if (_context[1]["_columns"][default_ds][default_cube][key]) return _context["column"](`${default_ds}.${default_cube}.${key}`)
        
      return col*/
    })
    },

    ... _context
  ]

  let _ctx = {}
  _ctx["+"] = makeSF( (ast) => {
    return eval_lisp(ast[0], aliasContext)
  })

  _ctx["-"] = makeSF( (ast) => {
    return `${eval_lisp(ast[0], aliasContext)} DESC`
  })

  return _ctx;
}


  /* В итоге у нас получается явный GROUP BY по указанным столбцам-dimensions и неявный group by по всем остальным dimensions куба.
   Свободные дименшены могут иметь мембера ALL, и во избежание удвоения сумм, требуется ВКЛЮЧИТЬ мембера ALL в суммирование как некий кэш.
   Другими словами, по ВСЕМ свободным дименшенам, у которых есть мембер ALL (см. конфиг) требуется добавить фильтр dimX = 'ALL' !

   Также можно считать агрегаты на лету, но для этого требуется ИСКЛЮЧИТЬ memberALL из агрегирования!!!

   Для указанных явно дименшенов доп. условий не требуется, клиент сам должен задать фильтры и понимать последствия.
   В любом случае по group by столбцам не будет удвоения, memberAll будет явно представлен отдельно в результатах
  */

function  inject_all_member_filters(_cfg, columns) {
  /* _cfg.filters может быть {} а может быть [{},{}] и тут у нас дикий код */

  var processed = {}
  if (isHash(_cfg["filters"])){
    _cfg["filters"] = get_all_member_filters(_cfg, columns, _cfg["filters"]);
  } else if (isArray(_cfg["filters"])){
    _cfg["filters"] = _cfg["filters"].map(obj => get_all_member_filters(_cfg, columns, obj))
  }
  return _cfg;
}

function inject_parallel_hierarchy_filters(_cfg, columns) {
  /* _cfg.filters может быть {} а может быть [{},{}] и тут у нас дикий код */
  var processed = {}
  if (isHash(_cfg["filters"])){
    _cfg["filters"] = get_parallel_hierarchy_filters(_cfg, columns, _cfg["filters"]);
  } else if (isArray(_cfg["filters"])){
    _cfg["filters"] = _cfg["filters"].map(obj => get_parallel_hierarchy_filters(_cfg, columns, obj))
  }
  return _cfg;
}


function get_parallel_hierarchy_filters(_cfg, columns, _filters) {

//console.log("FILTERS", JSON.stringify(_filters))
//console.log("columns", JSON.stringify(columns))
  // Ищем dimensions, у которых тип parallel и они ещё не указаны в фильтрах
  // ПО ВСЕМ СТОЛБАМ!!!
  Object.values(columns).map(el => {
    if (isHash(el.config)) {
      // если это параллельный дименшн и нет явно фильтра по нему
      //if (el.config.hierarchyType === 'parallel' && !isArray(_filters[el.id])){
      // НА САМОМ ДЕЛЕ ЭТО sharedDimension ???? conflicting
      // если есть значение по умолчанию, и не было явно указано фильтров, то ставим значение по умолчанию

      if (el.config.defaultValue !== undefined && !isArray(_filters[el.id])){
        if (isArray(el.config.defaultValue)) {
          // This is parsed lpe AST
          _filters[el.id] = el.config.defaultValue
        } else {
          if (isString(el.config.defaultValue) && el.config.defaultValue.startsWith('lpe:')) {
            let expr = el.config.defaultValue.substr(4)
            let evaled = parse(expr)

            if (isArray(evaled) && (evaled[0] === '"' || evaled[0] === "'") ) {
              // это константа и поэтому нужно добавить равенство!
              _filters[el.id] = ["=", evaled]
            } else {
              _filters[el.id] = evaled
            }
          } else {
            _filters[el.id] = ["=",el.config.defaultValue]
          }
        }
      }
      
    }
  })
  return _filters;
}


/*
Если у нас есть group by, то используем memeberALL,

Потом, к тем фильтрам, которые получились, добавляем фильтры по столбцам, где есть ключ "hierarchy_type":"parallel"
и делаем фильтр "default_value", НО ТОЛЬКО ЕСЛИ В ЗАПРОСЕ НЕТУ КЛЮЧА "distinct": "force"

*/

function get_all_member_filters(_cfg, columns, _filters) {
  var processed = {} // лучше его использовать как аккумулятор для накопления ответа, это вам не Clojure!
  var h = {};
  // заполняем хэш h длинными именами столбцов, по которым явно есть GROUP BY
  _cfg["_group_by"].map(el => {
    el.columns.map(e => h[e] = true)
  })
//console.log("FILTERS", JSON.stringify(_filters))
//console.log("columns", JSON.stringify(columns))
  // Ищем dimensions, по которым явно указан memeber ALL, и которых НЕТ в нашем явном списке...
  // ПО ВСЕМ СТОЛБАМ!!!
  Object.values(columns).map(el => {
    if (h[el.id] === true) {
      return // столбец уже есть в списке group by!
    }
    if (isHash(el.config)) {
      // Если для столбца прописано в конфиге follow=[], и нашего столбца ещё нет в списке фильтров, то надо добавить фильтр
      if ( isArray(el.config.follow) && !isArray(_filters[el.id])) {
        for( let alt of el.config.follow) {
          // names should skip datasource
          let altId = `${_cfg.ds}.${alt}`
          //console.log(`###checking ${el.config.follow} ${altId}`, JSON.stringify(_filters[el.id]) )
          // По столбцу за которым мы следуем есть условие
          if (isArray(_filters[altId])) {
            if ((_filters[altId]).length == 2) {
              // у столбца описан memberAll
              if (columns[altId].config.memberALL === null || 
                  isString(columns[altId].config.memberALL) || 
                  isNumber(columns[altId].config.memberALL)
                ) {
                var f = _filters[altId];
                if (f[1]==columns[altId].config.memberALL) {
                  // Есть условие по столбцу, которому мы должны следовать, надо добавить такое же условие!
                  _filters[el.id] = [f[0],f[1]];
                  break;
                }
              }
            }
            // так как есть условие по основному столбцу, мы не знаем точно, какое наше значение ему соответствует, 
            // и чтобы не добавлялся memberALL ниже, мы пропускаем наш столбец
            return;
          }
        }
      }


      if (el.config.memberALL === null ||
         isString(el.config.memberALL) ||
         isNumber(el.config.memberALL)
         ) {
        // есть значение для члена ALL, и оно в виде строки или IS NULL
        // добавляем фильтр, но только если по этому столбцу нет другого фильтра (который задали в конфиге)!!!
        // NOTE: по ключу filters ещё не было нормализации !!! 

        if (!isArray(_filters[el.id])){
          // Также нужно проверить нет ли уже фильтра по столбцу, который является altId
          if ( isArray(el.config.altDimensions) ) {
            for( let alt of el.config.altDimensions) {
              // names must skip datasource, but may skip cube, let's add our cube if it is missed...
              let altId = ''
              if (alt.includes('.')) {
                altId = `${_cfg.ds}.${alt}`
              } else {
                altId = `${_cfg.ds}.${_cfg.cube}.${alt}`
              }
              //console.log("ALT", JSON.stringify(altId))
              if (isArray(_filters[altId]) || h[altId] === true) {
                // уже есть условие по столбцу из altId, не добавляем новое условие
                // но только в том случае, если у нас явно просят этот столбец в выдачу
                // if ( h[])
                return
              }
            }
          }
          //console.log(`!!!!checking  ${el.id} children`, JSON.stringify(el.config.children) )
          // Если есть дочерние столбцы, то надо проверить нет ли их в GROUP BY или В Фильтрах
          if ( isArray(el.config.children) ) {
            for( let alt of el.config.children) {
              let altId = ''
              if (alt.includes('.')) {
                altId = `${_cfg.ds}.${alt}`
              } else {
                altId = `${_cfg.ds}.${_cfg.cube}.${alt}`
              }
              if (isArray(_filters[altId]) || h[altId] === true) {
                // children уже специфицированы, не надо добавлять меня!
                return
              }
            }
          }
          _filters[el.id] = ["=",el.config.memberALL]
        }
      }
    }
  })
  //console.log("FILTERS AFTER", JSON.stringify(_filters))

  return _filters;
}

/* возвращает все или некоторые фильтры в виде массива
если указаны required_columns и negate == falsy, то возвращает фильтры, соответсвующие required_columns
если указаны required_columns и negate == trufy, то возвращает все, кроме указанных в required_columns фильтров

Sep 2023: так как это для части SQL WHERE, то мы никогда не возвращаем столбцы, у которых стоит признак agg
*/

/* sql_context нужен для передачи в функцию `columns` = для принятия решения, используем ли мы имя таблицы
в clickhouse или нет*/

/* FIXME: в context обычно в 1-м элементе массива идёт структура с _aliases и c _target_database
   с помощью этого можно поискать по алиасам !!!
*/
function get_filters_array(context, filters_array, cube, required_columns, negate, sql_context) {

//console.log("get_filters_array " + JSON.stringify(filters_array))
// [{"ch.fot_out.hcode_name":[">","2019-01-01"],"ch.fot_out.pay_title":["=","2019-01-01","2020-03-01"],"ch.fot_out.group_pay_name":["=","Не задано"],"ch.fot_out.pay_code":["=","Не задано"],"ch.fot_out.pay_name":["=","Не задано"],"ch.fot_out.sex_code":["=",null]}]
//console.log(`get_filters_array ${negate} required_columns: ` + JSON.stringify(required_columns))
//console.log("======")

/* нужно пройти по LPE и добавить второй аргумент ко всем вызовам column(), чтобы чётко указать
что это контекст where или having */


  let reformator = function(ar) {
    if (isArray(ar)) {
      if (ar[0] === "column") {
        ar[2] = sql_context
        return ar
      } else {
        return ar.map(el=>{if (isArray(el)) {return reformator(el)} else {return el}})
      }
    }
    return ar 
  }

  filters_array = filters_array.map(el=>{
      let h = {}
      for (const [key, value] of Object.entries(el)) {
        h[key] = reformator(value)
      }
      return h
  })
  
  //console.log("get_filters_array0 <<<< " + JSON.stringify(filters_array))

  let comparator = function(k) {
    return k !== ""
  }
  /*  required_columns может содержать не вычисленные значения: 
    ["id","'dt':'date'"] (кавычки, двоеточия)
    нужно их аккуратно вычислить, но пока неясно, в каком контексте...
  */
  let aliases = {}

  let ignore_quot = function (ast){
    if (isArray(ast)){
      return ast[1]
    } else {
      return ast
    }
  }

  let local_alias_lpe_evaled_map = {}

  if (isArray(required_columns) && required_columns.length > 0) {
    //console.log(`REQ COLS: ${JSON.stringify(required_columns)}`)
    required_columns = required_columns.map(el => {
      let ast = parse(el)
      let colname, aliasname
      //console.log('get_filters_array1> ' + JSON.stringify(ast))
      if (isArray(ast)) {
        //[":",["'","dt"],["'","date"]]
        // FIXME: не будем делать context & eval, но надо бы

        if (ast[0] === ':') {
          colname = ignore_quot(ast[1])
          // [":",["'","dt"],["()",["->",["\"","date space"],["\"","tbl"],["\"","col"]]]]
          if (isArray(ast[2]) && ast[2][0] === '()') {
            ast[2] = ast[2][1]
            aliasname = eval_lisp(ast[2], context)
            //console.log(`get_filters_array2><< ${aliasname} ==` + JSON.stringify(ast[2]))
            local_alias_lpe_evaled_map[aliasname] = true
          } else {
            //aliasname = ignore_quot(ast[2])
            aliasname = eval_lisp(ast[2], context)
          }
          //console.log('get_filters_array3=== ' + aliasname)
          
        } else {
          colname = ignore_quot(ast)
          aliasname = colname
        }
      } else {
        colname = el
        aliasname = el
      }
      colname = cube + '.' + colname
      aliases[colname] = aliasname
      return colname})

    if (negate) {
      comparator = function(k) {
        return (k !== "") && !required_columns.includes(k)
      } 
    } else {
      comparator = function(k) {
        return (k !== "") && required_columns.includes(k)
      }
    }
  }

  let c = context[1]


  //FIXME hack чтобы работал код для agg функций
  context[1]["_result"] = {"columns":[]}

  let should_quot_local_alias = function(a) {
    if (local_alias_lpe_evaled_map[a] === true) {
      return false
    }
    if (a.startsWith("'") || a.startsWith('"')) {
      return false
    }
    return should_quote_alias(a)
  }

  var ret = filters_array.map(_filters => {
      let part_where = null
      let pw = Object.keys(_filters).filter(k => comparator(k)).map( 
        key => {
                    // специальная функция `ignore(me)` = которая ничего не делает, но является меткой для
                    // and or not
                    const [op, ...args] = _filters[key];

                    let colname = aliases[key] // это только при наличии required_columns
                    //console.log(`   STEP ${colname}`)
                    if (isString(colname)){
                      if (should_quot_local_alias(colname)) {
                        // FIXME: double check that lisp is ok with quoted string
                        colname = db_quote_ident(colname)
                      }
                    } else {
                      // ищем варианты для фильтров по алиасам "xxx": ["=","знач"]
                      // для clickhouse НУЖНО использовать ALIASES!!!
                      if (c._target_database !== 'clickhouse' && isHash(c._aliases) && isHash(c._aliases[key]) && c._aliases[key].expr ) {
                        colname = c._aliases[key].expr
                      } else {
                        colname = ["column", key, sql_context]
                      }
                    }
                    //console.log(`   STEP1 ${colname}`)

                    if (op === "ensureThat") {
                      return [op, ...args]
                    } else {
                      //console.log(`STEP0: ${colname} == ${local_alias_lpe_evaled_map[colname]} `)
                      return [op, ["ignore(me)", colname], ...args];
                    }
                    
                    /*
                    let el = _filters[key].slice(0)
                    el.splice(1,0,["ignore(me)",["column",key]])
                    return el*/
                });
//console.log("step:" + JSON.stringify(pw))

      // условия по пустому ключу "" подставляем только если у нас генерация полного условия WHERE,
      // а если это filter(col1,col2) то не надо
      if (required_columns === undefined || 
          (isArray(required_columns) && required_columns.length === 0) || 
          negate === true) 
      {
        if (isArray(_filters[""])) {
          if (isArray(pw)){
            pw.push(_filters[""])
          } else {
            pw = _filters[""]
          }
        }
      }

      if (pw.length > 0) {
        let wh = ["and"].concat(pw)
        //console.log("--WHERE", JSON.stringify(wh))
        // возможно, тут нужен спец. контекст с правильной обработкой or/and  функций.
        // ибо первым аргументом мы тут всегда ставим столбец!!! 
        //console.log('*****: ' + JSON.stringify(wh))
        part_where = eval_lisp(JSON.parse(JSON.stringify(wh)), context)
        //console.log('.....: ' + JSON.stringify(filters_array))
      } else {
        part_where = eval_lisp(JSON.parse(JSON.stringify(pw)), context)
      }
      return part_where
    }).filter(el => el !== null && el.length > 0)

delete context[1]["_result"]

//console.log("RET: " + ret)
//console.log(JSON.stringify(filters_array))
//console.log("---------------------------")
  return ret
}

/* Добавляем ключ "_aliases", чтобы можно было легко найти столбец по алиасу */
function cache_alias_keys(_cfg) {
  /*
  "_columns":[{"columns":["ch.fot_out.dt"],"expr":"(NOW() - INTERVAL '1 DAY')"},
   {"columns":["ch.fot_out.branch4"],"expr":"fot_out.branch4"},{"columns":[],"expr":"fot_out.ss1"},{"columns":
   ["ch.fot_out.v_main","ch.fot_out.v_rel_fzp"],"agg":true,"alias":"summa","expr":"sum((fot_out.v_main + utils.func(fot_out.v_rel_fzp)) / 100)"},
   {"columns":["ch.fot_out.obj_name"],"alias":"new","expr":"fot_out.obj_name"},{"columns":["ch.fot_out.v_rel_pp"],"agg":true,"expr":
   "sum(fot_out.v_rel_pp)"},{"columns":["ch.fot_out.indicator_v","ch.fot_out.v_main"],"agg":true,"alias":"new","expr":
   "avg(fot_out.indicator_v + fot_out.v_main)"}]
   */

  _cfg["_aliases"] = {}
  _cfg["_columns"].map( el => {
    var k = el["alias"]

    if (k && k.length > 0) {
      // включаем это в кэш
      if (_cfg["_aliases"][k]) {
        // EXCEPTION, duplicate aliases
        throw Error(`Duplicate alias ${k} for ${JSON.stringify(el)}`)
      }
      _cfg["_aliases"][k] = el
    } else {
      // SKIPPED, no Alias found !!!
    }
  })
  //console.log("######", JSON.stringify(_cfg))
  return _cfg

}

//  но возможно для teradata и oracle мы захотим брать в двойные кавычки...
function genereate_subtotals_group_by(cfg, group_by_list, target_database){
  let subtotals = cfg["subtotals"]
  let ret = {'group_by':'', 'select':[], 'having': ''}
  //console.log(`SUBTOTALS CFG ${JSON.stringify(cfg)}`)
  // {"ds":"ch","cube":"fot_out",
  //console.log(`GROUP BY: ${JSON.stringify(subtotals)} ${JSON.stringify(group_by_list)}`)
  if (group_by_list.length === 0) {
    return ret
  }
  
  //cfg["_group_by"].map(el => console.log(JSON.stringify(el)))
  //subtotals.map(el => console.log(JSON.strisngify(el)))
  let group_by_exprs = target_database === 'clickhouse'
          ? group_by_list.map(el => el.alias ? el.alias : el.expr)
          : group_by_list.map(el => el.expr)

  let group_by_aliases = group_by_list.map(el => el.alias).filter(el => el !== undefined)

  let group_by_columns = null

  let group_by_sql = group_by_exprs.join(', ')

  let check_column_existence = function(col){
    var i = group_by_exprs.indexOf(col)
    if (i===-1) {
      i = group_by_exprs.indexOf(`"${col}"`)
      if (i===-1) {
        i = group_by_aliases.indexOf(col)
        if (i===-1) {
          i = group_by_aliases.indexOf(`"${col}"`) //FIXME - не уверен что в алиасы попадут заквотированные имена!
          if (i===-1){
            if (group_by_columns === null){
              group_by_columns = group_by_list.map(el => isString(el.columns[0]) ? el.columns[0].split('.')[2]:undefined).filter(el => el !== undefined)
              //console.log(JSON.stringify(group_by_columns));
            }
            var i = group_by_columns.indexOf(col)
            if (i===-1){
              //console.log(`GROUP BY for ${col} : ${JSON.stringify(group_by_list)}`)
              // GROUP BY: ["dt"] [{"columns":["ch.fot_out.dt"],"alias":"ddd","expr":"(NOW() - INTERVAL '1 DAY')"}]
              throw Error(`looking for column ${col} listed in subtotals, but can not find in group_by`)
            }
          }
        }
      }
    }
  }

  // check existance of range() column
  let range_cols = group_by_list.filter(el => el.is_range_column === true)
  let range_col = range_cols[0]
  let range_col_in_the_middle = false

  // проверяем, является ли range НЕ первым столбцом в subtotals ??? #1248
  // FIXME считается, что у нас может быть только один range column!!!

  for (let i=1; i<subtotals.length; i++){
    let subtotal_name = subtotals[i]
    let gb_range_column_index = group_by_list.findIndex( c => 
                    c.is_range_column === true 
                    &&
                    (c.expr === subtotal_name 
                    || c.expr === `"${subtotal_name}"` 
                    || c.alias === subtotal_name
                    || c.alias === `"${subtotal_name}"`
                    ))
    
    //console.log(`${target_database}# SUBTOTAL: ${subtotal_name}` + gb_range_column_index)
    //console.log(JSON.stringify(group_by_list))
    if ( gb_range_column_index !== -1 ) {
      range_col_in_the_middle = true
      range_col = group_by_list[gb_range_column_index]
      break;
    }
  } // for

  /*
  if (!range_col_in_the_middle && isObject(range_col) && group_by_list[0].is_range_column !== true){
    // есть вариант, что в subtotals у нас не найдено range in the middle, но
    // в самом group by есть range, и он не на первом месте (но по фэншую надо искать с условием не только на первом месте)
    // На всякий случай добавляем фильтрацию!

    range_col_in_the_middle = true
  }*/

  //let accum_val = (group_by_list[0] && group_by_list[0].is_range_column === true) ? [range_col.expr] : []
  let accum_val = []

  // {"options": ["AllButOneInterleaved"] }
  // нужно сделать без учёта subtotals !!!
  let cross_subtotals_combinations = function() {
    return subtotals.map(col => {
    check_column_existence(col); 
    //console.log(JSON.stringify(group_by_list.filter(c => c !== col).join(', ')))
    /*
        let r = []
    for (let i=0; i < group_by_list.length; i++){
      let line = group_by_list.slice(0, i).concat(group_by_list.slice(i+1))
      r.push(line.map(c => c.expr).join(', '))
    }
    return r
    */
   // FIXME: range should be handled smartly!!!!
    return group_by_list.filter(c => c.expr !== col && c.expr !== `"${col}"` 
                                 && c.alias !== col && c.alias !== `"${col}"`
                                ).map(c => c.expr).join(', ')
    })
  }

  let hier_subtotals_combinations = function() {
          let res = subtotals.reduce((accum, col) => {
            check_column_existence(col)
            //console.log(`accum: ${JSON.stringify(accum)} + col: ${col} + first: ${JSON.stringify(accum.slice(-1).pop())}`)
            let match = group_by_list.filter(c => c.expr == col || c.expr == `"${col}"` 
                                              || c.alias == col || c.alias == `"${col}"`
                                              || (isArray(c.columns) && isString(c.columns[0]) && c.columns[0].split('.')[2] == col)
                                            )
            if (match.length == 0) {
              throw Error(`hier_subtotals_combinations: looking for column ${col} listed in subtotals, but can not find in group_by`)
            }
            //console.log(`FOUND: ${JSON.stringify(match)} in ${JSON.stringify(group_by_list)}`)
            let colexpr
            if (target_database === 'clickhouse'){
              colexpr = match[0].alias ? match[0].alias : match[0].expr
            } else {
              colexpr = match[0].expr
            }
            return accum.concat([accum.slice(-1).pop().concat(colexpr)])
          }, 
          [accum_val])
          res.shift(); // remove GROUPING SETS () 

/*
SEE #706 !!!
          -GROUP BY GROUPING SETS ((koob__range__table__.day_of_calendar - 1, (NOW() - INTERVAL '1 DAY'), v_main, group_pay_name)
we should remove this useless item:,(koob__range__table__.day_of_calendar - 1),
          -                        (koob__range__table__.day_of_calendar - 1,(NOW() - INTERVAL '1 DAY')),
          -                        (koob__range__table__.day_of_calendar - 1,(NOW() - INTERVAL '1 DAY'),v_main)
          -  
*/

/*
          if (group_by_list[0].is_range_column && res.length>1) {
            res.shift();
          }
*/
          return res;
    }
  let conf = cfg["config"] || {};

  let subtotals_combinations = conf["subtotalsMode"] === "AllButOneInterleaved"
                              ? cross_subtotals_combinations
                              : hier_subtotals_combinations;
  let uberTotal = ''
  let subtotalsSQL = '';

  // #756 не надо добавлять () даже если просили, если есть range()
  if (conf["subtotalsTotal"] && !range_col) {
    uberTotal = ",\n                        ()"
  }

/*
GRPBY: {"columns":[],"unresolved_aliases":["type_oe_bi"],"expr":"type_oe_bi"}
SUBTOTAL: type_oe_bi

GRPBY: {"columns":[],"expr":"ch.fot_out.dt"}
SUBTOTAL: dt
*/
  if (conf["subtotalsMode"] != "AllButOneInterleaved") {
    //console.log('group_by_list: ' + JSON.stringify(group_by_list))
    //console.log('subtotals: ' + JSON.stringify(subtotals))

    if (group_by_list.length == subtotals.length // || 
      /* есть range() и совпадает кол-во subtotals с group by */ 
      /* (group_by_list.length - subtotals.length == 1 && range_col) */
    ){

      let lastSubtotal = subtotals[subtotals.length-1]
      let lastGrp = group_by_list[group_by_list.length-1]
      //console.log('LAST GRPBY: ' + JSON.stringify(lastGrp))
      //console.log('LAST SUBTOTAL: ' + lastSubtotal)

      /* FIXME: double quotes!!! */
      if (lastGrp.expr === lastSubtotal || lastGrp.alias === lastSubtotal
        || (isArray(lastGrp.columns) && isString(lastGrp.columns[0]) && lastGrp.columns[0].split('.')[2] == lastSubtotal) 
      ){
        // we should remove it from subtotals, possibly we need check range()???
        // Удаляем бессмысленную группировку, так как она и так учтена в GROUP BY
        subtotals = subtotals.slice(0,-1)

        /* See #706 - не нужно удалять subtotal по range()
        if (range_col && subtotals.length === 1 && 
          (subtotals[0] === group_by_list[0].alias || subtotals[0] === group_by_list[0].expr) &&
          group_by_list[0].is_range_column
         ) {
          // after cleaning of the last column we have only range column = it is useless!
          // console.log('FIRST GRPBY: ' + JSON.stringify(group_by_list[0]))
          // console.log('FIRST SUBTOTAL: ' + subtotals[0])
           subtotals = []
        }*/



        /*
        if (subtotals.length === 0){
          // проверяем range()
          if(range_col){
            subtotals.push(range_col.expr)
            accum_val = [] // sorry for this
          }
        }*/
      }
    }
  }

  if (subtotals.length > 0) {
    subtotalsSQL = "\n                       ,(".concat(subtotals_combinations().join(
      "),\n                        ("),')');
  }

  ret.group_by = "\nGROUP BY GROUPING SETS ((".concat(group_by_sql, ')',
          subtotalsSQL,
          uberTotal,
         "\n                       )")

  // This might be a hard problem:
  // {"columns":["ch.fot_out.indicator_v","ch.fot_out.v_main"],"agg":true,"alias":"new","expr": "avg(fot_out.indicator_v + fot_out.v_main)"}
  let get_alias = function(el){
    let r
    if (el.alias !== undefined ){
      r = el.alias
    } else {
      r = el.expr
    }
    if (r.startsWith('"')){
      return r.replace(/^"/, '"∑')
    }else{
      return `"∑${r}"`
    }
  }

  let get_grouping_expr = function(el){
    return `GROUPING(${el.expr})`;
  }

  /* временно отключаем, нужно не алиас подставлять а exp */

  if (range_col_in_the_middle && isObject(range_col)){
    // не нужны суммы по range()!! #1248
    let a = target_database === 'clickhouse' ? get_alias(range_col) : get_grouping_expr(range_col)
    ret.having = `${a} != 1`
  }

  ret.select = group_by_list.map(el => `GROUPING(${el.expr}) AS ${get_alias(el)}`)
  return ret
}


/* в _vars могут быть доп. настройки для контекста.
Вообще говоря это должен быть настоящий контекст! с помощью init_koob_context() мы дописываем в этот 
контекст новые ключи, типа _columns, _aliases и т.д. Снаружи мы можем получить доп. фильтры. в ключе
_access_filters

_vars["_dimensions"] соддержит уже выбранные из базы записи из koob.dimensions для нужного куба
_vars["_cube"] содержит уже выбранную запись из базы из koob.cubes для нужного куба
*/

export function generate_koob_sql(_cfg, _vars) {
// так как мы потом меняем _vars, дописывая туда _ds и _cube для более удобного резолва
// столбцов, то нужно ценнную инфу запомнить!

  let _req_cube_info = _vars["_cube"]

  //let _context = {... _vars};
  let _context = _vars
  _context["_koob_api_request_body"] = _cfg; // запоминаем весь запрос из клиента, то есть можно перейти к одному аргументу _vars в будущем!

  if (isHash(_cfg["coefficients"])){
    _context["_coefficients"] = _cfg["coefficients"]
  }


/*
{
"with":"czt.fot",
  "filters": {
  "dor1": ["=", "ГОРЬК"],
  "dor2": ["=", "ПОДГОРЬК"],
  "dor4": ["=", null],
  "dor5": ["=", null],
  "dt": ["BETWEEN", "2020-01", "2020-12"],
  "sex_name": ["=", "Мужской"],
  "": [">", ["+",["col1", "col2"]], 100]
},
"having": {
  "dt": [">","2020-08"],
},
"columns": ["dor3", 'sum(val3):summa', {"new":"old"}, ["sum", ["column","val2"]],  {"new",  ["avg", ["+",["column","val2"],["column","val3"]]} ],
"sort": ["-dor1","val1",["-","val2"],"-czt.fot.dor2"] 
}
*/

  if (isHash(_vars["_data_source"]) && isString(_vars["_data_source"]["url"]) ) {
    var url = _vars["_data_source"]["url"]
    var matched = url.match(/^jdbc\:([^:]+)\:/)
    //console.log(`JSON DATA SOURCE URL MATCHED ${JSON.stringify(matched)}`)
    if (matched != null && matched.length > 1) {
      _context["_target_database"] = matched[1]
    } else {
      _context["_target_database"] = 'postgresql'
    }
  }

  let ds_info = {}
  if ( isString( _cfg["with"]) ) {
    var w = _cfg["with"]
    _context["_columns"] = reports_get_columns(w, _vars["_dimensions"])

    _context["_aliases"] = {} // will be filled while we are parsing columns

    // это корректный префикс: "дс.перв"."куб.2"  так что тупой подсчёт точек не катит.
    if ( w.match( /^("[^"]+"|[^\.]+)\.("[^"]+"|[^\.]+)$/) !== null ) {
      _cfg = normalize_koob_config(_cfg, w, _context);
      if ( _context["_target_database"] === undefined) {
        // это выполняется в БД на лету
        ds_info = get_data_source_info(w.split('.')[0])
        _context["_target_database"] = ds_info["flavor"]
      } else {
        //Это выполняется в тестах
        ds_info = {"flavor": _context["_target_database"]}
      }
    } else {
      // это строка, но она не поддерживается, так как либо точек слишком много, либо они не там, либо их нет
      throw new Error(`Request contains with key, but it has the wrong format: ${w} Should be datasource.cube with exactly one dot in between.`)
    }
  } else {
    throw new Error(`Default cube must be specified in with key`)
  }

  if (_cfg["columns"].length === 0){
    throw new Error(`Empty columns in the request. Can not create SQL.`)
  }

  _context["_ds"] = _cfg["ds"];
  _context["_cube"] = _cfg["cube"];

  _context = init_koob_context(_context, _cfg["ds"], _cfg["cube"])

  //console.log("PRE %%%%: " + _context[1]['()'])
  //console.log("NORMALIZED CONFIG FILTERS: ", JSON.stringify(_cfg))
  //console.log("NORMALIZED CONFIG COLUMNS: ", JSON.stringify(_cfg["columns"]))
  /*
    while we evaluating each column, koob_context will fill JSON structure in the context like this:
   {
     expr: "sum((fot.val3+fot.val1)/100) as summa",
     alias: "summa",
     columns: ["czt.fot.val3","czt.fot.val1"],
     agg: true
   }

   For window func clickhouse flavor we may get this inner/outer SQL:
  {
     expr: "runningAccumulate(mnt, (comp_code,gl_account)) as col1",
     alias: "col1",
     columns: ["czt.fot.val3","czt.fot.val1"],
     agg: true,
     window: true,
     inner_expr: "initializeAggregation('sumState',sum(s2.deb_cre_lc )) as mnt",
     inner_alias: 'mnt'

  } 
  */

  var cube_query_template = reports_get_table_sql(ds_info["flavor"], `${_cfg["ds"]}.${_cfg["cube"]}`, _req_cube_info)


  /* функция зависит от переменной cube_query_temaplte  :-() */
  _context[0]["uniq"] = function(col) {
    // считаем, что аргумент всегда один конкретный столбец (не *)
    _context[1]["_result"]["agg"] = true
    if (_context[1]._target_database === 'clickhouse' &&
      isString(cube_query_template.config.count_distinct) &&
      /^\w+$/.test(cube_query_template.config.count_distinct)
    ){
      return `${cube_query_template.config.count_distinct}(${col})`
    } else {
      return `count(distinct(${col}))`
    }
  }


  /* функция зависит от cube_query_template() */

  _context[0]["total"] = makeSF((ast, ctx, rs) => {
    // считаем, что аргумент всегда один конкретный столбец или формула (не *)

    let known_agg = _context[1]["_result"]["agg"]

    _context[1]["_result"]["agg"] = false

    // парсим пока что только первый аргумент!!!
    //console.log(JSON.stringify(ast))
    let col = eval_lisp(ast[0], ctx, rs)

    if(!_context[1]["_result"]["agg"]) {
      throw new Error(`total() first argument must be an aggregate`)
    }

    _context[1]["_result"]["agg"] = known_agg 

    if ( cube_query_template.config.is_template ) {
      throw new Error(`total() is not yet supported for SQL templates :-(`)
    }

    let f = cube_query_template.query

    return `(SELECT ${col} FROM ${f})`
  })


  let columns_s = [];
  let global_only1 = false;
  let global_joins = [];

  let columns = _cfg["columns"].map(el => {
                                      // eval should fill in _context[1]["_result"] object
                                      // hackers way to get results!!!!
                                      _context[1]["_result"] = {"columns":[]}
                                      //console.log("PRE EVAL: " + JSON.stringify(el))
                                      //console.log("PRE  CTX: " + _context[1]['()'])
                                      var r = eval_lisp(el, _context)
                                      //console.log("POST EVAL: " + JSON.stringify(r))
                                      var col = _context[1]["_result"]
                                      if (col["only1"] === true){
                                        global_only1 = true;
                                      }
                                      columns_s.push(col)
                                      if (col["alias"]) {
                                        _context[1]["_aliases"][col["alias"]] = col
                                      }

                                      if (isHash(col["join"])) {
                                        // Нужно запомнить условия для JOIN
                                        let join = col["join"]
                                        if (join["type"] !== 'inner') {
                                          throw new Error(`Only inner join is supported.`)
                                        }

                                        /* может быть понадобится
                                        if (col["is_range_column"] === true) {
                                          // try to fix where expr using real alias
                                          join.filters[col.alias] = join.filters["koob__range__"]
                                          delete join.filters["koob__range__"]
                                        }*/

                                        global_joins.push(join)
                                        //console.log(`HOY! ${JSON.stringify(col)}`)

                                        // FIXME: keys might collide!!! do not override!
                                        _cfg["filters"] =  {..._cfg["filters"], ...join["filters"]}
                                      }

                                      //FIXME: we should have nested settings for inner/outer 
                                      // Hope aliases will not collide!
                                      if (col["outer_alias"]) {
                                        _context[1]["_aliases"][col["outer_alias"]] = col
                                      }

                                      return r})
  _context[1]["_result"] = null
  _cfg["_aliases"] = _context[1]["_aliases"]

  //console.log("ALIASES" + JSON.stringify(_cfg["_aliases"]))
  var has_window = null
  for (var i=0; i<columns.length; i++){
    columns_s[i]["expr"] = columns[i]
    if (!has_window && columns_s[i]["window"]) {
      //FIXME: for now store here usefull info about order by !!!
      // it will be used later on the SQL generation stage
      has_window = columns_s[i]["inner_order_by_excl"]
    }
  }

  for (var i=0; i<columns_s.length; i++){
    // Also, try to resolve unresolved aliases
    //console.log("ITER0 " + JSON.stringify(columns_s[i]))
    if (isArray(columns_s[i]["unresolved_aliases"])) {
      for (var al of columns_s[i]["unresolved_aliases"]) {
        var col = _cfg["_aliases"][al]
        //console.log("ITER1 " + JSON.stringify(col))
        if (col) {
          if ( col.agg ) {
            // we have alias to the agg func, do the magic
            columns_s[i]["agg"] = true
            columns_s[i]["outer_expr"] = columns_s[i]["expr"] // so we can skip it in the inner select...
            columns_s[i]["expr"] = null
            break
          }
        }
      }
    }
  }

  // try to make transitive agg
  // FIXME: try to resolve full column names as well!
  for (var el of columns_s){
    if (el["agg"] !== true){
      for (var al of el["columns"]) {
        var col = _cfg["_aliases"][al]
        if (col) {
          if ( col.agg ) {
            el["agg"] = true
            break
          }
        }
      }
    }
  }

  // ищем кандидатов для GROUP BY и заполняем оригинальную структуру служебными полями
  _cfg["_group_by"] = []
  _cfg["_measures"] = []
  columns_s.map(el => {
    if (el["agg"] === true) {
      _cfg["_measures"].push(el) 
    } else {
      // window functions
      if (el["do_not_group_by"] === true) {
        _cfg["_measures"].push(el) 
      } else {
        _cfg["_group_by"].push(el)
      }
    }
  })
  _cfg["_columns"] = columns_s

  //console.log("RES ", JSON.stringify(columns_s))

  if (_cfg["_measures"].length === 0) {
    // do not group if we have no aggregates !!!
    _cfg["_group_by"] = []
  }
  //console.log("GBY ", JSON.stringify(_cfg["_group_by"]))

  /* В итоге у нас получается явный GROUP BY по указанным столбцам-dimensions и неявный group by по всем остальным dimensions куба.
   Свободные дименшены могут иметь мембера ALL, и во избежание удвоения сумм, требуется ВКЛЮЧИТЬ мембера ALL в суммирование как некий кэш.
   Другими словами, по ВСЕМ свободным дименшенам, у которых есть мембер ALL (см. конфиг) требуется добавить фильтр dimX = 'ALL' !

   Для указанных явно дименшенов доп. условий не требуется, клиент сам будет разбираться с результатом
  */


  /* Если есть хотя бы один явный столбец group_by, а иначе, если просто считаем агрегаты по всей таблице без группировки по столбцам */
  
  if (_cfg["options"].includes('!MemberALL') === false && (_cfg["_group_by"].length > 0 || _cfg["_measures"].length > 0)) {
    _cfg = inject_all_member_filters(_cfg, _context[1]["_columns"])
  }

  if (_cfg["options"].includes('!ParallelHierarchyFilters') === false) {
    _cfg = inject_parallel_hierarchy_filters(_cfg, _context[1]["_columns"])
  }

  // at this point we will have something like this:
  /*
   {"ds":"ch",
   "cube":"fot_out",
   "filters":{"ch.fot_out.dor1":["=","ГОРЬК"],"ch.fot_out.dor2":["=","ПОДГОРЬК"],"ch.fot_out.dor4":["=",null],
   "ch.fot_out.dor5":["=",null],"ch.fot_out.dt":["BETWEEN","2020-01","2020-12"],"ch.fot_out.sex_name":["=","Мужской"],"ch.fot_out.pay_name":
   ["=",null]},
   "having":{"ch.fot_out.dt":[">","2020-08"]},
   "columns":[["column","ch.fot_out.dt"],["column","ch.fot_out.branch4"],
   ["column","fot_out.ss1"],[":",["sum",["/",["()",["+","v_main",["->","utils",["func","v_rel_fzp"]]]],100]],"summa"],[":",
   ["column","ch.fot_out.obj_name"],"new"],["sum",["column","v_rel_pp"]],[":",["avg",["+",["column","ch.fot_out.indicator_v"],["column","v_main"]]],
   "new"]],"sort":[["-",["column","ch.fot_out.dor1"]],["+",["column","val1"]],["-",["column","val2"]],["-",["column","czt.fot.dor2"]],
   ["+",["column","summa"]]],
   "_group_by":[{"columns":["ch.fot_out.dt"],"expr":"(NOW() - INTERVAL '1 DAY')"},{"columns":["ch.fot_out.branch4"],
   "expr":"fot_out.branch4"},{"columns":[],"expr":"fot_out.ss1"},{"columns":["ch.fot_out.obj_name"],"alias":"new","expr":"fot_out.obj_name"}],
   "_measures":[{"columns":["ch.fot_out.v_main","ch.fot_out.v_rel_fzp"],"agg":true,"alias":"summa","expr":
   "sum((fot_out.v_main + utils.func(fot_out.v_rel_fzp)) / 100)"},{"columns":["ch.fot_out.v_rel_pp"],"agg":true,"expr":
   "sum(fot_out.v_rel_pp)"},{"columns":["ch.fot_out.indicator_v","ch.fot_out.v_main"],"agg":true,"alias":"new","expr":
   "avg(fot_out.indicator_v + fot_out.v_main)"}],
   "_columns":[{"columns":["ch.fot_out.dt"],"expr":"(NOW() - INTERVAL '1 DAY')"},
   {"columns":["ch.fot_out.branch4"],"expr":"fot_out.branch4"},{"columns":[],"expr":"fot_out.ss1"},{"columns":
   ["ch.fot_out.v_main","ch.fot_out.v_rel_fzp"],"agg":true,"alias":"summa","expr":"sum((fot_out.v_main + utils.func(fot_out.v_rel_fzp)) / 100)"},
   {"columns":["ch.fot_out.obj_name"],"alias":"new","expr":"fot_out.obj_name"},{"columns":["ch.fot_out.v_rel_pp"],"agg":true,"expr":
   "sum(fot_out.v_rel_pp)"},{"columns":["ch.fot_out.indicator_v","ch.fot_out.v_main"],"agg":true,"alias":"new","expr":
   "avg(fot_out.indicator_v + fot_out.v_main)"}]}
  */

  // we populate it dynamically now!
  //_cfg = cache_alias_keys(_cfg)
  
  // let's get SQL from it! BUT what about window functions ???

  if (has_window) {
    if (_context[1]["_target_database"] != 'clickhouse'){
      throw Error(`No Window functions support for flavor: ${_context[1]["_target_database"]}`)
    }
    // Try to replace column func to return short names!
    _context[1]["column"] = function(col) {
      // считаем, что сюда приходят только полностью резолвенные имена с двумя точками...
      var c = _context[1]["_columns"][col]
      if (c) {
        var parts = col.split('.')
        if (parts[2].localeCompare(c.sql_query, undefined, { sensitivity: 'accent' }) === 0 ) {
          // we have just column name, prepend table alias !
          return `${c.sql_query}`
          //return `${parts[1]}.${c.sql_query}`
        } else {
          return `(${c.sql_query})`
        }
      }
      //console.log("COL FAIL", col)
      // возможно кто-то вызовет нас с коротким именем - нужно знать дефолт куб!!!
      //if (_context["_columns"][default_ds][default_cube][key]) return `${default_cube}.${key}`;
      
      return col;
    }
  }

/* У нас к этому моменту должны быть заполнены в _cfg["having"] и _cfg["filters"]
при этом в массиве filters могут быть в том числе и столбцы, отмеченные как agg, а их нельзя пихать в where!
поэтому, мы должны качественно отработать массивы:

- _cfg[filters] для where (пропуская agg)
- _cfg[filters] (включая agg) и _cfg[havig] для having

*/
  let SQLWhereNegate = _cfg["options"].includes('SQLWhereNegate')

  let where = '';
  let part_where = SQLWhereNegate ? '1=0' : '1=1';
  let havingSQL = '';
  let part_having = SQLWhereNegate ? '1=0' : '1=1';

  let filters_array = []
  let filters_array_request = _cfg["filters"];
  if (isHash(filters_array_request)) {
    let cols = _context[1]["_columns"]

    /* здесь надо пройти по массиву filters_array, и вычислить AGGFN столбцы, и перенести их в having
    До того, как мы начнём генерить условия WHERE

    Пока что делаем только для простого случая, когда filters_array = hash, и нет никаких сложных
    склеек OR

    */
    Object.keys(filters_array_request).map(col => {
      if (isHash(cols[col])){
        if (cols[col]["type"] === 'AGGFN') {
          // Move col to the having hashmap ???
          
          if (_cfg["having"][col]) {
            Error(`"having" hashmap contains same column as derived column from AGGFN dimension: ${col}`)
          }
          _cfg["having"][col] = filters_array_request[col]
          delete filters_array_request[col]
          // console.log("AGGFN:" + JSON.stringify(_cfg["having"]))
        }
      }
    })

    filters_array_request = [filters_array_request] // делаем общий код на все варианты входных форматов {}/[]
  }


  havingSQL = get_filters_array(_context, [_cfg["having"]], '');
  // ["((NOW() - INTERVAL '1 DAY') > '2020-01-01') AND ((max(sum(v_main))) > 100)"]
  // console.log("AGGFN:" + JSON.stringify(havingSQL))

  // AGGFN условия в любом случае должны попадать в HAVING, иначе SQL не работает.
  // Проверка на наличие агрегатов не позволяет делать запрос по всей совокупности данных
  if (havingSQL.length === 1 /*&& _cfg["_group_by"].length > 0*/ ){
    if (SQLWhereNegate) {
      havingSQL = `\nHAVING NOT (${havingSQL[0]})`
    } else {
      havingSQL = `\nHAVING ${havingSQL[0]}`
    }
  } else {
    // можно не учитывать SQLWhereNegate, так как его учтём в filters ??
    // но может здесь и логичнее было бы
    havingSQL = '';
  }

  /* для кликхауса возможно надо другой контекст для подстановки в filters() */

  let access_where = ''

  let prepare_sql_where_parts = function(where_context){
    // where_context = 'where'
    let ret = {
      'filters_array': [],
      'where': '',
      'part_where': SQLWhereNegate ? '1=0' : '1=1',
      'access_where': ''
    }
    ret['filters_array'] = get_filters_array(_context, filters_array_request, '', undefined, false, where_context);
    // это теперь массив из уже готового SQL WHERE!
  
    // access filters
    var filters = _context[1]["_access_filters"]
    var ast = []
    //console.log("WHERE access filters: ", JSON.stringify(filters))
    if (isString(filters) && filters.length > 0) {
      var ast = parse(`expr(${filters})`)
      ast.splice(0, 1, '()') // replace expr with ()
    } else if (isArray(filters) && filters.length > 0){
      if (filters[0] === 'expr') {
        filters[0] = '()'
        ast = filters
      } else if (filters[0] !== '()') {
        ast = ['()',filters]
      }
    } else if (isHash(filters)){
      // новый формат фильтров, который совпадает с уже существующим....
      // возможно нужно ключи привести к полному имени ds.cube.column ????
      let access_where = get_filters_array(_context, [filters], '', undefined, false, where_context);
      if (access_where.length == 1){
        ret['access_where'] = access_where[0]
      } else if (access_where.length > 1){
        ret['access_where'] = `(${access_where.join(")\n   OR (")})`
      }
      //console.log(`NEW FILTERS: ${JSON.stringify(access_where)}`)
    } else {
      //warning
      //console.log('Access filters are missed.')
    }
    //console.log("WHERE access filters AST", JSON.stringify(ast))
  
    if (ast.length > 0) { // array
      ret['access_where'] = eval_lisp(ast, _context)
    }
  
    let fw = ''
    if (ret['filters_array'].length == 1){
      fw = ret['filters_array'][0]
    } else if (ret['filters_array'].length > 1){
      fw = `(${ret['filters_array'].join(")\n   OR (")})`
    }
  
  
    if (fw.length > 0) {
      if (ret['access_where'] !== undefined && ret['access_where'].length > 0) {
        fw = `(${fw})\n   AND\n   ${ret['access_where']}`
      }
    } else {
      if (ret['access_where'] !== undefined && ret['access_where'].length > 0) {
        fw = ret['access_where']
      }
    }
  
    if ( cube_query_template.config.is_template && cube_query_template.config.skip_where ) {
      // не печатаем часть WHERE, даже если она и должна быть, так как в конфиге куба нас просят
      // этого не делать. 
      if (fw.length > 0) {
        ret['part_where'] = fw
      }
    } else {
      if (fw.length > 0) {
        if (SQLWhereNegate) {
          ret['where'] = `\nWHERE NOT (${fw})`
          ret['part_where'] = `NOT (${fw})`
        } else {
          ret['where'] = `\nWHERE ${fw}`
          ret['part_where'] = fw
        }
      }
    }
    //console.log(`RET: ${JSON.stringify(ret) } `)
    return ret
  } // end of prepare_sql_where_parts


  let res = prepare_sql_where_parts('where')
  where = res['where']
  part_where = res['part_where']
  access_where = res['access_where']
  filters_array = res['filters_array']
   /*
  //_context[1]["column"] - это функция для резолва столбца в его текстовое представление
  filters_array = get_filters_array(_context, filters_array_request, '', undefined, false, 'where');
  // это теперь массив из уже готового SQL WHERE!

  // access filters
  var filters = _context[1]["_access_filters"]
  var ast = []
  //console.log("WHERE access filters: ", JSON.stringify(filters))
  if (isString(filters) && filters.length > 0) {
    var ast = parse(`expr(${filters})`)
    ast.splice(0, 1, '()') // replace expr with ()
  } else if (isArray(filters) && filters.length > 0){
    if (filters[0] === 'expr') {
      filters[0] = '()'
      ast = filters
    } else if (filters[0] !== '()') {
      ast = ['()',filters]
    }
  } else {
    //warning
    //console.log('Access filters are missed.')
  }
  //console.log("WHERE access filters AST", JSON.stringify(ast))

  var access_where = ''
  if (ast.length > 0) { // array
    access_where = eval_lisp(ast, _context)
  }

  var fw = ''
  if (filters_array.length == 1){
    fw = filters_array[0]
  } else if (filters_array.length > 1){
    fw = `(${filters_array.join(")\n   OR (")})`
  }


  if (fw.length > 0) {
    if (access_where.length > 0) {
      fw = `(${fw})\n   AND\n   ${access_where}`
    }
  } else {
    if (access_where.length > 0) {
      fw = access_where
    }
  }

  if ( cube_query_template.config.is_template && cube_query_template.config.skip_where ) {
    // не печатаем часть WHERE, даже если она и должна быть, так как в конфиге куба нас просят
    // этого не делать. 
    if (fw.length > 0) {
      part_where = fw
    }
  } else {
    if (fw.length > 0) {
      if (SQLWhereNegate) {
        where = `\nWHERE NOT (${fw})`
        part_where = `NOT (${fw})`
      } else {
        where = `\nWHERE ${fw}`
        part_where = fw
      }
    }
  }
*/

  // для teradata limit/offset 
  let global_extra_columns = []
  // Для Oracle
  let global_generate_3_level_sql = false
  let top_level_where = '' // for oracle RANGE && LIMIT
  let group_by;

  if (_context[1]["_target_database"] === 'clickhouse') {
    group_by = _cfg["_group_by"].map(el => el.alias ? el.alias : el.expr)
  } else {
    group_by = _cfg["_group_by"].map(el => el.expr)
  }

  // нужно дополнить контекст для +,- и суметь сослатся на алиасы!
  var order_by_context = extend_context_for_order_by(_context, _cfg)
  //console.log("SORT:", JSON.stringify(_cfg["sort"]))
  var order_by = _cfg["sort"].map(el => eval_lisp(el, order_by_context))
  //console.log("ORDER BY:", JSON.stringify(order_by))
  // ORDER BY: ["perda","lead DESC","newid() DESC","newid()"]

  //console.log("SQL:", JSON.stringify(cube_query_template))
  var from = cube_query_template.query

  var limit = isNumber(_cfg["limit"]) ? ` LIMIT ${_cfg["limit"]}` : ''
  var offset = isNumber(_cfg["offset"]) ? ` OFFSET ${_cfg["offset"]}` : ''
  let limit_offset = ''

  if (_context[1]["_target_database"] === 'oracle') {
    //AHTUNG!! это же условие для WHERE FILTERS !!!
    let w
    if (limit) {
      if (offset) {
        w = `"koob__row__num__" > ${parseInt(_cfg["offset"])} AND "koob__row__num__" <= (${parseInt(_cfg["offset"])} + ${parseInt(_cfg["limit"])})`
      } else {
        w = `"koob__row__num__" <= ${parseInt(_cfg["limit"])}`
      }
    } else if (offset) {
      w = `"koob__row__num__" > ${parseInt(_cfg["offset"])}`
    }

    if (w) {
      global_generate_3_level_sql = true
      if (top_level_where.length > 3) {
        top_level_where = `${top_level_where} AND ${w}`
      } else {
        top_level_where = `\nWHERE ${w}`
      }
    }

  } else if (_context[1]["_target_database"] === 'sqlserver') {
    if (limit) {
      if (offset) {
        limit_offset = `\nOFFSET ${parseInt(_cfg["offset"])} ROWS FETCH NEXT ${parseInt(_cfg["limit"])} ROWS ONLY`
      } else {
        limit_offset = `\nOFFSET 0 ROWS FETCH NEXT ${parseInt(_cfg["limit"])} ROWS ONLY`
      }
    } else if (offset) {
      limit_offset = `\nOFFSET ${parseInt(_cfg["offset"])} ROWS`
    }

    // FIXME: кажется это надо делать абсолютно для всех БД
    // и надо с умом подбирать список столбцов
    if (limit_offset.length > 1 && order_by.length === 0) {
      order_by = ["1"]
    }
  } else if (_context[1]["_target_database"] === 'teradata' && (limit || offset)) {
    // Здесь нужно иметь под рукой сотрировку! если её нет, то надо свою выбрать

    let window_order_by
    if (order_by.length === 0) {
      // надо использовать все столбцы, которые являются dimensions и лежать в group by ??? 
      //throw Error(`Teradata limit/offset without specified sorting order is not YET supported :-(`)

      if (_cfg["_group_by"].length === 0) {
        window_order_by = _cfg["_columns"].map( el => {
          if (el.alias) {
            return `"${el.alias}"`
          } else {
            return el.expr
          }
        }).join(',')
      } else {
        window_order_by = _cfg["_group_by"].map( el =>
          el.expr
        ).join(',')
      }
    } else {
      window_order_by = order_by.join(', ')
    }
    //`ROW_NUMBER() OVER (order by ${window_order_by}) as koob__row__num__`
    let column = {"columns":[],"alias":"koob__row__num__","expr":`ROW_NUMBER() OVER (order by ${window_order_by})`}
    // мы не можем добавлять это в общий список столбцов, так как нам потребуется ещё одна обёртка!
    // создаём пока переменную глобальную! но нам нужны вложенные SQL контексты, а не просто outer/inner
    //_cfg["_columns"].unshift(column)
    global_extra_columns.unshift(column)

    if (limit) {
      //QUALIFY __row_num  BETWEEN 1 and 4;
      if (offset) {
        let left = parseInt(_cfg["offset"]) + 1
        limit_offset = `\nQUALIFY koob__row__num__ BETWEEN ${left} AND ${parseInt(_cfg["offset"]) + parseInt(_cfg["limit"])}`
      } else {
        limit_offset = `\nQUALIFY koob__row__num__ <= ${parseInt(_cfg["limit"])}`
      }
    } else if (offset) {
      limit_offset = `\nQUALIFY koob__row__num__ > ${parseInt(_cfg["offset"])}`
    }
  } else {
    if (limit) {
      if (offset) {
        limit_offset = ` LIMIT ${parseInt(_cfg["limit"])} OFFSET ${parseInt(_cfg["offset"])}`
      } else {
        limit_offset = ` LIMIT ${parseInt(_cfg["limit"])}`
      }
    } else if (offset) {
      limit_offset = ` OFFSET ${parseInt(_cfg["offset"])}`
    }
  }

  var ending = ''
  // FIXME! Требуется использовать настройки куба, поле config.query_settings.max_threads
  //        Если в кубе нет настроек, то настройки из JDBC connect string сами применятся,
  //        на уровне драйвера !!! Нужна функция по получению инфы про куб (а у нас может быть несколько таблиц!!!)
  // if (isHash(_vars["_data_source"]) && isString(_vars["_data_source"]["url"]) ) {
  //if (_context[1]["_target_database"] === 'clickhouse'){
    // config->'_connection'->'options'->'max_threads'
    // ending = "\nSETTINGS max_threads = 1"
  //}

  var expand_outer_expr = function(el) {
    if (el["eval_expr"]===true) {
      //console.log("FOUND EVAL", JSON.stringify(el))
      // only one kind of expressions for now...
      // {"lpe_totals":{
      // "lpe_total_2":{"ast":["avg","v_rel_pp"],"expr":"avg(fot_out.v_rel_pp)"}}
      var expr = el.expr;
      for (var total in el.lpe_subtotals) {
        var hash = el.lpe_subtotals[total]
        expr = expr.replace(`${total}()`, `(SELECT ${hash["expr"]} FROM ${from}${where})`)
      }
      return expr;
    } else {
      return el.expr
    }
  }

  if (has_window) {
      // assuming we are working for clickhouse only....
      // we should generate correct order_by, even though each window func may require it's own order by
      // FIXME: we use only ONE SUCH FUNC FOR NOW, IGNORING ALL OTHERS

      // skip all columns which are references to window funcs!
      var innerSelect = "SELECT "
      // могут быть ньюансы квотации столбцов, обозначения AS и т.д. поэтому каждый участок приводим к LPE и вызываем SQLPE функции с адаптацией под конкретные базы
      innerSelect = innerSelect.concat(_cfg["_columns"].map(el => {
        //console.log('1: ' + JSON.stringify(el) + " alias:" + el.alias)
        if (el.expr === null) {
          return null
        }
        if (el.alias){
          for (var part of el.columns) {
            //console.log('2 part:' + part)
            // if we reference some known alias
            var target = _cfg["_aliases"][part]
            if (target && target.window) {
              // if we reference window function, skip such column from inner select!
              return null;
            }
          }
          return quot_as_expression(_context[1]["_target_database"], el.expr, el.alias)
        } else {
          if (el.columns.length === 1) {
            var parts = el.columns[0].split('.')
            return quot_as_expression(_context[1]["_target_database"], el.expr, parts[2])
          }
          return el.expr
        } 
      }).filter(el=> el !== null).join(', '))

    var expand_column = (col) => {
      var cube_prefix = `${_cfg["ds"]}.${_cfg["cube"]}`
      return col.match(/("[^"]+"|[^\.]+)\.("[^"]+"|[^\.]+)/) === null
        ? (_context[1]._columns[`${cube_prefix}.${col}`] ? `${_cfg["cube"]}.${col}` : col )
        : col
    }
    var excl_col = expand_column(has_window)
    //console.log(`${_cfg["ds"]}.${_cfg["cube"]}` + " EXPANDING " + has_window + " to " + excl_col)
    //console.log(JSON.stringify(_context[1]["_columns"]))

    // Put excl_col to the last position, so running window will accumulate data over it!


    var inner_order_by = []
    if (group_by.find(el => el === excl_col)) {
      inner_order_by = group_by.filter(el => el !== excl_col).concat(excl_col)
    }

    

    inner_order_by = inner_order_by.length ? "\nORDER BY ".concat(inner_order_by.join(', ')) : ''

    var having = where.replace("WHERE","HAVING")

    var inner_group_by = group_by.length ? "\nGROUP BY ".concat(group_by.join(', ')) : ''
    var inner = `${innerSelect}\nFROM ${from}${inner_group_by}${having}${inner_order_by}`

    // NOW WE NEED OUTER !

    function get_outer_expr(el) {
      if (el.outer_expr) {
        if (el.outer_expr_eval) {
          if (el.eval_reference_to) {
            // resolve_reference!!
            var init = _cfg["_aliases"][el.eval_reference_to]
            return el.outer_expr.replace('resolve_alias()', init["alias"])
          } else {
            // FIXME, currently we just do simple replace! love LISP: do eval!!!
            var part_columns = group_by.filter( el => el != excl_col)
            part_columns = part_columns.length ? part_columns.map(el=>{
                var p = el.split('.')
                return p[p.length-1]
                }).join(', ') : ''
            if (part_columns === '') {
              part_columns = 'tuple(null)'
            } else {
              part_columns = `(${part_columns})`
            }
            return el.outer_expr.replace('partition_columns()', part_columns)
          }
        } else {
          var parts = el.outer_expr.match(/^("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)$/)
          if (parts) {
            return parts[2]
          }
          return el.outer_expr
        }
      } else {
        // FIXME: stupid Javascript IF
        if ((el.agg === true) && (el.outerVerbatim !== true)) {
          // try to just use alias or column name!!!
          //console.log("DEPARSE " + JSON.stringify(el))
          if (el.alias) {
            return el.alias
          } else {
            var parts = el.columns[0].match(/^("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)$/)
            if (parts) {
              return parts[3]
            }
          }
        } else {
          var parts = el.expr.match(/^("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)$/)
          if (parts) {
            return parts[2]
          }
        }
        return el.expr
      }
    }

    var select = isArray(_cfg["distinct"]) ? "SELECT DISTINCT " : "SELECT "
    select = select.concat(_cfg["_columns"].map(el => {
      //console.log('outer1: ' + JSON.stringify(el) + " alias:" + el.alias)
      if (el.outer_alias) {
          return quot_as_expression(_context[1]["_target_database"], get_outer_expr(el), el.outer_alias)
      } else if (el.alias) {
          return quot_as_expression(_context[1]["_target_database"], get_outer_expr(el), el.alias)
      } else {
        if (el.columns.length === 1) {
          var parts = el.columns[0].match(/^("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)$/)
          //console.log(`outer2: ${get_outer_expr(el)}` + JSON.stringify(parts))
          if (parts) {
            return quot_as_expression(_context[1]["_target_database"], get_outer_expr(el), parts[3])
          }
          return `${get_outer_expr(el)}`
        }
        return `${get_outer_expr(el)}`
      } 
    }).filter(el=> el !== null).join(', '))

    order_by = order_by.length ? "\nORDER BY ".concat(order_by.join(', ')) : ''
    return `${select}\nFROM (\n${inner}\n)${order_by}${limit_offset}${ending}`
  } else {
    // NOT WINDOW! normal SELECT
    //---------------------------------------------------------------------
    let custom_count_disctinct = null

    if (  _cfg["return"] === "count" &&
          isString(cube_query_template.config.count_distinct) &&
          /^\w+$/.test(cube_query_template.config.count_distinct) &&
          _context[1]["_target_database"]==='clickhouse' &&
          isArray(_cfg["distinct"])
    ) {
      custom_count_disctinct = cube_query_template.config.count_distinct
    } 
    // могут быть ньюансы квотации столбцов, обозначения AS и т.д. поэтому каждый участок приводим к LPE и вызываем SQLPE функции с адаптацией под конкретные базы
    var normal_level_columns = _cfg["_columns"].map(el => {
      // It is only to support dictionaries for Clickhouse!!!
      // FIXME: switch to stacked SELECT idea
      if (el.outer_alias) {
        el.alias = el.outer_alias
      }

      if (el.outer_expr) {
        el.expr = el.outer_expr
      }
      /////////////////////////////////////////////////////
      //console.log("COLUMN:", JSON.stringify(el))

      /* v8.11 возвращает отдельные столбцы с GROUPING(col), generate_grouping больше не актуально */
      let generate_grouping = function(arg) {
        return expand_outer_expr(arg)
      }

      if (isArray(_cfg["subtotals"])){
        if (_context[1]["_target_database"]==='clickhouse') {
          generate_grouping = function(arg) {
            let expanded = expand_outer_expr(arg)
            if (arg.agg === true) {
              return expanded
            } else {
              // начиная с 22.6 появилась функция grouping
              // начиная с 22.9 она работает правильно, но есть проблема с алиасом на if(GROUPING())!!!
              // Это бага!!! даже в 22.12
              // Поэтому отключаем!!!
              // return `if(GROUPING(${expanded})=0,${expanded},NULL)`
              return expanded
            }
          }
        } else if (_context[1]["_target_database"]==='postgresql' || 
          /* есть проблема с генерацией SQL _context[1]["_target_database"]==='oracle' || */
          _context[1]["_target_database"]==='teradata' ||
          _context[1]["_target_database"]==='sqlserver' ||
          _context[1]["_target_database"]==='vertica') {
            generate_grouping = function(arg) {
              let expanded = expand_outer_expr(arg)
              if (arg.agg === true) {
                return expanded
              } else {
                return `CASE WHEN GROUPING(${expanded})=0 THEN ${expanded} ELSE NULL END`
              }
            }
        }
      }

      if (custom_count_disctinct) {
        return expand_outer_expr(el)
      } else {
          if (el.alias){
            return quot_as_expression(_context[1]["_target_database"], expand_outer_expr(el), el.alias)
          } else {
            if (el.columns.length === 1) {
              var parts = el.columns[0].split('.')
              // We may have auto-generated columns, which has no dots in name!
              // COLUMN: {"columns":["ch.fot_out.hcode_name"],"expr":"hcode_name"}
              // COLUMN: {"columns":["koob__range__"],"is_range_column":true,"expr":"koob__range__","join":{
              if (parts.length === 3) {
                return quot_as_expression(_context[1]["_target_database"], expand_outer_expr(el), parts[2])
              } else {
                return expand_outer_expr(el)
              }
            }
            //console.log("--ONE ELEMENT NO ALIAS" + JSON.stringify(el))
            return expand_outer_expr(el)
          }
      }
    }).join(', ')

    if (custom_count_disctinct) {
      // пишем кастомную функцию вместо DISTINCT !!!
      normal_level_columns = `${custom_count_disctinct}(${normal_level_columns})`
    }

    order_by = order_by.length ? "\nORDER BY ".concat(order_by.join(', ')) : ''
    let select_tail = normal_level_columns

    if (group_by.length == 0) {
      group_by = ''
    } else {
      if (_cfg["subtotals"] === 'cube') {
        if (_context[1]["_target_database"]==='clickhouse') {
          group_by =`\nGROUP BY ${group_by.join(', ')} WITH CUBE`
        } else {
          // postgresql
          group_by =`\nGROUP BY CUBE (${group_by.join(', ')})`
        }
      } else if (isArray(_cfg["subtotals"])){
        // FIXME: кажется только mysql не алё
        if (_context[1]["_target_database"]==='postgresql' || 
            _context[1]["_target_database"]==='oracle' ||
            _context[1]["_target_database"]==='teradata' ||
            _context[1]["_target_database"]==='clickhouse' ||
            _context[1]["_target_database"]==='sqlserver' ||
            _context[1]["_target_database"]==='vertica'
            ) {
          let subtotals = genereate_subtotals_group_by(_cfg, _cfg["_group_by"], _context[1]["_target_database"])

          if (subtotals.having !== '') {
            if (havingSQL === '') {
              havingSQL = `\nHAVING ${subtotals.having}`
            } else {
              havingSQL = havingSQL.replace("\nHAVING","\nHAVING (")
              havingSQL = `${havingSQL}) AND (${subtotals.having})`
            }
          }
          group_by = subtotals.group_by
          select_tail = `${select_tail}, ${subtotals.select.join(', ')}`
          // We need to add extra columns to the select as well
        } else {
          throw new Error(`named subtotals are not yet supported for ${_context[1]["_target_database"]}`)
        }
      } else {
        group_by ="\nGROUP BY ".concat(group_by.join(', '))
      }
    }
    select = (isArray(_cfg["distinct"]) && (custom_count_disctinct === null)) ? "SELECT DISTINCT " : "SELECT "
    select = select.concat(select_tail)

    var final_sql = ''
    if (cube_query_template.config.is_template) {
      // надо подставить WHERE аккуратно, это уже посчитано, заменяем ${filters} и ${filters()}
      var re = /\$\{filters(?:\(\))?\}/gi;

      // FIXME!!! part_where создан с подстановкой имени таблицы для Clickhouse!!!
      // FIXME!!! а это не всегда работает для шаблонов!!!
      let our_where
      if (_context[1]["_target_database"]==='clickhouse') {
        our_where = prepare_sql_where_parts('template_where')
        our_where = our_where["part_where"]
      } else {
        our_where = part_where
      }


      var processed_from = from.replace(re, our_where); //SQLWhereNegate уже учтено!


      // access_filters
      if (access_where.length == 0) {
        access_where = '1=1'
      }
      var re = /\$\{access_filters(?:\(\))?\}/gi;
      var processed_from = processed_from.replace(re, access_where); //SQLWhereNegate нельзя применять!

      // ищем except()
      re = /\$\{filters\(except\(([^\)]*)\)\)\}/gi
      
      function except_replacer(match, columns_text, offset, string) {
        if (SQLWhereNegate) {
          throw new Error(`Can not process filters(except(...)) when option SQLWhereNegate is present. Sorry.`)
        }
        var columns = columns_text.split(',')
        var filters_array = _cfg["filters"];
        if (isHash(filters_array)) {
          filters_array = [filters_array]
        } else {
          throw new Error(`Can not split OR SQL WHERE into template parts filters(except(...)). Sorry.`)
        }
        //console.log(JSON.stringify(_cfg["filters"]))
        var subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, true, 'template_where')
        if (subst.length == 0) {
          return "1=1"
        }
        return subst;
      }
      processed_from = processed_from.replace(re, except_replacer);

      // ищем filters(a,v,c)
      // FIXME: не делаем access_filters :()
      re = /\$\{filters\(([^\}]+)\)\}/gi
      
      function inclusive_replacer(match, columns_text, offset, string) {
        if (SQLWhereNegate) {
          throw new Error(`Can not process filters(...) when option SQLWhereNegate is present. Sorry.`)
        }
        var columns = columns_text.split(',')
        var filters_array = _cfg["filters"];
        if (isHash(filters_array)) {
          filters_array = [filters_array]
        } else {
          throw new Error(`Can not split OR SQL WHERE into template parts filters(...). Sorry.`)
        }
        //console.log(JSON.stringify(_cfg["filters"]))
        var subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, false, 'template_where')
        if (subst.length == 0) {
          return "1=1"
        }
        return subst;
      }
      processed_from = processed_from.replace(re, inclusive_replacer);

      //final_sql = `${select}\nFROM ${processed_from}${group_by}${order_by}${limit_offset}${ending}`

      ///////////////////////////////////////////////////////////////////////
      // ищем ${udf_args(column , title, name1, filter1, ....)}
      re = /\$\{udf_args\(([^\}]+)\)\}/gi
      let c = init_udf_args_context(`${_cfg.ds}.${_cfg.cube}`, 
                                    _cfg["filters"], 
                                    _context[1]["_target_database"],
                                    _context[0]);

      function udf_args_replacer(match, columns_text, offset, string) {
        if (SQLWhereNegate) {
          throw new Error(`Can not process udf_args(...) when option SQLWhereNegate is present. Sorry.`)
        }
        var filters_array = _cfg["filters"];
        if (!isHash(filters_array)) {
          throw new Error(`filters as array is not supported for udf_args(). Sorry.`)
        }
        //console.log(JSON.stringify(filters_array))
        //var subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, false)
        var ast = parse( `udf_args(${columns_text})`);
        if (ast.length == 0) {
          return ""
        }
        return eval_lisp(ast, c);
      }
      processed_from = processed_from.replace(re, udf_args_replacer);

      // функция filter из table lookup, но тут своя реализация... пробуем
      re = /\$\{filter\(([^\}]+)\)\}/gi // SQLWhereNegate = кажется тут не нужно

      // FIXME: надо инитить глобальный контекст, и подкидывать переменные про юзера.
      // let cc = [ {_target_database: "HOY"}, SQL_where_context ];

      let cc = sql_where_context({'user': _vars["_user_info"]});

      function filter_replacer(match, expression, offset, string) {
        //console.log(`Detected filters expresssion: ${expression}`)
        //var subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, false)
        var ast = parse( `filter(${expression})`);
        if (ast.length == 0) {
          return "1=1"
        }
        //console.log(`Parsed expr: ${JSON.stringify(ast)}`)
        return eval_lisp(ast, cc);
      }
      processed_from = processed_from.replace(re, filter_replacer);

      from = processed_from

    }

    if (global_joins.length > 0) {
      // нужно ещё сделать JOINS
      from = from + ',' + global_joins.map(el=>{
          if (el["expr"]) {
            return el["alias"] ? `${el["expr"]} as ${el["alias"]}`: el["expr"]
          } else {
            return el["alias"] ? `${el["table"]} as ${el["alias"]}`: el["table"]
          } 
      })
    }

    if (global_extra_columns.length > 0 ) {
      let saved_columns = _cfg["_columns"]
      _cfg["_columns"] = global_extra_columns
      // нам нужно ещё раз обернуть весь запрос!!!
      // похоже список столбцов нужнео дополнить нашими доп столбцами....
      var top_level_select = 'SELECT '
      top_level_select = top_level_select.concat(global_extra_columns.map(el => {
        // It is only to support dictionaries for Clickhouse!!!
        // FIXME: switch to stacked SELECT idea
        // console.log(`global_extra_columns: ${JSON.stringify(el)}`)
        if (el.outer_alias) {
          el.alias = el.outer_alias
        }
  
        if (el.outer_expr) {
          el.expr = el.outer_expr
        }
        /////////////////////////////////////////////////////
        //console.log("COLUMN:", JSON.stringify(el))
        if (el.alias){
          return quot_as_expression(_context[1]["_target_database"], expand_outer_expr(el), el.alias)
        } else {
          if (el.columns.length === 1) {
            var parts = el.columns[0].split('.')
            return quot_as_expression(_context[1]["_target_database"], expand_outer_expr(el), parts[2])
          }
          return expand_outer_expr(el)
        } 
      }).join(', '))

      //console.log(`global_extra_columns STEP ${top_level_select}`)
      top_level_select = top_level_select.concat(', ')

      _cfg["_columns"] = saved_columns
      // ещё раз надо пройтись по столбцам, но теперь нам нужны ТОЛЬКО АЛИАСЫ !
      top_level_select = top_level_select.concat(_cfg["_columns"].map(el => {
        // It is only to support dictionaries for Clickhouse!!!
        // FIXME: switch to stacked SELECT idea
        if (el.outer_alias) {
          el.alias = el.outer_alias
        }
  
        if (el.outer_expr) {
          el.expr = el.outer_expr
        }
        /////////////////////////////////////////////////////
        //console.log("COLUMN:", JSON.stringify(el))
        if (el.alias){
          // FIXME: делаем принудительную квотацию для терадаты!!!
          //return quot_as_expression(_context[1]["_target_database"], expand_outer_expr(el), el.alias)
          return `"${el.alias}"`
        } else {
          if (el.columns.length === 1) {
            var parts = el.columns[0].split('.')
            //return quot_as_expression(_context[1]["_target_database"], expand_outer_expr(el), parts[2])
            return `"${parts[2]}"`
          }
          return `"${expand_outer_expr(el)}"`
        } 
      }).join(', '))
      
      if (global_only1 === true) {
        group_by = ''
        // plSQL will parse this comment! Sic! 
        top_level_select = `/*ON1Y*/${top_level_select}`
      }
      // Oracle can not handle `table as alias` So we removed AS from final select
      // Teradata: [TeraJDBC 16.20.00.13] [Error 3706] [SQLState 42000] Syntax error: ORDER BY is not allowed in subqueries.
      if (_context[1]["_target_database"]==='teradata') {
        // FIXME: В терадате используется WINDOW  OVER (ORDER BY) для наших типов запросов, так что должно быть норм. 
        final_sql = `${top_level_select} FROM (${select}\nFROM ${from}${where}${group_by}${havingSQL}) koob__top__level__select__${top_level_where}${order_by}${limit_offset}${ending}`
      } else {
        final_sql = `${top_level_select} FROM (${select}\nFROM ${from}${where}${group_by}${havingSQL}${order_by}) koob__top__level__select__${top_level_where}${limit_offset}${ending}`
      }
    } else {
      if (global_only1 === true) {
        group_by = ''
        // plSQL will parse this comment! Sic! 
        select = `/*ON1Y*/${select}`
      } 
      if (_context[1]["_target_database"]==='oracle' &&  global_generate_3_level_sql === true) {
        // В оракле приходится 3-х этажный селект делать
        final_sql = `SELECT * FROM (SELECT koob__inner__select__.*, ROWNUM AS "koob__row__num__" FROM (${select}\nFROM ${from}${where}${group_by}${havingSQL}${order_by}) koob__inner__select__) koob__top__level__select__${top_level_where}${ending}`
      } else {
        final_sql = `${select}\nFROM ${from}${where}${group_by}${havingSQL}${order_by}${limit_offset}${ending}`
      }
    }

//console.log("FINAL: " + final_sql)
//custom_count_disctinct уже содержит кастомную функцию типа uniq() и не нужно делать доп. обёртку
    if (_cfg["return"] === "count" && custom_count_disctinct === null) {
      if (_context[1]["_target_database"] === 'clickhouse'){
        final_sql = `select toUInt32(count(300)) as count from (${final_sql})`
      } else {
        // use quotes to interact with our Web client in all cases (prevent upper case)
        final_sql = `select count(300) as "count" from (${final_sql}) koob__count__src__`
      }
    }
    return final_sql
  }

}
