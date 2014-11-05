/**
 * @fileOverview
 *
 * 两圆弧交点
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('intersect_arc_arc', {

    command: 'aai',

    prev: ['Arc', 'Arc', 'Index'],
    next: 'Point',

    /* http://mathworld.wolfram.com/Circle-CircleIntersection.html */
    go: function(a1, a2, index) {

        var x1 = a1.x, y1 = a1.y, r1 = a1.r,
            x2 = a2.x, y2 = a2.y, r2 = a2.r;

        var dx = x2 - x1;
        var dy = y2 - y1;

        var R = a1.r, r = a2.r, d = Math.sqrt(dx * dx + dy * dy);
        var root = (-d + r - R) * (-d - r + R) * (-d + r + R) * (d + r + R);

        if (root < 0) return null;

        var d2 = d + d;

        var x = (d * d - r * r + R * R) / d2;
        var y = Ruler.isZero(root) ? 0 : (Math.sqrt(root) / d2) * (index > 0 ? 1 : -1);
    
        // 转换为原始坐标
        var matrix = new Ruler.Matrix().rotateByVector(dx, dy).translate(x1, y1);
        return matrix.transformPoint({x: x, y: y});
    }
});