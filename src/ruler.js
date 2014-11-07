/* The Ruler Class */
function Ruler() {
    this.steps = [];
}

var TYPE_NUMBER = Ruler.TYPE_NUMBER = 'Number';
var TYPE_POINT = Ruler.TYPE_POINT = 'Point';
var TYPE_LINE = Ruler.TYPE_LINE = 'Line';
var TYPE_CIRCLE = Ruler.TYPE_CIRCLE = 'Circle';
var TYPE_POINTS = Ruler.TYPE_POINTS = 'Points';

/* 作图步骤定义 */
var __stepDefinations = {};


/* 判断为零（精度问题，浮点数不能直接和零对比） */
function isZero(number) {
    return !isNaN(number) && Math.abs(number) < 1e-6;
}
Ruler.isZero = isZero;


/* 定义一个作图步骤 */
function define(name, step) {
    __stepDefinations[name] = step;
}
Ruler.define = define;


/* 获取一个作图步骤定义 */
function use(ruleName) {
    return __stepDefinations[ruleName];
}
Ruler.use = use;

/* 对象 extend */
function extend(source, target) {
    if (arguments.length > 2) {
        return extend(source, extend.apply(null, [].slice.call(arguments, 1)));
    }
    if (!target) return source;
    for (var p in target) {
        if (target.hasOwnProperty(p)) source[p] = target[p];
    }
    return source;
}
Ruler.extend = extend;

function checkType(type, value) {
    if (value instanceof Step) {
        return value.resultType == type;
    }
    if (type == TYPE_NUMBER) return !isNaN(value);
    return false;
}

function printf(str) {
    var args = [].slice.call(arguments, 1);
    return str.replace(/\{(\d+)\}/g, function(match, $1) {
        return args[parseInt($1)] || match;
    });
}

var LENGTH_MISMATCH_ERR = 'The `{0}` step requires `{1}` previous values, but {2} are provided.';
var TYPE_MISMATCH_ERR = 'The `{0}` step requires `{1}` type previous values, but {2} are provided';

function validateStep(name, prevTypes, prevValues) {

    /* validate length */
    if (prevValues.length != prevTypes.length) {
        throw new Error(printf(LENGTH_MISMATCH_ERR, 
            name, prevTypes.length, prevValues.length));
    }

    /* validate type */
    for (var i = 0; i < prevTypes.length; i++) {
        if (!checkType(prevTypes[i], prevValues[i])) {
            throw new Error(printf(TYPE_MISMATCH_ERR, 
                name, prevTypes[i], prevValues[i]));
        }
    }
}


/**
 * 创建一个绘图步骤
 *
 * @param {string} name  步骤定义的名称
 * @param {Array<Step|number>} prevs 步骤的前驱步骤或前驱值
 */
function Step(name, prevs) {
    var defination = __stepDefinations[name];
    var prevTypes = defination.prev;
    var nextType = defination.next;

    validateStep(name, prevTypes, prevs);

    this.name = name;
    this.resultType = nextType;
    this.resultName = null;
    this.prevs = prevs;
    this.nexts = [];

    // 记住后驱
    prevs.forEach(function(prev) {
        if (prev instanceof Step) prev.nexts.push(this);
    });

    var _result = null;

    // 返回当前步骤的计算结果
    this.result = function() {

        // 已缓存的结果
        if (_result) return _result;

        // 未缓存，需要计算前驱，计算前驱如果出错，标记
        var error = false;

        // 计算前驱结果
        var prevResults = prevs.map(function(prev) {
            var prevResult = prev instanceof Step ? prev.result() : prev;
            if (prevResult === null) error = true;
            return prevResult;
        });

        // 计算错误，返回 null
        if (this.error = error) {
            return null;
        }

        return _result = defination.go.apply(this, prevResults);
    };

    // 重建当前步骤的结果
    this.rebuild = function(modifier) {
        _result = null;

        if (typeof(modifier) == 'function') {
            modifier(prevs);
        }

        if (this.nexts.length) {
            // 自顶向下 rebuild 
            this.nexts.forEach(function(next) {
                next.rebuild();
            });
        } else {
            // 自底向上重算
            this.result();            
        }

    };
}

Ruler.prototype.step = function(name, prevs) {
    var step = new Step(name, prevs);
    this.steps.push(step);
    return step;
};

Ruler.prototype.reset = function() {
    this.steps = [];
};

Ruler.prototype.hot = function(x, y) {
    var hots = [];

    var steps = this.steps.slice();

    var step, result;
    while (step = steps.pop()) {
        result = step.result();
        if (typeof(result.hot) == 'function' && result.hot(x, y)) {
            hots.push({
                result: result,
                step: step
            });
        }
    }

    hots.sort(function(a, b) {
        return b.result.hotPriority - a.result.hotPriority;
    });

    if (hots.length) {
        return this.hotStep = hots.pop().step;
    } else {
        return this.hotStep = null;
    }

};
