function Region(label,x,y,w,h){
    var self = this;
    self.label = label;
    self.x = x;
    self.y = y;
    self.w = w;
    self.ht = h;
}

Region.prototype.object = function(){
    var self = this;
    return {
        label:self.label,
        x:self.x,
        y:self.y,
        width:self.w,
        height:self.h
    };
};