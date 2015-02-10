ModalHeader.prototype = new Tag();

function ModalHeader(){
    var self = this;
    Tag.call(self,'div');
    self.addClass('modal-header');
    self.title = null;
}

ModalHeader.prototype.getTitle = function(){
    var self= this;
    if(self.title == null){
        self.title = new ModalTitle();
    }
    return self.title;
};