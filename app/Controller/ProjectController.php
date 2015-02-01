<?php

/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 26/01/15
 * Time: 22:52
 */
class ProjectController extends AppController
{
    public $model = 'Project';

    public function addAjax()
    {
        $this->autoRender = false;
        if ($this->request->is('ajax') && $this->request->is('post')) {
            $response['success'] = false;
            if (isset($this->request->data['name'])) {
                $nome = trim($this->request->data['name']);
                $conditions = array('Project.name' => $nome);

                if (!empty($nome) && !$this->Project->hasAny($conditions)) {
                    $project['Project'] = array('name' => $nome);
                    try {
                        if ($this->Project->save($project)) {
                            $response['success'] = true;
                            $response['id'] = $this->Project->getLastInsertID();
                        }
                    } catch (Exception $ex) {
                        echo $ex;
                    }
                }
            }

            echo json_encode($response);
        }
    }

    public function exists()
    {
        $this->autoRender = false;
        if ($this->request->is('ajax') && $this->request->is('post')) {
            $nome = trim($this->request->data['name']);
            $conditions = array('Project.name' => $nome);
            $response['exists'] = $this->Project->hasAny($conditions);
            echo json_encode($response);
        }
    }

    public function getAll()
    {
        $this->autoRender = false;
        if ($this->request->is('ajax') && $this->request->is('post')) {
            $projects = $this->Project->find('all');
            $aux['Project'] = [];
            foreach ($projects as $project) {
                $aux['Project'][] = array(
                    'id' => $project['Project']['id'],
                    'nome' => $project['Project']['name']
                );
            }
            echo json_encode($aux);
        }
    }

    public function expand()
    {
        $this->autoRender = false;
        if ($this->request->is('post') && $this->request->is('ajax')) {
            $result['success'] = false;
            if (isset($this->request->data['expand'])) {
                $expand = $this->request->data['expand'];
                $id = $this->request->data['id'];
                if ($this->Project->exists($id)) {
                    $updated = $this->Project->updateAll(
                        array(
                            'Project.expand' => $expand
                        ),
                        array(
                            'Project.id' => $id
                        )
                    );

                    if ($updated) {
                        $result['success'] = true;
                    }
                }
            }
            echo json_encode($result);
        }
    }

    public function getMapTree()
    {
        $this->autoRender = false;
        if (isset($this->request->data['id'])) {
            $id = $this->request->data['id'];
            $result = [];
            if ($this->Project->exists($id)) {
                $this->Project->id = $id;
                try {
                    $tree = $this->Project->getTree();
                    $result = $tree;
                } catch (Exception $ex) {

                }
            }
            echo json_encode($result);
        }
    }


    public function setSelectedList(){
        $this->autoRender = false;
        if($this->request->is('post') && $this->request->is('ajax')){
            $result['success'] = false;
            if(isset($this->request->data['id']) && isset($this->request->data['listindex'])){
                $id = $this->request->data['id'];
                $list = $this->request->data['listindex'];
                $updated = $this->Project->updateAll(
                    array('Project.selected_list' => $list),
                    array('Project.id' => $id)
                );
                if($updated){
                    $result['success'] = true;
                }
            }
            echo json_encode($result);
        }
    }
} 