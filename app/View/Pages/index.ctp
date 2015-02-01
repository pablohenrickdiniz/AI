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

    $('#map-create-action').click(function () {
        $('#map-create-form').submit();
    });

    $('#map-update-action').click(function () {
        $('#map-update-form').submit();
    });

    $('#resources').click(function(){
        resourcesManager.openModal();
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
        success: false,
        copy: 0,
        createMap: function () {
            var self = this;
            if (!self.creating) {
                self.creating = true;
                var data = {
                    'data[Map][name]': $('#map-name-create').val(),
                    'data[Map][display]': $('#map-display-create').val(),
                    'data[Map][width]': $('#map-width-create').val(),
                    'data[Map][height]': $('#map-height-create').val(),
                    'data[Map][scroll]': $('#map-scroll-create').val()
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
                $.ajax({
                    url: '<?=$this->Html->url(array('controller'=>'map','action'=>'edit'))?>',
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
            $('#map-update-modal').modal('hide');
            this.closeUpdateAlerts();
        }
    };

    var nomeMapa = /^[A-Za-z]+[A-Za-z0-9]+$/;

    var updateMapValidator = new FormValidator('map-update-form', [
        {
            name: 'map-name-update',
            display: 'O nome do mapa é obrigatório',
            rules: 'required|nomeMapa'
        },
        {
            name: 'map-display-update',
            display: 'O nome de apresentação é obrigatório',
            rules: 'required|nomeMapa'
        },
        {
            name: 'map-height-update',
            display: 'A altura do mapa deve ser um inteiro entre 10 e 1000',
            rules: 'required|integer|greater_than[9]|less_than[1001]'
        },
        {
            name: 'map-width-update',
            display: 'A largura do mapa deve ser um inteiro entre 10 e 1000',
            rules: 'required|integer|greater_than[9]|less_than[1001]'
        },
        {
            name: 'map-scroll-update',
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

    var createMapValidator = new FormValidator('map-create-form', [
        {
            name: 'map-name-create',
            display: 'O nome do mapa é obrigatório',
            rules: 'required|nomeMapa'
        },
        {
            name: 'map-display-create',
            display: 'O nome de apresentação é obrigatório',
            rules: 'required|nomeMapa'
        },
        {
            name: 'map-height-create',
            display: 'A altura do mapa deve ser um inteiro entre 10 e 1000',
            rules: 'required|integer|greater_than[9]|less_than[1001]'
        },
        {
            name: 'map-width-create',
            display: 'A largura do mapa deve ser um inteiro entre 10 e 1000',
            rules: 'required|integer|greater_than[9]|less_than[1001]'
        },
        {
            name: 'map-scroll-create',
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
            else if (key == 'copy') {
                mapManager.copy = mapManager.id;
            }
            else if (key == 'paste') {
                mapManager.paste();
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

    $('.categoria-item').click(function(){
        var id = $(this).attr('categoria-id');
        resourcesManager.selectedList = id;
        resourcesManager.updateSelectedList();
        $('.categoria-item').removeClass('active');
        $(this).addClass('active');
    });

    var resourcesManager = {
        updating:false,
        selectedList:<?=$selected_list?>,
        loadResources:function(){

        },
        openModal:function(){
            $('#resources-modal').modal();
        },
        closeModal:function(){
            $('#resources-modal').modal('hide');
        },
        updateSelectedList:function(){
            var self = this;
            if(!self.updating){
                self.updating = true;
                $.ajax({
                    url:'<?=$this->Html->url(array('controller'=>'project','action'=>'setSelectedList'))?>',
                    type:'post',
                    data:{
                        'data[id]':projectManager.project_id,
                        'data[listindex]':self.selectedList
                    },
                    success:function(data){
                        data = $.parseJSON(data)
                        if(data.success){

                        }
                    },
                    complete:function(){
                        self.updating =false;
                    }
                });
            }
        }
    };
});
</script>
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
<div class="modal" id="create-map-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <form action="#" id="map-create-form" name="map-create-form">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Novo Mapa</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="form-group col-md-6">
                            <input type="text" id="map-name-create" name="map-name-create" class="form-control"
                                   placeholder="Nome"/>
                        </div>
                        <div class="form-group col-md-6">
                            <input type="text" name="map-display-create" id="map-display-create"
                                   class="form-control"
                                   placeholder="Nome de apresentação"/>
                        </div>
                        <div class="form-group col-md-6">
                            <input type="number" id="map-width-create" placeholder="Altura" name="map-width-create"
                                   class="form-control" min="10" max="1000" value="10"/>
                        </div>
                        <div class="form-group col-md-6">
                            <input type="number" id="map-height-create" placeholder="Largura"
                                   name="map-height-create"
                                   class="form-control" min="10" max="1000" value="10"/>
                        </div>
                        <div class="form-group col-md-12">
                            <select id="map-scroll-create" class="form-control" name="map-scroll-create">
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
                    <button id="map-create-action" type="button" class="btn btn-default">Criar
                    </button>
                    <button id="cancel-new-map" type="button" class="btn btn-primary" data-dismiss="modal">
                        Cancelar
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
<div class="modal" id="map-update-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <form action="#" id="map-update-form" name="map-update-form">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Alterar Mapa</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="form-group col-md-6">
                            <input type="text" id="map-name-update" name="map-name-update" class="form-control"
                                   placeholder="Nome"/>
                        </div>
                        <div class="form-group col-md-6">
                            <input type="text" name="map-display-update" id="map-display-update"
                                   class="form-control"
                                   placeholder="Nome de apresentação"/>
                        </div>
                        <div class="form-group col-md-6">
                            <input type="number" id="map-height-update" placeholder="Altura"
                                   name="map-height-update""
                            class="form-control" min="10" max="1000" value="10"/>
                        </div>
                        <div class="form-group col-md-6">
                            <input type="number" id="map-width-update" placeholder="Largura" name="map-width-update"
                                   class="form-control" min="10" max="1000" value="10"/>
                        </div>
                        <div class="form-group col-md-12">
                            <select id="map-scroll-update" class="form-control" name="map-scroll-update">
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
                    <button id="map-update-action" type="button" class="btn btn-default">Atualizar
                    </button>
                    <button id="cancel-update-map" type="button" class="btn btn-primary" data-dismiss="modal">
                        Cancelar
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
<div class="modal" id="resources-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Recursos</h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-4">
                        <table class="table table-bordered" id="table-resources">
                            <?php foreach($categorias as $key => $categoria):?>
                            <tr>
                                <th class="categoria-item <?=$key==$selected_list?'active':''?>" categoria-id="<?=$key?>"><?=$categoria?></th>
                            </tr>
                            <?php endforeach;?>
                        </table>
                    </div>
                    <div class="col-md-5" id="resources-list">
                        <table class="table table-bordered">
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                            <tr>
                                <th>teste</th>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <input type="button" value="Importar" class="form-control btn btn-default"/>
                        </div>
                        <div class="form-group">
                            <input type="button" value="Apagar" class="form-control btn btn-default"/>
                        </div>
                        <div class="form-group">
                            <input type="button" value="Pré-visualização" class="form-control btn btn-default"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<nav class="navbar navbar-default" id="navbar-editor">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-2">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>

        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
            <ul class="nav navbar-nav">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Projeto
                        <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#" id="new-project"><span class="fa  fa-file-o"></span>&nbsp;&nbsp;Novo</a></li>
                        <li><a href="#" id="open-project"><span
                                    class="fa  fa-folder-open-o"></span>&nbsp;&nbsp;Abrir</a></li>
                        <li><a href="#"><span class="fa  fa-floppy-o"></span>&nbsp;&nbsp;Salvar</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Editar
                        <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#"><span class="fa  fa-scissors"></span>&nbsp;&nbsp;Recortar</a></li>
                        <li><a href="#"><span class="fa  fa-copy"></span>&nbsp;&nbsp;Copiar</a></li>
                        <li><a href="#"><span class="fa  fa-paste"></span>&nbsp;&nbsp;Colar</a></li>
                        <li><a href="#"><span class="fa  fa-eraser"></span>&nbsp;&nbsp;Apagar</a></li>
                        <li><a href="#"><span class="fa  fa-repeat"></span>&nbsp;&nbsp;Desfazer</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Modo
                        <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#"><span class="fa  fa-picture-o"></span>&nbsp;&nbsp;Mapa</a></li>
                        <li><a href="#"><span class="fa  fa-user"></span>&nbsp;&nbsp;Evento</a></li>
                        <li><a href="#"><span class="fa  fa-th"></span>&nbsp;&nbsp;Região</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Desenho
                        <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#"><span class="fa  fa-pencil"></span>&nbsp;&nbsp;Lápis</a></li>
                        <li><a href="#"><span class="fa  fa-square"></span>&nbsp;&nbsp;Retângulo</a></li>
                        <li><a href="#"><span class="fa  fa-circle"></span>&nbsp;&nbsp;Círculo</a></li>
                        <li><a href="#"><span class="fa  fa-tint"></span>&nbsp;&nbsp;Preencher</a></li>
                        <li><a href="#"><span class="fa  fa-pencil-square"></span>&nbsp;&nbsp;Sombra</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Ferramentas
                        <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#"><span class="fa  fa-database"></span>&nbsp;&nbsp;Banco de dados</a></li>
                        <li><a href="#" id="resources"><span class="fa  fa-server"></span>&nbsp;&nbsp;Recursos</a></li>
                        <li><a href="#"><span class="fa  fa-file-code-o"></span>&nbsp;&nbsp;Editor de script</a></li>
                        <li><a href="#"><span class="fa  fa-music"></span>&nbsp;&nbsp;Música</a></li>
                        <li><a href="#"><span class="fa  fa-street-view"></span>&nbsp;&nbsp;Gerador de Caracters</a>
                        </li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Jogo
                        <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#"><span class="fa  fa-play"></span></a></li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </div>
    <!-- /.container-fluid -->
</nav>
<div class="row">
    <div class="col-md-12">
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
</div>
