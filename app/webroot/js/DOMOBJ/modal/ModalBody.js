ModalBody.prototype = new Tag();

function ModalBody(){
    var self = this;
    Tag.call(self,'div');
    self.addClass('modal-body');
}