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

        $('#create-new-project').click(function () {
            projectManager.createProject();
        });

        $(document).on('click', '.project-list-item', function () {
            var selfInput = $(this).find('input');
            $(selfInput).prop('checked', true);
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
            project_id: 0,
            loading: false,
            createProject: function () {
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
                                $("#tree").dynatree({
                                    initAjax:{
                                        url:'<?=$this->Html->url(array('controller'=>'project','action'=>'getMapTree'))?>',
                                        data:{
                                            'data[id]':data.id
                                        },
                                        type:'post'
                                    },
                                    persist: true
                                });
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
                                $(td).attr('data-id', project.id).html(project.nome);
                                $(tr).append(td, td2).attr('class', 'project-list-item');
                                $('#open-project-select').append(tr);
                            }
                        },
                        complete: function () {
                            callback();
                        }
                    });
                }
            }
        };



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
    <div class="col-md-12">
        <ul class="nav navbar-nav tools">
            <li><a href="#" id="new-project"><span class="fa fa-2x fa-file-o"></span></a></li>
            <li><a href="#" id="open-project"><span class="fa fa-2x fa-folder-open-o"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-floppy-o"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-scissors"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-copy"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-paste"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-eraser"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-repeat"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-picture-o"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-user"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-th"></span></a></li>
            <div class="clearfix"></div>
            <li><a href="#"><span class="fa fa-2x fa-pencil"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-square"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-circle"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-tint"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-pencil-square"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-database"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-server"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-file-code-o"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-music"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-street-view"></span></a></li>
            <li><a href="#"><span class="fa fa-2x fa-play"></span></a></li>

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