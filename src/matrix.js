/**
 * @fileOverview
 *
 * 简单矩阵
 * 支持平移、旋转、求逆、转换点
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

function Matrix(a, b, c, d, e, f) {
    a = a || 1; c = c || 0; e = e || 0;
    b = b || 0; d = d || 1; f = f || 0;

    function _merge(a1, b1, c1, d1, e1, f1) {
        var a2 = a, b2 = b, c2 = c, d2 = d, e2 = e, f2 = f;
        a = a1 * a2 + c1 * b2;
        b = b1 * a2 + d1 * b2;
        c = a1 * c2 + c1 * d2;
        d = b1 * c2 + d1 * d2;
        e = a1 * e2 + c1 * f2 + e1;
        f = b1 * e2 + d1 * f2 + f1;
    }

    function _rotate(sin, cos) {
        _merge(cos, sin, -sin, cos, 0, 0);
    }

    this.translate = function(dx, dy) {
        _merge(1, 0, 0, 1, dx, dy);
        return this;
    };

    this.rotate = function(rad) {
        var sin = Math.sin(rad);
        var cos = Math.cos(rad);
        _rotate(sin, cos);
        return this;
    };

    this.inverse = function() {
        var k = a * d - b * c,
            aa = d / k,
            bb = -b / k,
            cc = -c / k,
            dd = a / k,
            ee = (c * f - e * d) / k,
            ff = (b * e - a * f) / k;
        a = aa;
        b = bb;
        c = cc;
        d = dd;
        e = ee;
        f = ff;
        return this;
    };

    this.rotateByVector = function(dx, dy) {
        var dr = Math.sqrt(dx * dx + dy * dy);
        var sin = dy / dr;
        var cos = dx / dr;
        _rotate(sin, cos);
        return this;
    };

    this.transformPoint = function(p) {
        return new Ruler.Point(
            a * p.x + c * p.y + e,
            b * p.x + d * p.y + f
        );
    };
}

Ruler.Matrix = Matrix;