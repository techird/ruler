/**
 * @fileOverview
 *
 * 圆弧定义
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('define_arc', {

    command: 'ad',

    prev: ['Point', 'Distance'],
    next: 'Arc',

    go: function (center, r) {
        console.log('go', center, r);
        return {
            x: center.x,
            y: center.y,
            r: r
        };
    }
});

Ruler.define('define_arc_2', {

    command: 'ad2',

    prev: ['Point', 'Point'],
    next: 'Arc',

    go: function (center, outer) {
        var dx = center.x - outer.x;
        var dy = center.y - outer.y;
        return {
            x: center.x,
            y: center.y,
            r: Math.sqrt(dx * dx + dy * dy)
        };
    }
});

Ruler.define('define_arc_3', {

    command: 'ad3',

    prev: ['Point', 'Point', 'Point'],
    next: 'Arc',

    go: function (center, dref1, dref2) {
        var dx = dref2.x - dref1.x,
            dy = dref2.y - dref1.y;
        return {
            x: center.x,
            y: center.y,
            r: Math.sqrt(dx * dx + dy * dy)
        };
    }
});
