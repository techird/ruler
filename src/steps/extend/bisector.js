/**
 * @fileOverview
 *
 * 中点
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
Ruler.define('bisector', {

    command: 'bp',

    prev: ['Point', 'Point'],
    next: 'Point',

    go: function(p1, p2) {
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };
    }
});