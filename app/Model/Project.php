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
    public $validate = array(
        'name' => array(
            'uniqueRule' => array(
                'rule' => 'isUnique',
                'message' => 'Já existe um projeto com este nome'
            ),
            'letras' => array(
                'rule' => '/^[A-Za-z]+$/',
                'message' => 'O nome do projeto deve conter somente letras de A a Z'
            )
        )
    );

    public function beforeSave($options=array()){
        $this->data['Project']['user_id'] = AuthComponent::user('id');
    }

    public function getTree(){
        $Map = Map::getInstance();
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