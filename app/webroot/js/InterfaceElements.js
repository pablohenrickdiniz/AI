OpenProjectModal.prototype = new Modal();

function OpenProjectModal(){
    Modal.call(this,'open-project-modal','Abrir Projeto','open-project');
    self.table = null;
    self.openBtn = null;
    self.cancelBtn = null;
}

OpenProjectModal.prototype.getTable = function(){
    var self = this;
    if(self.table == null){
        self.table = document.createElement('table');
        $(self.table).
            prop('id','open-project-select').
            addClass('table table-striped').
            html('<tr><th>Nome do projeto</th><th></th></tr>');
    }
    return self.table;
};

OpenProjectModal.prototype.getOpenBtn = function(){
    var self = this;
    if(self.openBtn == null){
        self.openBtn = document.createElement('button');
        $(self.openBtn).prop('id','open-project-action').attr('type','button').addClass('btn btn-default').attr('data-dismiss','modal').html('Abrir');
    }
    return self.openBtn;
};

OpenProjectModal.prototype.getCancelBtn = function(){
    var self = this;
    if(self.cancelBtn = null){
        self.cancelBtn = document.createElement('button');
        $(self.cancelBtn).prop('id','cancel-open-project').attr('type','button').addClass('btn btn-primary').html('Cancelar');
    }
    return self.cancelBtn;
};