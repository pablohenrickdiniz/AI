function ProjectWindow() {}

ProjectWindow.mapManager = {
    id: 0,
    type: '',
    creating: false,
    node: null,
    success: false,
    copy: 0,
    updateMap: function () {
        var self = this;
        if (!self.creating) {
            self.creating = true;
            $.ajax({
                url: Global.mapEditAction,
                type: 'post',
                data: {
                    'data[Map][id]': self.id,
                    'data[Map][name]': $('#map-name-update').val(),
                    'data[Map][display]': $('#map-display-update').val(),
                    'data[Map][width]': $('#map-width-update').val(),
                    'data[Map][height]': $('#map-height-update').val(),
                    'data[Map][scroll]': $('#map-scroll-update').val()
                },
                success: function (data) {
                    data = $.parseJSON(data);
                    if (data.success) {
                        self.closeUpdateModal();
                        var tree = $('#tree').dynatree('getTree');
                        var node = tree.getNodeByKey(self.id);
                        if (node != null) {
                            node.data.title = data.map.name;
                            node.render();
                        }
                    }
                    else {
                        self.showUpdateError();
                    }
                },
                complete: function () {
                    self.creating = false;
                }
            });
        }
    },
    deleteMap: function () {
        var self = this;
        if (!self.creating) {
            self.creating = true;
            $.ajax({
                url: Global.mapDeleteAction,
                type: 'post',
                data: {
                    'data[id]': self.id
                },
                success: function (data) {
                    data = $.parseJSON(data);
                    if (data.success) {
                        var tree = $('#tree').dynatree('getTree');
                        var node = tree.getNodeByKey(self.mapManager.id);
                        if (node != null) {
                            node.remove();
                        }

                    }
                },
                complete: function () {
                    self.creating = false;
                }
            });
        }
    },
    loadEdit: function () {
        var self = this;
        if (!self.creating) {
            self.creating = true;
            $.ajax({
                url: Global.mapLoadMap,
                type: 'post',
                data: {
                    'data[id]': self.id
                },
                success: function (data) {
                    data = $.parseJSON(data);
                    if (data.success) {
                        var map = data.map;
                        self.success = true;
                        $('#map-name-update').val(map.Map.name);
                        $('#map-display-update').val(map.Map.display);
                        $('#map-width-update').val(map.Map.width);
                        $('#map-height-update').val(map.Map.height);
                        $('#map-scroll-update').val(map.Map.scroll);
                    }
                },
                complete: function () {
                    if (self.success) {
                        $('#map-update-modal').modal();
                        self.success = false;
                    }
                    self.creating = false;
                }
            });
        }
    },
    expand: function (expand) {
        var self = this;
        if (!self.creating) {
            self.creating = true;
            $.ajax({
                url: Global.mapExpand,
                type: 'post',
                data: {
                    'data[id]': self.mapManager.id,
                    'data[expand]': expand
                },
                complete: function () {
                    self.creating = false;
                }
            });
        }
    },
    showError: function () {
        $('#create-map-warning').hide();
        $('#create-map-error').show();
    },
    showUpdateError: function () {
        $('#update-map-warning').hide();
        $('#update-map-error').show();
    },
    showWarnings: function () {
        $('#create-map-error').hide();
        $('#create-map-warning').show();
    },
    showUpdateWarnings: function () {
        $('#update-map-error').hide();
        $('#update-map-warning').show();
    },
    closeAlerts: function () {
        $('#create-map-error').hide();
        $('#create-map-warning').hide();
    },
    closeUpdateAlerts: function () {
        $('#update-map-error').hide();
        $('#update-map-warning').hide();
    },
    setWarningMessage: function (message) {
        $('#create-map-warning').html(message);
    },
    setUpdateWarningMessage: function (message) {
        $('#create-update-warning').html(message);
    },
    closeModal: function () {
        self.create.modal.close();
        this.closeAlerts();
    },
    closeUpdateModal: function () {
        updateMapModal.close();
        this.closeUpdateAlerts();
    }
};





ProjectWindow.projectManager = {
    project_id: Global.projectId,
    loading: false,
    treeLoaded: false,
    loadProjects: function (callback) {
        var self = this;
        if (!self.loading) {
            $.ajax({
                url: Global.projectGetAll,
                type: 'post',
                success: function (data) {
                    data = $.parseJSON(data);
                    $('#open-project-select').find('tr > td').remove();
                    for (var i = 0; i < data.Project.length; i++) {
                        var project = data.Project[i];
                        project = new Project(project.id,project.name);
                        ProjectWindow.open.add(project);
                    }
                },
                complete: function () {
                    callback();
                }
            });
        }
    },
    reload: function (callback) {
        var self = this;
        if (self.treeLoaded) {
            self.clear();
        }

        self.loadProject(callback);
    },
    clear: function () {
        $("#tree").dynatree("destroy");
    },
    expand: function (expand) {
        var self = this;
        if (!self.loading) {
            self.loading = true;
            $.ajax({
                url: Global.projectExpand,
                type: 'post',
                data: {
                    'data[id]': mapManager.id,
                    'data[expand]': expand
                },
                complete: function () {
                    self.loading = false;
                }
            });
        }
    },
    loadProject: function (callback) {
        var self = this;
        if (self.project_id != 0) {
            $("#tree").dynatree({
                initAjax: {
                    url: Global.projectGetMapTree,
                    data: {
                        'data[id]': self.project_id
                    },
                    type: 'post',
                    complete: function () {
                        self.treeLoaded = true;
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
                    mapManager.id = id;
                    var span = $(dtnode.li).children()[0];
                    var map = $(span).hasClass('map');
                    if (map) {
                        mapManager.expand(flag);
                    }
                    else {
                        projectManager.expand(flag);
                    }
                }
            });
        }
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
            self.modal.add(self.getTable());
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
                    ProjectWindow.projectManager.project_id = self.getCheckedProjectId();
                    ProjectWindow.projectManager.reload(function () {
                        self.getModal().close();
                    });
                });
        }
        return self.confirm;
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
            th.val('Nome do projeto');
            tr.add(th);
            self.table.add(tr);
        }
        return self.table;
    },
    add: function (project) {
        var self = this;
        if (project instanceof Project) {
            var table = self.getTable();
            project.setParent(self);
            table.add(project);
            self.projects.push(project);
        }
    },
    getCheckedId: function () {
        var self = this;
        for (var i = 0; i < self.projects.length; i++) {
            if (self.projects[i].checked) {
                return self.projects[i].id;
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
                type('button').
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
    checkName: function () {
        var self = this;
        var name = self.getInputName().val();
        var warning = self.getAlertWarning();
        var confirm = self.getConfirm();
        if (name != '') {
            if (self.validator.nameExp.test(name)) {
                self.validator.validateProjectName(name);
            }
            else {
                $(warning).html('Esse nome de projeto é inválido');
                $(warning).show();
                $(confirm).attr('disabled', true);
            }
        }
        else {
            $(warning).html('O nome do projeto não pode ser vazio');
            $(warning).show();
            $(confirm).attr('disabled', true);
        }
    },
    getModal: function () {
        var self = this;
        if (self.modal == null) {
            self.modal = new Modal();
            self.modal.setTitle('Novo Projeto');
        }
        return self.modal;
    },
    getWarning: function () {
        var self = this;
        if (self.warning == null) {
            self.warning = new Tag('div');
            self.warning.
                addClass('col-md-12 form-group alert alert-warning').
                prop('id', 'alert-project-exists').
                hide();
        }
        return self.warning;
    }
};
