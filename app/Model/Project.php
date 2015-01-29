<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 26/01/15
 * Time: 22:53
 */
App::import('Model','Map');
App::import('Model','Config');


class Project extends AppModel{
    public $useTable = 'project';

    public function afterSave($created,$options=array()){
        if($created){
            $Map = Map::getInstance();
            $Config = Config::getInstance();
            $id = $this->data['Project']['id'];
            $map['Map'] = array(
                'project_id' => $id,
                'name' => 'MAP001',
                'width' => 17,
                'height' => 13
            );
            try{
                $Map->save($map);
                $Config->setLastProjectId($id);
            }
            catch(Exception $ex){
                echo $ex;
            }
        }
    }


    public function getTree(){
        $Map = Map::getInstance();
        $Config = Config::getInstance();
        $Config->setLastProjectId($this->id);
        $project = $this->read(array('id','name'));
        $root['title'] = $project['Project']['name'];
        $root['key'] = $project['Project']['id'];
        $root['isFolder'] = true;


        $maps = $Map->find('all',array(
            'fields' => array(
                'Map.id'
            ),
            'conditions' => array(
                'Map.project_id' => $project['Project']['id']
            ),
            'order' => array(
                'Map.name' => 'ASC'
            )
        ));

        for($i=0;$i<count($maps);$i++){
            $Map->id = $maps[$i]['Map']['id'];
            $root['children'][$i] = $Map->getTree();
        }
        return $root;
    }

    public function beforeDelete($cascade = false){
        $Map = Map::getInstance();
        $deleted = $Map->deleteAll(array(
            'Map.project_id' => $this->id
        ));
        return $deleted;
    }
} 