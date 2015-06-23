<?= $this->Html->css('index') ?>
<?= $this->Html->css('tree2') ?>
<div id="content">

</div>
<div id="tmp">

</div>
<div id="context-menu-container">

</div>
<div id="resources-modal-container">

</div>
<div id="map-editor-container">

</div>
<div id="open-project-modal-container">

</div>
<div id="new-project-modal-container">

</div>
<div id="resource-step-modal-container">

</div>
<div class="row">
    <div class="col-md-12">
        <div id="container-a" class="col-md-3">
            <div id="tileset-container">

            </div>
            <div id="map-container">

            </div>
        </div>
        <div id="container-b" class="col-md-9">
            <div id="canvas-container">

            </div>
        </div>
    </div>
</div>
<?= $this->Html->script('lodash.min')?>
<?= $this->Html->script('uuid') ?>
<?= $this->Html->script('jquery.form.min') ?>
<?= $this->Html->script('jquery-mask') ?>
<script type="text/javascript">
    var Global = {
        resource: {
            children: '<?=$this->Html->url(array('controller'=>'resource','action'=>'getResourcesTree'))?>',
            add: '<?=$this->Html->url(array('controller' => 'resource','action'=>'addAjax'))?>'
        },
        project: {
            id: parseInt('<?=$project_id?>'),
            add: '<?=$this->Html->url(array('controller'=>'project','action'=>'addAjax'))?>',
            expand: '<?=$this->Html->url(array('controller'=>'project','action'=>'expand'))?>',
            all: '<?=$this->Html->url(array('controller'=>'project','action'=>'getAll'))?>',
            mapTree: '<?=$this->Html->url(array('controller'=>'project','action'=>'getMapTree'))?>',
            exists: '<?=$this->Html->url(array('controller'=>'project','action'=>'exists'))?>',
            children: '<?=$this->Html->url(array('controller'=>'project','action'=>'getChildren'))?>',
            delete: '<?=$this->Html->url(array('controller'=>'project','action'=>'deleteAjax'))?>'
        },
        map: {
            add: '<?=$this->Html->url(array('controller'=>'map','action'=>'add'))?>',
            edit: '<?=$this->Html->url(array('controller'=>'map','action'=>'edit'))?>',
            delete: '<?=$this->Html->url(array('controller'=>'map','action'=>'delete'))?>',
            load: '<?=$this->Html->url(array('controller'=>'map','action'=>'load'))?>',
            expand: '<?=$this->Html->url(array('controller'=>'map','action'=>'expand'))?>',
            paste: '<?=$this->Html->url(array('controller'=>'map','action'=>'paste'))?>',
            children: '<?=$this->Html->url(array('controller'=>'map','action'=>'getChildren'))?>',
            action: 'new'
        },
        pages: {
            isOnline: '<?=$this->Html->url(array('controller'=>'pages','action'=>'isOnline'))?>',
            index: '<?=$this->Html->url('/')?>'
        }
    };
</script>
<?= $this->Html->script('react/react') ?>
<?= $this->Import->script('react/build') ?>
<?= $this->Html->script('InterfaceElements') ?>
<script type="text/javascript">
    $(document).ready(function () {
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

        /*
         $.contextMenu({
         selector: '.resource',
         callback: function (key) {
         if (key == 'new') {
         //ResourcesManager.tileset.getModal().open();
         $('#resource-step-modal').modal();
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
         Global.map.action = 'new';
         $('#map-editor').modal();
         }
         else if (key == 'edit') {
         Global.map.action = 'edit';
         $('#map-editor').modal();
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
         Global.map.action = 'new';
         $('#map-editor').modal();
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
         */
    });
</script>

