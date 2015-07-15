Math.dot = function dot(x, y) { //dot product
    return x.reduce(function (p, c, i) {
        return p + x[i] * y[i];
    }, 0);
};

Math.norm = function (x) { //2-norm of a vector
    return Math.sqrt(Math.dot(x, x));
};

Math.vpv = function () { //element-wise addition
    var vec = {x:0,y:0};
    for(var i = 0; i < arguments.length;i++){
        vec.x+= arguments[i].x;
        vec.y+= arguments[i].y;
    }
    return vec;
};

Math.vmv = function () { //element-wise subtraction
    var vec = arguments[0];
    for(var i = 1; i < arguments.length;i++){
        vec.x-= arguments[i].x;
        vec.y-= arguments[i].y;
    }
    return vec;
};

Math.med = function () {
    var vec = Math.vpv.apply(this,arguments);
    vec.x = vec.x/arguments.length;
    vec.y = vec.y/arguments.length;
    return vec;
};

Math.parse_degree = function (radians) {
    return radians * (180 / Math.PI);
};

Math.parse_radians = function (degree) {
    return degree / (180 / Math.PI);
};


Math.get_degree = function (a, b) {
    return Math.parse_degree(Math.acos(Math.dot(a, b) / (Math.norm(a) * Math.norm(b))));
};


Math.get_clock_degree = function (origin, p) {
    var va = [0, -1];
    var vb = [p[0] - origin[0], p[1] - origin[1]];
    var degree = Math.get_degree(va, vb);
    return vb[0] < 0 ? 360 - degree : degree;
};

Math.min = function(){
    var min = {x:null,y:null};
    for(var i = 0; i < arguments.length;i++){
        var p = arguments[i];
        if(min.x == null || min.x > p.x){
            min.x = p.x;
        }
        if(min.y == null || min.y < p.y){
            min.y = p.y;
        }
    }
    return min;
};

Math.distance = function (pa, pb) {
    return Math.sqrt(Math.pow(pa.x - pb.x, 2) + Math.pow(pa.y - pb.y, 2));
};

Math.circleIntersectRect = function(circle,rect){
    var x0 = rect.x;
    var y0 = rect.y;
    var x1 = rect.x+rect.width;
    var y1 = rect.y+rect.height;
    return (circle.x >= x0 && circle.x <= x1 && circle.y >= y0  && circle.y <= y1);
};

Math.rectIntersectRect = function(rectA,rectB){
    var x0a = rectA.x;
    var y0a = rectA.y;
    var x1a = rectA.x+rectA.width;
    var y1a = rectA.y+rectA.height;
    var x0b = rectB.x;
    var y0b = rectB.y;
    var x1b = rectB.x+rectB.width;
    var y1b = rectB.y+rectB.height;
    return !(x0a > x1b || x1a < x0b || y0a > y1b || y1a < y0b);
};