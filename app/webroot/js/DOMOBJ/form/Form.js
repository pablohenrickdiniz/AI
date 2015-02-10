Form.prototype = new Tag();

function Form(){
    var self = this;
    Tag.call(self,'form');
}

Form.prototype.action = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).attr('action');
    }
    else{
        $(self.getDOM()).attr('action',arguments[0]);
    }
    return self;
};