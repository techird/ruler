/**
 * @fileOverview
 *
 * 两圆弧交点
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('intersect_circle_circle', {

    prev: [TYPE_CIRCLE, TYPE_CIRCLE],
    next: TYPE_POINTS,

    /* http://mathworld.wolfram.com/Circle-CircleIntersection.html */
    go: function(c1, c2, index) {

        var x1 = c1.x, y1 = c1.y, r1 = c1.r,
            x2 = c2.x, y2 = c2.y, r2 = c2.r;

        var dx = x2 - x1;
        var dy = y2 - y1;

        var R = c1.r, r = c2.r, d = Math.sqrt(dx * dx + dy * dy);
        var root = (-d + r - R) * (-d - r + R) * (-d + r + R) * (d + r + R);

        if (root < 0) return [];

        var d2 = d + d;

        var x = (d * d - r * r + R * R) / d2;

        var matrix = new Ruler.Matrix().rotateByVector(dx, dy).translate(x1, y1);
        var transformer = matrix.transformPoint.bind(matrix);

        // 相切
        if (isZero(root)) {
            return [new Point(x, 0)].map(transformer);
        }

        var h = Math.sqrt(root) / d2;
        return [new Point(x, -h), new Point(x, h)].map(transformer);
    
    }
});