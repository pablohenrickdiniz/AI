<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 01/02/15
 * Time: 14:16
 */

App::import('Model','Project');

class Resource extends AppModel{
    public $useTable = 'resource';
    public $project_id = null;
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
            $resources_folder = $this->getPath();
            $category_folder = $resources_folder.'/'.$category;
            if(!file_exists($category_folder)){
                mkdir($category_folder,777,true);
            }
        }
        return $root;
    }

    public function getPath(){
        $project = Project::getInstance();
        $project->id = $this->project_id;
        $project_path = $project->getPath();
        $resources_folder = $project_path.'/resources';
        if(!file_exists($resources_folder)){
            mkdir($resources_folder,777,true);
        }
        return $resources_folder;
    }

} 