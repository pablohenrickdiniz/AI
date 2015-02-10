Modal.prototype = new Tag();


function Modal(){
    var self = this;
    Tag.call(self,'div');
    self.addClass('modal');
    self.dialog = null;
}

Modal.prototype.getDialog = function(){
    var self = this;
    if(self.dialog == null){
        self.dialog = new ModalDialog();
    }
    return self.dialog;
};

Modal.prototype.add = function(content){
    self.getDialog().getContent().getBody().add(content);
};

Modal.prototype.setTitle = function(title){
    var self = this;
    self.getDialog().getContent().getHeader().getTitle().text(title);
};

Modal.prototype.open = function(){
    var self = this;
    $(self.getDOM()).modal();
};

Modal.prototype.close = function(){
    var self = this;
    $(self.getDOM()).modal('hide');
};

Modal.prototype.getFooter = function(){
    return self.getDialog().getContent().getFooter();
};