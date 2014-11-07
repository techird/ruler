/**
 * @fileOverview
 *
 * 渲染 Ruler 对象中每一步产生的结果
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.defaultStyle = {
    'point-fill': 'red',
    'point-stroke': null,
    'point-stroke-width': 0,
    'point-size': 3,
    'point-label': '#666',

    'draggable-point-fill': 'white',
    'draggable-point-stroke': 'red',
    'draggable-point-stroke-width': 4,
    'draggable-point-size': 4,
    'draggable-point-label': '#666',

    'path-stroke': 'gray',
    'path-stroke-width': 1,
    'path-label': false
};

Ruler.hotStyle = {
    'point-stroke': 'yellow',
    'point-stroke-width': 4,
    'point-size': 4,

    'draggable-point-fill': 'white',
    'draggable-point-stroke': 'red',
    'draggable-point-stroke-width': 4,
    'draggable-point-size': 6,

    'path-stroke': 'blue',
    'path-hightlight': 'rgba(200, 100, 100, .3)',
    'path-hightlight-width': 4,
    'path-label': '#999'
};

Ruler.hotPrevStyle = {
    'point-fill': 'green',
    'point-stroke': 'yellow',
    'point-stroke-width': 2,
    'point-size': 4,

    'draggable-point-fill': 'green',
    'draggable-point-stroke': 'yellow',
    'draggable-point-stroke-width': 4,
    'draggable-point-size': 4,

    'path-stroke': 'green',
    'path-stroke-width': 1,
    'path-hightlight': 'rgba(100, 100, 100, .3)',
    'path-hightlight-width': 3,
    'path-label': '#999'
};

function renderPoint(point, step, ctx, style) {

    var draggable = step.name == 'define_point';

    var size = draggable ? style['draggable-point-size'] : style['point-size'];
    var fill = draggable ? style['draggable-point-fill'] : style['point-fill'];
    var stroke = draggable ? style['draggable-point-stroke'] : style['point-stroke'];
    var strokeWidth = draggable ? style['draggable-point-stroke-width'] : style['point-stroke-width'];

    var label = style['point-label'];
    
    ctx.beginPath();
    ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
    ctx.closePath();

    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (label && step.resultName) {
        ctx.font = '12px Arial';
        ctx.fillStyle = label;
        ctx.fillText(step.resultName, point.x + size + 3, point.y - size - 1);
    }
}

function renderLine(line, step, ctx, style, bounding) {

    var top = bounding[0];
    var right = bounding[1];
    var bottom = bounding[2];
    var left = bounding[3];

    ctx.beginPath();

    if (!Ruler.isZero(line.dx)) {
        ctx.moveTo(left, line.getYForX(left));
        ctx.lineTo(right, line.getYForX(right));
    } else {
        ctx.moveTo(line.x1, top);
        ctx.lineTo(line.x1, bottom);
    }

    var label = style['path-label'];
    if (label && step.resultName) {
        var xm = (line.x1 + line.x2) / 2;
        var ym = (line.y1 + line.y2) / 2;
        var dx = line.dx;
        var dy = line.dy;
        var dr = Math.sqrt(dx * dx + dy * dy);
        var r = 20;
        var x = xm + r * dy / dr;
        var y = ym + r * dx / dr;
        labelPath(ctx, step, x, y, label);
    }

    stylizedPath(ctx, style);
}

function renderCircle(circle, step, ctx, style) {

    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
    ctx.closePath();

    var label = style['path-label'];

    if (label && step.resultName) {
        var cx = circle.x;
        var cy = circle.y;
        var r = circle.r + 20;
        var x = cx + r * 0.717;
        var y = cy - r * 0.717;
        labelPath(ctx, step, x, y, label);
    }

    stylizedPath(ctx, style);
}

function labelPath(ctx, step, x, y, style) {
    ctx.font = '12px Arial';
    ctx.fillStyle = style;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(step.resultName, x, y);
}

function stylizedPath(ctx, style) {
    var stroke = style['path-stroke'];
    var strokeWidth = style['path-stroke-width'];
    var highlight = style['path-hightlight'];
    var highlightWidth = style['path-hightlight-width'];

    if (highlight) {
        ctx.strokeStyle = highlight;
        ctx.lineWidth = highlightWidth;
        ctx.stroke();
    }
    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }
}

var rendererMap = {
    'Point': renderPoint,
    'Line': renderLine,
    'Circle': renderCircle
};

var pseudos = {
    'default': 'defaultStyle',
    'hot': 'hotStyle',
    'prev-hot': 'hotPrevStyle'
};

function addStyle(ruler, selector, defines) {
    defines = parseStyleDefines(defines);

    var pseudoName = pseudos[selector.toLowerCase().split('::')[1]];

    if (pseudoName) {
        ruler[pseudoName] = defines;
    } else {
        var parts = selector.split(':');
        var name = parts[0];

        if (parts.length == 2) {
            pseudoName = pseudos[parts[1]];
        }

        var step = ruler.findStep(name);
        if (!step) return;

        if (pseudoName) {
            step[pseudoName] = defines;
        } else {
            step.style = extend({}, step.style, defines);
        }
    }
}

function parseStyleDefines(defines) {
    var result = {};

    function match(all, name, value) {
        var intValue = parseInt(value, 10);
        result[name] = isNaN(intValue) ? value : intValue;
    }

    String(defines).replace(/\s+([\w-]+)\:\s*([\w\d#\(\)\.]+)/g, match);

    return result;
}

Ruler.prototype.loadStyleSheet = function(text) {
    var ruler = this;

    function match(all, selectors, defines) {
        selectors.split(',').forEach(function(selector) {
            addStyle(ruler, selector.trim(), defines);
        });
    }

    String(text).replace(/^(.+?)(\{[\s\S]+?\})/gm, match);
};

Ruler.prototype.render = function(ctx, bounding) {
    var canvas = ctx.canvas;
    var ruler = this;

    bounding = bounding || [0, canvas.width, canvas.height, 0];

    var hotStep = this.hotStep,
        hotPrevs = hotStep && hotStep.prevs;

    if (hotPrevs && hotPrevs[0].resultType == TYPE_POINTS) {
        hotPrevs = hotPrevs[0].prevs;
    }

    var renderSteps = this.steps.slice();

    renderSteps.sort(function(a, b) {
        var ah = a.result().hotPriority || 99999;
        var bh = b.result().hotPriority || 99999;

        if (a == hotStep) ah = -1;
        if (hotPrevs && hotPrevs.indexOf(a) != -1) ah = 0;

        if (b == hotStep) bh = -1;
        if (hotPrevs && hotPrevs.indexOf(b) != -1) bh = 0;

        return bh - ah;
    });

    renderSteps.forEach(function(step) {

        var result = step.result();

        if (!result) return;

        var style = extend({}, Ruler.defaultStyle, ruler.defaultStyle, step.style);

        if (hotStep == step) {
            style = extend(style, Ruler.hotStyle, ruler.hotStyle, step.hotStyle);
        } else if (hotPrevs && hotPrevs.indexOf(step) != -1) {
            style = extend(style, Ruler.hotPrevStyle, ruler.hotPrevs, step.hotPrevStyle);
        }

        var renderer = rendererMap[step.resultType];

        if (renderer) {
            ctx.save();
            renderer(result, step, ctx, style, bounding);
            ctx.restore();
        }
    });
};
