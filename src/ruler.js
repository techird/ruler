var _stepDefinations = {};
var _cmdMap = {};

function isZero(number) {
    return !isNaN(number) && Math.abs(number) < 1e-6;
}

function define(name, step) {
    _stepDefinations[name] = step;
    _cmdMap[step.command] = name;
}

function use(ruleName) {
    return _stepDefinations[ruleName];
}

var NUMBER_TYPES = { Number:1, Distance: 1, Index: 1 };
function _checkType(type, value) {
    if (type in NUMBER_TYPES) {
        if (type == 'Distance' && value && value.type == 'Distance') return true;
        return !isNaN(value);
    } else {
        return value && type == value.type;
    }
}

function _validateStep(name, previousTypeRequired, previous) {
    /* validate length */
    if (previous.length != previousTypeRequired.length) {
        throw new Error('The `' + name + '` step requires ' + previousTypeRequired.length + ' previous, but ' + previous.length + ' are given');
    }
    /* validate type */
    for (var i = 0; i < previousTypeRequired.length; i++) {
        if (!_checkType(previousTypeRequired[i], previous[i])) {
            throw new Error('The `' + name + '` rule requires a ' + previousTypeRequired[i] + ' for previous[' + i + '], but ' + (previous[i].type || typeof(previous[i])) + ' are given');
        }
    }
}

function Matrix(a, b, c, d, e, f) {
    a = a || 1; c = c || 0; e = e || 0;
    b = b || 0; d = d || 1; f = f || 0;

    function _merge(a1, b1, c1, d1, e1, f1) {
        var a2 = a, b2 = b, c2 = c, d2 = d, e2 = e, f2 = f;
        a = a1 * a2 + c1 * b2;
        b = b1 * a2 + d1 * b2;
        c = a1 * c2 + c1 * d2;
        d = b1 * c2 + d1 * d2;
        e = a1 * e2 + c1 * f2 + e1;
        f = b1 * e2 + d1 * f2 + f1;
    }

    function _rotate(sin, cos) {
        _merge(cos, sin, -sin, cos, 0, 0);
    }

    this.translate = function(dx, dy) {
        _merge(1, 0, 0, 1, dx, dy);
        return this;
    };

    this.rotate = function(rad) {
        var sin = Math.sin(rad);
        var cos = Math.cos(rad);
        _rotate(sin, cos);
        return this;
    };

    this.inverse = function() {
        var k = a * d - b * c,
            aa = d / k,
            bb = -b / k,
            cc = -c / k,
            dd = a / k,
            ee = (c * f - e * d) / k,
            ff = (b * e - a * f) / k;
        a = aa;
        b = bb;
        c = cc;
        d = dd;
        e = ee;
        f = ff;
        return this;
    };

    this.rotateByVector = function(dx, dy) {
        var dr = Math.sqrt(dx * dx + dy * dy);
        var sin = dy / dr;
        var cos = dx / dr;
        _rotate(sin, cos);
        return this;
    };

    this.transformPoint = function(p) {
        return {
            x: a * p.x + c * p.y + e,
            y: b * p.x + d * p.y + f
        };
    };
}

var namingMap = {
    Point: 'P',
    Line: 'L',
    Arc: 'C',
    Distance: 'D'
};
var idMap = {};

function Step(name, prevs) {
    var defination = _stepDefinations[name];
    var next = defination.next;
    var naming = namingMap[next];

    _validateStep(name, defination.prev, prevs);

    idMap[next] = (idMap[next] ? idMap[next] + 1 : 1);

    this.origin = name;
    this.name = naming + idMap[next];
    this.type = next;
    this.prevs = prevs;
    this.nexts = [];

    // 记住后驱
    prevs.forEach(function(prev) {
        if (prev instanceof Step) prev.nexts.push(this);
    });

    var _result = null;

    this.result = function() {
        var error = false;

        var prevResults = prevs.map(function(prev) {
            var prevResult = prev instanceof Step ? prev.result() : prev;
            if (prevResult === null) error = true;
            return prevResult;
        });

        if (this.error = error) {
            _result = null;
            return;
        }

        if (_result === null) {
            _result = defination.go.apply(this, prevResults);
        }

        return _result;
    };

    this.rebuild = function(modifier) {
        _result = null;
        this.nexts.forEach(function(next) {
            next.rebuild();
        });
        if (typeof(modifier) == 'function') {
            modifier(prevs);
        }
        return this.result();
    };
}

