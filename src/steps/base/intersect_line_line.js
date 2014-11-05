/**
 * @fileOverview
 *
 * 
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('intersect_line_line', {

    command: 'lli',

    prev: ['Line', 'Line'],
    next: 'Point',

    /* http://en.wikipedia.org/wiki/Line%E2%80%93line_intersection */
    go: function (l1, l2) {
        var x1 = l1.x1, y1 = l1.y1,
            x2 = l1.x2, y2 = l1.y2,
            x3 = l2.x1, y3 = l2.y1,
            x4 = l2.x2, y4 = l2.y2,
            m1 = x1 - x2, n1 = y1 - y2,
            m2 = x3 - x4, n2 = y3 - y4,
            a = x1 * y2 - y1 * x2,
            b = x3 * y4 - y3 * x4;

        var f = m1 * n2 - n1 * m2;

        if (Ruler.isZero(f)) return null;

        return {
            x: (a * m2 - m1 * b) / f,
            y: (a * n2 - n1 * b) / f
        };

    }
});