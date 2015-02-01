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
            'allowEmpty' => false
        ),
        'display' => array(
            'rule' => 'notEmpty',
            'required' => true
        ),
        'width' => array(
            'rule' => '/^([0-9]{2,3}|1000)$/i',
            'required' => true
        ),
        'height' => array(
            'rule' => '/^([0-9]{2,3}|1000)$/i',
            'required' => true
        ),
        'scroll' => array(
            'rule' => '/^[0-3]$/i',
            'required' => true
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

    public function beforeDelete($cascade = false)
    {
        $deleted = $this->deleteAll(array(
            'Map.parent_id' => $this->id
        ));
        return $deleted;
    }


} 