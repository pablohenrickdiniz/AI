function createCircle(x,y,r){
    var circleSd = new b2CircleDef();
    circleSd.density = 100.0;
    circleSd.radius = r;
    circleSd.restitution = 0.8;
    circleSd.friction = 0.8;
    var circleBd = new b2BodyDef();
    circleBd.AddShape(circleSd);
    circleBd.position.Set(x,y);
    return circleBd;
}

function Ball(radius,x,y){
    radius = radius==undefined?10:radius;
    x = x == undefined?0:x;
    y = y == undefined?0:y;

    var self = this;
    self.shape = new b2CircleDef();
    self.shape.density = 100.0;
    self.shape.radius = radius;
    self.shape.restitution = 0.8;
    self.shape.friction = 0.8;
    self.body = new b2BodyDef();
    self.body.AddShape(self.shape);
    self.body.position.Set(x,y);
    self.body.fillStyle = 'blue';
    self.body.strokeStyle = 'green';
    self.body.lineWidth = 1;
}

Ball.prototype.getBody = function(){
    return this.body;
};


function createSquare(x,y,w,h){
    var squareSd = new b2BoxDef();
    squareSd.density = 0.0;
    squareSd.restitution = 0.2;
    squareSd.friction = 0.6;
    squareSd.extents.Set(w/2,h/2);

    var bodyDef = new b2BodyDef();
    bodyDef.AddShape(squareSd);
    bodyDef.position.Set(x,y);
    return bodyDef;
}


function createGear(sides,radius){
    var bodyDef = new b2BodyDef();

    bodyDef.position.Set(200,200);

    for(var i = 0; i < 3;i++){
        var circleSd = new b2CircleDef();
        circleSd.density = 100.0;
        circleSd.radius = radius;
        circleSd.restitution = 0.8;
        circleSd.friction = 0.8;
        circleSd.localPosition.Set(i*20,i*20);
        bodyDef.AddShape(circleSd);
    }
    return bodyDef;
}
