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
    public $uses = array('Project', 'Config');
    public $authorization = array(
        'user' => array(
            'addAjax',
            'getAll',
            'expand',
            'getMapTree',
            'getChildren',
            'getResourcesTree',
            'deleteAjax'
        )
    );
    public $autoRender = false;

    public function beforeFilter()
    {
        if ($this->request->is('ajax') && $this->request->is('post')) {
            parent::beforeFilter();
        }
    }

    public function addAjax()
    {
        $response['success'] = false;
        if (isset($this->request->data['Project']['name'])) {
            $nome = trim($this->request->data['Project']['name']);
            $project['Project'] = array('name' => $nome);
            try {
                $this->Project->create();
                if ($this->Project->save($project)) {
                    $id = $this->Project->getLastInsertID();
                    $response['success'] = true;
                    $response['id'] = $id;
                }
            } catch (Exception $ex) {

            }
        }
        $response['errors'] = $this->Project->validationErrors;
        echo json_encode($response);
    }

    public function getAll()
    {
        $projects = $this->Project->find('all');
        $aux['projects'] = [];
        $user_id = AuthComponent::user('id');
        foreach ($projects as $project) {
            $aux['projects'][] = array(
                'id' => $project['Project']['id'],
                'name' => $project['Project']['name'],
                'user_id' => $user_id
            );
        }
        echo json_encode($aux);
    }

    public function expand()
    {
        $result['success'] = false;
        if (isset($this->request->data['expand'])) {
            $expand = $this->request->data['expand'];
            $id = $this->request->data['id'];
            $this->Project->id = $id;
            if ($this->Project->exists() && $this->Project->isAuthorized()) {
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


    public function getChildren()
    {
        if (isset($this->request->data['id'])) {
            $id = $this->request->data['id'];
            $result = [];
            $this->Project->id = $id;
            if ($this->Project->exists() && $this->Project->isAuthorized()) {
                try {
                    $children = $this->Project->getChildrenNodes();
                    $result = $children;
                } catch (Exception $ex) {

                }
            }
            echo json_encode($result);
        }
    }

    public function getMapTree()
    {
        if (isset($this->request->data['id'])) {
            $id = $this->request->data['id'];
            $result = [];
            $this->Project->id = $id;
            if ($this->Project->exists() && $this->Project->isAuthorized()) {
                try {
                    $node = $this->Project->getNode();
                    $result[] = $node;
                    $this->Config->setLastProjectId($id);
                } catch (Exception $ex) {

                }
            }
            echo json_encode($result);
        }
    }
} 