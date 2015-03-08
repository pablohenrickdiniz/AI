<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 01/02/15
 * Time: 16:18
 */

class ResourceController extends AppController{
    public $file = null;
    public $autoRender = false;
    public $model = 'Resource';
    public $authorization = array(
        'user' => array(
            'getResourcesTree',
            'add'
        )
    );
    public $uses = array('Project','Resource');
    public $components = array('File');

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


    public function addAjax(){
        if($this->request->is('post') && $this->request->is('ajax')){
            $continue = isset($this->request->data['Resource']['project_id']);
            if($continue){
                $continue = isset($this->request->data['Resource']['category']);
                if($continue){
                    $continue = isset($this->request->data['Resource']['file']['tmp_name']);
                    if($continue){
                        $file = $this->request->data['Resource']['file'];
                        $continue = @is_uploaded_file($file['tmp_name']);
                        if($continue){
                            $project_id = $this->request->data['Resource']['project_id'];
                            $this->Project->id = $project_id;
                            if($this->Project->exists() && $this->Project->isAuthorized()){
                                $category = $this->request->data['Resource']['category'];
                                $categories = $this->Resource->categories;
                                if(isset($categories[$category])){
                                    $this->Resource->project_id = $project_id;
                                    $file_name = $this->Resource->generateName($category);
                                    $category_folder = $this->Resource->getCategoryFolder($category);
                                    $name = $this->File->upload($file,$file_name,array(),$category_folder);
                                    if(!is_null($name)){
                                        $this->request->data['Resource']['file'] = $file;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        parent::addAjax();
    }
} 