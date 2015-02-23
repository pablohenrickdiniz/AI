function ProjectWindow() {}
function MapWindow(){}
function FolderWindow(){}
FolderWindow.id = Global.project.id;
FolderWindow.type = 'project';
ProjectWindow.loading = false;
MapWindow.loading =false;
MapWindow.clipboard = {
    type:'copy',
    value:null
};


MapWindow.copy = function(){
    var self = this;
    self.clipboard.value = FolderWindow.id;
    self.clipboard.type = 'copy';
};

MapWindow.cut = function(){
    var self = this;
    self.clipboard.value = FolderWindow.id;
    self.clipboard.type = 'cut';
};

MapWindow.paste = function(){
    var self = this;
    if(!self.loading){
        self.loading = true;
        var data = {
            'data[id]':self.clipboard.value,
            'data[type]':self.clipboard.type
        };
        var type = FolderWindow.type;
        if(type == 'project'){
            data['data[project_id]'] = FolderWindow.id;
        }
        else{
            data['data[parent_id]'] = FolderWindow.id;
        }

        $.ajax({
            url:Global.map.paste,
            type:'post',
            data:data,
            dataType:'json',
            success:function(data){
                if(data.success){
                    var parent = FolderWindow.id;
                    var tree = $('#tree').dynatree('getTree');
                    var node = tree.getNodeByKey(parent);
                    if(node != null){
                        if(MapWindow.clipboard.type == 'cut'){
                            var old = tree.getNodeByKey(data.node.key);
                            if(old != null){
                                old.remove();
                            }
                        }
                        var child = data.node;
                        node.addChild(child);
                    }
                }
            },
            complete:function(){
                self.loading = false;
            }
        });
    }
};

