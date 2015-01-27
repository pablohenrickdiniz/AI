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
    $("#livros").css({'color': '#e74c3c', 'background': "#eee"});
    $(function () {
        $("#publicacao").mask('99/99/9999');
        var livro = {
            capa: null,
            pdf: null
        };

        $('#livro').fileupload({
            url: '<?=$this->Html->url(array('controller' =>'arquivos','action'=>'add'))?>',
            add: function (e, data) {
                var name = data.files[0].name;
                var ext = getFileExt(name);
                if (ext == 'pdf') {
                    data.submit();
                    $("#livro-progress").show();
                }
                else {
                    $("#livro").val('');
                }
            },
            progressall: function (e, data) {
                var per = (data.loaded * 100) / data.total;
                $("#livro-progress .progress-bar").css('width', per);
                $("#livro-progress .progress-bar").attr('aria-valuenow', per);
                $("#livro-progress .progress-bar").html(per + '%');
            },
            done: function (e, data) {
                var result = $.parseJSON(data.result);
                if(result.success){
                    livro.pdf = result.id;
                    $("#livro-progress").hide();
                    PDFJS.workerSrc = '<?=$this->Html->url('/js/pdf.worker.js')?>';
                    PDFJS.getDocument(result.completepath).then(function (pdf) {
                        pdf.getPage(1).then(function (page) {
                            var scale = 0.3;
                            var viewport = page.getViewport(scale);
                            var canvas = document.getElementById('pdf-view');
                            var context = canvas.getContext('2d');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            var renderContext = {
                                canvasContext: context,
                                viewport: viewport
                            };
                            page.render(renderContext);
                        })
                    });
                    $("#livro").attr('required',false);
                    $("#arquivo-form").val(result.id);
                }
            }
        });

        $('#capa').fileupload({
            url: '<?=$this->Html->url(array('controller' =>'arquivos','action'=>'add'))?>',
            add: function (e, data) {
                var name = data.files[0].name;
                var ext = getFileExt(name);
                if (ext == 'png' || ext == 'jpg' || ext == 'jpeg') {
                    data.submit();
                    $("#capa-progress").show();
                }
                else {
                    $("#capa").val('');
                }
            },
            progressall: function (e, data) {
                var per = (data.loaded * 100) / data.total;
                $("#capa-progress .progress-bar").css('width', per);
                $("#capa-progress .progress-bar").attr('aria-valuenow', per);
                $("#capa-progress .progress-bar").html(per + '%');
            },
            done: function (e, data) {
                var result = $.parseJSON(data.result);
                if(result.success){
                    var img = document.createElement('img');
                    $(img).attr('src', result.completepath);
                    $(img).css('width', '180px');
                    $("#capa-livro").html(img);
                    $("#capa-progress").hide();
                    $("#capa").attr('required',false);
                    $("#capa-form").val(result.id);
                }
            },
            fail:function(e,data){

            }
        });

        function getFileExt(name) {
            return name.split('.').pop().trim();
        }
        $("#datetimepicker1").datetimepicker({
            language:'pt'
        });
        CKEDITOR.replace("descricao");
    });
</script>
<div class="table-responsive">
    <h4 class="page-header"><b>Editar Livro</b></h4>
    <?= $this->Form->create('Livro', array('url' => array('controller'=>'livros','action'=>'edit',$livro['Livro']['id']),'inputDefaults' => array('class' => 'form-control', 'style' => 'border-radius:0','label' => false))) ?>
    <div class="row">
        <div class="form-group col-md-6">
            <?= $this->Form->input('Livro.nome', array('required','placeholder' => 'Nome')) ?>
        </div>
        <div class="form-group col-md-6">
            <?= $this->Form->input('Livro.autor_id', array('placeholder' => 'Autor', 'options' => $autorOptions, 'empty' => 'Selecione o autor', 'required')) ?>
        </div>
    </div>
    <div class="row">
        <div class="form-group col-md-12">
            <?= $this->Form->input('Livro.isbn', array('placeholder' => 'ISBN')) ?>
        </div>
    </div>
    <div class="row">
        <div class="form-group col-md-6">
            <?= $this->Form->input('Livro.edicao', array('placeholder' => 'Edição', 'type' => 'text')) ?>
        </div>
        <div class="form-group col-md-6">
            <div class='input-group date' id='datetimepicker1'>
                <?= $this->Form->input('Livro.data_publicacao', array('placeholder' => 'dd/mm/yyyy', 'type' => 'text','id' => 'publicacao','required')) ?>
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                </span>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="form-group col-md-12">
            <?= $this->Form->input('Livro.descricao', array('placeholder' => 'Descrição do livro', 'style' => 'max-width:100%','id' => 'descricao')) ?>
        </div>
    </div>
    <div class="row">
        <div class="form-group col-md-6">
            <?= $this->Form->input('Arquivo.arquivo', array('type' => 'file', 'id' => 'capa', 'required','label' => 'Capa do livro(jpg, png)')) ?>
            <?= $this->Form->input('Livro.capa', array('type' => 'number', 'id' => 'capa-form','label' => false,'style' => 'display:none')) ?>
        </div>
        <div class="form-group col-md-6">
            <?= $this->Form->input('Arquivo.arquivo', array('type' => 'file', 'id' => 'livro', 'required','label' => 'Arquivo do livro(pdf)')) ?>
            <?= $this->Form->input('Livro.arquivo_id', array('type' => 'number', 'id' => 'arquivo-form', 'label' => false,'style' => 'display:none')) ?>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div class="row">
                <div class="col-md-12">
                    <div id="capa-livro" class="img-thumbnail" style="width:200px;height:250px;overflow:hidden">
                        <?= $this->Html->image('/files/arquivos/' . $livro['ArquivoFoto']['path'], array('style' => 'width:180px')) ?>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12" style="height:20px">
                    <div id="capa-progress" class="progress pull-left" style="width:200px;margin:auto;display:none">
                        <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0"
                             aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
                            0%
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="row">
                <div class="col-md-12">
                    <div class="img-thumbnail" style="width:200px;height:250px;overflow:hidden">
                        <canvas id="pdf-view" width="200" height="250">

                        </canvas>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12" style="height:20px">
                    <div id="livro-progress" class="progress pull-left" style="width:200px; margin:auto;display:none">
                        <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0"
                             aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
                            0%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row" style="margin-top:30px">
        <div class="form-group col-md-12">
            <?= $this->Form->submit('Atualizar', array('class' => 'btn btn-success', 'style' => 'border-radius:0;width:200px','id' => 'submit')) ?>
        </div>
    </div>
    <?= $this->Form->end() ?>
</div>