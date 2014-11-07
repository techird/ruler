/**
 * @fileOverview
 *
 * 直线定义
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('define_line', {

    prev: [TYPE_POINT, TYPE_POINT],
    next: TYPE_LINE,

    go: function(p1, p2) {
        return new Line(p1, p2);
    }
});