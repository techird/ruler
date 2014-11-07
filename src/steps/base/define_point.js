/**
 * @fileOverview
 *
 * 点定义
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.define('define_point', {

    prev: [TYPE_NUMBER, TYPE_NUMBER],
    next: TYPE_POINT,
    
    go: function(x, y) {
        return new Point(x, y);
    }
});