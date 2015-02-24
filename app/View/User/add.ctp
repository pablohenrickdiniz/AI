<div class="row">
    <div class="panel panel-info" style="width:500px;margin:100px auto auto auto;">
        <div class="panel-heading">
            <h3 class="panel-title">Cadastro</h3>
        </div>
        <div class="panel-body">
            <div>
                <?=$this->Form->create('User',array('inputDefaults' => array('class' =>'form-control','div' =>'form-group col-md-12','label' =>false)))?>
                <?=$this->Form->input('User.fullname',array('required','placeholder' =>'Digite seu nome completo'))?>
                <?=$this->Form->input('User.email',array('required','placeholder' =>'Digite seu endereço de e-mail'))?>
                <?=$this->Form->input('User.username',array('required','placeholder' =>'Digite um nome de usuário'))?>
                <?=$this->Form->input('User.password',array('required','placeholder' =>'Digite uma senha'))?>
                <?=$this->Form->input('User.confirm',array('required','placeholder' =>'Digite novamente a senha','type' =>'password'))?>
                <?=$this->Form->submit('Entrar',array('class' =>'btn btn-primary btn-block','div' =>'form-group col-md-12'))?>
                <?=$this->Form->end()?>
            </div>
        </div>
    </div>
</div>
