/**
 * @fileOverview
 *
 * 碰撞检测
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

Ruler.prototype.hots = function(x, y) {
    var hots = [];

    var steps = this.getAvailableSteps();

    var step, result;
    while (step = steps.pop()) {
        result = step.result();
        if (typeof(result.hot) == 'function' && result.hot(x, y)) {
            hots.push({
                result: result,
                step: step
            });
        }
    }

    this.hotSteps = hots.slice();

    return hots;
};

Ruler.prototype.hot = function(x, y) {
    var hots = this.hots(x, y);

    hots.sort(function(a, b) {
        return b.result.hotPriority - a.result.hotPriority;
    });

    if (hots.length) {
        return this.hotStep = hots.pop().step;
    } else {
        return this.hotStep = null;
    }
};
