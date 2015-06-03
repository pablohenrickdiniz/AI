<?= $this->Html->script('uuid')?>
<?= $this->Html->script('jquery.form.min')?>
<?= $this->Html->script('MouseReader') ?>
<?= $this->Html->script('jquery-mask') ?>
<!--<?= $this->Import->script('DOMOBJ', true) ?>-->
<?= $this->Html->css('index')?>
<?= $this->Html->script('react/react')?>
<?= $this->Html->script('react/build/modal')?>
<?= $this->Html->script('react/build/dropdown')?>
<?= $this->Html->script('react/build/dropdownitem')?>
<?= $this->Html->script('react/build/tabpanel')?>
<?= $this->Html->script('react/build/tabpane')?>
<?= $this->Html->script('react/build/tablistitem')?>
<?= $this->Html->script('react/build/navbar')?>
<?= $this->Html->script('react/build/alert')?>
<?= $this->Html->script('react/build/main')?>
<script type="text/javascript">
    var Global = {
        resources: {
            children: '<?=$this->Html->url(array('controller'=>'resource','action'=>'getResourcesTree'))?>',
            add:'<?=$this->Html->url(array('controller' => 'resource','action'=>'addAjax'))?>'
        },
        project: {
            id:'<?=$project_id?>',
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
                ResourcesManager.id = id;
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
<div id="content">

</div>
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