MapWindow.edit = {
    loading:false,
    modal:null,
    inputName:null,
    inputDisplay:null,
    inputWidth:null,
    inputHeight:null,
    selectScroll:null,
    send:function(){
        var self = this;
        if(!self.loading){
            self.loading = true;
            $.ajax({
                url: Global.map.edit,
                type: 'post',
                data: {
                    'data[Map][id]': FolderWindow.id,
                    'data[Map][name]': self.getInputName().val(),
                    'data[Map][display]': self.getInputDisplay().val(),
                    'data[Map][width]': self.getInputWidth().val(),
                    'data[Map][height]':self.getInputHeight().val(),
                    'data[Map][scroll]': self.getSelectScroll().val()
                },
                dataType:'json',
                success: function (data) {
                    if (data.success) {
                        self.getModal().close();
                        self.getWarning().hide();
                        var tree = $('#tree').dynatree('getTree');
                        var node = tree.getNodeByKey(FolderWindow.id);
                        if (node != null) {
                            node.data.title = data.map.name;
                            node.render();
                        }
                    }
                    else {
                        var errors = data.errors;
                        var message = '';
                        for(var index in errors){
                            message += '* '+errors[index]+'<br>';
                        }
                        self.getWarning().setMessage(message);
                        self.getWarning().show();
                    }
                },
                complete: function () {
                    self.loading = false;
                }
            });
        }
    },
    load:function(callback){
        var self = this;
        if(!self.loading){
            self.loading = true;
            $.ajax({
                url:Global.map.load,
                type:'post',
                dataType:'json',
                data:{
                    'data[id]':FolderWindow.id
                },
                success:function(data){
                    if(data.success){
                        var map = data.map;
                        self.getInputName().val(map.name);
                        self.getInputDisplay().val(map.display);
                        self.getInputWidth().val(map.width);
                        self.getInputHeight().val(map.height);
                        self.getSelectScroll().val(map.scroll);
                        if(typeof callback == 'function'){
                            callback.apply(self);
                        }
                    }
                },
                error:function(){

                },
                complete:function(){
                    self.loading = false;
                }
            });
        }
    },
    getCancel:function(){
        var self = this;
        if(self.cancel == null){
            self.cancel = new Button();
            self.cancel.
                addClass('btn btn-default').
                val('Cancelar').
                click(function(){
                    self.getModal().close();
                });
        }
        return self.cancel;
    },
    getConfirm:function(){
        var self = this;
        if(self.confirm == null){
            self.confirm = new Button();
            self.confirm.
                addClass('btn btn-success').
                val('Atualizar Mapa').
                click(function(){
                    self.send();
                });
        }
        return self.confirm;
    },
    getInputName:function(){
        var self = this;
        if(self.inputName == null){
            self.inputName = new Input('text');
            self.inputName.placeholder('Nome').
                addClass('form-control').
                setAttribute('required',true);
        }
        return self.inputName;
    },
    getInputDisplay:function(){
        var self = this;
        if(self.inputDisplay == null){
            self.inputDisplay = new Input('text');
            self.inputDisplay.
                placeholder('Nome de apresentação').
                addClass('form-control').
                setAttribute('required',true);
        }
        return self.inputDisplay;
    },
    getInputWidth:function(){
        var self = this;
        if(self.inputWidth == null){
            self.inputWidth = new Input('number');
            self.inputWidth.
                placeholder('Largura').
                addClass('form-control').
                css('min',10).
                css('max',1000).
                setAttribute('required',true);
        }
        return self.inputWidth;
    },
    getInputHeight:function(){
        var self = this;
        if(self.inputHeight == null){
            self.inputHeight = new Input('number');
            self.inputHeight.
                placeholder('Altura').
                addClass('form-control').
                css('min',10).
                css('max',1000).
                setAttribute('required',true);
        }
        return self.inputHeight;
    },
    getSelectScroll:function(){
        var self = this;
        if(self.scroll ==null){
            self.scroll = new Select();
            self.scroll.setOptions({
                0:'Nenhum',
                1:'Loop Vertical',
                2:'Loop Horizontal',
                3:'Loop Vertical e Horizontal'
            }).addClass('form-control');
        }
        return self.scroll;
    },
    getWarning:function(){
        var self =this;
        if(self.warning ==null){
            self.warning = new Alert(Alert.warning);
            self.warning.hide();
            return self.warning;
        }
        return self.warning;
    },
    getModal:function(){
        var self = this;
        if(self.modal == null){
            self.modal = new Modal();
            self.modal.setTitle('Editar Mapa');
            var container = self.modal.getBody().addContainer('row','');
            container.addContainer('form-group col-md-6',self.getInputName());
            container.addContainer('form-group col-md-6',self.getInputDisplay());
            container.addContainer('form-group col-md-6',self.getInputWidth());
            container.addContainer('form-group col-md-6',self.getInputHeight());
            container.addContainer('form-group col-md-12',self.getSelectScroll());
            container.addContainer('form-group col-md-12',self.getWarning());
            self.modal.getFooter().add(self.getCancel()).add(self.getConfirm());
        }
        return self.modal;
    }
};

MapWindow.delete = function(){
    if (!MapWindow.loading) {
        MapWindow.loading = true;
        $.ajax({
            url: Global.map.delete,
            type: 'post',
            data: {
                'data[id]': FolderWindow.id
            },
            dataType:'json',
            success: function (data) {
                if (data.success) {
                    var tree = $('#tree').dynatree('getTree');
                    var node = tree.getNodeByKey(FolderWindow.id);
                    if (node != null) {
                        node.remove();
                    }
                }
            },
            complete: function () {
                MapWindow.loading = false;
            }
        });
    }
};

MapWindow.expand = function(expand){
    var self = this;
    if (!self.loading) {
        self.loading = true;
        $.ajax({
            url: Global.map.expand,
            type: 'post',
            data: {
                'data[id]': FolderWindow.id,
                'data[expand]': expand
            },
            complete: function () {
                self.loading = false;
            }
        });
    }
};


