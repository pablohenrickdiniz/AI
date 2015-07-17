<?= $this->Html->css('tool') ?>
<?= $this->Html->css('jquery.minicolors') ?>
<?= $this->Html->script('react/build/inputnumber')?>
<div class="container" id="container">
    <div class="row">
        <div class="col-md-4">
            <div class="tool-box" data-toggle="buttons">
                <div class="btn-group">
                    <label class="btn btn-default active">
                        <input type="radio" name="tool" id="option1" autocomplete="off" value="pointer">
                        <i class="fa fa-hand-o-up"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option2" autocomplete="off" value="move">
                        <i class="fa fa-arrows"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option3" autocomplete="off" value="pencil">
                        <i class="fa fa-pencil"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option4" autocomplete="off" value="rect">
                        <i class="fa fa-square"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option5" autocomplete="off" value="circle">
                        <i class="fa fa-circle"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option9" autocomplete="off" value="polygon">
                        <span class="glyphicon glyphicon-vector-path-polygon"></span>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option6" autocomplete="off" value="image">
                        <i class="fa fa-picture-o"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option7" autocomplete="off" value="select">
                        <i class="fa fa-select"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option8" autocomplete="off" value="fill">
                        <i class="fa fa-bucket-fill"></i>
                    </label>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-7">
            <canvas id="draw" width="660" height="500" class="thumbnail"></canvas>
        </div>
        <div class="col-sm-2">
            <div class="row form-group">
                <div class="input-group">
                    <input type="text" id="fillColor" class="form-control fillColor" title="preenchimento"/>
                <span class="input-group-addon">
                    <i class="fa fa-tint"></i>
                </span>
                </div>
            </div>
            <div class="row form-group">
                <div class="input-file">
                    <div class="input-group">
                        <input type="file" class="hidden"/>
                        <input type="text" class="form-control"  readonly/>
                        <span class="input-group-addon file-btn">
                            <i class="fa fa-picture-o"></i>
                        </span>
                    </div>
                </div>
            </div>
            <div class="row form-group" id="border-container">

            </div>
        </div>
    </div>
    <div class="row">

    </div>
</div>
<?= $this->Html->script('jquery.minicolors.min') ?>
<?= $this->Html->script('Math') ?>
<?= $this->Html->script('keys') ?>
<?= $this->Html->script('Overlap') ?>
<?= $this->Html->script('physics') ?>
<?= $this->Html->script('physics') ?>
