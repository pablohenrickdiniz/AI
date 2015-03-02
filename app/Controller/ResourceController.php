<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 01/02/15
 * Time: 16:18
 */

class ResourceController extends AppController{
    public $autoRender = false;
    public $model = 'Resource';
    public $authorization = array(
        'user' => array(
            'getResourcesTree'
        )
    );
    public $uses = array('Project','Resource');

    public function beforeFilter(){
        if($this->request->is('ajax') && $this->request->is('post')){
            parent::beforeFilter();
        }
    }


    public function getResourcesTree()
    {
        $result['success'] = false;
        if (isset($this->request->data['id'])) {
            $id = $this->request->data['id'];
            $this->Project->id = $id;
            if($this->Project->exists() && $this->Project->isAuthorized()){
                $this->Resource->project_id = $id;
                $result = $this->Resource->getTree();
            }
        }
        echo json_encode($result);
    }
} 