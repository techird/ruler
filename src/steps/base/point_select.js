/**
 * @fileOverview
 *
 * 两圆弧交点
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
Ruler.define('point_select', {

    prev: [TYPE_POINTS, TYPE_NUMBER],
    next: TYPE_POINT,

    go: function(points, index) {
        return points[index];
    }

});