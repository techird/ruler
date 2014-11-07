/**
 * @fileOverview
 *
 * 圆弧定义
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('define_circle', {

    prev: [TYPE_POINT, TYPE_NUMBER],
    next: TYPE_CIRCLE,

    go: function (center, r) {
        return new Circle(center, r);
    }
});
