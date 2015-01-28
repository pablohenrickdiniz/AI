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

    public function beforeFilter()
    {
        $this->Auth->Allow('addAjax', 'exists', 'getAll', 'getMapTree');
    }

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

    public function getMapTree()
    {
        $this->autoRender = false;
        if (isset($this->request->data['id'])) {
            $id = $this->request->data['id'];
            $result = [];
            if ($this->Project->exists($id)) {
                $this->Project->id = $id;
                $tree = $this->Project->getTree();
                $result = $tree;
            }
            echo json_encode($result);
        }
    }
} 