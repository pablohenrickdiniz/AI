Row.prototype = new Tag();

function Row(){
    var self = this;
    Tag.call(self,'tr');
    self.cols = [];
}

Row.prototype.add = function(col){
    var self = this;
    if(col instanceof Col){
        if(self.cols.indexOf(col) == -1){
            self.cols.push(col);
            $(self.getDOM()).append(col.getDOM())
        }
    }
    return self;
};

Row.prototype.remove = function(){
    var self = this;
    if(arguments.length == 0){
        $(self.getDOM()).remove();
    }
    else if(arguments[0] instanceof Col){
        var col = arguments[0];
        var index = self.cols.indexOf(col);
        if(index != -1){
            $(self.cols[index]).remove();
            self.cols.splice(index,1);
        }
    }
    return self;
};