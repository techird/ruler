void

function() {

    /**
     * ruler command compiler
     * 尺规作图类型推导命令编译器
     * @author 王集鹄(wangjihu,http://weibo.com/zswang),刘家鸣(liujiaming,http://weibo.com/techird)
     * @version 2014-11-06
     */

    /**
     * 表达式类型
     */
    var symbolOperator = {
        define_point: ',',
        define_line: ',',
        define_circle: ',',
        define_distance: '~',
        intersect_circle_circle: '*',
        intersect_line_circle: '*',
        intersect_line_line: '*',
        point_select: '['
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
        for (var stepName in symbolOperator) {
            var operator = symbolOperator[stepName];
            var stepDefine = Ruler.use(stepName);

            var attrTypes = stepDefine.prev.slice();

            var key1 = [operator, attrTypes].join();
            var key2 = [operator, attrTypes.reverse()].join();

            var type = {
                type: stepDefine.next,
                operator: operator,
                attrs: attrTypes.slice(),
                fn: stepName
            };

            inferences[key1] = type;

            if (key1 !== key2) { // 类型有不同
                type = JSON.parse(JSON.stringify(type));
                type.attrs = attrTypes.slice().reverse();
                inferences[key2] = type;
            }
        }
        /*<debug>*/
        // console.log(JSON.stringify(inferences, null, 2));
        /*</debug>*/
    };

    /**
     * 编译命令
     */
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
            // console.log('calc(%s)', JSON.stringify(formula));
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
                // console.log('calcExper(*, %s, %s, %s)', JSON.stringify(left), JSON.stringify(operator), JSON.stringify(right));
                /*</debug>*/
                left = calc(left);
                right = calc(right);
                if (/[+\-*\/]/.test(operator) && // 数值运算
                    left.type === TYPE_NUMBER && right.type === TYPE_NUMBER) {
                    var value = eval(left.value + operator + right.value);
                    result = {
                        type: TYPE_NUMBER,
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
                    type: TYPE_NUMBER,
                    text: value,
                    value: value
                };
            } else if (/[\[\]]/.test(formula)) { // 存在下标计算
                formula.replace(/^(.*)\[([^\[\]]+)\]/, function(all, left, index) {
                    left = calc(left);
                    index = calc(index);
                    result = scan('[', left, index);
                });
            } else if (/[,+\-*\/~]/.test(formula)) { // 存在操作符
                // 运算符优先级
                prioritys.forEach(function(priority) {
                    if (result) {
                        return true;
                    }
                    formula.replace(priority, calcExper);
                });
            }
            if (!result) {
                console.warn('formula parse failed: ' + formula);
                return;
            }
            var name = '{' + (guid++) + '}';
            result.text = name;
            formulas[formula] = result;
            symbols[name] = result;
            return result;
        };

        var formulaRegex = /^\s*([\w_$]+)\s*=\s*(.+)\s*$/;

        function parseLine(line) {
            String(line).replace(formulaRegex, function(all, name, expression) {
                    var replace = 1;
                    var expr = expression;
                    // 优先计算括号内的表达式
                    while (replace) {
                        replace = 0;
                        expr = expr.replace(/\(([^()]*)\)/g, function(all, formula) {
                            var data = calc(formula);
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
        }

        String(text).split('\n').forEach(function(line, index) {
            try {
                parseLine(line);
            } catch (e) {
                throw new Error('Parsing faild (line ' + index + '): ' + line);
            }
        });

        return symbols;
    };

    Ruler.prototype.parse = function(text) {
        var symbols = build(text);

        var settled = {};
        var ruler = this;

        function importStep(name) {

            if (settled[name]) return;

            var symbol = symbols[name];

            if (symbol.type == TYPE_NUMBER &&  !symbol.operands) return;

            var prevs = [];

            if (symbol.operands) {

                symbol.operands.forEach(function(operand) {
                    if (symbols[operand].type == TYPE_NUMBER && !symbols[operand].operands) prevs.push(symbols[operand].value);
                    else {
                        importStep(operand);
                        prevs.push(settled[operand]);
                    }
                });

                var step = ruler.step(symbol.fn, prevs);
                step.resultName = symbol.name || null;
                settled[name] = step;
            }
        }

        this.reset();

        for (var name in symbols) {
            importStep(name);
        }

        return this.steps;
    };

}();
