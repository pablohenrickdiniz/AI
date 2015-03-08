<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 01/02/15
 * Time: 14:16
 */

App::import('Model','Project');
App::import('Model','User');

class Resource extends AppModel{
    public $useTable = 'resource';
    public $project_id = null;
    public $file = null;
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

    public $validate = array(
        'name' => array(
            'rule' => 'notEmpty',
            'required' => true
        ),
        'category' => array(
            'rule' => array(
                array('comparison','>=',0),
                array('comparison','<=',13)
            ),
            'message' => 'A categoria selecionada não existe'
        ),
        'user_id' => array(
            'rule' => 'check_user_exists',
            'message' => 'O usuário não existe'
        )
    );


    public function check_user_exists(){
        $valid = isset($this->data['Resource']['user_id']);
        if($valid){
            $id = $this->data['Resource']['user_id'];
            $User = User::getInstance();
            $valid = $User->exists($id);
        }

        return $valid;
    }

    public function getCategories(){
        return $this->$categories;
    }

    public function getTree(){
        $root['title'] = 'recursos';
        $root['isFolder'] = true;
        $root['addClass'] = 'resources';
        $root['children'] = [];
        $categories = $this->categories;
        foreach($categories as $key => $category){
            $root['children'][] = array(
                'title' => $category,
                'addClass' => 'resource',
                'key' => $key
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

    public function beforeDelete($cascade = false){
        $file = $this->field('file');
        $category = $this->field('category');
        $this->file = $file;
        $this->category = $category;
    }

    public function afterDelete(){
        $file = $this->file;
        $category_folder = $this->getCategoryFolder($this->category);
        $file_path = $category_folder.'/'.$file;
        if(file_exists($file_path)){
            @unlink($file_path);
        }
    }
} 