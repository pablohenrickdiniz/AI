<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 28/01/15
 * Time: 21:53
 */

class Config extends AppModel{
    public $useTable = 'user_config';
    public $last_project_id = null;

    public function __construct($id = false,$table = null,$ds =null){
        parent::__construct($id,$table,$ds);
        $this->load();
    }

    private function load(){
        $user_id = AuthComponent::user('id');
        $config = $this->findByUserId($user_id);
        if(empty($config)){
            $config['Config'] = array(
                'user_id' => $user_id,
                'last_project_id' => null
            );
            $this->create();
            $this->save($config);
            $config['Config']['id'] = $this->getLastInsertID();
        }
        $this->id = $config['Config']['id'];
        $this->last_project_id = $config['Config']['last_project_id'];
    }

    public function setLastProjectId($project_id){
        $this->saveField('last_project_id',$project_id);
    }

    public function getLastProjectId(){
        return $this->last_project_id;
    }
} 