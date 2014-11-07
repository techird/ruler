/**
 * @fileOverview
 *
 * 点的数据
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.hotPriority = 1;
}

Point.prototype.hot = function(x, y) {
    var dx = this.x - x;
    var dy = this.y - y;
    var r = 5;
    return dx * dx + dy * dy < r * r;
};

Ruler.Point = Point;