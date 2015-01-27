<?php
echo $this->Html->css('jquery.fileupload');
echo $this->Html->script('vendor/jquery.ui.widget');
echo $this->Html->script('jquery.fileupload');
echo $this->Html->script('jquery.iframe-transport');
echo $this->Html->script('pdf.js');
echo $this->Html->script('moment');
echo $this->Html->script('bootstrap-datetimepicker');
echo $this->Html->css('bootstrap-datetimepicker.min');
echo $this->Html->script('jquery-mask');
?>
    <script type="text/javascript">
        $("#gerenciaDeConteudo").parent('li').toggleClass('active').children('ul').collapse('toggle');
        $("#autores").css({'color': '#e74c3c', 'background': "#eee"});
        $(document).ready(function () {
            $("#nascimento").mask('99/99/9999');
            $("#datetimepicker1").datetimepicker({
                language: 'pt'
            });

            $('#foto').fileupload({
                url: '<?=$this->Html->url(array('controller' =>'arquivos','action'=>'add'))?>',
                add: function (e, data) {
                    var name = data.files[0].name;
                    var ext = getFileExt(name);
                    if (ext == 'png' || ext == 'jpeg' || ext == 'jpg') {
                        data.submit();
                        $("#foto-progress").show();
                    }
                    else {
                        $("#foto").val('');
                    }
                },
                progressall: function (e, data) {
                    var per = (data.loaded * 100) / data.total;
                    $("#foto-progress .progress-bar").css('width', per);
                    $("#foto-progress .progress-bar").attr('ariavaluenow', per);
                    $("#foto-progress .progress-bar").html(per + '%');
                },
                done: function (e, data) {
                    var result = $.parseJSON(data.result);
                    var img = document.createElement('img');
                    $(img).attr('src', result.completepath);
                    $(img).css('width', '180px');
                    $("#foto-livro").html(img);
                    $("#foto-progress").hide();
                    $("#fotoform").val(result.id);
                    $("#foto").attr('required', false);
                }
            });
            function getFileExt(name) {
                return name.split('.').pop().trim();
            }

            CKEDITOR.replace('descricao');
        });
    </script>
    <h4 class="page-header"><b>Editar Autor</b></h4>
<?= $this->Form->create('Autor', array('url' => array('controller' => 'autores', 'action' => 'edit', $autor['Autor']['id']), 'inputDefaults' => array('class' => 'form-control', 'style' => 'border-radius:0', 'label' => false), 'type' => 'post')) ?>
    <div class="form-group col-md-6">
        <?= $this->Form->input('Autor.nome', array('required', 'placeholder' => 'Nome')) ?>
    </div>
    <div class="form-group col-md-6">
        <?= $this->Form->input('Autor.sobrenome', array('placeholder' => 'Sobrenome')) ?>
    </div>
    <div class="form-group col-md-6">
        <?= $this->Form->input('Autor.apelido', array('placeholder' => 'Apelido')) ?>
    </div>
    <div class="form-group col-md-6">
        <div class='input-group date' id='datetimepicker1'>
            <?= $this->Form->input('Autor.nascimento', array('type' => 'text', 'required', 'id' => 'nascimento', 'placeholder' => 'Data de Nascimento')) ?>
            <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar"></span>
        </span>
        </div>
    </div>
    <div class="form-group col-md-12">
        <?= $this->Form->input('Autor.descricao', array('style' => 'max-width:100%', 'placeholder' => 'Breve Descrição do Autor', 'id' => 'descricao', 'label' => 'Descrição do autor')) ?>
    </div>
    <div class="form-group col-md-12">
        <?= $this->Form->input('Arquivo.arquivo', array('class' => 'form-control', 'type' => 'file', 'id' => 'foto', 'label' => 'Foto do autor')) ?>
        <?= $this->Form->input('Autor.foto', array('id' => 'fotoform', 'style' => 'display:none')) ?>
    </div>
    <div class="form-group col-md-12">
        <div id="foto-livro" class="img-thumbnail" style="width:200px;height:250px;overflow:hidden">
            <?= $this->Html->image('/files/arquivos/' . $autor['Arquivo']['path'], array('style' => 'width:180px')) ?>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12" style="height:20px">
            <div id="foto-progress" class="progress" style="width:200px; margin:auto;display:none">
                <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0"
                     aria-valuemax="100" style="width: 0%;">
                    0%
                </div>
            </div>
        </div>
    </div>
    <div class="form-group col-md-12">
        <?= $this->Form->submit('Atualizar', array('class' => 'btn btn-success', 'style' => 'border-radius:0;width:200px')) ?>
    </div>
<?= $this->Form->end() ?>