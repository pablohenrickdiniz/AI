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



MapModal.prototype = new Modal();

function MapModal(id,title,label){
    var self = this;
    Modal.call(self,id,title,label);
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
    self.form = null;
}

MapModal.prototype.getGroup = function(group){
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


MapModal.prototype.getRow = function(){
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

MapModal.prototype.getBody = function(){
    var self = this;
    if(self.body == null){
        Modal.prototype.getBody.apply(self);
        $(self.body).append(self.getRow());
    }
    return self.body;
};


MapModal.prototype.getOptions = function(){
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

MapModal.prototype.getConfirm = function(){
    var self = this;
    if(self.confirmBtn == null){
        Modal.prototype.getConfirm.apply(self);
        $(self.confirmBtn).click(function () {
            $(self.getForm()).submit();
        });
    }
    return self.confirmBtn;
};

MapModal.prototype.getCancel = function(){
    var self = this;
    if(self.cancelBtn == null){
        Modal.prototype.getCancel.apply(self);
        $(self.cancelBtn).html('Cancelar');
    }
    return self.cancelBtn;
};

MapModal.prototype.getInputName = function(){
    var self = this;
    if(self.inputName == null){
        self.inputName = document.createElement('input');
        $(self.inputName).
            attr('type','text').
            addClass('form-control').
            attr('placeholder','Nome');
    }
    return self.inputName;
};

MapModal.prototype.getDisplayName = function(){
    var self = this;
    if(self.displayName == null){
        self.displayName = document.createElement('input');
        $(self.displayName).
            attr('type','text').
            addClass('form-control').
            attr('placeholder','Nome de apresentação');
    }
    return self.displayName;
};

MapModal.prototype.getWidth = function(){
    var self = this;
    if(self.inputWidth == null){
        self.inputWidth = document.createElement('input');
        $(self.inputWidth).
            attr('type','number').
            attr('placeholder','Largura').
            addClass('form-control').
            attr('min',10).
            attr('max',1000).
            attr('value',10);

    }
    return self.inputWidth;
};

MapModal.prototype.getHeight = function(){
    var self = this;
    if(self.inputHeight == null){
        self.inputHeight = document.createElement('input');
        $(self.inputHeight).
            attr('type','number').
            attr('placeholder','Altura').
            addClass('form-control').
            attr('min',10).
            attr('max',1000).
            attr('value',10);

    }
    return self.inputHeight;
};

MapModal.prototype.getSelectScroll = function(){
    var self = this;
    if(self.selectScroll == null){
        self.selectScroll = document.createElement('select');
        $(self.selectScroll).addClass('form-control');
        self.getOptions().forEach(function(option){
            $(self.selectScroll).append(option);
        });
    }
    return self.selectScroll;
};

MapModal.prototype.getDialog = function(){
    var self = this;
    if(self.dialog == null){
        self.dialog = document.createElement('div');
        $(self.dialog).addClass('modal-dialog');
        $(self.dialog).append(self.getForm());
    }
    return self.dialog;
};

MapModal.prototype.getForm = function(){
    var self = this;
    if(self.form == null){
        self.form = document.createElement('form');
        $(self.form).attr('action','#');
        $(self.form).append(self.getContent());
    }
    return self.form;
};




NewMapModal.prototype = new MapModal();

function NewMapModal(){
    var self = this;
    MapModal.call(self,'create-map-modal','Novo Mapa','new-map');
}


NewMapModal.prototype.getConfirm = function(){
    var self = this;
    if(self.confirmBtn == null){
        MapModal.prototype.getConfirm.apply(self);
        $(self.confirmBtn).prop('id','map-create-action').html('Criar');
    }
    return self.confirmBtn;
};

NewMapModal.prototype.getInputName = function(){
    var self = this;
    if(self.inputName == null){
        MapModal.prototype.getInputName.apply(self);
        $(self.inputName).prop('id','map-name-create').attr('name','map-name-create');
    }
    return self.inputName;
};

NewMapModal.prototype.getDisplayName = function(){
    var self = this;
    if(self.displayName == null){
        MapModal.prototype.getDisplayName.apply(self);
        $(self.displayName).prop('id','map-display-create').attr('name','map-display-create');
    }
    return self.displayName;
};

NewMapModal.prototype.getWidth = function(){
    var self = this;
    if(self.inputWidth == null){
        MapModal.prototype.getWidth.apply(self);
        $(self.inputWidth).prop('id','map-width-create').attr('name','map-width-create');
    }
    return self.inputWidth;
};

NewMapModal.prototype.getHeight = function(){
    var self = this;
    if(self.inputHeight == null){
        MapModal.prototype.getHeight.apply(self);
        $(self.inputHeight).prop('id','map-height-create').attr('name','map-height-create');
    }
    return self.inputHeight;
};

NewMapModal.prototype.getSelectScroll = function(){
    var self = this;
    if(self.selectScroll == null){
        MapModal.prototype.getSelectScroll.apply(self);
        $(self.selectScroll).prop('id','map-scroll-create').attr('name','map-scroll-create');
    }
    return self.selectScroll;
};


NewMapModal.prototype.getForm = function(){
    var self = this;
    if(self.form == null){
        MapModal.prototype.getForm.apply(self);
        $(self.form).prop('id','map-create-form').attr('name','map-create-form');
    }
    return self.form;
};


UpdateMapModal.prototype= new MapModal();

function UpdateMapModal(){
    var self = this;
    MapModal.call(self,'map-update-modal','Alterar Mapa','update-map');
}

UpdateMapModal.prototype.getConfirm = function(){
    var self = this;
    if(self.confirmBtn == null){
        MapModal.prototype.getConfirm.apply(self);
        $(self.confirmBtn).prop('id','map-update-action').html('Atualizar');
    }
    return self.confirmBtn;
};

UpdateMapModal.prototype.getInputName = function(){
    var self = this;
    if(self.inputName == null){
        MapModal.prototype.getInputName.apply(self);
        $(self.inputName).prop('id','map-name-update').attr('name','map-name-update');
    }
    return self.inputName;
};

UpdateMapModal.prototype.getDisplayName = function(){
    var self = this;
    if(self.displayName == null){
        MapModal.prototype.getDisplayName.apply(self);
        $(self.displayName).prop('id','map-display-update').attr('name','map-display-update');
    }
    return self.displayName;
};

UpdateMapModal.prototype.getWidth = function(){
    var self = this;
    if(self.inputWidth == null){
        MapModal.prototype.getWidth.apply(self);
        $(self.inputWidth).prop('id','map-width-update').attr('name','map-width-update');
    }
    return self.inputWidth;
};

UpdateMapModal.prototype.getHeight = function(){
    var self = this;
    if(self.inputHeight == null){
        MapModal.prototype.getHeight.apply(self);
        $(self.inputHeight).prop('id','map-height-update').attr('name','map-height-update');
    }
    return self.inputHeight;
};

UpdateMapModal.prototype.getSelectScroll = function(){
    var self = this;
    if(self.selectScroll == null){
        MapModal.prototype.getSelectScroll.apply(self);
        $(self.selectScroll).prop('id','map-scroll-update').attr('name','map-scroll-update');
    }
    return self.selectScroll;
};


UpdateMapModal.prototype.getForm = function(){
    var self = this;
    if(self.form == null){
        MapModal.prototype.getForm.apply(self);
        $(self.form).prop('id','map-update-form').attr('name','map-update-form');
    }
    return self.form;
};
