<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 01/02/15
 * Time: 16:18
 */

class ResourceController extends AppController{
    public $autoRender = false;
    public $authorization = array(
        'user' => array(
            'getResourcesTree',
            'addAjax',
            'delete',
            'all'
        )
    );

    public function getResourcesTree()
    {
        if (isset($this->request->data['id'])) {
            $id = $this->request->data['id'];
            $result =[];
            $this->loadModel('Project');
            $this->Project->id = $id;
            if($this->Project->exists() && $this->Project->isAuthorized()){
                $this->Resource->project_id = $id;
                $result[] = $this->Resource->getTree();
            }
            echo json_encode($result);
        }
    }

    public function addAjax(){
        if($this->request->is('ajax') && $this->request->is('post')){
            if(isset($this->request->data['ResourceRegion']) && is_array($this->request->data['ResourceRegion'])){
                $this->loadModel('Category');
                $resources_region = $this->request->data['ResourceRegion'];
                for($i=0;$i<count($resources_region);$i++){
                    if(isset($resources_region[$i]['Category']) && is_array($resources_region[$i]['Category'])){
                        $categories = $resources_region[$i]['Category'];
                        for($j=0;$j<count($categories);$j++){
                            $name = $categories[$j]['name'];
                            $category = $this->Category->findByName($name);
                            if(empty($category)){
                                $this->Category->create();
                                $this->Category->save(array(
                                    'Category' => array(
                                        'name' => $name
                                    )
                                ));
                                $category['Category']['id'] = $this->Category->getLastInsertID();
                                $category['Category']['name'] = $name;
                            }

                            $this->request->data['ResourceRegion'][$i]['Category'][$j]['ResourceRegionCategory']['category_id'] = $category['Category']['id'];
                        }
                    }
                }
            }

            parent::addAjax();
        }
    }


    public function all($options=array(),$return = false){
        $rows = parent::all($options,true);

        print_r($rows);
    }

} 