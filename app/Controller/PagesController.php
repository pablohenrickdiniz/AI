<?php


class PagesController extends AppController {
	public $uses = array('Config','Map','Resource','Project');
    public $layout = 'painel';
    public $user = array('index');
    public $authorization = array(
        'user' => array(
            'index'
        ),
        'public' => array(
            'isOnline'
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

    public function isOnline(){
        $this->autoRender = false;
        if($this->request->is('ajax') && $this->request->is('post')){
            $id = AuthComponent::user('id');
            $response['online'] = !is_null($id);
            echo json_encode($response);
        }
    }
}
