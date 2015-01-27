<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 15/10/14
 * Time: 21:41
 */

class Autor extends AppModel{
    public $useTable = 'autores';
    public $belongsTo = array('Arquivo' => array(
        'className' => 'Arquivo',
        'foreignKey' => 'foto'
    ));

    public function beforeSave($option=array()){
        $this->data['Autor']['nascimento'] = implode('-',array_reverse(explode('/',$this->data['Autor']['nascimento'])));
    }

    public function afterFind($results,$primary=false){
        foreach($results as $key => $value){
            if(isset($value['Autor']['nascimento'])){
                $results[$key]['Autor']['nascimento'] = implode('/',array_reverse(explode('-',$value['Autor']['nascimento'])));
            }
        }
        return $results;
    }
} 