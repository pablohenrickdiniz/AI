<div class="text-center">
    <ul class="pagination pagination-sm pull-left">
        <?= $this->Paginator->prev(__('Página Anterior'), array('tag' => 'li'), null, array('tag' => 'li','class' => 'disabled','disabledTag' => 'a')) ?>
    </ul>
    <ul class="pagination pagination-sm">
        <?= $this->Paginator->numbers(array('separator' => '','currentTag' => 'a', 'currentClass' => 'active','tag' => 'li','first' => 1, 'ellipsis' => '')) ?>
        <?php //echo $this->Paginator->numbers(); ?>
    </ul>
    <ul class="pagination pagination-sm pull-right">
        <?= $this->Paginator->next(__('Próxima Página'), array('tag' => 'li','currentClass' => 'disabled'), null, array('tag' => 'li','class' => 'disabled','disabledTag' => 'a'));
        ?>
    </ul>
</div>