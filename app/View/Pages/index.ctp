<script type="text/javascript">
$(document).ready(function () {
    $("#new-project").click(function () {
        $("#new-project-modal").modal();
        $('#new-project-name').val('');
    });

    $('#open-project').click(function () {
        projectManager.loadProjects(function () {
            $('#open-project-modal').modal();
        });
    });

    $("#cancel-new-project").click(function () {
        $("#new-project-modal").modal('hide');
    });

    $('#cancel-open-project').click(function () {
        $('#open-project-modal').modal('hide');
    });

    $('#cancel-new-map').click(function () {
        mapManager.closeModal();
    });

    $('#create-new-project').click(function () {
        projectManager.createProject();
    });

    $(document).on('click', '.project-list-item', function () {
        var selfInput = $(this).find('input');
        $(selfInput).prop('checked', true);
    });


    $('#open-project-action').click(function () {
        var id = $('input[name=project]:checked').val();
        projectManager.project_id = id;
        projectManager.clear();
        projectManager.loadProject();
    });

    var checkProjectName = function () {
        var name = $(this).val().trim();
        if (name != '') {
            if (validator.nameExp.test(name)) {
                validator.validateProjectName(name);
            }
            else {
                $('#alert-project-exists').html('Esse nome de projeto é inválido');
                $('#alert-project-exists').show();
                $('#create-new-project').attr('disabled', true);
            }
        }
        else {
            $('#alert-project-exists').html('O nome do projeto não pode ser vazio');
            $('#alert-project-exists').show();
            $('#create-new-project').attr('disabled', true);
        }
    };

    $('#new-project-name').change(checkProjectName);
    $('#new-project-name').keyup(checkProjectName)
    $('#new-project-name').focus(checkProjectName);

    var validator = {
        checking: false,
        checkinglist: [],
        nameExp: /^[a-zA-z]+[0-9a-zA-z]+$/,
        validateProjectName: function (name) {
            this.checkinglist.push(name);
            if (!this.checking) {
                this.checking = true;
                this.checkName();
            }
        },
        checkName: function () {
            var name = this.checkinglist.pop();
            this.checkinglist = [];
            this.checking = true;
            var self = this;
            $.ajax({
                url: '<?=$this->Html->url(array('controller'=>'project','action'=>'exists'))?>',
                type: 'post',
                data: {
                    'data[name]': name
                },
                success: function (data) {
                    data = $.parseJSON(data);
                    if (data.exists) {
                        $('#alert-project-exists').html('Já existe um projeto com este nome!');
                        $('#alert-project-exists').show();
                    }
                    else {
                        $('#alert-project-exists').hide();
                    }
                    $('#create-new-project').attr('disabled', data.exists);
                },
                complete: function () {
                    if (self.checkinglist.length > 0) {
                        self.checkName();
                    }
                    else {
                        self.checking = false;
                    }
                }
            });
        }
    };


    var projectManager = {
        project_id: <?=$project_id?>,
        loading: false,
        treeLoaded: false,
        createProject: function () {
            var self = this;
            var name = $('#new-project-name').val();
            if (validator.nameExp.test(name)) {
                $('#create-new-project').attr('disabled', true);
                $.ajax({
                    url: '<?=$this->Html->url(array('controller'=>'project','action'=>'addAjax'))?>',
                    type: 'post',
                    data: {
                        'data[name]': name
                    },
                    success: function (data) {
                        data = $.parseJSON(data);
                        if (data.success) {
                            $('#new-project-modal').modal('hide');
                            self.project_id = data.id;
                            self.reload();
                        }
                    },
                    complete: function () {
                        $('#create-new-project').attr('disabled', false);
                    }
                });
            }
        },
        loadProjects: function (callback) {
            var self = this;
            if (!self.loading) {
                $.ajax({
                    url: '<?=$this->Html->url(array('controller'=>'project','action'=>'getAll'))?>',
                    type: 'post',
                    success: function (data) {
                        data = $.parseJSON(data);
                        $('#open-project-select').find('tr > td').remove();
                        for (var i = 0; i < data.Project.length; i++) {
                            var project = data.Project[i];
                            var tr = document.createElement('tr');
                            var td = document.createElement('td');
                            var td2 = document.createElement('td');
                            var radio = document.createElement('input');
                            $(radio).attr('type', 'radio').attr('name', 'project').val(project.id);
                            $(td2).append(radio);
                            $(td).html(project.nome);
                            $(tr).append(td, td2).attr('class', 'project-list-item');
                            $('#open-project-select').append(tr);
                        }
                    },
                    complete: function () {
                        callback();
                    }
                });
            }
        },
        reload: function () {
            var self = this;
            if (self.treeLoaded) {
                self.clear();
            }

            self.loadProject();
        },
        clear: function () {
            $("#tree").dynatree("destroy");
        },
        expand: function (expand) {
            var self = this;
            if (!self.loading) {
                self.loading = true;
                $.ajax({
                    url: '<?=$this->Html->url(array('controller'=>'project','action'=>'expand'))?>',
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
        loadProject: function () {
            var self = this;
            if (self.project_id != 0) {
                $("#tree").dynatree({
                    initAjax: {
                        url: '<?=$this->Html->url(array('controller'=>'project','action'=>'getMapTree'))?>',
                        data: {
                            'data[id]': self.project_id
                        },
                        type: 'post',
                        complete: function () {
                            self.treeLoaded = true;
                        }
                    },
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


    $(document).on('mousedown', '.dynatree-node', function (event) {
        if (event.which == 3) {
            var id = $(this).parent().prop('id');
            id = id.split(':')[1];
            mapManager.id = id;
            mapManager.node = $(this).parent();
            if ($(this).hasClass('map')) {
                mapManager.type = 'map';
            }
            else if ($(this).hasClass('project')) {
                mapManager.type = 'project';
            }
        }
    });

    projectManager.loadProject();

    var mapManager = {
        id: 0,
        type: '',
        creating: false,
        node: null,
        success:false,
        createMap: function () {
            var self = this;
            if (!self.creating) {
                self.creating = true;
                var data = {
                    'data[Map][name]': $('#nome-mapa').val(),
                    'data[Map][display_name]': $('#nome-apresentacao').val(),
                    'data[Map][altura]': $('#mapa-altura').val(),
                    'data[Map][largura]': $('#mapa-largura').val(),
                    'data[Map][loop]': $('#mapa-loop').val()
                };

                if (self.type == 'project') {
                    data['data[Map][project_id]'] = self.id;
                }
                else {
                    data['data[Map][parent_id]'] = self.id;
                }

                $.ajax({
                    url: '<?=$this->Html->url(array('controller'=>'map','action'=>'add'))?>',
                    type: 'post',
                    data: data,
                    success: function (data) {
                        data = $.parseJSON(data);
                        if (data.success) {
                            var tree = $("#tree").dynatree("getTree");
                            var node = tree.getNodeByKey(mapManager.id);
                            if (node != null) {
                                node.addChild(data.node);
                            }
                            self.closeModal();
                        }
                        else {
                            self.showError();
                        }
                    },
                    complete: function () {
                        self.creating = false;
                    }
                });
            }
        },
        updateMap: function () {
            var self = this;
            if (!self.creating) {
                self.creating = true;
                var data = {
                    'data[Map][name]': $('#nome-mapa').val(),
                    'data[Map][display_name]': $('#nome-apresentacao').val(),
                    'data[Map][altura]': $('#mapa-altura').val(),
                    'data[Map][largura]': $('#mapa-largura').val(),
                    'data[Map][loop]': $('#mapa-loop').val()
                };

                if (self.type == 'project') {
                    data['data[Map][project_id]'] = self.id;
                }
                else {
                    data['data[Map][parent_id]'] = self.id;
                }

                $.ajax({
                    url: '<?=$this->Html->url(array('controller'=>'map','action'=>'add'))?>',
                    type: 'post',
                    data: data,
                    success: function (data) {
                        data = $.parseJSON(data);
                        if (data.success) {
                            self.closeUpdateModal();
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
                    url: '<?=$this->Html->url(array('controller'=>'map','action'=>'delete'))?>',
                    type: 'post',
                    data: {
                        'data[id]': self.id
                    },
                    success: function (data) {
                        data = $.parseJSON(data);
                        if (data.success) {
                            var tree = $('#tree').dynatree('getTree');
                            var node = tree.getNodeByKey(mapManager.id);
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
                    url: '<?=$this->Html->url(array('controller'=>'map','action'=>'loadMap'))?>',
                    type: 'post',
                    data: {
                        'data[id]': self.id
                    },
                    success: function (data) {
                        data = $.parseJSON(data);
                        if (data.success) {
                            console.log(data);
                            var map = data.map;
                            self.success = true;
                            $('#nome-mapa-update').val(map.Map.name);
                            $('#nome-apresentacao-update').val(map.Map.display);
                            $('#mapa-altura-update').val(map.Map.width);
                            $('#mapa-largura-update').val(map.Map.height);
                            $('#mapa-loop-update').val(map.Map.scroll);
                        }
                    },
                    complete:function(){
                        if(self.success){
                            $('#edit-map-modal').modal();
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
                    url: '<?=$this->Html->url(array('controller'=>'map','action'=>'expand'))?>',
                    type: 'post',
                    data: {
                        'data[id]': mapManager.id,
                        'data[expand]': expand
                    },
                    complete: function () {
                        self.creating = false;
                    }
                });
            }
        },
        showSuccess: function () {
            $('#create-map-warning').hide();
            $('#create-map-error').hide();
            $('#create-map-success').show();
        },
        showError: function () {
            $('#create-map-success').hide();
            $('#create-map-warning').hide();
            $('#create-map-error').show();
        },
        showUpdateError: function () {
            $('#update-map-success').hide();
            $('#update-map-warning').hide();
            $('#update-map-error').show();
        },
        showWarnings: function () {
            $('#create-map-success').hide();
            $('#create-map-error').hide();
            $('#create-map-warning').show();
        },
        showUpdateWarnings: function () {
            $('#update-map-success').hide();
            $('#update-map-error').hide();
            $('#update-map-warning').show();
        },
        closeAlerts: function () {
            $('#create-map-success').hide();
            $('#create-map-error').hide();
            $('#create-map-warning').hide();
        },
        closeUpdateAlerts: function () {
            $('#update-map-success').hide();
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
            $('#create-map-modal').modal('hide');
            $('#create-map-modal').find('input[type!=number]').val('');
            $('#create-map-modal').find('input[type=number]').val(10);
            this.closeAlerts();
        },
        closeUpdateModal: function () {
            $('#update-map-modal').modal('hide');
            $('#update-map-modal').find('input[type!=number]').val('');
            $('#update-map-modal').find('input[type=number]').val(10);
            this.closeUpdateAlerts();
        }
    };

    var nomeMapa = /^[A-Za-z]+[A-Za-z0-9]+$/;

    var updateMapValidator = new FormValidator('update-map-form', [
        {
            name: 'nome-mapa',
            display: 'O nome do mapa é obrigatório',
            rules: 'required|nomeMapa'
        },
        {
            name: 'nome-apresentacao',
            display: 'O nome de apresentação é obrigatório',
            rules: 'required|nomeMapa'
        },
        {
            name: 'mapa-altura',
            display: 'A altura do mapa deve ser um inteiro entre 10 e 1000',
            rules: 'required|integer|greater_than[9]|less_than[1001]'
        },
        {
            name: 'mapa-largura',
            display: 'A largura do mapa deve ser um inteiro entre 10 e 1000',
            rules: 'required|integer|greater_than[9]|less_than[1001]'
        },
        {
            name: 'mapa-loop',
            display: 'loop do mapa',
            rules: 'required|greater_than[-1]|less_than[4]'
        }
    ], function (errors, event) {
        if (errors.length > 0) {
            var message = '';
            for (var i = 0; i < errors.length; i++) {
                message += '* ' + errors[i].message + '<br>';
            }
            mapManager.setUpdateWarningMessage(message);
            mapManager.showUpdateWarnings();
        }
        else {
            mapManager.closeUpdateAlerts();
            mapManager.updateMap();
        }
        event.preventDefault();
    });

    var createMapValidator = new FormValidator('create-map-form', [
        {
            name: 'nome-mapa',
            display: 'O nome do mapa é obrigatório',
            rules: 'required|nomeMapa'
        },
        {
            name: 'nome-apresentacao',
            display: 'O nome de apresentação é obrigatório',
            rules: 'required|nomeMapa'
        },
        {
            name: 'mapa-altura',
            display: 'A altura do mapa deve ser um inteiro entre 10 e 1000',
            rules: 'required|integer|greater_than[9]|less_than[1001]'
        },
        {
            name: 'mapa-largura',
            display: 'A largura do mapa deve ser um inteiro entre 10 e 1000',
            rules: 'required|integer|greater_than[9]|less_than[1001]'
        },
        {
            name: 'mapa-loop',
            display: 'loop do mapa',
            rules: 'required|greater_than[-1]|less_than[4]'
        }
    ], function (errors, event) {
        if (errors.length > 0) {
            var message = '';
            for (var i = 0; i < errors.length; i++) {
                message += '* ' + errors[i].message + '<br>';
            }
            mapManager.setWarningMessage(message);
            mapManager.showWarnings();
        }
        else {
            mapManager.closeAlerts();
            mapManager.createMap();
        }
        event.preventDefault();
    });


    $.contextMenu({
        selector: '.map',
        callback: function (key, options) {
            if (key == 'new') {
                $('#create-map-modal').modal();
            }
            else if (key == 'edit') {
                mapManager.loadEdit();
            }
            else if (key == 'delete') {
                mapManager.deleteMap();
            }
        },
        items: {
            "edit": {name: "Alterar propriedades", icon: "edit"},
            'sp1': '-----------',
            'new': {name: 'Novo Mapa', icon: "add"},
            'sp2': '-----------',
            "copy": {name: "Copiar", icon: "copy"},
            "paste": {name: "Colar", icon: "paste"},
            "delete": {name: "Apagar", icon: "delete"}
        }
    });

    $.contextMenu({
        selector: '.project',
        callback: function (key, options) {
            if (key == 'new') {
                $('#create-map-modal').modal();
            }
        },
        items: {
            'new': {name: 'Novo Mapa', icon: "add"},
            'sp2': '-----------',
            "copy": {name: "Copiar", icon: "copy"},
            "paste": {name: "Colar", icon: "paste"},
            "delete": {name: "Apagar", icon: "delete"}
        }
    });
});
</script>
<div class="row">
    <div class="modal" id="new-project-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
         aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Novo projeto</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label for="new-project-name">Nome do projeto</label>
                            <input id="new-project-name" type="text" class="form-control"/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 form-group alert alert-warning" id="alert-project-exists"
                             style="display:none;">

                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="create-new-project" type="button" class="btn btn-default" data-dismiss="modal">Criar
                    </button>
                    <button id="cancel-new-project" type="button" class="btn btn-primary">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="modal" id="open-project-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
         aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Abrir Projeto</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group" style="overflow-x:hidden;height:200px;">
                            <table id="open-project-select" class="table table-striped">
                                <tr>
                                    <th>Nome do projeto</th>
                                    <th></th>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 form-group alert alert-warning" id="alert-project-exists"
                             style="display:none;">

                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="open-project-action" type="button" class="btn btn-default" data-dismiss="modal">Abrir
                    </button>
                    <button id="cancel-open-project" type="button" class="btn btn-primary">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="modal" id="create-map-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
         aria-hidden="true">
        <div class="modal-dialog">
            <form action="#" id="create-map-form" name="create-map-form">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Novo Mapa</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="form-group col-md-6">
                                <input type="text" id="nome-mapa" name="nome-mapa" class="form-control"
                                       placeholder="Nome"/>
                            </div>
                            <div class="form-group col-md-6">
                                <input type="text" name="nome-apresentacao" id="nome-apresentacao" class="form-control"
                                       placeholder="Nome de apresentação"/>
                            </div>
                            <div class="form-group col-md-6">
                                <input type="number" id="mapa-altura" placeholder="Altura" name="mapa-altura"
                                       class="form-control" min="10" max="1000" value="10"/>
                            </div>
                            <div class="form-group col-md-6">
                                <input type="number" id="mapa-largura" placeholder="Largura" name="mapa-largura"
                                       class="form-control" min="10" max="1000" value="10"/>
                            </div>
                            <div class="form-group col-md-12">
                                <select id="mapa-loop" class="form-control" name="mapa-loop">
                                    <option value="0">Sem Loop</option>
                                    <option value="1">Loop Vertical</option>
                                    <option value="2">Loop Horizontal</option>
                                    <option value="3">Loop Vertical e Horizontal</option>
                                </select>
                            </div>
                        </div>
                        <div class="alert alert-warning" id="create-map-warning" style="display:none;">

                        </div>
                        <div class="alert alert-success" id="create-map-success" style="display:none;">
                            Mapa criado com sucesso
                        </div>
                        <div class="alert alert-danger" id="create-map-error" style="display:none;">
                            Erro ao tentar criar mapa!
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="create-map-action" type="button" class="btn btn-default">Criar
                        </button>
                        <button id="cancel-new-map" type="button" class="btn btn-primary" data-dismiss="modal">
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<div class="row">
    <div class="modal" id="edit-map-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
         aria-hidden="true">
        <div class="modal-dialog">
            <form action="#" id="edit-map-form" name="edit-map-form">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Alterar Mapa</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="form-group col-md-6">
                                <input type="text" id="nome-mapa-update" name="nome-mapa" class="form-control"
                                       placeholder="Nome"/>
                            </div>
                            <div class="form-group col-md-6">
                                <input type="text" name="nome-apresentacao-update" id="nome-apresentacao" class="form-control"
                                       placeholder="Nome de apresentação"/>
                            </div>
                            <div class="form-group col-md-6">
                                <input type="number" id="mapa-altura-update" placeholder="Altura" name="mapa-altura"
                                       class="form-control" min="10" max="1000" value="10"/>
                            </div>
                            <div class="form-group col-md-6">
                                <input type="number" id="mapa-largura-update" placeholder="Largura" name="mapa-largura"
                                       class="form-control" min="10" max="1000" value="10"/>
                            </div>
                            <div class="form-group col-md-12">
                                <select id="mapa-loop-update" class="form-control" name="mapa-loop">
                                    <option value="0">Sem Loop</option>
                                    <option value="1">Loop Vertical</option>
                                    <option value="2">Loop Horizontal</option>
                                    <option value="3">Loop Vertical e Horizontal</option>
                                </select>
                            </div>
                        </div>
                        <div class="alert alert-warning" id="update-map-warning" style="display:none;">

                        </div>
                        <div class="alert alert-success" id="update-map-success" style="display:none;">
                            Mapa atualizado com sucesso
                        </div>
                        <div class="alert alert-danger" id="update-map-error" style="display:none;">
                            Erro ao tentar atualizar mapa!
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="update-map-action" type="button" class="btn btn-default">Atualizar
                        </button>
                        <button id="cancel-update-map" type="button" class="btn btn-primary" data-dismiss="modal">
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <ul class="nav navbar-nav tools">
            <li><a href="#" id="new-project"><span class="fa  fa-file-o"></span></a></li>
            <li><a href="#" id="open-project"><span class="fa  fa-folder-open-o"></span></a></li>
            <li><a href="#"><span class="fa  fa-floppy-o"></span></a></li>
            <li><a href="#"><span class="fa  fa-scissors"></span></a></li>
            <li><a href="#"><span class="fa  fa-copy"></span></a></li>
            <li><a href="#"><span class="fa  fa-paste"></span></a></li>
            <li><a href="#"><span class="fa  fa-eraser"></span></a></li>
            <li><a href="#"><span class="fa  fa-repeat"></span></a></li>
            <li><a href="#"><span class="fa  fa-picture-o"></span></a></li>
            <li><a href="#"><span class="fa  fa-user"></span></a></li>
            <li><a href="#"><span class="fa  fa-th"></span></a></li>
            <li><a href="#"><span class="fa  fa-pencil"></span></a></li>
            <li><a href="#"><span class="fa  fa-square"></span></a></li>
            <li><a href="#"><span class="fa  fa-circle"></span></a></li>
            <li><a href="#"><span class="fa  fa-tint"></span></a></li>
            <li><a href="#"><span class="fa  fa-pencil-square"></span></a></li>
            <li><a href="#"><span class="fa  fa-database"></span></a></li>
            <li><a href="#"><span class="fa  fa-server"></span></a></li>
            <li><a href="#"><span class="fa  fa-file-code-o"></span></a></li>
            <li><a href="#"><span class="fa  fa-music"></span></a></li>
            <li><a href="#"><span class="fa  fa-street-view"></span></a></li>
            <li><a href="#"><span class="fa  fa-play"></span></a></li>

        </ul>
    </div>
</div>
<div class="row">
    <div id="container-a">
        <div id="tileset-container">

        </div>
        <div id="map-container">
            <div id="tree">

            </div>
        </div>
    </div>
    <div id="container-b">

    </div>
</div>