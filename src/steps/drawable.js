/**
 * @fileOverview
 *
 * 表示可以绘制的物件
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

function Drawable() {
    this.state = Drawable.STATE_NORMAL;
}

Drawable.prototype.draw = function(canvasContext2D) {
    /*<debug>*/
    throw new Error('Not implement: draw()');
    /*</debug>*/
};

Drawable.prototype.hot = function(x, y) { return false; };

Drawable.STATE_NORMAL = 0;
Drawable.STATE_HOVER = 1;
Drawable.STATE_NEXT_HOVER = 2;
Drawable.STATE_DECENSTOR_HOVER = 3;