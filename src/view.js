/**
 * @fileOverview
 *
 * 视野支持
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
Ruler.prototype.enableView = function() {
    if (!this.canvas) throw new Error('ruler canvas missing');

    var downPosition = null;
    var downOffset = null;

    var ruler = this;
    var canvas = this.canvas;

    this.canvas.addEventListener('mousedown', function(e) {
        if (ruler.hotStep) return;
        downPosition = { x: e.clientX, y: e.clientY };
        downOffset = ruler.canvasOffset;
        e.preventDefault();
    });

    this.canvas.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    this.canvas.addEventListener('mousemove', function(e) {
        if (!downPosition) return;
        var dx = e.clientX - downPosition.x;
        var dy = e.clientY - downPosition.y;

        ruler.canvasOffset = [downOffset[0] + dx, downOffset[1] + dy];
        ruler.render();
    });

    window.addEventListener('mouseup', function(e) {
        downPosition = null;
    });
};