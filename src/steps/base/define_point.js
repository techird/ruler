/**
 * @fileOverview
 *
 * 点定义
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('define_point', {

    command: 'pd',

    prev: ['Number', 'Number'],
    next: 'Point',
    
    go: function(x, y) {
        return {
            x: x,
            y: y
        };
    }
});