/**
 * @fileOverview
 *
 * 
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
Ruler.define('perpendicular_line', {

    command: 'pl',

    prev: ['Line', 'Point'],
    next: 'Line',

    go: function(line, point) {
        var x1 = point.x,
            y1 = point.y;

        var x2 = line.dy + x1,
            y2 = line.dx + y1;

        return {
            x1: point.x,
            y1: point.y,
            x2: -line.dy + point.x,
            y2: line.dx + point.y,
            dx: -line.dy,
            dy: line.dx
        };
    }
});