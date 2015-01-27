<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 26/01/15
 * Time: 22:52
 */

class ProjetoController extends AppController{
    public $model = 'Projeto';
       public function beforeFilter(){
           $this->Auth->Allow('addAjax','exists','getAll');
       }

    public function addAjax(){
        $this->autoRender = false;
        if($this->request->is('ajax') && $this->request->is('post')){
            $response['success'] = false;
            if(isset($this->request->data['nome'])){
                $nome = trim($this->request->data['nome']);
                $conditions = array('Projeto.nome' => $nome);

                if(!empty($nome) && !$this->Projeto->hasAny($conditions)){
                    $projeto['Projeto'] = array('nome' => $nome);
                    if($this->Projeto->save($projeto)){
                        $response['success'] = true;
                        $response['id'] = $this->Projeto->getLastInsertID();
                    }
                }
            }

            echo json_encode($response);
        }
    }

    public function exists(){
        $this->autoRender = false;
        if($this->request->is('ajax') && $this->request->is('post')){
            $nome = trim($this->request->data['nome']);
            $conditions = array('Projeto.nome' => $nome);
            $response['exists'] = $this->Projeto->hasAny($conditions);
            echo json_encode($response);
        }
    }

    public function getAll(){
        $this->autoRender = false;
        if($this->request->is('ajax') && $this->request->is('post')){
            $projects = $this->Projeto->find('all');
            $aux['Projeto'] = [];
            foreach($projects as $project){
                $aux['Projeto'][] = array(
                    'id' => $project['Projeto']['id'],
                    'nome' =>   $project['Projeto']['nome']
                );
            }
            echo json_encode($aux);
        }
    }
} 