function lineY(line, x) {
    if (isZero(line.dx)) return null;
    return line.dy / line.dx * (x - line.x1) + line.y1;
}


/* The Ruler Class */
function Ruler() {
    this.steps = [];
}

Ruler.prototype.step = function(name, prevs) {
    var step = new Step(name, prevs);
    this.steps.push(step);
    return step;
};

function _checkStepTypeMatch(step, args) {
    var requiredTypes = step.prev;

    if (args.length != requiredTypes.length) return false;

    for (var i = 0; i < requiredTypes.length; i++) {
        if (!_checkType(requiredTypes[i], args[i])) return false;
    }

    return true;
}

function _createTypeStep(type) {
    return function autoStep() {
        var args = [].slice.call(arguments);
        for (var name in _stepDefinations) {
            if (!_stepDefinations.hasOwnProperty(name)) return;
            var defination = _stepDefinations[name];

            if (defination.next != type) continue;

            if (_checkStepTypeMatch(defination, args)) return this.step(name, args);
        }
    };
}

Ruler.prototype.point = _createTypeStep('Point');
Ruler.prototype.line = _createTypeStep('Line');
Ruler.prototype.arc = _createTypeStep('Arc');
Ruler.prototype.distance = _createTypeStep('Distance');

Ruler.prototype.exec = function(commandString) {
    var symbols = (this.symbols || (this.symbols = {}));
    var parts = commandString.split(/[\s,]+/);

    while(parts.length && !parts[0]) parts.shift();
    while(parts.length && !parts[parts.length - 1]) parts.pop();

    var commandName = parts.shift();
    var symbol = parts.pop();

    var style, hide;

    if (symbol.indexOf('!') > 0) {
        var arr = symbol.split('!');
        symbol = arr.shift();
        style = arr.pop();
    }

    if (symbol.indexOf('&') > 0) {
        symbol = symbol.split('&')[0];
        hide = true;
    }

    if (symbol in symbols) {
        throw new Error('Symbol ' + symbol + ' has been token.');
    }

    var stepName = _cmdMap[commandName];
    if (!stepName) throw new Error('Undefined command: ' + commandName);

    var args = parts.map(function(part) {
        return symbols[part] || parseInt(part, 10);
    });
    if (!_checkStepTypeMatch(_stepDefinations[stepName], args)) throw new Error('Args mismatch: ' + commandString);

    var step = symbols[symbol] = this.step(stepName, args);
    step.name = symbol;

    if (style) step.style = style;
    if (hide) step.hide = hide;

    return step;
};

Ruler.prototype.reset = function() {
    this.steps = [];
    this.symbols = {};
};

Ruler.prototype.render = function(ctx, style, left, right, top, bottom) {
    var canvas = ctx.canvas;
    left = left || 0;
    top = top || 0;
    right = right || canvas.width;
    bottom = bottom || canvas.height;

    var renderSteps = this.steps.slice();
    renderSteps.sort(function(a, b) {
        if (a.type == 'Point') return 1;
        if (b.type == 'Point') return -1;
    });
    renderSteps.forEach(function(step) {
        var result = step.result();
        if (!result || step.hide) return;
        switch (step.type) {
            case 'Point':
                ctx.beginPath();
                ctx.arc(result.x, result.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = step.style || (step.origin == 'define_point' ? 'red' : 'lightgray');
                ctx.fill();
                ctx.font = '12px Arial';
                ctx.fillStyle = '#999';
                ctx.fillText(step.name, result.x + 5, result.y - 3);
                break;
            case 'Line':
                ctx.beginPath();
                if (!isZero(result.dx)) {
                    ctx.moveTo(left, lineY(result, left));
                    ctx.lineTo(right, lineY(result, right));
                } else {
                    ctx.moveTo(result.x1, top);
                    ctx.lineTo(result.x1, bottom);
                }
                ctx.strokeStyle = step.style || '#EEE';
                ctx.stroke();
                break;
            case 'Arc':
                ctx.beginPath();
                ctx.arc(result.x, result.y, result.r, 0, Math.PI * 2);
                ctx.strokeStyle = step.style || '#EEE';
                ctx.stroke();
                break;
        }
    });
};

Ruler.isZero = isZero;
Ruler.define = define;
Ruler.use = use;
Ruler.Matrix = Matrix;
