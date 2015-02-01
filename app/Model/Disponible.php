<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 31/01/15
 * Time: 17:50
 */

class Disponible extends Model{
    public $useTable = 'disponibleid';
    public static $instance = null;

    public static function getInstance(){
        if(is_null(self::$instance)){
            self::$instance = new Disponible();
        }
        return self::$instance;
    }

    public function getNextID($class){
        $result = $this->find('first',array(
            'conditions' => array(
                'Disponible.table_name' => $class
            )
        ));
        if(!empty($result)){
            return $result['Disponible']['table_id'];
        }
        return null;
    }

    public function getFreeID(){
        $results = $this->find('first',array(
            'fields' => array(
                'COALESCE(MAX(Disponible.id),1) as next_id'
            )
        ));
        return $results[0]['next_id'];
    }


    public function beforeSave($options=array()){
        $id = $this->getNextID('Disponible');
        if(!is_null($id)){
            $this->data['Disponible']['id'] = $id;
        }
    }

    public function afterSave($created,$options=array()){
        if($created){
            try{
                $this->deleteAll(array(
                    'Disponible.table_name' => 'Disponible',
                    'Disponible.table_id' => $this->getLastInsertID()
                ));
            }
            catch(Exception $ex){

            }
        }
    }

    public function afterDelete(){
        $disponible['Disponible'] = array(
            'Disponible.table_name' => 'Disponible',
            'Disponible.table_id' => $this->id
        );
        try{
            $this->save($disponible);
        }
        catch(Exception $ex){

        }
    }
} 