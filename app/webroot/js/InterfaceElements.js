Number.regex = {
    int: /^[0-9]+$/
};

Number.isInt = function (number) {
    return this.regex.int.test(number + '');
};

function ProjectManager() {
}
function MapManager() {
}
function FolderManager() {
}
function ResourcesManager() {
}

FolderManager.id = Global.project.id;
FolderManager.type = 'project';
ResourcesManager.id = 0;
ProjectManager.loading = false;
ProjectManager.treeLoaded = false;
MapManager.loading = false;
MapManager.id = 0;
MapManager.clipboard = {
    type: 'copy',
    value: null
};

ProjectManager.loadProjects = function (callback) {
    var self = this;
    if (!self.loading) {
        $.ajax({
            url: Global.project.all,
            type: 'post',
            dataType: 'json',
            success: function (data) {
                self.open.clearTable();
                var projects = data.projects;
                for (var i = 0; i < projects.length; i++) {
                    var project = projects[i];
                    project = new Project(project.id, project.name);
                    self.open.add(project);
                }
                self.open.getModal().open();
            },
            complete: function () {
                callback();
            }
        });
    }
};

ProjectManager.expand = function (expand) {
    var self = this;
    if (!self.loading) {
        self.loading = true;
        $.ajax({
            url: Global.project.expand,
            type: 'post',
            data: {
                'data[id]': FolderManager.id,
                'data[expand]': expand
            },
            complete: function () {
                self.loading = false;
            }
        });
    }
};


ProjectManager.reload = function (callback) {
    var self = this;
    if (self.treeLoaded) {
        self.clear();
    }
    self.load(callback);
};

ProjectManager.clear = function () {
    $("#tree").dynatree("destroy");
};

ProjectManager.load = function (callback) {
    var self = this;
    if (FolderManager.id != 0 && !self.loading) {
        self.loading = true;
        $("#tree").dynatree({
            initAjax: {
                url: Global.project.mapTree,
                data: {
                    'data[id]': FolderManager.id
                },
                type: 'post',
                complete: function () {
                    self.treeLoaded = true;
                    self.loading = false;
                    if (typeof callback == 'function') {
                        callback();
                    }
                }
            },
            debugLevel: 0,
            persist: false,
            generateIds: true,
            idPrefix: 'data-id:',
            onLazyRead: function (node) {
                var span = node.span;
                var action = '';

                if ($(span).hasClass('project')) {
                    action = Global.project.children;
                }
                else if ($(span).hasClass('map')) {
                    action = Global.map.children;
                }
                node.appendAjax({
                    url: action,
                    type: 'post',
                    data: {
                        'data[id]': node.data.key
                    }
                });
            }/*,
             onExpand: function (flag, dtnode) {
             var id = $(dtnode.li).prop('id');
             id = id.split(':')[1];
             FolderManager.id = id;
             var span = $(dtnode.li).children()[0];
             var map = $(span).hasClass('map');
             if (map) {
             MapManager.expand(flag);
             }
             else {
             self.expand(flag);
             }
             }*/
        });
    }
};

ProjectManager.open = {
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
            self.modal.getBody().add(self.getTable()).css('overflow-x', 'hidden').css('height', '300px');
            self.modal.getFooter().add(self.getConfirm());
            self.modal.getFooter().add(self.getCancel());
            self.modal.onopen(function () {
                for (var i = 0; i < self.projects.length; i++) {
                    var project = self.projects[i];
                    if (project.id == Global.project.id) {
                        project.getRadio().check();
                        break;
                    }
                }
            });
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
                    var id = self.getCheckedId();
                    Global.project.id = id;
                    FolderManager.id = id;
                    FolderManager.type = 'project';
                    ProjectManager.reload(function () {
                        self.getModal().close();
                    });
                });
        }
        return self.confirm;
    },
    clearTable: function () {
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
                addClass('table table-default');
            var tr = new Row();
            var th = new Col('header');
            var th2 = new Col('header');
            th2.hide();
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
            if (project.isChecked()) {
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
                setAttribute('type', 'button').
                setAttribute('data-dismiss', 'modal').
                click(function () {
                    self.getModal().close();
                });
        }
        return self.cancel
    }
};

