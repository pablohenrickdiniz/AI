OpenProjectModal.prototype = new Modal();

function OpenProjectModal(){
    var self = this;
    Modal.call(self,'open-project-modal','Abrir Projeto','open-project');
    self.table = null;
    self.createBtn = null;
    self.cancelBtn = null;
    self.projects = [];
    self.projectManager = null;
}

OpenProjectModal.prototype.show = function(){
    var self = this;
    $(self.getModal()).modal();
};


OpenProjectModal.prototype.setProjectManager = function(projectManager){
    this.projectManager = projectManager;
};

OpenProjectModal.prototype.getBody = function(){
    var self = this;
    if(self.body == null){
        Modal.prototype.getBody.apply(self);
        $(self.body).append(self.getTable());
    }

    return self.body;
};

OpenProjectModal.prototype.clear = function(){
    var self = this;
    self.projects.forEach(function(project){
        $(project).remove();
    });
    self.projects = [];
};

OpenProjectModal.prototype.addProject = function(id,name){
    var self = this;
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    var td2 = document.createElement('td');
    var radio = document.createElement('input');
    $(radio).attr('type', 'radio').attr('name', 'project').val(id);
    $(td2).append(radio);
    $(td).html(name);
    $(tr).append(td, td2).attr('class', 'project-list-item');
    $(self.getTable()).append(tr);
    self.projects.push(tr);
};

OpenProjectModal.prototype.getCheckedProjectId = function(){
    var self = this;
    for(var i = 0; i < self.projects.length;i++){
        var radio = $(self.projects[i]).find('input[type=radio]');
        if($(radio).is(':checked')){
            return $(radio).val();
        }
    }
    return null;
};


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

OpenProjectModal.prototype.getConfirm = function(){
    var self = this;
    if(self.confirmBtn == null){
        Modal.prototype.getConfirm.apply(self);
        $(self.confirmBtn).prop('id','open-project-action').html('Abrir');
        $(self.confirmBtn).click(function () {
            var id = self.getCheckedProjectId();
            self.projectManager.project_id = id;
            self.projectManager.reload(function(){
                self.close();
            });
        });
    }
    return self.confirmBtn;
};

OpenProjectModal.prototype.getCancel= function(){
    var self = this;
    if(self.cancelBtn == null){
        Modal.prototype.getCancel.apply(self);
        $(self.cancelBtn).prop('id','cancel-open-project').html('Cancelar');
        $(self.cancelBtn).click(function () {
            $(self.getModal()).modal('hide');
        });
    }
    return self.cancelBtn;
};



NewProjectModal.prototype = new Modal();


function NewProjectModal(){
    var self = this;
    Modal.call(self,'new-project-modal','Novo Projeto','new-project');
    self.inputName = null;
    self.alertWarning = null;
    self.groups = [];
    self.rows = [];
}

NewProjectModal.prototype.getGroup = function(index){
    var self = this;
    if(self.groups[index] == undefined){
        self.groups[index] = document.createElement('div');
        $(self.groups[index]).addClass('col-md-12 form-group');
    }
    return self.groups[index];
};

NewProjectModal.prototype.getRow = function(index){
    var self = this;
    if(self.rows[index] == undefined){
        self.rows[index] = document.createElement('div');
        $(self.rows[index]).addClass('row');
    }
    return self.rows[index];
};

NewProjectModal.prototype.getConfirm = function(){
    var self = this;
    if(self.confirmBtn == null){
        Modal.prototype.getConfirm.apply(self);
        $(self.confirmBtn).prop('id','create-new-project').attr('type' ,'button').addClass('btn btn-primary').html('Criar');
    }
    return self.confirmBtn;
};

NewProjectModal.prototype.getCancel = function(){
    var self = this;
    if(self.cancelBtn == null){
        Modal.prototype.getCancel.apply(self);
        $(self.cancelBtn).html('Cancelar');
    }
    return self.cancelBtn;
};

NewProjectModal.prototype.getAlertWarning = function(){
    var self = this;
    if(self.alertWarning == null){
        self.alertWarning = document.createElement('div');
        $(self.alertWarning).addClass('col-md-12 form-group alert alert-warning').prop('id','alert-project-exists').hide();
    }
    return self.alertWarning;
};

NewProjectModal.prototype.getBody = function(){
    var self = this;
    if(self.body == null){
        Modal.prototype.getBody.apply(self);
        var row    = self.getRow(0);
        var groupA = self.getGroup(0);
        var groupB = self.getGroup(1);
        $(groupA).append(self.getNameInput());
        $(groupB).append(self.getAlertWarning());
        $(row).append(groupA,groupB);
        $(self.body).append(row);
    }
    return self.body;
};

NewProjectModal.prototype.getNameInput = function(){
    var self = this;
    if(self.inputName == null){
        self.inputName = document.createElement('input');
        $(self.inputName).
            prop('id','new-project-name').
            attr('type','text').
            addClass('form-control').
            attr('placeholder','Nome do Projeto');
    }
    return self.inputName;
};

