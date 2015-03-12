<?= $this->Html->script('MouseReader') ?>
<?= $this->Html->script('jquery-mask') ?>
<?= $this->Import->script('DOMOBJ', true) ?>
<?= $this->Html->css('index')?>
<script type="text/javascript">
    var Global = {
        resources: {
            children: '<?=$this->Html->url(array('controller'=>'resource','action'=>'getResourcesTree'))?>',
            add:'<?=$this->Html->url(array('controller' => 'resource','action'=>'addAjax'))?>'
        },
        project: {
            id:<?=$project_id?>,
            add: '<?=$this->Html->url(array('controller'=>'project','action'=>'addAjax'))?>',
            expand: '<?=$this->Html->url(array('controller'=>'project','action'=>'expand'))?>',
            all: '<?=$this->Html->url(array('controller'=>'project','action'=>'getAll'))?>',
            mapTree: '<?=$this->Html->url(array('controller'=>'project','action'=>'getMapTree'))?>',
            exists: '<?=$this->Html->url(array('controller'=>'project','action'=>'exists'))?>',
            children: '<?=$this->Html->url(array('controller'=>'project','action'=>'getChildren'))?>',
        },
        map: {
            add: '<?=$this->Html->url(array('controller'=>'map','action'=>'add'))?>',
            edit: '<?=$this->Html->url(array('controller'=>'map','action'=>'edit'))?>',
            delete: '<?=$this->Html->url(array('controller'=>'map','action'=>'delete'))?>',
            load: '<?=$this->Html->url(array('controller'=>'map','action'=>'load'))?>',
            expand: '<?=$this->Html->url(array('controller'=>'map','action'=>'expand'))?>',
            paste: '<?=$this->Html->url(array('controller'=>'map','action'=>'paste'))?>',
            children: '<?=$this->Html->url(array('controller'=>'map','action'=>'getChildren'))?>'
        },
        pages: {
            isOnline: '<?=$this->Html->url(array('controller'=>'pages','action'=>'isOnline'))?>',
            index: '<?=$this->Html->url('/')?>'
        }
    };

</script>
<?= $this->Html->script('InterfaceElements') ?>
<script type="text/javascript">
    $(document).ready(function () {

        ProjectManager.load();

        $("#new-project").click(function () {
            ProjectManager.create.getModal().open();
        });

        $('#open-project').click(function () {
            ProjectManager.loadProjects(function () {
                ProjectManager.open.getModal().open();
            });
        });

        $('#resources').click(function () {
            ResourcesManager.main.getModal().open();
        });

        $(document).on('mousedown', '.dynatree-node:not(.resource,.resources)', function (event) {
            if (event.which == 3) {
                var id = $(this).parent().prop('id');
                id = id.split(':')[1];
                FolderManager.id = id;
                if ($(this).hasClass('map')) {
                    FolderManager.type = 'map';
                }
                else if ($(this).hasClass('project')) {
                    FolderManager.type = 'project';
                }
            }
        });

        $(document).on('mousedown', '.dynatree-node.resource', function (event) {
            if (event.which == 3) {
                var id = $(this).parent().prop('id');
                id = id.split(':')[1];
                if (id == 8) {
                    ResourcesManager.id = 8;
                }
            }
        });


        $.contextMenu({
            selector: '.resource',
            callback: function (key) {
                if (key == 'new') {
                    ResourcesManager.tileset.getModal().open();
                }
            },
            items: {
                "new": {'name': "Adicionar Recurso", 'icon': 'add'}
            }
        });

        $.contextMenu({
            selector: '.map',
            callback: function (key) {
                if (key == 'new') {
                    MapManager.create.getModal().open();
                }
                else if (key == 'edit') {
                    MapManager.edit.load(function () {
                        var self = this;
                        self.getModal().open();
                    });
                }
                else if (key == 'delete') {
                    MapManager.delete();
                }
                else if (key == 'copy') {
                    MapManager.copy();
                }
                else if (key == 'cut') {
                    MapManager.cut();
                }
                else if (key == 'paste') {
                    MapManager.paste();
                }
            },
            items: {
                "edit": {name: "Alterar propriedades", icon: "edit"},
                'sp1': '-----------',
                'new': {name: 'Novo Mapa', icon: "add"},
                'sp2': '-----------',
                "copy": {name: "Copiar", icon: "copy"},
                "cut": {name: "Recortar", icon: "cut"},
                "paste": {name: "Colar", icon: "paste"},
                "delete": {name: "Apagar", icon: "delete"}
            }
        });

        $.contextMenu({
            selector: '.project',
            callback: function (key) {
                if (key == 'new') {
                    MapManager.create.getModal().open();
                }
                else if (key == 'paste') {
                    MapManager.paste();
                }
            },
            items: {
                'new': {name: 'Novo Mapa', icon: "add"},
                'sp2': '-----------',
                "paste": {name: "Colar", icon: "paste"}
            }
        });

    });
</script>
<nav class="navbar navbar-default" id="navbar-editor">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse"
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
