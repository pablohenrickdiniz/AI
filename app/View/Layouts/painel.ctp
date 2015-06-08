<!doctype html>
<html lang="pt_BR">
<head>
    <?=$this->Html->script('jquery-1.11.2.min')?>
    <?=$this->Html->script('jquery-ui.min')?>
    <?=$this->Html->script('jquery.cookie')?>
    <?=$this->Html->script('jquery.dynatree.min')?>
    <?=$this->Html->script('validate')?>
    <?=$this->Html->css('jquery-ui.min')?>
    <?=$this->Html->css('font-awesome/css/font-awesome')?>
    <?=$this->Html->css('skin/ui.dynatree')?>
    <?=$this->Html->css('bootstrap.min')?>
    <?=$this->Html->css('/jquery-context-menu/jquery.contextMenu')?>
    <?=$this->Html->css('sb-admin')?>
    <?=$this->Html->script('bootstrap.min')?>
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
            <a class="navbar-brand" href="#">Inicio</a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
                <li><a href="<?=$this->Html->url('/editor')?>">Editor <span class="sr-only">(current)</span></a></li>
                <li><a href="<?=$this->Html->url('/conteudo')?>">Conteúdo</a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">Something else here</a></li>
                        <li class="divider"></li>
                        <li><a href="#">Separated link</a></li>
                        <li class="divider"></li>
                        <li><a href="#">One more separated link</a></li>
                    </ul>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="#">Link</a></li>
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