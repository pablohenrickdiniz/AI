<!doctype html>
<html lang="pt_BR">
<head>
    <?=$this->Html->script('jquery-1.11.2.min')?>
    <?=$this->Html->script('jquery-ui.min')?>
    <?=$this->Html->script('jquery.cookie')?>
    <?=$this->Html->css('jquery-ui.min')?>
    <?=$this->Html->css('font-awesome/css/font-awesome')?>
    <?=$this->Html->css('bootstrap.min')?>
    <?=$this->Html->css('/jquery-context-menu/jquery.contextMenu')?>
    <?=$this->Html->css('sb-admin')?>
    <?=$this->Html->script('bootstrap.min')?>
    <?= $this->Html->script('lodash.min')?>
    <?= $this->Html->script('uuid') ?>
    <?= $this->Html->script('jquery.form.min') ?>
    <?= $this->Html->script('jcanvas.min')?>
    <?= $this->Html->script('jquery-mask') ?>
    <meta charset="utf-8"/>
    <title>
        <?= $this->fetch('title') ?>
    </title>
</head>
<body>
<nav class="navbar navbar-inverse" id="navbar-header">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>

        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">

                    </ul>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Opções <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#"><span class="fa fa-gear"></span>&nbsp;&nbsp;Configurações</a></li>
                        <li class="divider"></li>
                        <li><a href="<?=$this->Html->url(array('controller'=>'users','action' =>'logout'))?>"><span class="fa fa-sign-out"></span>&nbsp;&nbsp;Sair</a></li>
                    </ul>
                </li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>
<div id="page-wrapper">
        <?= $this->Session->flash(); ?>
        <?= $this->fetch('content'); ?>
</div>
</body>
</html>