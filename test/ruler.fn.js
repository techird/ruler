void

function(exportName) {

    var exports = exports || {};

    function isZero(number) {
        return !isNaN(number) && Math.abs(number) < 1e-6;
    }

    var definePoint = function(x, y) {
        return {
            x: x,
            y: y
        }
    };
    exports.definePoint = definePoint;

    var defineLine = function(p1, p2) {
        return {
            p1: p1,
            p2: p2
        }
    };
    exports.defineLine = defineLine;

    var defineArc = function(center, radius) {
        return {
            center: center,
            radius: radius
        }
    };
    exports.defineArc = defineArc;

    var distance = function(p1, p2) {
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    exports.distance = distance;

    function lerp(a, b, t) {
        return {
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t
        };
    );


    // from https://github.com/thelonious/js-intersections
    var intersectArcArc = function(a1, a2) {
        var r1 = a1.radius;
        var r2 = a2.radius;
        var c1 = a1.center;
        var c2 = a2.center;

        // Determine minimum and maximum radii where circles can intersect
        var r_max = r1 + r2;
        var r_min = Math.abs(r1 - r2);

        // Determine actual distance between circle circles
        var c_dist = distance(c1, c2);

        if (c_dist > r_max) {
            return null;
        }
        if (c_dist < r_min) {
            return null;
        }

        var a = (r1 * r1 - r2 * r2 + c_dist * c_dist) / (2 * c_dist);
        var h = Math.sqrt(r1 * r1 - a * a);
        var p = lerp(c1, c2, a / c_dist);
        var b = h / c_dist;
        return [{
            x: p.x - b * (c2.y - c1.y),
            y: p.y + b * (c2.x - c1.x)

        }, {

            x: p.x + b * (c2.y - c1.y),
            y: p.y - b * (c2.x - c1.x)
        }];
    };
    exports.intersectArcArc = intersectArcArc;

    var intersectLineArc = function(line, arc) {
        var x0 = arc.x,
            y0 = arc.y,
            r = arc.r;
        var x1 = line.x1 - x0,
            y1 = line.y1 - y0,
            x2 = line.x2 - x0,
            y2 = line.y2 - y0,
            dx = line.dx,
            dy = line.dy;
        var dr2 = dx * dx + dy * dy;
        var dr = Math.sqrt(dr2);
        var D = x1 * y2 - x2 * y1;
        var delta = r * r * dr * dr - D * D;

        // 相切
        if (isZero(delta)) {
            var p = {
                x: D * dy / dr2 + x0,
                y: -D * dx / dr2 + y0
            };
            return [p, p];
        }

        // 相离
        if (delta < 0) return null;

        var sgn = dy < 0 ? -1 : 1;

        var p1 = {
            x: (D * dy + sgn * dx * Math.sqrt(delta)) / dr2 + x0,
            y: (-D * dx + Math.abs(dy) * Math.sqrt(delta)) / dr2 + y0
        };
        var p2 = {
            x: (D * dy - sgn * dx * Math.sqrt(delta)) / dr2 + x0,
            y: (-D * dx - Math.abs(dy) * Math.sqrt(delta)) / dr2 + y0
        };

        return [p1, p2];
    };
    exports.intersectLineArc = intersectLineArc;

    var intersectLineLine = function(l1, l2) {
        var a = l1.p1;
        var b = l1.p2;
        var c = l2.p1;
        var d = l2.p2;
        var delta = (b.y - a.y) * (d.x - c.x) -
            (d.y - c.y) * (b.x - a.x);

        if (isZero(delta)) {
            return null;
        }

        var x = (
            (b.x - a.x) * (d.x - c.x) * (c.y - a.y) +
            (b.y - a.y) * (d.x - c.x) * a.x -
            (d.y - c.y) * (b.x - a.x) * c.x
        ) / delta;
        var y = (
            (b.y - a.y) * (d.y - c.y) * (c.x - a.x) +
            (b.x - a.x) * (d.y - c.y) * a.y -
            (d.x - c.x) * (b.y - a.y) * c.y
        ) / -delta;

        return {
            x: x,
            y: y
        };
    };
    exports.intersectLineLine = intersectLineLine;

    var indexOf = function(line, index) {
        if (index === 0) {
            return line.p1;
        }
        return line.p2;
    };
    exports.indexOf = indexOf;

    if (typeof define === 'function') {
        if (define.amd || define.cmd) {
            define(function() {
                return exports;
            });
        }
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = exports;
    } else {
        window[exportName] = exports;
    }

}('rulerFn');
