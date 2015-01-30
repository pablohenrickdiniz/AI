<!doctype html>
<html>
<head>
    <?=$this->Html->script('jquery-1.11.2.min')?>
    <?=$this->Html->script('jquery-ui.min')?>
    <?=$this->Html->script('jquery.cookie')?>
    <?=$this->Html->script('jquery.dynatree.min')?>
    <?=$this->Html->script('/jquery-context-menu/jquery.contextMenu')?>
    <?=$this->Html->css('jquery-ui.min')?>
    <?=$this->Html->css('font-awesome/css/font-awesome')?>
    <?=$this->Html->css('skin/ui.dynatree')?>
    <?=$this->Html->css('bootstrap.min')?>
    <?=$this->Html->css('/jquery-context-menu/jquery.contextMenu')?>
    <?=$this->Html->css('sb-admin')?>

    <?=$this->Html->script('bootstrap.min')?>
    <title>
        <?= $this->fetch('title') ?>
    </title>
</head>
<body>
<div id="page-wrapper">
    <div class="container">
        <?= $this->Session->flash(); ?>
        <?= $this->fetch('content'); ?>
    </div>
</div>
</body>
</html>