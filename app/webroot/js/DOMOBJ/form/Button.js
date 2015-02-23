Button.prototype = new Tag();

function Button(){
    var self = this;
    Tag.call(self,'button');
    $(self.getDOM()).attr('type','button');
}

Button.prototype.val = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).html();
    }
    else{
        $(self.getDOM()).append(arguments[0]);
    }
    return self;
};