Option.prototype = new Tag();

function Option(){
    var self = this;
    Tag.call(self,'option');
}

Option.prototype.val = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).val();
    }
    else{
        $(self.getDOM()).val(arguments[0]);
    }
    return self;
};

Option.prototype.text = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).html();
    }
    else{
        $(self.getDOM()).html(arguments[0]);
    }
    return self;
};