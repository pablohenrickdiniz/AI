function Region(label,x,y,w,h){
    var self = this;
    self.label = label;
    self.x = x;
    self.y = y;
    self.w = w;
    self.h = h;
    self.children=  [];
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

Region.prototype.clearChildren = function(){
    var self = this;
    for(var i = 0; i < self.children.length;i++){
        self.children[i].inContact = false;
        if(!self.children[i].inUse){
            self.children[i].checked = false;
        }
    }
};

Region.prototype.updateInUse = function(){
    var self = this;
    for(var i = 0; i < self.children.length;i++){
        self.children[i].inUse = true;
    }
};

Region.prototype.updateSize = function(){
    var self = this;
    var x = null;
    var y = null;
    var w = null;
    var h = null;
    for(var i = 0; i < self.children.length;i++){
        var child = self.children[i];
        if(x == null || x > child.x){
            x = child.x;
        }

        if(y == null || y > child.y){
            y = child.y;
        }

        if(w == null || w < (child.x + child.w)){
            w = child.x + child.w;
        }

        if(h == null || h < (child.y + child.h)){
            h = child.y + child.h;
        }

        self.x =x;
        self.y = y;
        self.w = w;
        self.h = h;
    }
};