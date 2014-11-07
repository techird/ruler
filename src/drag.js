/**
 * @fileOverview
 *
 * 支持原始步骤拖拽
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.prototype.enableDrag = function() {
    var canvas = this.canvas;
    var ruler = this;

    var draggingStep = null;
    var downPrevs = null;
    var downPosition = null;

    canvas.addEventListener('mousedown', function(e) {
        var position = ruler.getDrawingPosition(e.clientX, e.clientY);
        var hot = ruler.hot(position.x, position.y);

        if (hot && hot.name == 'define_point') {
            draggingStep = hot;
            downPrevs = draggingStep.prevs.slice();
            downPosition = {x: e.clientX, y: e.clientY};
        }
    });

    canvas.addEventListener('mousemove', function(e) {
        if (!draggingStep) return;
        var dx = e.clientX - downPosition.x;
        var dy = e.clientY - downPosition.y;
        draggingStep.rebuild(function(prevs) {
            prevs[0] = downPrevs[0] + dx;
            prevs[1] = downPrevs[1] + dy;
        });
        ruler.render();
    });

    window.addEventListener('mouseup', function(e) {
        draggingStep = null;
    });
};