ProjectWindow.loadProjects = function(callback){
    if (!ProjectWindow.loading) {
        $.ajax({
            url: Global.project.all,
            type: 'post',
            dataType:'json',
            success: function (data) {
                ProjectWindow.open.clearTable();
                var projects = data.projects;
                for (var i = 0; i < projects.length; i++) {
                    var project = projects[i];
                    project = new Project(project.id,project.name);
                    ProjectWindow.open.add(project);
                }
                ProjectWindow.open.getModal().open();
            },
            complete: function () {
                callback();
            }
        });
    }
};

ProjectWindow.expand = function(expand){
    var self = this;
    if (!self.loading) {
        self.loading = true;
        $.ajax({
            url: Global.project.expand,
            type: 'post',
            data: {
                'data[id]': FolderWindow.id,
                'data[expand]': expand
            },
            complete: function () {
                self.loading = false;
            }
        });
    }
};

ProjectWindow.treeLoaded = false;
ProjectWindow.reload = function (callback) {
    if (ProjectWindow.treeLoaded) {
        ProjectWindow.clear();
    }
    ProjectWindow.load(callback);
};

ProjectWindow.clear = function () {
    $("#tree").dynatree("destroy");
};

ProjectWindow.load = function (callback) {
    if (FolderWindow.id != 0 && !ProjectWindow.loading) {
        ProjectWindow.loading = true;
        $("#tree").dynatree({
            initAjax: {
                url: Global.project.mapTree,
                data: {
                    'data[id]': FolderWindow.id
                },
                type: 'post',
                complete: function () {
                    ProjectWindow.treeLoaded = true;
                    ProjectWindow.loading = false;
                    if (typeof callback == 'function') {
                        callback();
                    }
                }
            },
            debugLevel: 0,
            persist: false,
            generateIds: true,
            idPrefix: 'data-id:',
            onExpand: function (flag, dtnode) {
                var id = $(dtnode.li).prop('id');
                id = id.split(':')[1];
                FolderWindow.id = id;
                var span = $(dtnode.li).children()[0];
                var map = $(span).hasClass('map');
                if (map) {
                    MapWindow.expand(flag);
                }
                else {
                    ProjectWindow.expand(flag);
                }
            }
        });
    }
};


ProjectWindow.open = {
    modal: null,
    confirm: null,
    cancel: null,
    table: null,
    inputName: null,
    projects: [],
    getModal: function () {
        var self = this;
        if (self.modal == null) {
            self.modal = new Modal();
            self.modal.setTitle('Abrir Projeto');
            self.modal.getBody().add(self.getTable()).css('overflow-x','hidden').css('height','300px');
            self.modal.getFooter().add(self.getConfirm());
            self.modal.getFooter().add(self.getCancel())
        }
        return self.modal;
    },
    getConfirm: function () {
        var self = this;
        if (self.confirm == null) {
            self.confirm = new Button();
            self.confirm.
                addClass('btn btn-primary').
                setId('open-project-action').
                val('Abrir').
                click(function () {
                    FolderWindow.id = self.getCheckedId();
                    FolderWindow.type = 'project';
                    ProjectWindow.reload(function () {
                        self.getModal().close();
                    });
                });
        }
        return self.confirm;
    },
    clearTable:function(){
        var self = this;
        self.getTable().clearTds();
        self.projects = [];
    },
    getTable: function () {
        var self = this;
        if (self.table == null) {
            self.table = new Table();
            self.table.
                setId('open-project-select').
                addClass('table table-bordered');
            var tr = new Row();
            var th = new Col('header');
            var th2 = new Col('header');
            th.val('Nome do projeto');
            tr.add(th);
            tr.add(th2);
            self.table.add(tr);
        }
        return self.table;
    },
    add: function (project) {
        var self = this;
        if (project instanceof Project) {
            var table = self.getTable();
            table.add(project.getRow());
            self.projects.push(project);
        }
    },
    getCheckedId: function () {
        var self = this;
        var projects = self.projects;
        var size = projects.length;
        for (var i = 0; i < size; i++) {
            var project = projects[i];
            if(project.isChecked()){
                return project.id;
            }
        }
        return null;
    },
    getCancel: function () {
        var self = this;
        if (self.cancel == null) {
            self.cancel = new Button();
            self.cancel.
                addClass('btn btn-default').
                prop('id', 'cancel-open-project').
                val('Cancelar').
                setAttribute('type','button').
                setAttribute('data-dismiss', 'modal').
                click(function () {
                    self.getModal().close();
                });
        }
        return self.cancel
    }
};

