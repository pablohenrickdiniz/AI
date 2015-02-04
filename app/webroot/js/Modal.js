function Modal(id,titleText,label){
    var self = this;
    self.id = id;
    self.titleText = titleText;
    self.label = label;
    self.title = null;
    self.modal = null;
    self.dialog = null;
    self.content = null;
    self.header = null;
    self.closeBtn = null;
    self.body = null;
    self.footer = null;
    self.confirmBtn = null;
    self.cancelBtn = null;
}

Modal.prototype.close = function(){
    var self = this;
    $(self.getModal()).modal('hide');
};

Modal.prototype.getConfirm = function(){
    var self = this;
    if(self.confirmBtn == null){
        self.confirmBtn = document.createElement('button');
        $(self.confirmBtn).attr('type','button').html('Confirm').addClass('btn btn-primary');
    }
    return self.confirmBtn;
};

Modal.prototype.getCancel = function(){
    var self = this;
    if(self.cancelBtn == null){
        self.cancelBtn = document.createElement('button');
        $(self.cancelBtn).attr('type','button').html('Cancel').addClass('btn btn-default').attr('data-dismiss','modal');
    }
    return self.cancelBtn;
};

Modal.prototype.getModal = function(){
    var self = this;
    if(self.modal == null){
        self.modal = document.createElement('div');
        $(self.modal).
            addClass('modal').
            prop('id',self.id).
            attr('tabindex',-1).
            attr('role','dialog').
            attr('aria-labelledby',self.label).
            attr('aria-hidden',true);
        $(self.modal).append(self.getDialog());
    }
    return self.modal;
};


Modal.prototype.getBody = function(){
    var self = this;
    if(self.body == null){
        self.body = document.createElement('div');
        $(self.body).addClass('modal-body');
    }
    return self.body;
};

Modal.prototype.getFooter = function(){
    var self = this;
    if(self.footer == null){
        self.footer = document.createElement('div');
        $(self.footer).addClass('modal-footer');
        $(self.footer).append(self.getCancel(),self.getConfirm());
    }
    return self.footer;
};

Modal.prototype.getHeader = function(){
    var self = this;
    if(self.header == null){
        self.header = document.createElement('div');
        $(self.header).addClass('modal-header');
        $(self.header).append(self.getCloseBtn(),self.getTitle());
    }
    return self.header;
};

Modal.prototype.getTitle = function(){
    var self = this;
    if(self.title == null){
        self.title = document.createElement('h4');
        $(self.title).addClass('modal-title').prop('id',self.label).html(self.titleText);
    }
    return self.title;
};

Modal.prototype.getCloseBtn = function(){
    var self = this;
    if(self.closeBtn == null){
        self.closeBtn = document.createElement('button');
        $(self.closeBtn).
            addClass('close').
            attr('data-dismiss','modal').
            attr('arial-label','Close').
            html('<span aria-hidden="true">&times;</span>');
    }
    return self.closeBtn;
};

Modal.prototype.getContent = function(){
    var self = this;
    if(self.content == null){
        self.content = document.createElement('div');
        $(self.content).addClass('modal-content');
        $(self.content).append(self.getHeader(),self.getBody(),self.getFooter());
    }
    return self.content;
};

Modal.prototype.getDialog = function(){
    var self = this;
    if(self.dialog == null){
        self.dialog = document.createElement('div');
        $(self.dialog).addClass('modal-dialog');
        $(self.dialog).append(self.getContent());
    }
    return self.dialog;
};

Modal.prototype.setTitleText = function(title){
    var self = this;
    $(self.getTitle()).html(title);
};