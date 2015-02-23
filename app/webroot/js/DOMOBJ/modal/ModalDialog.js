ModalDialog.prototype = new Tag();

function ModalDialog(){
    var self = this;
    Tag.call(self,'div');
    self.addClass('modal-dialog');
    self.content = null;
    self.add(self.getContent());
}

ModalDialog.prototype.getContent = function(){
    var self = this;
    if(self.content == null){
        self.content = new ModalContent();
    }
    return self.content;
};
