ModalHeader.prototype = new Tag();

function ModalHeader(){
    var self = this;
    Tag.call(self,'div');
    self.addClass('modal-header');
    self.title = null;
    self.close = null;
    self.add(self.getClose());
    self.add(self.getTitle());
}

ModalHeader.prototype.getTitle = function(){
    var self= this;
    if(self.title == null){
        self.title = new ModalTitle();
    }
    return self.title;
};

ModalHeader.prototype.getClose = function(){
    var self = this;
    if(self.close == null){
        self.close = new Button();
        self.close.
            setAttribute('type','button').
            addClass('close').
            setAttribute('aria-label','close').
            add('<span aria-hiden="true">&times;</span>');
    }
    return self.close;
};
