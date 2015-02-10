ModalTitle.prototype = new Tag();

function ModalTitle(){
    var self = this;
    Tag.call(self,'h4');
}


ModalTitle.prototype.text = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).html();
    }
    else{
        $(self.getDOM()).html(arguments[0]);
    }
    return self;
};

