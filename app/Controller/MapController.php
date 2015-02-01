<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 30/01/15
 * Time: 22:11
 */

class MapController extends AppController{
    public $model = 'Map';
    public $results = 'maps';
    public $result = 'map';
    public $autoRender = false;

    public function add(){
        if($this->request->is('ajax') && $this->request->is('post')){
            $result['success'] = false;
            try{
                if($this->Map->save($this->request->data)){
                    $this->Map->id = $this->Map->getLastInsertID();
                    $result['node'] = $this->Map->getTree();
                    $result['success'] = true;
                }
            }
            catch(Exception $ex){

            }
            echo json_encode($result);
        }
    }

    public function loadMap(){
       if($this->request->is('post') && $this->request->is('ajax')){
           $result['success'] = true;
           if(isset($this->request->data['id'])){
                $id = $this->request->data['id'];
               $this->Map->id = $id;
                $map = $this->Map->read(array('Map.name','Map.display_name','Map.width','Map.height','Map.scroll_type'));
                if(!empty($map)){
                    $map['Map']['display'] = $map['Map']['display_name'];
                    $map['Map']['scroll'] = $map['Map']['scroll_type'];
                    unset($map['Map']['display_name']);
                    unset($map['Map']['scroll_type']);
                    $result['map'] = $map;
                    $result['success'] = true;
                }
           }
           echo json_encode($result);
       }
    }

    public function edit($id=null){
        if($this->request->is('post') && $this->request->is('ajax')){
            $result['success'] = false;
            try{
                if($this->Map->save($this->request->data)){
                    $result['success'] = true;
                }
            }
            catch(Exception $ex){

            }
            echo json_encode($result);
        }
    }

    public function expand(){
        if($this->request->is('post') && $this->request->is('ajax')){
            $result['success'] = false;
            if(isset($this->request->data['expand'])){
                $expand = $this->request->data['expand'];
                $id     = $this->request->data['id'];

                if($this->Map->exists($id)){
                    $saved = $this->Map->updateAll(
                        array(
                            'Map.expand' => $expand
                        ),
                        array(
                            'Map.id' => $id
                        )
                    );
                    if($saved){
                        $result['success'] = true;
                    }
                }
            }
            echo json_encode($result);
        }
    }

    public function delete($id =null){
        if($this->request->is('ajax') && $this->request->is('post')){
            $result['success'] = false;
            if(isset($this->request->data['id'])){
                $id = $this->request->data['id'];

                try{
                    if($this->Map->delete($id)){
                        $result['success'] = true;
                    }
                }
                catch(Exception $ex){
                    echo $ex;
                }
            }
            echo json_encode($result);
        }
    }
} 