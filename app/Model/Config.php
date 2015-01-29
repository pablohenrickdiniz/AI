<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 28/01/15
 * Time: 21:53
 */

class Config extends AppModel{
    public $useTable = 'config';

    public function __construct($id = null,$table=null,$ds = null){
        parent::__construct($id,$table,$ds);
        if(!$this->exists(1)){
            $config['Config'] = array(
                'id' => 1
            );
            try{
                $this->save($config);
            }
            catch(Exception $ex){

            }
        }
    }


    public function setLastProjectId($id){
        $this->id = 1;
        $this->saveField('last_project_id',$id);
    }

    public function getLastProjectId(){
        $this->id = 1;
        $id = $this->field('last_project_id');
        $id = is_null($id)?0:$id;
        return $id;
    }

} 