NewMapModal.prototype = new Modal();

function NewMapModal(){
    var self = this;
    Modal.call(self,'create-map-modal','Novo Mapa','new-map');
    self.inputName = null;
    self.displayName = null;
    self.inputWidth = null;
    self.inputHeight = null;
    self.selectScroll = null;
    self.row = null;
    self.groupA = null;
    self.groupB = null;
    self.groupC = null;
    self.groupD = null;
    self.groupE = null;
    self.col6 = ['A','B','C','D'];
    self.col12 = ['E'];
    self.options = null;
    self.optionsLabels = ['Sem Loop','Loop Vertical','Loop Horizontal','Loop Vertical e Horizontal'];
    self.getElements = ['getInputName','getDisplayName','getWidth','getHeight','getSelectScroll'];
    self.alertWarning = null;
    self.alertSuccess = null;
    self.alertDanger = null;
}

NewMapModal.prototype.getGroup = function(group){
    var self = this;
    var alias = 'group'+group;
    if(self[alias] == undefined){
        var index = self.col6.indexOf(group);
        if(index != -1){
            self[alias] = document.createElement('div');
            $(self[alias]).addClass('col-md-6 form-group');
            console.log(index);
            $(self[alias]).append(self[self.getElements[index]]());
        }
        else{
            self[alias] = document.createElement('div');
            $(self[alias]).addClass('col-md-12 form-group');
            $(self[alias]).append(self[self.getElements[4]]());
        }
    }
    return self[alias];
};


Modal.prototype.getRow = function(){
    var self = this;
    if(self.row == null){
        self.row = document.createElement('div');
        $(self.row).addClass('row');
        $(self.row).append(
            self.getGroup('A'),
            self.getGroup('B'),
            self.getGroup('C'),
            self.getGroup('D'),
            self.getGroup('E')
        );
    }
    return self.row;
};

NewMapModal.prototype.getBody = function(){
    var self = this;
    if(self.body == null){
        Modal.prototype.getBody.apply(self);
        $(self.body).append(self.getRow());
    }
    return self.body;
};


NewMapModal.prototype.getOptions = function(){
    var self = this;
    if(self.options == null){
        self.options = [];
        for(var i = 0; i < self.optionsLabels.length;i++){
            self.options[i] = document.createElement('option');
            $(self.options[i]).val(i).html(self.optionsLabels[i]);
        }
    }
    return self.options;
};

NewMapModal.prototype.getConfirm = function(){
    var self = this;
    if(self.confirmBtn == null){
        Modal.prototype.getConfirm.apply(self);
        $(self.confirmBtn).prop('id','map-create-action').html('Criar');
    }
    return self.confirmBtn;
};

NewMapModal.prototype.getCancel = function(){
    var self = this;
    if(self.cancelBtn == null){
        Modal.prototype.getCancel.apply(self);
        $(self.cancelBtn).prop('id','cancel-new-map').html('Cancelar');
    }
    return self.cancelBtn;
};

NewMapModal.prototype.getInputName = function(){
    var self = this;
    if(self.inputName == null){
        self.inputName = document.createElement('input');
        $(self.inputName).
            attr('type','text').
            prop('id','map-name-create').
            attr('name','map-name-create').
            addClass('form-control').
            attr('placeholder','Nome');
    }
    return self.inputName;
};

NewMapModal.prototype.getDisplayName = function(){
    var self = this;
    if(self.displayName == null){
        self.displayName = document.createElement('input');
        $(self.displayName).
            attr('type','text').
            prop('id','map-display-create').
            attr('name','map-display-create').
            addClass('form-control').
            attr('placeholder','Nome de apresentação');
    }
    return self.displayName;
};

NewMapModal.prototype.getWidth = function(){
    var self = this;
    if(self.inputWidth == null){
        self.inputWidth = document.createElement('input');
        $(self.inputWidth).
            attr('type','number').
            prop('id','map-width-create').
            attr('placeholder','Largura').
            attr('name','map-width-create').
            addClass('form-control').
            attr('min',10).
            attr('max',1000).
            attr('value',10);

    }
    return self.inputWidth;
};

NewMapModal.prototype.getHeight = function(){
    var self = this;
    if(self.inputHeight == null){
        self.inputHeight = document.createElement('input');
        $(self.inputHeight).
            attr('type','number').
            prop('id','map-height-create').
            attr('placeholder','Altura').
            attr('name','map-height-create').
            addClass('form-control').
            attr('min',10).
            attr('max',1000).
            attr('value',10);

    }
    return self.inputHeight;
};

NewMapModal.prototype.getSelectScroll = function(){
    var self = this;
    if(self.selectScroll == null){
        self.selectScroll = document.createElement('select');
        $(self.selectScroll).prop('id','map-scroll-create').addClass('form-control').attr('name','map-scroll-create');
        self.getOptions().forEach(function(option){
            $(self.selectScroll).append(option);
        });
    }
    return self.selectScroll;
};
