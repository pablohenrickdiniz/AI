<?php

/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 28/01/15
 * Time: 08:49
 */
class Map extends AppModel
{
    public $useTable = 'map';
    public $validate = array(
        'name' => array(
            'rule' => '/^[A-Za-z0-9]+$/i',
            'required' => true,
            'allowEmpty' => false,
            'message' => 'O nome do mapa deve conter somente letras ou números'
        ),
        'display' => array(
            'rule' => 'notEmpty',
            'message' => 'O nome de exibição deve ser informado',
            'required' => true
        ),
        'width' => array(
            'rule' => '/^([0-9]{2,3}|1000)$/i',
            'required' => true,
            'message' => 'A largura do mapa deve ser de no mínimo 10 e no máximo 1000 (quadrados de 32px)'
        ),
        'height' => array(
            'rule' => '/^([0-9]{2,3}|1000)$/i',
            'required' => true,
            'message' => 'A altura do mapa deve ser de no mínimo 10 e no máximo 1000 (quadrados de 32px)'
        ),
        'scroll' => array(
            'regra' => array(
                'rule' => '/^[0-9]$/',
                'message' => 'O tipo de rolagem de mapa informado não existe'
            )
        )
    );

    public function beforeSave($options = array())
    {
        $continue = true;

        if (isset($this->data['Map']['project_id'])) {
            unset($this->data['Map']['parent_id']);
        } else if (isset($this->data['Map']['parent_id'])) {
            unset($this->data['Map']['project_id']);
        } else {
            $continue = false;
        }

        if ($continue && !isset($this->data['Map']['id'])) {
            $name = trim($this->data['Map']['name']);
            $options['conditions']['Map.name'] = $name;
            if (isset($this->data['Map']['project_id'])) {
                $project_id = $this->data['Map']['project_id'];
                $options['conditions']['Map.project_id'] = $project_id;
            } else {
                $parent_id = $this->data['Map']['parent_id'];
                $options['conditions']['Map.parent_id'] = $parent_id;
            }
            $count = $this->find('count', $options);
            $continue = $count == 0;
        }

        return $continue;
    }

    public function getTree()
    {
        $map = $this->read(array('id', 'name', 'expand'));
        $root['title'] = $map['Map']['name'];
        $root['key'] = $map['Map']['id'];
        $root['expand'] = $map['Map']['expand'];
        $root['addClass'] = 'map';

        $maps = $this->find('all', array(
            'fields' => array(
                'Map.id'
            ),
            'conditions' => array(
                'Map.parent_id' => $this->id
            ),
            'order' => array(
                'Map.name' => 'ASC'
            )
        ));



        for ($i = 0; $i < count($maps); $i++) {
            $this->id = $maps[$i]['Map']['id'];
            $root['children'][$i] = $this->getTree();
        }
        return $root;
    }

    public function getRecursive($id){
        $map = $this->findById($id);
        if(!empty($map)){
            $map['Children'] = $this->getChildrenRecursive($map);
        }
        return $map;
    }

    private function getChildrenRecursive($map){
        $children = $this->getChildren($map['Map']['id']);
        for($i=0;$i<count($children);$i++){
            $children[$i]['Children'] = $this->getChildrenRecursive($children[$i]);
        }
        return $children;
    }

    public function beforeDelete($cascade = true)
    {
        $id = $this->id;
        $children = $this->getChildrenID();
        $deleted = false;
        $this->begin();
        try{
            $deleted = true;
            for($i = 0; $i<count($children);$i++){
                if($deleted){
                    $deleted = $this->delete($children);
                }
                else{
                    break;
                }
            }
        }
        catch(Exception $ex){

        }
        if($deleted){
            $this->commit();
        }
        else{
            $this->rollback();
        }
        $this->id = $id;
        return $deleted;
    }

    public function getChildren($id){
        $children = $this->find('all',array(
            'conditions' => array(
                'Map.parent_id' => $id
            )
        ));
        return $children;
    }

    public function getChildrenID(){
        $children = $this->find('list',array(
            'fields' => array(
                'Map.id'
            ),
            'conditions' => array(
                'Map.parent_id' => $this->id
            )
        ));
        return $children;
    }
} 