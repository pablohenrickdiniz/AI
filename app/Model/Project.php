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

    public function getPath(){
        $user_path = User::getPath();
        $project_name = $this->field('name');
        $project_path = $user_path.'/'.$project_name;
        if(!file_exists($project_path)){
            mkdir($project_path,777,true);
        }
        return $project_path;
    }

    public function getResourcesFolder(){
        $project_path = self::getPath();
        $resources_folder = $project_path.'/resources';
        if(!file_exists($resources_folder)){
            mkdir($resources_folder,777,true);
        }
        return $resources_folder;
    }

    public function getResourcesTree(){
        $root['title'] = 'resources';
        $root['isFolder'] = true;
        $root['addClass'] = 'resources';
        $root['children'] = [];
        $categories = Resource::getCategories();
        foreach($categories as $key => $category){
            $root['children'][] = array(
                'title' => $category,
                'addClass' => 'resource',
                'key' => $key
            );
            $resources_folder = self::getResourcesFolder();
            $category_folder = $resources_folder.'/'.$category;
            if(!file_exists($category_folder)){
                mkdir($category_folder,777,true);
            }
        }
        return $root;
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