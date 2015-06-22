<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 01/02/15
 * Time: 14:16
 */

App::import('Model','Project');
App::import('Model','User');
App::import('Model','ProjectResource');

class Resource extends AppModel{
    public $useTable = 'resource';
    public $project_id = null;
    public $category = null;
    public $categories = array(
        0 => 'Animation',
        1 => 'Battleback',
        2 => 'Battler',
        3 => 'Character',
        4 => 'Face',
        5 => 'Parallaxe',
        6 => 'Picture',
        7 => 'System',
        8 => 'Tileset',
        9 => 'Title',
        10 => 'BGM',
        11 => 'BGS',
        12 => 'ME',
        13 => 'SE'
    );
    public $prefix = array(
        0 => 'animation',
        1 => 'battleback',
        2 => 'battler',
        3 => 'character',
        4 => 'face',
        5 => 'parallaxe',
        6 => 'picture',
        7 => 'system',
        8 => 'tileset',
        9 => 'title',
        10 => 'bgm',
        11 => 'bgs',
        12 => 'me',
        13 => 'se'
    );
    public $resources_folder = [];
    public $hasMany = array(
        'ResourceRegion' => array(
            'cascade' => true
        )
    );

    public $actsAs = array(
        'File' => array(
            'fields' => 'file',
            'folder' => 'resources',
            'prefix' => 'res-'
        )
    );

    public $validate = array(
        'category' => array(
            'rule1' => array(
                'rule' =>  array('comparison','>=',0),
                'message' => 'A categoria selecionada não existe'
            ),
            'rule2' => array(
                'rule' =>  array('comparison','<=',13),
                'message' => 'A categoria selecionada não existe'
            ),
        )
    );

    public function getCategories(){
        return $this->$categories;
    }

    public function getTree(){
        $root = array(
            'title' => 'Recursos',
            'isFolder' => true,
            'children' => [],
            'addClass' => 'fa fa-folder',
            'expandClass' => 'fa fa-folder-open',
            'metadata' => array(
                'type' =>'resources'
            ),
            'expand' => false
        );

        $categories = $this->categories;
        foreach($categories as $key => $category){
            $root['children'][] = array(
                'title' => $category,
                'addClass' => 'fa fa-folder',
                'expandClass' => 'fa fa-folder-open',
                'metadata' => array(
                    'type' => 'resource-folder',
                    'id' => $key
                ),
                'isFolder' => true
            );
        }
        return $root;
    }

    public function getCategoryFolder($index){
        if(isset($this->categories[$index])){
            $category = $this->categories[$index];
            $resources_folder = $this->getPath();
            $category_folder = $resources_folder.'/'.$category;
            if(!file_exists($category_folder)){
                mkdir($category_folder,777,true);
            }
            return $category_folder;
        }
        return '';
    }

    public function getPath(){
        if(!isset($this->resources_folder[$this->project_id])){
            $project = Project::getInstance();
            $project->id = $this->project_id;
            $project_path = $project->getPath();
            $resources_folder = $project_path.'/resources';
            if(!file_exists($resources_folder)){
                mkdir($resources_folder,777,true);
            }
            $this->resources_folder[$this->project_id] = $resources_folder;
        }
        return $this->resources_folder[$this->project_id];
    }

    public function generateName($category){
        $label = $this->prefix[$category];
        $name = $label.'_'.sha1(uniqid(rand(), true));
        return $name;
    }

    public function beforeSave($options=array()){
        $this->data['Resource']['user_id'] = AuthComponent::user('id');
        $this->data['Resource']['name'] = $this->generateName($this->data['Resource']['category']);
        return true;
    }
} 