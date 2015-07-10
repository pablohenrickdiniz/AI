<?php


class PagesController extends AppController {
	public $uses = array('Config','Map','Resource','Project');
    public $layout = 'painel';
    public $user = array('index');
    public $authorization = array(
        'user' => array(
            'index',
            'tree',
            'build'
        ),
        'public' => array(
            'physics'
        )
    );

    public function tree(){

    }

    public function admin(){

    }

    public function index(){
        $this->build();
        $project_id = $this->Config->getLastProjectId();
        $this->Project->id = $project_id;
        $this->set('project_id',$project_id);
        $this->set('categorias',$this->Resource->category);
    }

    public function build(){
        if(file_exists('js/react/build')){
            @unlink('js/react/build',777,true);
        }
        $output = [];
       $var = null;
        $response = exec('cd js/react&jsx /src /build',$output,$var);
        if($var != 0){
            echo 'erro ao compilar jsx';
        }
    }

    public function physics(){
        $this->build();
    }
}
