<!doctype html>
<html>
<head>
    <?php
    echo $this->Html->script('jquery-1.11.1.min');
    echo $this->Html->css('font-awesome/css/font-awesome');
    echo $this->Html->css('bootstrap.min');
    echo $this->Html->script('bootstrap.min');
    echo $this->Html->css('sb-admin');
    echo $this->fetch('meta');
    echo $this->fetch('script');
    echo $this->fetch('css');
    ?>
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