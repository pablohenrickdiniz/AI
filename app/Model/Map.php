<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 28/01/15
 * Time: 08:49
 */

class Map extends AppModel{
    public $useTable = 'map';



    public function getTree(){
        $map = $this->read(array('id','name'));
        $root['title'] = $map['Map']['name'];
        $root['key'] = $map['Map']['id'];

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
} 