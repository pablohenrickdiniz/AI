<?php


class PagesController extends AppController {
	public $uses = array('Config','Map','Resource','Project');
    public $layout = 'painel';
    public $user = array('index');
    public $authorization = array(
        'user' => array(
            'index'
        )
    );


    public function admin(){

    }

    public function index(){
        $project_id = $this->Config->getLastProjectId();
        $this->Project->id = $project_id;
        $this->set('project_id',$project_id);
        $this->set('categorias',$this->Resource->category);
    }
}
