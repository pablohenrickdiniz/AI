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

    public function getTree(){
        $Map = Map::getInstance();
        $Config = Config::getInstance();
        $Config->setLastProjectId($this->id);
        $project = $this->read(array('id','name','expand'));
        $root['title'] = $project['Project']['name'];
        $root['key'] = $project['Project']['id'];
        $root['expand'] = $project['Project']['expand'];
        $root['isFolder'] = true;
        $root['addClass'] = 'project';

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