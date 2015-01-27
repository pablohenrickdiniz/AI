<script type="text/javascript">
    $("#gerenciaDeConteudo").parent('li').toggleClass('active').children('ul').collapse('toggle');
    $("#livros").css({'color': '#e74c3c', 'background': "#eee"});
</script>
<div class="table-responsive">
    <div class="row">
        <div class="col-md-12">
            <h4 class="page-header"><b>Livros</b></h4>
        </div>
    </div>
    <div class="row" style="min-height:40px">
        <div class="col-md-12">
            <?= $this->Html->link('Cadastrar Livro <span class="glyphicon glyphicon-plus"></span>', array('controller' => 'livros', 'action' => 'add'), array('class' => 'btn btn-success', 'escape' => false, 'style' => 'border-radius:0')) ?>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <table class="table table-striped">
                <tr>
                    <th>
                        Capa
                    </th>
                    <th>
                        Nome
                    </th>
                    <th>
                        ISBN
                    </th>
                    <th>
                        Data de publicação
                    </th>
                    <th>
                        Edição
                    </th>
                    <th style="border-right-color:transparent"></th>
                    <th style="border-right-color:transparent"></th>
                    <th></th>
                </tr>
                <?php
                foreach ($livros as $livro):
                    ?>
                    <tr>
                        <td>
                            <?=$this->Html->image('/files/arquivos/'.$livro['ArquivoFoto']['path'],array('style' =>'width:100px;height:auto','class' =>'img-thumbnail'))?>
                        </td>
                        <td>
                            <?= $livro['Livro']['nome'] ?>
                        </td>
                        <td>
                            <?= $livro['Livro']['isbn'] ?>
                        </td>
                        <td>
                            <?=date('d/m/Y',strtotime($livro['Livro']['data_publicacao']))?>
                        </td>
                        <td>
                            <?= $livro['Livro']['edicao'] ?>
                        </td>
                        <td>
                            <?=$this->Html->link(
                                'Visualizar <span class="glyphicon glyphicon-book"></span>',
                                array(
                                    'controller' => 'livros',
                                    'action' => 'view',
                                    $livro['Livro']['id']
                                ),
                                array(
                                    'class' => 'btn btn-primary btn-block',
                                    'escape' => false
                                )
                            )?>
                        </td>
                        <td>
                            <?=$this->Html->link(
                                'Editar <span class="glyphicon glyphicon-edit"></span>',
                                array(
                                    'controller' => 'livros',
                                    'action' => 'edit',
                                    $livro['Livro']['id']
                                ),
                                array(
                                    'class' => 'btn btn-primary btn-block',
                                    'escape' => false
                                )
                            )?>
                        </td>
                        <td>
                            <?=$this->Form->postLink('Deletar',
                            array(
                                'controller' => 'livros',
                                'action' => 'delete',
                                $livro['Livro']['id']
                            ),array(
                                'class' => 'btn btn-danger btn-block'
                            ),'Tem Certeza?')?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </table>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <?=$this->Element('paginator')?>
        </div>
    </div>
</div>
