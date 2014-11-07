/**
 * @fileOverview
 *
 * 圆的数据
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

function Circle(center, radius) {
    this.x = center.x;
    this.y = center.y;
    this.r = radius;
    this.hotPriority = 3;
}

Circle.prototype.hot = function(x, y) {
    var dx = x - this.x;
    var dy = y - this.y;
    var dr = Math.sqrt(dx * dx + dy * dy);
    var r = this.r;
    return Math.abs(dr - r) < 5;
};

Ruler.Circle = Circle;