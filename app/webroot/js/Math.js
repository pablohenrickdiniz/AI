Math.dot = function dot(va,vb) { //dot product
    var sum = 0;
    va = _.cloneDeep(va);
    for(var index in va){
        sum += va[index]*vb[index];
    }
    return sum;
};

Math.norm = function (x) { //2-norm of a vector
    return Math.sqrt(Math.dot(x, x));
};

Math.vpv = function () { //element-wise addition
    if(arguments.length >= 2){
        var vec = _.cloneDeep(arguments[0]);
        var size = arguments.length;
        for(var index in vec){
            for(var j = 1; j < size;j++){
                vec[index] += arguments[j][index];
            }
        }

        return vec;
    }

    return null;
};

Math.vmv = function () { //element-wise subtraction
    if(arguments.length >= 2){
        var vec = _.cloneDeep(arguments[0]);
        var size = arguments.length;
        for(var index in vec){
            for(var j = 1; j < size;j++){
                vec[index] += arguments[j][index];
            }
        }

        return vec;
    }

    return null;
};

Math.med = function () {
    var vec = Math.vpv.apply(this,arguments);
    for(var index in vec){
        vec[index] = vec[index]/arguments.length;
    }
    return vec;
};

Math.radiansToDegree = function (radians) {
    return radians * (180 / Math.PI);
};

Math.degreeToRadians = function (degree) {
    return degree / (180 / Math.PI);
};


Math.getDegreeFromVec = function (a, b) {
    return Math.radiansToDegree(Math.acos(Math.dot(a, b) / (Math.norm(a) * Math.norm(b))));
};


Math.rotate = function (v, theta, c) {
    var rad = Math.degreeToRadians(theta);
    c = c == undefined ? {x:0,y:0} : c;
    var radc = Math.cos(rad);
    var rads = Math.sin(rad);
    var suba = v.x - c.x;
    var subb = v.y - c.y;
    return {x:(suba * radc - subb * rads) + c.x,y: (subb * radc + suba * rads) + c.y};
};


Math.getClockDegree = function (origin, p) {
    var va = {x:0, y:-1};
    var vb = [p.x - origin.x, p.y - origin.y];
    var degree = Math.getDegreeFromVec(va, vb);
    return vb.x < 0 ? 360 - degree : degree;
};

Math.min = function(){
    if(arguments.length > 0 ){
        var min = _.cloneDeep(arguments[0]);
        var size = arguments.length;
        for(var j = 1; j < size;j++){
            for(var index in arguments[j]){
                if(min[index] > arguments[j][index]){
                    min[index] = arguments[j][index];
                }
            }
        }
        return min;
    }
    return null;
};

Math.distance = function (pa, pb) {
    return Math.sqrt(Math.pow(pa.x - pb.x, 2) + Math.pow(pa.y - pb.y, 2));
};

