/**
 * @fileOverview
 *
 * Ruler.js 文件引入
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

(function() {
    'use strict';

    var base = 'src/';
    var paths = [
        'ruler.js',

        'point.js',
        'line.js',
        'circle.js',
        'matrix.js',

        'steps/base/define_point.js',
        'steps/base/define_line.js',
        'steps/base/define_circle.js',
        'steps/base/define_distance.js',
        'steps/base/intersect_circle_circle.js',
        'steps/base/intersect_line_circle.js',
        'steps/base/intersect_line_line.js',
        'steps/base/point_select.js',

        'steps/extend/bisector.js',
        'steps/extend/perpendicular_bisector.js',
        'steps/extend/perpendicular_line.js',

        'render.js',
        'formula.js'
    ];

    /* global module:true */
    if (typeof(module) == 'object' && module.exports) {
        module.exports = paths;
    } else if (document) {
        while (paths.length) {
            document.write('<script type="text/javascript" src="' + base + paths.shift() + '"></script>');
        }
    }
})();