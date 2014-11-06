/**
 * @fileOverview
 *
 * 直线定义
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('define_line', {

    prev: ['Point', 'Point'],
    next: 'Line',

    go: function(p1, p2) {
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        if (Ruler.isZero(dx) && Ruler.isZero(dy)) return null;
        return {
            dx: dx,
            dy: dy,
            x1: p1.x,
            x2: p2.x,
            y1: p1.y,
            y2: p2.y
        };
    }
});