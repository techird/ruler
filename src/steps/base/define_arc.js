/**
 * @fileOverview
 *
 * 圆弧定义
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('define_arc', {

    prev: ['Point', 'Number'],
    next: 'Arc',

    go: function (center, r) {
        return {
            x: center.x,
            y: center.y,
            r: r
        };
    }
});