ProjectManager.create = {
    modal: null,
    confirm: null,
    cancel: null,
    inputName: null,
    warning: null,
    send: function () {
        var self = this;
        var data = {
            'data[Project][name]': self.getInputName().val()
        };
        $.ajax({
            url: Global.project.add,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    FolderManager.id = data.id;
                    FolderManager.type = 'project';
                    ProjectManager.reload(function () {
                        self.getModal().close();
                        self.getWarning().hide();
                    });
                }
                else {
                    var msg = '';
                    for (var index in data.errors) {
                        msg += '* ' + data.errors[index] + '<br>';
                    }
                    self.getWarning().setMessage(msg).show();
                }
            },
            error: function (data) {

            }
        });
    },
    getCancel: function () {
        var self = this;
        if (self.cancel == null) {
            self.cancel = new Button();
            self.cancel.
                addClass('btn btn-default').
                prop('id', 'cancel-create-project').
                val('Cancelar').
                setAttribute('type', 'button').
                setAttribute('data-dismiss', 'modal').
                click(function () {
                    self.getModal().close();
                });
        }
        return self.cancel;
    },
    getConfirm: function () {
        var self = this;
        if (self.confirm == null) {
            self.confirm = new Button();
            self.confirm.
                addClass('btn btn-success').
                val('Concluir').
                click(function () {
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
            self.modal.onclose(function () {
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

MapManager.create = {
    modal: null,
    inputName: null,
    inputDisplay: null,
    inputWidth: null,
    inputHeight: null,
    inputScroll: null,
    cancel: null,
    confirm: null,
    warning: null,
    send: function () {
        var self = this;
        var data = {
            'data[Map][name]': self.getInputName().val(),
            'data[Map][display]': self.getInputDisplay().val(),
            'data[Map][width]': self.getInputWidth().val(),
            'data[Map][height]': self.getInputHeight().val(),
            'data[Map][scroll]': self.getSelectScroll().val()
        };

        if (FolderManager.type == 'map') {
            data['data[Map][parent_id]'] = FolderManager.id;
        }
        else {
            data['data[Map][project_id]'] = FolderManager.id;
        }

        $.ajax({
            url: Global.map.add,
            type: 'post',
            dataType: 'json',
            data: data,
            success: function (data) {
                if (data.success) {
                    self.getModal().close();
                    self.getWarning().hide();
                    var tree = $('#tree').dynatree('getTree');
                    var node = tree.getNodeByKey(FolderManager.id);
                    if (node != null) {
                        node.addChild(data.node);
                    }
                }
                else {
                    var errors = data.errors;
                    var message = '';
                    for (var index in errors) {
                        message += '* ' + errors[index] + '<br>';
                    }
                    self.getWarning().setMessage(message);
                    self.getWarning().show();
                }
            }
        });
    },
    getCancel: function () {
        var self = this;
        if (self.cancel == null) {
            self.cancel = new Button();
            self.cancel.
                addClass('btn btn-default').
                val('Cancelar').
                click(function () {
                    self.getModal().close();
                });
        }
        return self.cancel;
    },
    getConfirm: function () {
        var self = this;
        if (self.confirm == null) {
            self.confirm = new Button();
            self.confirm.
                addClass('btn btn-success').
                val('Criar Mapa').
                click(function () {
                    MapManager.create.send();
                });
        }
        return self.confirm;
    },
    getInputName: function () {
        var self = this;
        if (self.inputName == null) {
            self.inputName = new Input('text');
            self.inputName.placeholder('Nome').
                addClass('form-control').
                setAttribute('required', true);
        }
        return self.inputName;
    },
    getInputDisplay: function () {
        var self = this;
        if (self.inputDisplay == null) {
            self.inputDisplay = new Input('text');
            self.inputDisplay.
                placeholder('Nome de apresentação').
                addClass('form-control').
                setAttribute('required', true);
        }
        return self.inputDisplay;
    },
    getInputWidth: function () {
        var self = this;
        if (self.inputWidth == null) {
            self.inputWidth = new Input('number');
            self.inputWidth.
                placeholder('Largura').
                addClass('form-control').
                css('min', 10).
                css('max', 1000).
                setAttribute('required', true);
        }
        return self.inputWidth;
    },
    getInputHeight: function () {
        var self = this;
        if (self.inputHeight == null) {
            self.inputHeight = new Input('number');
            self.inputHeight.
                placeholder('Altura').
                addClass('form-control').
                css('min', 10).
                css('max', 1000).
                setAttribute('required', true);
        }
        return self.inputHeight;
    },
    getSelectScroll: function () {
        var self = this;
        if (self.scroll == null) {
            self.scroll = new Select();
            self.scroll.setOptions({
                0: 'Nenhum',
                1: 'Loop Vertical',
                2: 'Loop Horizontal',
                3: 'Loop Vertical e Horizontal'
            }).addClass('form-control');
        }
        return self.scroll;
    },
    getWarning: function () {
        var self = this;
        if (self.warning == null) {
            self.warning = new Alert(Alert.warning);
            self.warning.hide();
            return self.warning;
        }
        return self.warning;
    },
    getModal: function () {
        var self = this;
        if (self.modal == null) {
            self.modal = new Modal();
            self.modal.setTitle('Novo Mapa');
            var container = self.modal.getBody().addContainer('row', '');
            container.addContainer('form-group col-md-6', self.getInputName());
            container.addContainer('form-group col-md-6', self.getInputDisplay());
            container.addContainer('form-group col-md-6', self.getInputWidth());
            container.addContainer('form-group col-md-6', self.getInputHeight());
            container.addContainer('form-group col-md-12', self.getSelectScroll());
            container.addContainer('form-group col-md-12', self.getWarning());
            self.modal.getFooter().add(self.getCancel()).add(self.getConfirm());
            self.modal.onclose(function () {
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

MapManager.expand = function (expand) {
    var self = this;
    if (!self.loading) {
        self.loading = true;
        $.ajax({
            url: Global.map.expand,
            type: 'post',
            data: {
                'data[id]': FolderManager.id,
                'data[expand]': expand
            },
            complete: function () {
                self.loading = false;
            }
        });
    }
};

MapManager.copy = function () {
    var self = this;
    self.clipboard.value = FolderManager.id;
    self.clipboard.type = 'copy';
};

MapManager.cut = function () {
    var self = this;
    self.clipboard.value = FolderManager.id;
    self.clipboard.type = 'cut';
};

MapManager.paste = function () {
    var self = this;
    if (!self.loading) {
        self.loading = true;
        var data = {
            'data[id]': self.clipboard.value,
            'data[type]': self.clipboard.type
        };
        var type = FolderManager.type;
        if (type == 'project') {
            data['data[project_id]'] = FolderManager.id;
        }
        else {
            data['data[parent_id]'] = FolderManager.id;
        }

        $.ajax({
            url: Global.map.paste,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    var parent = FolderManager.id;
                    var tree = $('#tree').dynatree('getTree');
                    var node = tree.getNodeByKey(parent);
                    if (node != null) {
                        if (self.clipboard.type == 'cut') {
                            var old = tree.getNodeByKey(data.node.key);
                            if (old != null) {
                                old.remove();
                            }
                        }
                        var child = data.node;
                        node.addChild(child);
                    }
                }
            },
            complete: function () {
                self.loading = false;
            }
        });
    }
};

MapManager.edit = {
    loading: false,
    modal: null,
    inputName: null,
    inputDisplay: null,
    inputWidth: null,
    inputHeight: null,
    selectScroll: null,
    send: function () {
        var self = this;
        if (!self.loading) {
            self.loading = true;
            $.ajax({
                url: Global.map.edit,
                type: 'post',
                data: {
                    'data[Map][id]': FolderManager.id,
                    'data[Map][name]': self.getInputName().val(),
                    'data[Map][display]': self.getInputDisplay().val(),
                    'data[Map][width]': self.getInputWidth().val(),
                    'data[Map][height]': self.getInputHeight().val(),
                    'data[Map][scroll]': self.getSelectScroll().val()
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success) {
                        self.getModal().close();
                        self.getWarning().hide();
                        var tree = $('#tree').dynatree('getTree');
                        var node = tree.getNodeByKey(FolderManager.id);
                        if (node != null) {
                            node.data.title = data.map.name;
                            node.render();
                        }
                    }
                    else {
                        var errors = data.errors;
                        var message = '';
                        for (var index in errors) {
                            message += '* ' + errors[index] + '<br>';
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
    load: function (callback) {
        var self = this;
        if (!self.loading) {
            self.loading = true;
            $.ajax({
                url: Global.map.load,
                type: 'post',
                dataType: 'json',
                data: {
                    'data[id]': FolderManager.id
                },
                success: function (data) {
                    if (data.success) {
                        var map = data.map;
                        self.getInputName().val(map.name);
                        self.getInputDisplay().val(map.display);
                        self.getInputWidth().val(map.width);
                        self.getInputHeight().val(map.height);
                        self.getSelectScroll().val(map.scroll);
                        if (typeof callback == 'function') {
                            callback.apply(self);
                        }
                    }
                },
                error: function () {

                },
                complete: function () {
                    self.loading = false;
                }
            });
        }
    },
    getCancel: function () {
        var self = this;
        if (self.cancel == null) {
            self.cancel = new Button();
            self.cancel.
                addClass('btn btn-default').
                val('Cancelar').
                click(function () {
                    self.getModal().close();
                });
        }
        return self.cancel;
    },
    getConfirm: function () {
        var self = this;
        if (self.confirm == null) {
            self.confirm = new Button();
            self.confirm.
                addClass('btn btn-success').
                val('Atualizar Mapa').
                click(function () {
                    self.send();
                });
        }
        return self.confirm;
    },
    getInputName: function () {
        var self = this;
        if (self.inputName == null) {
            self.inputName = new Input('text');
            self.inputName.placeholder('Nome').
                addClass('form-control').
                setAttribute('required', true);
        }
        return self.inputName;
    },
    getInputDisplay: function () {
        var self = this;
        if (self.inputDisplay == null) {
            self.inputDisplay = new Input('text');
            self.inputDisplay.
                placeholder('Nome de apresentação').
                addClass('form-control').
                setAttribute('required', true);
        }
        return self.inputDisplay;
    },
    getInputWidth: function () {
        var self = this;
        if (self.inputWidth == null) {
            self.inputWidth = new Input('number');
            self.inputWidth.
                placeholder('Largura').
                addClass('form-control').
                css('min', 10).
                css('max', 1000).
                setAttribute('required', true);
        }
        return self.inputWidth;
    },
    getInputHeight: function () {
        var self = this;
        if (self.inputHeight == null) {
            self.inputHeight = new Input('number');
            self.inputHeight.
                placeholder('Altura').
                addClass('form-control').
                css('min', 10).
                css('max', 1000).
                setAttribute('required', true);
        }
        return self.inputHeight;
    },
    getSelectScroll: function () {
        var self = this;
        if (self.scroll == null) {
            self.scroll = new Select();
            self.scroll.setOptions({
                0: 'Nenhum',
                1: 'Loop Vertical',
                2: 'Loop Horizontal',
                3: 'Loop Vertical e Horizontal'
            }).addClass('form-control');
        }
        return self.scroll;
    },
    getWarning: function () {
        var self = this;
        if (self.warning == null) {
            self.warning = new Alert(Alert.warning);
            self.warning.hide();
            return self.warning;
        }
        return self.warning;
    },
    getModal: function () {
        var self = this;
        if (self.modal == null) {
            self.modal = new Modal();
            self.modal.setTitle('Editar Mapa');
            var container = self.modal.getBody().addContainer('row', '');
            container.addContainer('form-group col-md-6', self.getInputName());
            container.addContainer('form-group col-md-6', self.getInputDisplay());
            container.addContainer('form-group col-md-6', self.getInputWidth());
            container.addContainer('form-group col-md-6', self.getInputHeight());
            container.addContainer('form-group col-md-12', self.getSelectScroll());
            container.addContainer('form-group col-md-12', self.getWarning());
            self.modal.getFooter().add(self.getCancel()).add(self.getConfirm());
        }
        return self.modal;
    }
};

MapManager.delete = function () {
    var self = this;
    if (!self.loading) {
        self.loading = true;
        $.ajax({
            url: Global.map.delete,
            type: 'post',
            data: {
                'data[id]': FolderManager.id
            },
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    var tree = $('#tree').dynatree('getTree');
                    var node = tree.getNodeByKey(FolderManager.id);
                    if (node != null) {
                        node.remove();
                    }
                }
            },
            complete: function () {
                self.loading = false;
            }
        });
    }
};


ResourcesManager.tileset = {
    modal: null,
    loading: false,
    tabPanel: null,
    tabGridItem: null,
    tabRegionItem: null,
    canvasImage: null,
    canvasGrid: null,
    canvasGridDraw: null,
    canvasGridRegion: null,
    canvasGridDrawRegion: null,
    canvasAligner: null,
    canvasAlignerRegion: null,
    gridContext: null,
    gridRegionContext: null,
    tabPaneImage: null,
    tabPaneGrid: null,
    tabPaneRegion: null,
    imageInput: null,
    nextButton: null,
    cancelButton: null,
    rowInput: null,
    colInput: null,
    allowedImages: [
        'jpg',
        'png',
        'gif'
    ],
    passo: 0,
    image: null,
    rows: null,
    cols: null,
    gridMouseReader: null,
    startPoint: null,
    left: false,
    regions:[],
    rects:[],
    getGridMouseReader: function () {
        var self = this;
        if (self.gridMouseReader == null) {
            self.gridMouseReader = new MouseReader(self.getCanvasGridDrawRegion().element);
            self.gridMouseReader.start();
            self.gridMouseReader.onmousemove(function () {
                var reader = this;
                if (reader.left && self.left) {
                    var vertexB = reader.vertex;
                    var vertexA = self.startPoint;


                    var w = vertexB[0] - vertexA[0];
                    var h = vertexB[1] - vertexA[1];

                    var rect = {
                        x:vertexA[0]+(w<0?w:0),
                        y:vertexA[1]+(h<0?h:0),
                        w:Math.abs(w),
                        h:Math.abs(h)
                    };
                    self.region.children = [];
                    for(var i = 0; i < self.rects.length;i++){
                        if(self.rects[i].colide(rect)){
                            self.rects[i].checked = true;
                            self.region.children.push(self.rects[i]);
                        }
                        else{
                            self.rects[i].checked = false;
                        }
                    }


                    self.clearGridRegion();
                    self.drawGridRegion();
                }
            });
            self.gridMouseReader.onmousedown(MouseReader.LEFT, function () {
                self.startPoint = [this.vertex[0], this.vertex[1]];
            });
            self.gridMouseReader.onmouseup(MouseReader.LEFT, function () {

            });
            $(document).on('mousedown', function () {
                self.left = true;
                self.region = new Region('',0,0,0,0);
            });
            $(document).on('mouseup', function () {
                self.left = false;
            });
        }
        return self.gridMouseReader;
    },
    getFileExt: function (filename) {
        var index = filename.lastIndexOf('.');
        var ext = '';
        if (index != -1) {
            ext = filename.substring(index + 1, filename.length).toLowerCase();
        }
        return ext;
    },
    drawGrid: function () {
        var self = this;
        var rows = self.getRowInput().val();
        var cols = self.getColInput().val();
        if (Number.isInt(rows) && Number.isInt(cols) && rows > 0 && cols > 0) {
            self.rows = rows;
            self.cols = cols;
            var image = self.getImage();
            var w = image.width / cols;
            var h = image.height / rows;
            w = w < 32 ? 32 : w;
            h = h < 32 ? 32 : h;
            self.clearGrid();
            var ctx = self.getGridContext();
            ctx.setLineDash([2, 2]);
            for (var i = 0; i <= image.width; i += w) {
                for (var j = 0; j <= image.height; j += h) {
                    ctx.strokeRect(i, j, w, h);
                }
            }
        }
    },
    drawGridRegion: function () {
        var self = this;
        var rects = self.rects;
        var ctx = self.getGridRegionContext();
        ctx.strokeStyle = '#00000';
        ctx.fillStyle = 'rgba(180,0,0,0.5)';

        for(var i = 0; i < rects.length;i++){
            var rect = rects[i];
            ctx.strokeRect(rect.x,rect.y,rect.w,rect.h);
            if(rect.checked){
                ctx.fillRect(rect.x,rect.y,rect.w,rect.h);
            }
        }
    },
    createGridRects:function(){
        var self = this;
        var rows = self.rows;
        var cols = self.cols;
        var image = self.getImage();
        var w = image.width/cols;
        var h = image.height/rows;
        self.rects = [];
        for (var i = 0; i <= image.width; i += w) {
            for (var j = 0; j <= image.height; j += h) {
                var rect = new Rect(i,j,w,h);
                self.rects.push(rect);
            }
        }
    },
    clearGrid: function () {
        var self = this;
        var ctx = self.getGridContext();
        var image = self.getImage();
        ctx.fillStyle = 'transparent';
        ctx.clearRect(0, 0, image.width, image.height);
    },
    clearGridRegion: function () {
        var self = this;
        var ctx = self.getGridRegionContext();
        var image = self.getImage();
        ctx.fillStyle = 'transparent';
        ctx.clearRect(0, 0, image.width, image.height);
    },
    getGridContext: function () {
        var self = this;
        if (self.gridContext == null) {
            var canvas = self.getCanvasGridDraw();
            self.gridContext = canvas.element.getContext('2d');
        }
        return self.gridContext;
    },
    getGridRegionContext: function () {
        var self = this;
        if (self.gridRegionContext == null) {
            var canvas = self.getCanvasGridDrawRegion();
            self.gridRegionContext = canvas.element.getContext('2d');
        }
        return self.gridRegionContext;
    },
    getImageInput: function () {
        var self = this;
        if (self.imageInput == null) {
            self.imageInput = new Input('file');
            self.imageInput.addClass('form-control');
            self.imageInput.change(function () {
                var filepath = $(this.element).val();
                var ext = self.getFileExt(filepath);
                if (self.allowedImages.indexOf(ext) != -1) {
                    self.image = null;
                    var canvas = self.getCanvasImage();
                    var ctx = canvas.getDOM().getContext('2d');
                    var img = self.getImage();
                    img.onload = function () {
                        canvas.setAttribute('width', img.width + 'px').setAttribute('height', img.height + 'px');
                        ctx.drawImage(img, 0, 0);
                        self.getNextButton().enable();
                    };
                }
                else {
                    self.getNextButton().disable();
                }
            });
        }
        return self.imageInput;
    },
    getImage: function () {
        var self = this;
        if (self.image == null) {
            self.image = new Image;
            self.image.src = URL.createObjectURL(self.getImageInput().element.files[0]);
        }
        return self.image;
    },
    getTabPaneImage: function () {
        var self = this;
        if (self.tabPaneImage == null) {
            self.tabPaneImage = new TabPane('resource-image');
            var container = self.tabPaneImage.addContainer('row', '');
            container.css('overflow', 'hidden').css('padding', '20px');
            var canvasContainer = container.addContainer('col-md-12 form-group', self.getCanvasImage());
            canvasContainer.css('width', '100%').css('height', '300px').css('border', '1px dashed gray').css('overflow', 'scroll');
            container.addContainer('col-md-12 form-group', self.getImageInput());
        }
        return self.tabPaneImage;
    },
    getTabPaneGrid: function () {
        var self = this;
        if (self.tabPaneGrid == null) {
            self.tabPaneGrid = new TabPane('resource-grid');
            var container = self.tabPaneGrid.addContainer('row');
            container.css('overflow', 'hidden').css('padding', '20px');
            var canvasContainer = container.addContainer('col-md-12 form-group', '');
            self.canvasAligner = canvasContainer.addContainer('', self.getCanvasGrid());
            self.canvasAligner.add(self.getCanvasGridDraw());
            self.canvasAligner.css('margin', 'auto');
            canvasContainer.css('width', '100%').css('height', '300px').css('border', '1px dashed gray').css('overflow', 'scroll');
            container.addContainer('col-md-6 form-group', self.getRowInput());
            container.addContainer('col-md-6 form-group', self.getColInput());
        }
        return self.tabPaneGrid;
    },
    getTabPaneRegion: function () {
        var self = this;
        if (self.tabPaneRegion == null) {
            self.tabPaneRegion = new TabPane('resource-region');
            var container = self.tabPaneRegion.addContainer('row');
            container.css('overflow', 'hidden').css('padding', '20px');
            var canvasContainer = container.addContainer('col-md-12 form-group', '');
            self.canvasAlignerRegion = canvasContainer.addContainer('', self.getCanvasGridRegion());
            self.canvasAlignerRegion.add(self.getCanvasGridDrawRegion());
            self.canvasAlignerRegion.css('margin', 'auto');
            canvasContainer.css('width', '100%').css('height', '300px').css('border', '1px dashed gray').css('overflow', 'scroll');
        }
        return self.tabPaneRegion;
    },
    getCanvasImage: function () {
        var self = this;
        if (self.canvasImage == null) {
            self.canvasImage = new Tag('canvas');
            self.canvasImage.setAttribute('width', '550px').setAttribute('height', 'auto');
        }
        return self.canvasImage;
    },
    getCanvasGrid: function () {
        var self = this;
        if (self.canvasGrid == null) {
            self.canvasGrid = new Tag('canvas');
            self.canvasGrid.setAttribute('width', '550px').setAttribute('height', 'auto').css('position', 'absolute').css('z-index', 1);
        }
        return self.canvasGrid;
    },
    getCanvasGridRegion: function () {
        var self = this;
        if (self.canvasGridRegion == null) {
            self.canvasGridRegion = new Tag('canvas');
            self.canvasGridRegion.setAttribute('width', '550px').setAttribute('height', 'auto').css('position', 'absolute').css('z-index', 1);
        }
        return self.canvasGridRegion;
    },
    getCanvasGridDraw: function () {
        var self = this;
        if (self.canvasGridDraw == null) {
            self.canvasGridDraw = new Tag('canvas');
            self.canvasGridDraw.setAttribute('width', '550px').setAttribute('height', 'auto').css('position', 'absolute').css('z-index', 2).css('margin', 'auto');
        }
        return self.canvasGridDraw;
    },
    getCanvasGridDrawRegion: function () {
        var self = this;
        if (self.canvasGridDrawRegion == null) {
            self.canvasGridDrawRegion = new Tag('canvas');
            self.canvasGridDrawRegion.setAttribute('width', '550px').setAttribute('height', 'auto').css('position', 'absolute').css('z-index', 2).css('margin', 'auto');
        }
        return self.canvasGridDrawRegion;
    },
    getModal: function () {
        var self = this;
        if (self.modal == null) {
            self.modal = new Modal();
            self.modal.setTitle('Adicionar Tileset');
            self.modal.getBody().add(self.getTabPanel());
            self.modal.getFooter().add(self.getNextButton()).add(self.getCancelButton());
            self.modal.onopen(function () {
                self.getTabItemImage().addClass('active');
                self.getTabPaneImage().addClass('active');
                var canvas = self.getCanvasImage();
                var ctx = canvas.getDOM().getContext('2d');
                ctx.clearRect(0, 0, 550, 550);
                canvas.setAttribute('width', '550px').setAttribute('height', 'auto');
                self.getImageInput().val('');
                self.passo = 0;
                self.regions = [];
            });
            self.modal.onclose(function () {
                self.getTabPaneGrid().removeClass('active');
                self.getTabItemGrid().removeClass('active');
                self.getTabPaneRegion().removeClass('active');
                self.getTabItemRegion().removeClass('active');
            });
            self.getGridMouseReader();
        }
        return self.modal;
    },
    getTabItemImage: function () {
        var self = this;
        if (self.tabItemImage == null) {
            self.tabItemImage = new TabListItem('#resource-image', 'Gráfico');
        }
        return self.tabItemImage;
    },
    getTabItemGrid: function () {
        var self = this;
        if (self.tabGridItem == null) {
            self.tabGridItem = new TabListItem('#resource-grid', 'Grid');
        }
        return self.tabGridItem;
    },
    getTabItemRegion: function () {
        var self = this;
        if (self.tabRegionItem == null) {
            self.tabRegionItem = new TabListItem('#resource-region', 'Região');
        }
        return self.tabRegionItem;
    },
    getTabPanel: function () {
        var self = this;
        if (self.tabPanel == null) {
            self.tabPanel = new TabPanel();
            self.tabPanel.getTabList().
                add(self.getTabItemImage()).
                add(self.getTabItemGrid()).
                add(self.getTabItemRegion());
            self.tabPanel.getTabContent().add(self.getTabPaneImage()).add(self.getTabPaneGrid()).add(self.getTabPaneRegion());
        }
        return self.tabPanel;
    },
    getNextButton: function () {
        var self = this;
        if (self.nextButton == null) {
            self.nextButton = new Button();
            self.nextButton.
                val('Próximo').
                addClass('btn btn-primary').
                disable().click(function () {
                    var image = null;
                    var ctx = null;
                    if (self.passo == 0) {
                        self.passo = 1;
                        self.getTabItemImage().removeClass('active');
                        self.getTabPaneImage().removeClass('active');
                        self.getTabItemGrid().addClass('active');
                        self.getTabPaneGrid().addClass('active');
                        image = self.getImage();
                        self.getCanvasGrid().setAttribute('width', image.width + 'px').setAttribute('height', image.height + 'px');
                        self.getCanvasGridDraw().setAttribute('width', image.width + 'px').setAttribute('height', image.height + 'px');
                        self.canvasAligner.css('width', image.width + 'px').css('height', image.height + 'px');
                        self.getRowInput().setAttribute('max', parseInt(Math.floor(image.height / 32)));
                        self.getColInput().setAttribute('max', parseInt(Math.floor(image.width / 32)));
                        ctx = self.getCanvasGrid().element.getContext('2d');
                        ctx.drawImage(image, 0, 0);
                        self.drawGrid();
                    }
                    else if (self.passo == 1) {
                        self.passo = 2;
                        self.createGridRects();
                        self.getTabItemGrid().removeClass('active');
                        self.getTabPaneGrid().removeClass('active');
                        self.getTabItemRegion().addClass('active');
                        self.getTabPaneRegion().addClass('active');
                        image = self.getImage();
                        self.getCanvasGridRegion().setAttribute('width', image.width + 'px').setAttribute('height', image.height + 'px');
                        self.getCanvasGridDrawRegion().setAttribute('width', image.width + 'px').setAttribute('height', image.height + 'px');
                        self.canvasAlignerRegion.css('width', image.width + 'px').css('height', image.height + 'px');
                        ctx = self.getCanvasGridRegion().element.getContext('2d');
                        ctx.drawImage(image, 0, 0);
                        self.drawGridRegion();
                    }
                });
        }
        return self.nextButton;
    },
    getCancelButton: function () {
        var self = this;
        if (self.cancelButton == null) {
            self.cancelButton = new Button();
            self.cancelButton.
                val('Cancelar').
                addClass('btn btn-default').
                click(function () {
                    self.getModal().close();
                });
        }
        return self.cancelButton;
    },
    getRowInput: function () {
        var self = this;
        if (self.rowInput == null) {
            self.rowInput = new Input('number');
            var func = function () {
                self.drawGrid();
            };
            self.rowInput.
                addClass('form-control').
                placeholder('Linhas').
                setAttribute('min', 1).
                val(1).
                change(func).
                keyup(func).
                focus(func);
        }
        return self.rowInput;
    },
    getColInput: function () {
        var self = this;
        if (self.colInput == null) {
            self.colInput = new Input('number');
            var func = function () {
                self.drawGrid();
            };
            self.colInput.
                addClass('form-control').
                placeholder('Colunas').
                setAttribute('min', 1).
                val(1).
                change(func).
                keyup(func).
                focus(func);
        }
        return self.colInput;
    }
};


ResourcesManager.main = {
    modal: null,
    tree: null,
    treeLoaded: false,
    loading: false,
    getModal: function () {
        var self = this;
        if (self.modal == null) {
            self.modal = new Modal();
            self.modal.setTitle('Recursos');
            self.modal.getBody().add(self.getTree());
            self.modal.onopen(function () {
                $(self.getTree().getDOM()).dynatree({
                    initAjax: {
                        url: Global.resources.children,
                        data: {
                            'data[id]': Global.project.id
                        },
                        type: 'post',
                        complete: function () {
                            self.treeLoaded = true;
                            self.loading = false;
                        }
                    },
                    debugLevel: 0,
                    persist: false,
                    generateIds: true,
                    idPrefix: 'resource-folder-id:',
                    onLazyRead: function (node) {
                        var span = node.span;
                        var action = '';

                        if ($(span).hasClass('project')) {
                            action = Global.project.children;
                        }
                        else if ($(span).hasClass('map')) {
                            action = Global.map.children;
                        }
                        node.appendAjax({
                            url: action,
                            type: 'post',
                            data: {
                                'data[id]': node.data.key
                            }
                        });
                    }
                });
            });
        }
        return self.modal;
    },
    getTree: function () {
        var self = this;
        if (self.tree == null) {
            self.tree = new Tag('div');
        }
        return self.tree;
    }
};
