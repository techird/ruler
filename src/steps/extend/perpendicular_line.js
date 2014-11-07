/**
 * @fileOverview
 *
 * 
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
Ruler.define('perpendicular_line', {

    prev: [TYPE_LINE, TYPE_POINT],
    next: TYPE_LINE,

    go: function(line, point) {
        var x1 = point.x,
            y1 = point.y;

        var x2 = line.dy + x1,
            y2 = line.dx + y1;

        return new Line(point, new Point(x2, y2));
    }
});