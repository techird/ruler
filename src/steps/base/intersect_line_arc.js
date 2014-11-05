/**
 * @fileOverview
 *
 * 直线和圆相交
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('intersect_line_arc', {

    command: 'lai',

    prev: ['Line', 'Arc', 'Index'],
    next: 'Point',

    /* http://mathworld.wolfram.com/Circle-LineIntersection.html */
    go: function (line, arc, index) {
        var x0 = arc.x,
            y0 = arc.y,
            r = arc.r;
        var x1 = line.x1 - x0, y1 = line.y1 - y0,
            x2 = line.x2 - x0, y2 = line.y2 - y0,
            dx = line.dx, dy = line.dy;
        var dr2 = dx * dx + dy * dy;
        var dr = Math.sqrt(dr2);
        var D = x1 * y2 - x2 * y1;
        var delta = r * r * dr * dr - D * D;

        // 相切
        if (Ruler.isZero(delta)) return {
            x: D * dy / dr2 + x0,
            y: -D * dx / dr2 + y0
        };

        // 相离
        if (delta < 0) return null;

        var sgn = dy < 0 ? -1 : 1;
        var choose = index > 0 ? 1 : -1;
        var x = (D * dy + choose * sgn * dx * Math.sqrt(delta)) / dr2;
        var y = (-D * dx + choose * Math.abs(dy) * Math.sqrt(delta)) / dr2;

        return {x: x + x0, y: y + y0};
    }
});