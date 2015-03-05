function Rect(x,y,w,h){
    var self = this;
    self.x = x;
    self.y = y;
    self.w = w;
    self.h = h;
    self.checked = false;
}

Rect.prototype.colide = function(rect){
    var self = this;
    var xa = rect.x;
    var ya = rect.y;
    var wa = rect.w;
    var ha = rect.h;
    var xb = self.x;
    var yb = self.y;
    var wb = self.w;
    var hb = self.h;

    return !(xa > xb+wb || xb > xa+wa || ya > yb+hb || yb > ya+ha);
};