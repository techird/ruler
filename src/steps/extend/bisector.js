/**
 * @fileOverview
 *
 * 中点
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
Ruler.define('bisector', {

    prev: [TYPE_POINT, TYPE_POINT],
    next: TYPE_POINT,

    go: function(p1, p2) {
        return new Point(
            (p1.x + p2.x) / 2,
            (p1.y + p2.y) / 2
        );
    }
});