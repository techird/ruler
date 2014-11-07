/**
 * @fileOverview
 *
 * 距离定义 
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('define_distance', {

    prev: [TYPE_POINT, TYPE_POINT],
    next: TYPE_NUMBER,
    
    go: function (p1, p2) {
        var dx = p1.x - p2.x,
            dy = p1.y - p2.y;

        return Math.sqrt(dx * dx + dy * dy);
    }
});