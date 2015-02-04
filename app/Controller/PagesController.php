<?php


class PagesController extends AppController {
	public $uses = array('Config','Map','Resource','Project');
    public $layout = 'painel';

    public function beforeFilter(){
        parent::beforeFilter();
        $this->Auth->allow('index');
    }



    public function admin(){

    }

    public function index(){
        $project_id = $this->Config->getLastProjectId();
        $this->Project->id = $project_id;
        $project = $this->Project->read('Project.selected_list');
        $selected_list = 0;
        if(isset($project['Project']['selected_list'])){
            $selected_list = $project['Project']['selected_list'];
        }

        $this->set('project_id',$project_id);
        $this->set('categorias',$this->Resource->category);
        $this->set('selected_list',$selected_list);
    }
}
