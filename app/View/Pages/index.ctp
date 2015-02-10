<?=$this->Import->script('DOMOBJ',true)?>
<script type="text/javascript">
    Global = {
        projectAddAction:'<?=$this->Html->url(array('controller'=>'project','action'=>'addAjax'))?>',
        projectExpand:'<?=$this->Html->url(array('controller'=>'project','action'=>'expand'))?>',
        projectGetAll:'<?=$this->Html->url(array('controller'=>'project','action'=>'getAll'))?>',
        projectGetMapTree:'<?=$this->Html->url(array('controller'=>'project','action'=>'getMapTree'))?>',
        mapAddAction:'<?=$this->Html->url(array('controller'=>'map','action'=>'add'))?>',
        mapEditAction:'<?=$this->Html->url(array('controller'=>'map','action'=>'edit'))?>',
        mapDeleteAction:'<?=$this->Html->url(array('controller'=>'map','action'=>'delete'))?>',
        mapLoadMap:'<?=$this->Html->url(array('controller'=>'map','action'=>'loadMap'))?>',
        mapExpand:'<?=$this->Html->url(array('controller'=>'map','action'=>'expand'))?>',
        projectId:<?=$project_id?>
    };
</script>
<?=$this->Html->script('InterfaceElements')?>
<script type="text/javascript">
$(document).ready(function () {
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


    ProjectWindow.projectManager.loadProject();

    $("#new-project").click(function () {
        $("#new-project-modal").modal();
        $('#new-project-name').val('');
    });

    $('#open-project').click(function () {
        ProjectWindow.projectManager.loadProjects(function () {
            $('#open-project-modal').modal();
        });
    });

    $('#resources').click(function () {
        resourcesManager.openModal();
    });

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
        try{
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
                newMapModal.create();
            }
        }
        catch(ex){
            console.log(ex);
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

    $('.categoria-item').click(function () {
        var id = $(this).attr('categoria-id');
        resourcesManager.selectedList = id;
        resourcesManager.updateSelectedList();
        $('.categoria-item').removeClass('active');
        $(this).addClass('active');
    });


    $('#import-resource').click(function () {
        resourcesManager.openImport();
    });

    var resourcesManager = {
        updating: false,
        selectedList:<?=$selected_list?>,
        loadResources: function () {

        },
        openImport: function () {
            $('#resource-create-modal').modal();
        },
        openModal: function () {
            $('#resources-modal').modal();
        },
        closeModal: function () {
            $('#resources-modal').modal('hide');
        },
        updateSelectedList: function () {
            var self = this;
            if (!self.updating) {
                self.updating = true;
                $.ajax({
                    url: '<?=$this->Html->url(array('controller'=>'project','action'=>'setSelectedList'))?>',
                    type: 'post',
                    data: {
                        'data[id]': projectManager.project_id,
                        'data[listindex]': self.selectedList
                    },
                    success: function (data) {
                        data = $.parseJSON(data)
                        if (data.success) {

                        }
                    },
                    complete: function () {
                        self.updating = false;
                    }
                });
            }
        }
    };
});
</script>
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
                            <?php foreach ($categorias as $key => $categoria): ?>
                                <tr>
                                    <th class="categoria-item <?= $key == $selected_list ? 'active' : '' ?>"
                                        categoria-id="<?= $key ?>"><?= $categoria ?></th>
                                </tr>
                            <?php endforeach; ?>
                        </table>
                    </div>
                    <div class="col-md-5" id="resources-list">
                        <table class="table table-bordered">

                        </table>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <input id="import-resource" type="button" value="Importar"
                                   class="form-control btn btn-default"/>
                        </div>
                        <div class="form-group">
                            <input id="delete-resurce" type="button" value="Apagar"
                                   class="form-control btn btn-default"/>
                        </div>
                        <div class="form-group">
                            <input id="view-resource" type="button" value="Pré-visualização"
                                   class="form-control btn btn-default"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal" id="resource-create-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <form action="#" id="resource-create-form" name="resource-create-form">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Novo Recurso</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="form-group col-md-12">
                            <input type="text" name="resource-name" id="resource-create-name" class="form-control"
                                   required="true"/>
                        </div>
                        <div class="form-group col-md-12">
                            <input type="file" name="resource-file" id="resource-create-file" class="form-control"
                                   required="true"/>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="resource-create-action" type="button" class="btn btn-default">Próximo
                    </button>
                    <button id="resource-cancel-action" type="button" class="btn btn-primary" data-dismiss="modal">
                        Cancelar
                    </button>
                </div>
            </div>
        </form>
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
