/**
 * @fileOverview
 *
 * 垂直平分线
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
Ruler.define('perpendicular_bisector', {

    command: 'pbl',

    prev: ['Point', 'Point'],
    next: 'Line',

    go: function(p1, p2) {
        var define_line = Ruler.use('define_line');
        var define_arc = Ruler.use('define_arc');
        var define_distance = Ruler.use('define_distance');
        var intersect_arc_arc = Ruler.use('intersect_arc_arc');
        var intersect_line_line = Ruler.use('intersect_line_line');

        var d1 = define_distance.go(p1, p2);

        if (Ruler.isZero(d1)) return null;

        var c1 = define_arc.go(p1, d1);
        var c2 = define_arc.go(p2, d1);

        var q1 = intersect_arc_arc.go(c1, c2, 0);
        var q2 = intersect_arc_arc.go(c1, c2, 1);

        return define_line.go(q1, q2);
    }
});