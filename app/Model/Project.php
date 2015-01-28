<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 26/01/15
 * Time: 22:53
 */
App::import('Model','Map');


class Project extends AppModel{
    public $useTable = 'project';

    public function afterSave($created,$options=array()){
        if($created){
            $Map = Map::getInstance();
            $id = $this->data['Project']['id'];
            $map['Map'] = array(
                'project_id' => $id,
                'name' => 'MAP001',
                'width' => 17,
                'height' => 13
            );
            $Map->save($map);
        }
    }


    public function getTree(){
        $Map = Map::getInstance();
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
} 