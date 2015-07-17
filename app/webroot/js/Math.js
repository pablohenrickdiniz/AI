Math.dot = function(x,y){
    return Object.keys(x).reduce(function (p, c) {
        return p + x[c] * y[c];
    }, 0);
};

Math.vxv = function(x,y){
    var vec = {};
    Object.keys(x).forEach(function (index) {
        vec[index] = x[index]*y[index];
    });
    return vec;
};

Math.vdv = function(x,y){
    var vec = {};
    Object.keys(x).forEach(function (index) {
        vec[index] = x[index]/y[index];
    });
    return vec;
};

Math.vpv = function(x, y){
    var vec = {};
    Object.keys(x).forEach(function (index) {
        vec[index] = x[index]+y[index];
    });
    return vec;
};

Math.vmv = function(x, y){
    var vec = {};
    Object.keys(x).forEach(function (index) {
        vec[index] = x[index]-y[index];
    });
    return vec;
};

Math.sxv = function(c,x){
    var vec = {};
    Object.keys(x).forEach(function (index) {
        vec[index] = x[index]*c;
    });
    return vec;
};

Math.mxv = function(m,x){
    return m.map(function (mElem) {
        return Math.dot(mElem, x);
    });
};

Math.cross2 = function(x,y) {
    return x.x * y.y - x.y * y.x;
};

Math.norm = function(x){
    return Math.sqrt(Math.dot(x, x));
};

Math.normalize = function(x){
    return Math.sxv(1 / Math.norm(x), x);
};

Math.med = function(va, vb){
    var vec = {};
    Object.keys(va).forEach(function(index){
        vec[index] = (va[index]+vb[index])/2;
    });
    return vec;
};

Math.rotate = function(va, theta, center){
    var rad = Math.degreeToRadians(theta);
    center = center == undefined ? {x:0,y:0} : center;
    var radc = Math.cos(rad);
    var rads = Math.sin(rad);
    var suba = va.x - center.x;
    var subb = va.y - center.y;
    return [(suba * radc - subb * rads) + center.x, (subb * radc + suba * rads) + center.y];
};

Math.degreeToRadians = function(theta){
    return theta * (Math.PI / 180);
};

Math.degreeFromVec = function(va, vb){
    return Math.radiansToDegree(Math.radiansFromVec(va, vb));
};

Math.radiansFromVec = function(va, vb){
    var pe = Math.dot(va, vb);
    var na = Math.norm(va);
    var nb = Math.norm(vb);
    return Math.acos(pe / (na * nb));
};

Math.radiansToDegree = function(theta){
    return theta * (180 / Math.PI);
};

Math.distance = function(va,vb){
    return Math.sqrt(Object.keys(va).reduce(function(p,c){
        return p + Math.pow(va[c] - vb[c],2);
    },0));
};