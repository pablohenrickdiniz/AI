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

Math.vmv = function (x, y) { //element-wise subtraction
    return x.map(function (xElem, i) {
        return xElem - y[i];
    });
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