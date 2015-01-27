<!doctype html>
<html>
<head>
    <?php
    echo $this->Html->script('jquery-1.11.1.min');
    echo $this->Html->css('font-awesome/css/font-awesome');
    echo $this->Html->css('plugins/morris/morris-0.4.3.min');
    echo $this->Html->css('plugins/timeline/timeline');
    echo $this->Html->css('sb-admin');
    echo $this->Html->script('jquery.form');
    echo $this->Html->script('bootstrap.min');
    echo $this->Html->script('plugins/metisMenu/jquery.metisMenu');
    echo $this->Html->script('plugins/morris/raphael-2.1.0.min');
    echo $this->Html->script('plugins/morris/morris');
    echo $this->Html->script('sb-admin');
    echo $this->Html->script('ckeditor/ckeditor');
    echo $this->Html->script('jquery.maskMoney.min');
    echo $this->Html->css('bootstrap.min');
    echo $this->Html->script('bootstrap.min');
    echo $this->fetch('meta');
    echo $this->fetch('script');
    echo $this->fetch('css');
    ?>
    <title>
        <?= $this->fetch('title') ?>
    </title>
    <script type="text/javascript">
        $(document).ready(function () {
            $("#new-project").click(function () {
                $("#new-project-modal").modal();
                $('#new-project-name').val('');
            });

            $('#open-project').click(function(){
                projectManager.loadProjects(function(){
                    $('#open-project-modal').modal();
                });
            });

            $("#cancel-new-project").click(function () {
                $("#new-project-modal").modal('hide');
            });

            $('#cancel-open-project').click(function(){
                $('#open-project-modal').modal('hide');
            });

            $('#create-new-project').click(function () {
                projectManager.createProject();
            });

            $(document).on('click','.project-list-item',function(){
                var selfInput =  $(this).find('input');
                $(selfInput).prop('checked',true);
            });

            var checkProjectName = function () {
                var nome = $(this).val().trim();
                if (nome != '') {
                    if(validator.nameExp.test(nome)){
                        validator.validateProjectName(nome);
                    }
                    else{
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
                project_id:0,
                loading:false,
                createProject:function(){
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
                loadProjects:function(callback){
                    var self = this;
                    if(!self.loading){
                        $.ajax({
                            url:'<?=$this->Html->url(array('controller'=>'projeto','action'=>'getAll'))?>',
                            type:'post',
                            success:function(data){
                                data = $.parseJSON(data);
                                $('#open-project-select').find('tr > td').remove();
                                for(var i =0; i < data.Projeto.length;i++){
                                    var projeto = data.Projeto[i];
                                    var tr = document.createElement('tr');
                                    var td = document.createElement('td');
                                    var td2 = document.createElement('td');
                                    var radio = document.createElement('input');
                                    $(radio).attr('type','radio').attr('name','project').val(projeto.id);
                                    $(td2).append(radio);
                                    $(td).attr('data-id',projeto.id).html(projeto.nome);
                                    $(tr).append(td,td2).attr('class','project-list-item');
                                    $('#open-project-select').append(tr);
                                }
                            },
                            complete:function(){
                                callback();
                            }
                        });
                    }
                }
            };
        });
    </script>
</head>
<body>
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
                        <table id="open-project-select" class="table table-striped" >
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
<div id="navbar" class="navbar-collapse collapse">
    <ul class="nav navbar-nav">
        <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span
                    class="fa fa-file-archive-o"></span>&nbsp;&nbsp;Arquivo <span
                    class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
                <li><a href="#" id="new-project"><span class="fa fa-file-o"></span>&nbsp;&nbsp;Novo projeto</a></li>
                <li><a href="#" id="open-project"><span class="fa fa-folder-open-o"></span>&nbsp;&nbsp;Abrir projeto</a></li>
                <li><a href="#"><span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Salvar projeto</a></li>
            </ul>
        </li>
        <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span
                    class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Editar <span
                    class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
                <li><a href="#"><span class="glyphicon glyphicon-repeat"></span>&nbsp;&nbsp;Voltar</li>
                <li class="divider"></li>
                <li><a href="#"><span class="fa fa-scissors"></span>&nbsp;&nbsp;Recortar</a></li>
                <li><a href="#"><span class="fa fa-copy"></span>&nbsp;&nbsp;Copiar</a></li>
                <li><a href="#"><span class="fa fa-paste"></span>&nbsp;&nbsp;Colar</a></li>
                <li><a href="#"><span class="glyphicon glyphicon-erase"></span>&nbsp;&nbsp;Apagar</a></li>
            </ul>
        </li>
        <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span
                    class="fa fa-check-square-o"></span>&nbsp;&nbsp;Modo <span
                    class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
                <li><a href="#"><span class="fa fa-picture-o"></span>&nbsp;&nbsp;Mapa</a></li>
                <li><a href="#"><span class="fa fa-user"></span>&nbsp;&nbsp;Evento</a></li>
                <li><a href="#"><span class="fa fa-th"></span>&nbsp;&nbsp;Região</a></li>
            </ul>
        </li>
        <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span
                    class="fa fa-picture-o"></span>&nbsp;&nbsp;Desenho <span
                    class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
                <li><a href="#"><span class="fa fa-pencil"></span>&nbsp;&nbsp;Lápis</a></li>
                <li><a href="#"><span class="fa fa-square"></span>&nbsp;&nbsp;Retangulo</a></li>
                <li><a href="#"><span class="fa fa-circle"></span>&nbsp;&nbsp;Elipse</a></li>
                <li><a href="#"><span class="fa fa-tint"></span>&nbsp;&nbsp;Preencher</a></li>
                <li><a href="#"><span class="fa fa-pencil-square"></span>&nbsp;&nbsp;Caneta de sombra</a></li>
            </ul>
        </li>
        <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span
                    class="fa fa-wrench"></span>&nbsp;&nbsp;Ferramentas
                <span class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
                <li><a href="#"><span class="fa fa-database"></span>&nbsp;&nbsp;Banco de dados</a></li>
                <li><a href="#"><span class="fa fa-server"></span>&nbsp;&nbsp;Gerenciador de recursos</a></li>
                <li><a href="#"><span class="fa fa-file-code-o"></span>&nbsp;&nbsp;Editor de Scripts</a></li>
                <li><a href="#"><span class="fa fa-music"></span>&nbsp;&nbsp;Teste de som</a></li>
                <li><a href="#"><span class="fa fa-street-view"></span>&nbsp;&nbsp;Gerador de caracters</a></li>
            </ul>
        </li>
        <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span
                    class="fa fa-gamepad"></span>&nbsp;&nbsp;Jogo <span
                    class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
                <li><a href="#"><span class="fa fa-play"></span>&nbsp;&nbsp;Executar</a></li>
            </ul>
        </li>
    </ul>
    <ul class="nav navbar-nav navbar-right">
        <li><a href="#"><span class="fa fa-sign-out"></span>&nbsp;&nbsp;Sair</a></li>
    </ul>
</div>
<div id="navbar-2" class="navbar-collapse collapse">
    <ul class="nav navbar-nav">
        <li><a href="#"><span class="fa fa-file-o"></span></a></li>
        <li><a href="#"><span class="fa fa-folder-open-o"></span></a></li>
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
    </ul>
</div>
<div id="page-wrapper">
    <?= $this->Session->flash(); ?>
    <?= $this->fetch('content'); ?>
</div>
</body>
</html>