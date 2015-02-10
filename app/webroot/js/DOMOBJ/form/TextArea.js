TextArea.prototype = new Tag();

function TextArea(){
    var self = this;
    Tag.call(self,'textarea');
}

TextArea.prototype.rows = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).attr('rows');
    }
    else{
        $(self.getDOM()).attr('rows',arguments[0]);
    }
    return self;
};

TextArea.prototype.cols = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).attr('cols');
    }
    else{
        $(self.getDOM()).attr('cols',arguments[0]);
    }
    return self;
};