/* The Ruler Class */
function Ruler(canvas) {
    this.steps = [];
    this.canvas = canvas || null;
}


/* 判断为零（精度问题，浮点数不能直接和零对比） */
function isZero(number) {
    return !isNaN(number) && Math.abs(number) < 1e-6;
}
Ruler.isZero = isZero;


/* 对象 extend */
function extend(source) {
    var extensions = [].slice.call(arguments, 1);

    source = source || {};

    extensions.forEach(function(extension) {
        if (!extension) return;
        for (var p in extension) {
            if (extension.hasOwnProperty(p)) source[p] = extension[p];
        }
    });
    return source;
}
Ruler.extend = extend;
