void
function() {

    function format(template, json) {
        /*<debug>*/
        if (typeof template === 'function') { // 函数多行注释处理
            template = String(template).replace(
                /^[^\{]*\{\s*\/\*!?[ \f\t\v]*\n?|[ \f\t\v]*\*\/[;|\s]*\}$/g, // 替换掉函数前后部分
                ''
            );
        }
        /*</debug>*/

        return template.replace(/#\{(.*?)\}/g, function(all, key) {
            return json && (key in json) ? json[key] : "";
        });
    }

    Ruler.librarys = {
        std: format(function() {
            /*!
def point(x, y) {
    return x, y
}
def line(p1, p2) {
    return p1 | p2
}
def circle(center, radius) {
    return center | radius
}
*/
        }),
        common: format(function() {
            /*!
def center(p1, p2) {
    d = p1 ~ p2
    a1 = p1 @ d
    a2 = p2 @ d
    x = a1 & a2
    return (x[0] | x[1]) & (p1 | p2)
}
*/
        })
    };
}();
