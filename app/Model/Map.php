<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 28/01/15
 * Time: 08:49
 */

class Map extends AppModel{
    public $useTable = 'map';
    public $validate = array(
        'name' => array(
            'rule' => '/^[A-Za-z0-9]+$/i',
            'required' => true,
            'allowEmpty' => false
        ),
        'display_name' => array(
            'rule' => 'notEmpty',
            'required' => true
        ),
        'width' => array(
            'rule-1' => array(
                'rule' => array('comparison','>=',10)
            ),
            'rule-2' => array(
                'rule' => array('comparison','<=',1000)
            ),
            'required' => true,
            'allowEmpty' => false
        ),
        'height' => array(
            'rule-1' => array(
                'rule' => array('comparison','>=',10)
            ),
            'rule-2' => array(
                'rule' => array('comparison','<=',1000)
            ),
            'required' => true,
            'allowEmpty' => false
        ),
        'scroll_type' => array(
            'rule-1' => array(
                'rule' => array('comparison','>=',0)
            ),
            'rule-2' => array(
                'rule' => array('comparison','<=',3)
            ),
            'required' => true,
            'allowEmpty' => false
        )
    );

    public function beforeSave($options = array()){
        $continue = isset($this->data['Map']['project_id']) || isset($this->data['Map']['parent_id']);
        if($continue){
            $name = trim($this->data['Map']['name']);
            $options['conditions']['Map.name'] = $name;
            if(isset($this->data['Map']['project_id'])){
                unset($this->data['Map']['parent_id']);
                $project_id = $this->data['Map']['project_id'];
                $options['conditions']['Map.project_id'] = $project_id;
            }
            else{
                $parent_id = $this->data['Map']['parent_id'];
                unset($this->data['Map']['project_id']);
                $options['conditions']['Map.parent_id'] = $parent_id;
            }
            $count = $this->find('count',$options);
            $continue = $count == 0;
        }

        return $continue;
    }

    public function getTree(){
        $map = $this->read(array('id','name','expand'));
        $root['title'] = $map['Map']['name'];
        $root['key'] = $map['Map']['id'];
        $root['expand'] = $map['Map']['expand'];
        $root['addClass'] = 'map';

        $maps = $this->find('all',array(
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

        for($i=0;$i<count($maps);$i++){
            $this->id = $maps[$i]['Map']['id'];
            $root['children'][$i] = $this->getTree();
        }
        return $root;
    }

    public function beforeDelete($cascade = false){
        $deleted = $this->deleteAll(array(
            'Map.parent_id' => $this->id
        ));
        return $deleted;
    }


} 