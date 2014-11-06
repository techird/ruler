void

function(exportName) {

    var exports = exports || {};

    /**
     * Variant Type 值类型
     */
    var VT_NUMBER = 'number';
    var VT_POINT = 'point';
    var VT_LINE = 'line';
    var VT_ARC = 'arc';

    /**
     * 表达式类型
     */
    var symbolTypes = {
        definePoint: {
            type: VT_POINT,
            operator: ',',
            attrs: [{
                name: 'x',
                type: VT_NUMBER
            }, {
                name: 'y',
                type: VT_NUMBER
            }]
        },

        defineLine: {
            type: VT_LINE,
            operator: ',',
            attrs: [{
                name: 'p1',
                type: VT_POINT
            }, {
                name: 'p2',
                type: VT_POINT
            }]
        },

        defineArc: {
            type: VT_ARC,
            operator: ',',
            attrs: [{
                name: 'center',
                type: VT_POINT
            }, {
                name: 'radius',
                type: VT_NUMBER
            }]
        },

        distance: {
            type: VT_NUMBER,
            operator: '~',
            attrs: [{
                name: 'p1',
                type: VT_POINT
            }, {
                name: 'p2',
                type: VT_POINT
            }]
        },

        intersectArcArc: {
            type: VT_LINE,
            operator: '*',
            attrs: [{
                name: 'c1',
                type: VT_ARC
            }, {
                name: 'c2',
                type: VT_ARC
            }]
        },

        intersectLineArc: {
            type: VT_LINE,
            operator: '*',
            attrs: [{
                name: 'arc',
                type: VT_ARC
            }, {
                name: 'line',
                type: VT_LINE
            }]
        },

        intersectLineLine: {
            type: VT_POINT,
            operator: '*',
            attrs: [{
                name: 'l1',
                type: VT_LINE
            }, {
                name: 'l2',
                type: VT_LINE
            }]
        },

        indexOf: {
            type: VT_NUMBER,
            operator: '[',
            attrs: [{
                name: 'line',
                type: VT_LINE
            }, {
                name: 'index',
                type: VT_NUMBER,
                min: 0,
                max: 1
            }]
        }
    };

    /**
     * 类型推导
     */
    var inferences;
    var init = function() {
        if (inferences) {
            return;
        }
        inferences = {};
        for (var i in symbolTypes) {
            var type = symbolTypes[i];
            type.fn = i;
            var attrTypes = type.attrs.map(function(attr) {
                return attr.type;
            });
            var key1 = [type.operator, attrTypes].join();
            var key2 = [type.operator, attrTypes.reverse()].join();

            inferences[key1] = type;
            if (key1 !== key2) { // 类型有不同
                type = JSON.parse(JSON.stringify(type));
                type.attrs = type.attrs.reverse();
                inferences[key2] = type;
            }
        }
        /*<debug>*/
        // console.log(JSON.stringify(inferences, null, 2));
        /*</debug>*/
    };

    var build = function(text) {
        init();

        var symbols = {};
        var formulas = {}; // 表达式缓存
        var guid = 0;
        var scan = function(operator, left, right) {
            /*<debug>*/
            // console.log('scan(%s, %s, %s)', JSON.stringify(operator), JSON.stringify(left), JSON.stringify(right));
            /*</debug>*/
            var result;
            var inference = inferences[[operator, left.type, right.type]];
            if (!inference) {
                throw new Error(left.type + operator + right.type);
                return;
            }
            // inference.attrs
            result = {
                type: inference.type,
                fn: inference.fn
            };
            var items = [left, right];
            result.operands = [];
            inference.attrs.forEach(function(attr) {
                var item = items.shift();
                //result[attr.name] = item;
                result.operands.push(item.text);
            });
            return result;
        };

        /**
         * 计算表达式
         * @param{String} formula 表达式
         * return{Symbol}
         *   @field{String} type 类型
         *   @field{String} text 表达式文本
         */
        var calc = function(formula) {
            /*<debug>*/
            console.log('calc(%s)', JSON.stringify(formula));
            /*</debug>*/

            formula = formula.trim(); // 清除空格

            if (formulas[formula]) { // 表达式缓存
                return formulas[formula];
            }

            if (symbols[formula]) { // 已经计算过的变量
                return symbols[formula];
            }

            var result;
            var prioritys = [
                /^(.*)(~)(.*?)$/,
                /^(.*)(,)(.*?)$/,
                /^(.*)([*\/])(.*?)$/,
                /^(.*)([+\-])(.*?)$/
            ];

            var calcExper = function(all, left, operator, right) {
                /*<debug>*/
                console.log('calcExper(*, %s, %s, %s)', JSON.stringify(left), JSON.stringify(operator), JSON.stringify(right));
                /*</debug>*/
                left = calc(left);
                right = calc(right);
                if (/[+\-*\/]/.test(operator) && // 数值运算
                    left.type === VT_NUMBER && right.type === VT_NUMBER) {
                    var value = eval(left.value + operator + right.value);
                    result = {
                        type: VT_NUMBER,
                        text: value,
                        value: value
                    };
                } else {
                    result = scan(operator, left, right);
                }
            };

            if (/^[\d-*+\/\s.]+$/.test(formula)) { // 数学表达式
                var value = eval(formula);
                result = {
                    type: VT_NUMBER,
                    text: value,
                    value: value
                };
            } else if (/[,+\-*\/~]/.test(formula)) { // 存在操作符
                // 运算符优先级
                prioritys.forEach(function(priority) {
                    if (result) {
                        return true;
                    }
                    formula.replace(priority, calcExper);
                });
            } else if (/[\[\]]/.test(formula)) { // 存在下标计算
                formula.replace(/^(.*)\[([^\[\]]+)\]/, function(all, left, index) {
                    left = calc(left);
                    index = calc(index);
                    result = scan('[', left, index);
                });
            }
            if (!result) {
                throw new Error(formula);
            }
            var name = '{' + (guid++) + '}';
            result.text = name;
            formulas[formula] = result;
            symbols[name] = result;
            return result;
        };

        String(text).replace(/^\s*([\w_$]+)\s*=\s*(.+)\s*$/gm,
            function(all, name, expression) {
                var replace = 1;
                var expr = expression;

                // 优先计算括号内的表达式
                while (replace) {
                    replace = 0;
                    expr = expr.replace(/\(([^()]*)\)/g, function(all, formula) {
                        var data = calc(formula);
                        if (!data) {
                            throw new Error(formula);
                        }
                        replace++;
                        return data.text;
                    });
                }
                if (/\(|\)/.test(expr)) {
                    throw new Error(expression);
                }

                formulas[name] = calc(expr);
                formulas[name].name = name;
            }
        );

        return symbols;
    };

    exports.build = build;

    if (typeof define === 'function') {
        if (define.amd || define.cmd) {
            define(function() {
                return exports;
            });
        }
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = exports;
    } else {
        window[exportName] = exports;
    }

}('ruler');
