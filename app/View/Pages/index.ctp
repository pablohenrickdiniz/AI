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
            var nome = $(this).val().trim();
            if (nome != '') {
                if (validator.nameExp.test(nome)) {
                    validator.validateProjectName(nome);
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
            validateProjectName: function (nome) {
                this.checkinglist.push(nome);
                if (!this.checking) {
                    this.checking = true;
                    this.checkName();
                }
            },
            checkName: function () {
                var nome = this.checkinglist.pop();
                this.checkinglist = [];
                this.checking = true;
                var self = this;
                $.ajax({
                    url: '<?=$this->Html->url(array('controller'=>'projeto','action'=>'exists'))?>',
                    type: 'post',
                    data: {
                        'data[nome]': nome
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
                var nome = $('#new-project-name').val();
                if (validator.nameExp.test(nome)) {
                    $('#create-new-project').attr('disabled', true);
                    $.ajax({
                        url: '<?=$this->Html->url(array('controller'=>'projeto','action'=>'addAjax'))?>',
                        type: 'post',
                        data: {
                            'data[nome]': nome
                        },
                        success: function (data) {
                            data = $.parseJSON(data);
                            if (data.success) {
                                $('#new-project-modal').modal('hide');
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
                        url: '<?=$this->Html->url(array('controller'=>'projeto','action'=>'getAll'))?>',
                        type: 'post',
                        success: function (data) {
                            data = $.parseJSON(data);
                            $('#open-project-select').find('tr > td').remove();
                            for (var i = 0; i < data.Projeto.length; i++) {
                                var projeto = data.Projeto[i];
                                var tr = document.createElement('tr');
                                var td = document.createElement('td');
                                var td2 = document.createElement('td');
                                var radio = document.createElement('input');
                                $(radio).attr('type', 'radio').attr('name', 'project').val(projeto.id);
                                $(td2).append(radio);
                                $(td).attr('data-id', projeto.id).html(projeto.nome);
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
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li><a href="#" id="new-project"><span class="fa fa-file-o"></span></a></li>
                        <li><a href="#" id="open-project"><span class="fa fa-folder-open-o"></span></a></li>
                        <li><a href="#"><span class="fa fa-floppy-o"></span></a></li>
                        <li class="divider"></li>
                        <li><a href="#"><span class="fa fa-scissors"></span></a></li>
                        <li><a href="#"><span class="fa fa-copy"></span></a></li>
                        <li><a href="#"><span class="fa fa-paste"></span></a></li>
                        <li><a href="#"><span class="fa fa-eraser"></span></a></li>
                        <li><a href="#"><span class="fa fa-repeat"></span></a></li>
                        <li><a href="#"><span class="fa fa-picture-o"></span></a></li>
                        <li><a href="#"><span class="fa fa-user"></span></a></li>
                        <li><a href="#"><span class="fa fa-th"></span></a></li>
                        <li><a href="#"><span class="fa fa-pencil"></span></a></li>
                        <li><a href="#"><span class="fa fa-square"></span></a></li>
                        <li><a href="#"><span class="fa fa-circle"></span></a></li>
                        <li><a href="#"><span class="fa fa-tint"></span></a></li>
                        <li><a href="#"><span class="fa fa-pencil-square"></span></a></li>
                        <li><a href="#"><span class="fa fa-database"></span></a></li>
                        <li><a href="#"><span class="fa fa-server"></span></a></li>
                        <li><a href="#"><span class="fa fa-file-code-o"></span></a></li>
                        <li><a href="#"><span class="fa fa-music"></span></a></li>
                        <li><a href="#"><span class="fa fa-street-view"></span></a></li>
                        <li><a href="#"><span class="fa fa-play"></span></a></li>
                        <li><a href="#"><span class="fa fa-sign-out"></span></li>
                    </ul>
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>
    </div>
</div>
<div class="row">
    <div class="col-md-2">
        <div id="tileset-area">

        </div>
    </div>
    <div class="col-md-10">

    </div>
</div>