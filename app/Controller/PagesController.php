<?php


class PagesController extends AppController {
	public $uses = array('Config');
    public $layout = 'admin';

    public function beforeFilter(){
        parent::beforeFilter();
        $this->Auth->allow('index');
    }



    public function admin(){

    }

    public function index(){
        $project_id = $this->Config->getLastProjectId();
        $this->set('project_id',$project_id);
    }
}
