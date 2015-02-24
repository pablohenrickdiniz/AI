<div class="row">
    <div class="panel panel-info" style="width:300px;margin:100px auto auto auto;">
        <div class="panel-heading">
            <h3 class="panel-title">Login</h3>
        </div>
        <div class="panel-body">
            <div>
                <?=$this->Form->create('User',array('type' => 'post','inputDefaults' => array('class' =>'form-control','div' =>'form-group col-md-12','label' =>false)))?>
                <?=$this->Form->input('username',array('required','placeholder' =>'Digite seu nome de usuário'))?>
                <?=$this->Form->input('password',array('required','placeholder' =>'Digite sua senha'))?>
                <?=$this->Form->submit('Entrar',array('class' =>'btn btn-primary btn-block','div' =>'form-group col-md-12'))?>
                <?=$this->Form->end()?>
            </div>
        </div>
    </div>
</div>