ProjectWindow.create = {
    modal: null,
    confirm: null,
    cancel: null,
    inputName: null,
    warning: null,
    send:function(){
        var self = this;
        var data = {
            'data[Project][name]':self.getInputName().val()
        };
        $.ajax({
            url:Global.project.add,
            type:'post',
            data:data,
            dataType:'json',
            success:function(data){
                if(data.success){
                    FolderWindow.id = data.id;
                    FolderWindow.type = 'project';
                    ProjectWindow.reload(function () {
                        self.getModal().close();
                        self.getWarning().hide();
                    });
                }
                else{
                    var msg = '';
                    for(var index in data.errors){
                        msg += '* '+data.errors[index]+'<br>';
                    }
                    self.getWarning().setMessage(msg).show();
                }
            },
            error:function(data){

            }
        });
    },
    getCancel:function(){
        var self = this;
        if(self.cancel == null){
            self.cancel = new Button();
            self.cancel.
                addClass('btn btn-default').
                prop('id', 'cancel-create-project').
                val('Cancelar').
                setAttribute('type','button').
                setAttribute('data-dismiss','modal').
                click(function(){
                    self.getModal().close();
                });
        }
        return self.cancel;
    },
    getConfirm:function(){
        var self = this;
        if(self.confirm == null){
            self.confirm = new Button();
            self.confirm.
                addClass('btn btn-success').
                val('Concluir').
                click(function(){
                    self.send();
                });
        }
        return self.confirm;
    },
    getInputName: function () {
        var self = this;
        if (self.inputName == null) {
            self.inputName = new Input();
            self.inputName.
                prop('id', 'new-project-name').
                type('text').
                addClass('form-control').
                placeholder('Nome do Projeto').
                change().keyup().focus();
        }
        return self.inputName;
    },
    getModal: function () {
        var self = this;
        if (self.modal == null) {
            self.modal = new Modal();
            self.modal.setTitle('Novo Projeto');
            self.modal.getBody().add(self.getInputName()).add(self.getWarning());
            self.modal.getFooter().add(self.getCancel()).add(self.getConfirm());
            self.modal.onclose(function(){
                self.getWarning().hide();
            });
        }
        return self.modal;
    },
    getWarning: function () {
        var self = this;
        if (self.warning == null) {
            self.warning = new Alert(Alert.warning);
            self.warning.hide();
        }
        return self.warning;
    }
};



