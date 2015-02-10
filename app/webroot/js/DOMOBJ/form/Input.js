Input.prototype = new Tag();

function Input(type){
    var self = this;
    Tag.call(self,'input');
    $(self.getDOM()).attr('type',type);
}

Input.prototype.type = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).attr('type');
    }
    else{
        $(self.getDOM()).attr('type',arguments[0]);
    }
    return self;
};

Input.prototype.val = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).val();
    }
    else{
        $(self.getDOM()).val(arguments[0]);
    }
    return self;
};

Input.prototype.placeholder = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).attr('placeholder');
    }
    else{
        $(self.getDOM()).attr('placeholder',arguments[0]);
    }
    return self;
};