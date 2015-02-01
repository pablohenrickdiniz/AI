<?php
/**
 * Application model for CakePHP.
 *
 * This file is application-wide model file. You can put all
 * application-wide model-related methods here.
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Model
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

App::uses('Model', 'Model');
App::import('Model','Disponible');
/**
 * Application model for Cake.
 *
 * Add your application-wide methods in the class below, your models
 * will inherit them.
 *
 * @package       app.Model
 */
class AppModel extends Model {
    public static $instances = [];


    public static function getInstance(){
        $class = get_called_class();
        if(!isset(self::$instances[$class])){
            self::$instances[$class] = new $class();
        }
        return self::$instances[$class];
    }
    /*
   public function beforeSave($options=array()){
       $class = get_class($this);
       $instance = Disponible::getInstance();
       $id = $instance->getNextID($class);
       if(!is_null($id)){
           $this->data[$class]['id'] = $id;
       }
   }

   public function afterSave($created,$options=array()){
       if($created){
           $class = get_class($this);
           $instance = Disponible::getInstance();
           try{
               $instance->deleteAll(array(
                   'Disponible.table_name' => $class,
                   'Disponible.table_id' => $this->getLastInsertID()
               ));
           }
           catch(Exception $ex){

           }
       }
   }

   public function afterDelete(){
       $class = get_class($this);
       $instance = Disponible::getInstance();
       $disponible['Disponible'] = array(
           'table_name' => $class,
           'table_id' => $this->id
       );
       try{
           $instance->save($disponible);
       }
       catch(Exception $ex){
           echo $ex;
       }
   }

   public function getFreeID(){
       $class = get_class($this);
       $results = $this->find('first',array(
           'fields' => array(
               'COALESCE(MAX('.$class.'.id)+1,1) as next_id'
           )
       ));
       return $results[0]['next_id'];
   }*/
}
