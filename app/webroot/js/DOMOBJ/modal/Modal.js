Modal.prototype = new Tag();


function Modal(){
    var self = this;
    Tag.call(self,'div');
    self.addClass('modal');
    self.dialog = null;
    self.add(self.getDialog());
    self.getDialog().getContent().getHeader().getClose().click(function(){
        self.close();
    });
    self.closeActions = [];
}

Modal.prototype.getDialog = function(){
    var self = this;
    if(self.dialog == null){
        self.dialog = new ModalDialog();
    }
    return self.dialog;
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
    for(var i = 0; i < self.closeActions.length;i++){
        self.closeActions[i]();
    }
};

Modal.prototype.onclose = function(func){
    if(typeof func == 'function'){
        var self = this;
        self.closeActions.push(func);
    }
};

Modal.prototype.getFooter = function(){
    var self = this;
    return self.getDialog().getContent().getFooter();
};

Modal.prototype.getBody = function(){
    var self = this;
    return self.getDialog().getContent().getBody();
};