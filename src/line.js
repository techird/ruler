/**
 * @fileOverview
 *
 * 直线数据
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
function Line(p1, p2) {
    this.x1 = p1.x;
    this.x2 = p2.x;
    this.y1 = p1.y;
    this.y2 = p2.y;
    this.dx = p2.x - p1.x;
    this.dy = p2.y - p1.y;
    this.hotPriority = 2;
}

Line.prototype.getYForX = function getYForX(x) {
    return this.dy / this.dx * (x - this.x1) + this.y1;
};

Line.prototype.getXForY = function getXForY(y) {
    return this.dx / this.dy * (y - this.y1) + this.x1;
};

Line.prototype.hot = function(x, y) {
    var a = this.dy,
        b = -this.dx,
        c = -this.dy * this.x1 + this.dx * this.y1;
    var d = Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
    return d < 5;
};

Ruler.Line = Line;