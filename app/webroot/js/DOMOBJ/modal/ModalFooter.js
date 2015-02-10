ModalFooter.prototype = new Tag();

function ModalFooter(){
    var self = this;
    Tag.call(self,'div');
    self.addClass('modal-footer');
}