MapWindow.id = 0;
MapWindow.create = {
    modal:null,
    inputName:null,
    inputDisplay:null,
    inputWidth:null,
    inputHeight:null,
    inputScroll:null,
    cancel:null,
    confirm:null,
    warning:null,
    send:function(){
        var self = this;
        var data ={
            'data[Map][name]':self.getInputName().val(),
            'data[Map][display]':self.getInputDisplay().val(),
            'data[Map][width]':self.getInputWidth().val(),
            'data[Map][height]':self.getInputHeight().val(),
            'data[Map][scroll]':self.getSelectScroll().val()
        };

        if(FolderWindow.type == 'map'){
            data['data[Map][parent_id]'] = FolderWindow.id;
        }
        else{
            data['data[Map][project_id]'] = FolderWindow.id;
        }

        $.ajax({
            url:Global.map.add,
            type:'post',
            dataType:'json',
            data:data,
            success:function(data){
                if(data.success){
                    self.getModal().close();
                    self.getWarning().hide();
                    var tree = $('#tree').dynatree('getTree');
                    var node = tree.getNodeByKey(FolderWindow.id);
                    if (node != null) {
                        node.addChild(data.node);
                    }
                }
                else{
                    var errors = data.errors;
                    var message = '';
                    for(var index in errors){
                        message += '* '+errors[index]+'<br>';
                    }
                    self.getWarning().setMessage(message);
                    self.getWarning().show();
                }
            }
        });
    },
    getCancel:function(){
        var self = this;
        if(self.cancel == null){
            self.cancel = new Button();
            self.cancel.
                addClass('btn btn-default').
                val('Cancelar').
                click(function(){
                    self.getModal().close();
                });
        }
        return self.cancel;
    },
    getConfirm:function(){
        var self = this;
        if(self.confirm == null){
            self.confirm = new Button();
            self.confirm.
                addClass('btn btn-success').
                val('Criar Mapa').
                click(function(){
                    MapWindow.create.send();
                });
        }
        return self.confirm;
    },
    getInputName:function(){
        var self = this;
        if(self.inputName == null){
            self.inputName = new Input('text');
            self.inputName.placeholder('Nome').
                addClass('form-control').
                setAttribute('required',true);
        }
        return self.inputName;
    },
    getInputDisplay:function(){
        var self = this;
        if(self.inputDisplay == null){
            self.inputDisplay = new Input('text');
            self.inputDisplay.
                placeholder('Nome de apresentação').
                addClass('form-control').
                setAttribute('required',true);
        }
        return self.inputDisplay;
    },
    getInputWidth:function(){
        var self = this;
        if(self.inputWidth == null){
            self.inputWidth = new Input('number');
            self.inputWidth.
                placeholder('Largura').
                addClass('form-control').
                css('min',10).
                css('max',1000).
                setAttribute('required',true);
        }
        return self.inputWidth;
    },
    getInputHeight:function(){
        var self = this;
        if(self.inputHeight == null){
            self.inputHeight = new Input('number');
            self.inputHeight.
                placeholder('Altura').
                addClass('form-control').
                css('min',10).
                css('max',1000).
                setAttribute('required',true);
        }
        return self.inputHeight;
    },
    getSelectScroll:function(){
        var self = this;
        if(self.scroll ==null){
            self.scroll = new Select();
            self.scroll.setOptions({
               0:'Nenhum',
               1:'Loop Vertical',
               2:'Loop Horizontal',
               3:'Loop Vertical e Horizontal'
            }).addClass('form-control');
        }
        return self.scroll;
    },
    getWarning:function(){
        var self =this;
        if(self.warning ==null){
            self.warning = new Alert(Alert.warning);
            self.warning.hide();
            return self.warning;
        }
        return self.warning;
    },
    getModal:function(){
        var self = this;
        if(self.modal == null){
            self.modal = new Modal();
            self.modal.setTitle('Novo Mapa');
            var container = self.modal.getBody().addContainer('row','');
            container.addContainer('form-group col-md-6',self.getInputName());
            container.addContainer('form-group col-md-6',self.getInputDisplay());
            container.addContainer('form-group col-md-6',self.getInputWidth());
            container.addContainer('form-group col-md-6',self.getInputHeight());
            container.addContainer('form-group col-md-12',self.getSelectScroll());
            container.addContainer('form-group col-md-12',self.getWarning());
            self.modal.getFooter().add(self.getCancel()).add(self.getConfirm());
            self.modal.onclose(function(){
                self.getWarning().hide();
                self.getInputName().val('');
                self.getInputDisplay().val('');
                self.getInputWidth().val('');
                self.getInputHeight().val('');
                self.getSelectScroll().val(0);
            });
        }
        return self.modal;
    }
};
