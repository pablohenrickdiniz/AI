<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 26/01/15
 * Time: 22:53
 */
App::import('Model','Map');
App::import('Model','User');
App::import('Model','Resource');
App::import('Model','Config');


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
    public $lazy_load_url = '';

    public function __construct($id = false, $table = null, $ds = null){
        parent::__construct($id,$table,$ds);
        $this->lazy_load_url = Router::url(array('controller' => 'project','action' => 'getChildren'),true);
    }



    public function beforeSave($options=array()){
        $this->data['Project']['user_id'] = AuthComponent::user('id');
    }

    public function getPath(){
        $user_path = User::getPath();
        $project_name = $this->field('name');
        $project_path = $user_path.'/'.$project_name;
        if(!file_exists($project_path)){
            mkdir($project_path,777,true);
        }
        return $project_path;
    }

    public function getNode(){
        $project = $this->read(array('id', 'name', 'expand', 'isLazy'));
        $node = $this->parseNode($project);
        return $node;
    }

    private function parseNode($project){
        $Map = Map::getInstance();
        return array(
            'title' => $project['Project']['name'],
            'expand' => $project['Project']['expand'],
            'addClass' => 'fa fa-folder',
            'expandClass' => 'fa fa-folder-open',
            'isFolder' => true,
            'metadata' => array(
                'type' => 'project',
                'id' => $project['Project']['id']
            ),
            'lazyLoadUrl' => $this->lazy_load_url,
            'formData' => array(
                'data[id]' => $project['Project']['id']
            ),
            'hasChildren' => $Map->hasAny(array('project_id' => $project['Project']['id']))
        );
    }

    public function getChildrenNodes()
    {
        $Map = Map::getInstance();
        $maps = $Map->find('all', array(
            'conditions' => array(
                'Map.project_id' => $this->id
            ),
            'order' => array(
                'Map.name' => 'ASC'
            )
        ));
        $children = [];

        if(empty($maps)){
            $this->saveField('isLazy',false);
        }

        foreach ($maps as $map) {
            $children[] = $Map->parseNode($map);
        }
        return $children;
    }


    public function beforeDelete($cascade = false){
        $Map = Map::getInstance();
        $deleted = $Map->deleteAll(array(
            'Map.project_id' => $this->id
        ));
        return $deleted;
    }

} 