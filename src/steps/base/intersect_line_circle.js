/**
 * @fileOverview
 *
 * 直线和圆相交
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('intersect_line_circle', {

    prev: [TYPE_LINE, TYPE_CIRCLE],
    next: TYPE_POINTS,

    /* http://mathworld.wolfram.com/Circle-LineIntersection.html */
    go: function (line, circle) {
        var x0 = circle.x,
            y0 = circle.y,
            r = circle.r;
        var x1 = line.x1 - x0, y1 = line.y1 - y0,
            x2 = line.x2 - x0, y2 = line.y2 - y0,
            dx = line.dx, dy = line.dy;
        var dr2 = dx * dx + dy * dy;
        var dr = Math.sqrt(dr2);
        var D = x1 * y2 - x2 * y1;
        var delta = r * r * dr * dr - D * D;

        // 相切
        if (isZero(delta)) return [new Ruler.Point(
            D * dy / dr2 + x0,
            -D * dx / dr2 + y0
        )];

        // 相离
        if (delta < 0) return null;

        var sgn = dy < 0 ? -1 : 1;

        var intersects = [];

        var xt = sgn * dx * Math.sqrt(delta);
        var yt = Math.abs(dy) * Math.sqrt(delta);

        return [
            new Point(
                (D * dy - xt) / dr2 + x0,
                (-D * dx - yt) / dr2 + y0
            ),
            new Point(
                (D * dy + xt) / dr2 + x0,
                (-D * dx + yt) / dr2 + y0
            )
        ];
    }
});