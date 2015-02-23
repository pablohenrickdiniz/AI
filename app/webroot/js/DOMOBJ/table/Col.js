Col.prototype = new Tag();

function Col(type){
    var self = this;
    type = type==undefined?'td':type;
    switch(type){
        case 'header':
            type = 'th';
            break;
        case 'default':
            type = 'td';
    }
    Tag.call(self,type);
    self.type = type;
}

Col.prototype.getType = function(){
    var self = this;
    return self.type;
};

Col.prototype.val = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).html();
    }
    else{
        $(self.getDOM()).html(arguments[0]);
    }
    return self;
};