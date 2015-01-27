<script type="text/javascript">
    $("#gerenciaDeConteudo").parent('li').toggleClass('active').children('ul').collapse('toggle');
    $("#autores").css({'color': '#e74c3c', 'background': "#eee"});
</script>
<div class="table-responsive">
    <div class="row">
        <div class="col-md-12">
            <h4 class="page-header"><b>Autores</b></h4>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12" style="min-height:40px">
            <?=
            $this->Html->link(
                'Cadastrar Autor &nbsp;<span class="glyphicon glyphicon-plus"></span>',
                array('controller' => 'autores', 'action' => 'add'),
                array('class' => 'btn btn-success', 'style' => 'border-radius:0', 'escape' => false))
            ?>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <table class="table table-striped">
                <tr>
                    <th>Foto</th>
                    <th>Nome</th>
                    <th>Sobrenome</th>
                    <th>Apelido</th>
                    <th style="border-right-color:transparent"></th>
                    <th></th>
                </tr>
                <?php foreach ($autors as $autor): ?>
                    <tr>
                        <td>
                            <?= $this->Html->image('/files/arquivos/' . $autor['Arquivo']['path'], array('style' => 'width:120px;height:auto;user-select:none','class' => 'img-thumbnail')) ?>
                        </td>
                        <td>
                            <?= $autor['Autor']['nome'] ?>
                        </td>
                        <td>
                            <?= $autor['Autor']['sobrenome'] ?>
                        </td>
                        <td>
                            <?= $autor['Autor']['apelido'] ?>
                        </td>
                        <td>
                            <?= $this->Html->link('Editar <span class="glyphicon glyphicon-edit"></span>', array('controller' => 'autores', 'action' => 'edit', $autor['Autor']['id']), array('escape' => false, 'class' => 'btn btn-primary btn-block')) ?>
                        </td>
                        <td>
                            <?= $this->Form->postLink('Apagar', array('controller' => 'autores', 'action' => 'delete', $autor['Autor']['id']), array('class' => 'btn btn-danger btn-block'), 'Tem certeza?') ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </table>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <?= $this->Element('paginator') ?>
        </div>
    </div>
</div>