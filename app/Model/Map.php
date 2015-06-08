<?php

/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 28/01/15
 * Time: 08:49
 */
App::import('Model', 'Project');

class Map extends AppModel
{
    public $useTable = 'map';
    public $validate = array(
        'name' => array(
            'rule1' => array(
                'rule' => '/^[A-Za-z0-9]+$/i',
                'required' => true,
                'allowEmpty' => false,
                'message' => 'O nome do mapa deve conter somente letras ou números'
            ),
            'rule2' => array(
                'rule' => 'checkName',
                'message' => 'Já existe um arquivo com esse nome nesse diretório'
            )
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
        ),
        'project_id' => array(
            'rule' => 'checkParent',
            'required' => false
        ),
    );

    public function checkName(){
        $continue = isset($this->data['Map']['name']);
        if($continue){
            if(isset($this->data['Map']['parent_id']) && !is_null($this->data['Map']['parent_id'])){
                $conditions['Map.parent_id'] = $this->data['Map']['parent_id'];
            }
            else if(isset($this->data['Map']['project_id']) && !is_null($this->data['Map']['project_id'])){
                $conditions['Map.project_id'] = $this->data['Map']['project_id'];
            }
            else{
                $continue = false;
            }

            if($continue){
                $id = null;
                if(isset($this->data['Map']['id'])){
                    $id = $this->data['Map']['id'];
                    $conditions['Map.id !='] = $id;
                }

                $name = $this->data['Map']['name'];
                $conditions['Map.name'] = $name;
                $continue = !$this->hasAny($conditions);
            }
        }

        return $continue;
    }

    public function checkParent()
    {
        $project_set = isset($this->data['Map']['project_id']);
        $parent_set = isset($this->data['Map']['parent_id']);
        if (!$project_set && !$parent_set) {
            return false;
        }

        $project_id = null;
        $parent_id = null;

        if ($project_set) {
            $project_id = $this->data['Map']['project_id'];
        }

        if ($parent_set) {
            $parent_id = $this->data['Map']['parent_id'];
        }

        return !(is_null($parent_id) && is_null($project_id) || !is_null($parent_id) && !is_null($project_id));
    }

    public function beforeSave($options = array())
    {
        $continue = true;
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
            if ($continue) {
                $this->data['Map']['user_id'] = AuthComponent::user('id');
            }
        }

        return $continue;
    }

    public function afterSave($created, $options = array())
    {
        $Project = Project::getInstance();
        $Project->begin();
        $this->begin();
        $updated = false;
        try {
            if (isset($this->data['Map']['project_id'])) {
                $updated = $Project->updateAll(
                    array(
                        'Project.isLazy' => true
                    ),
                    array(
                        'Project.id' => $this->data['Map']['project_id']
                    )
                );
            } else if (isset($this->data['Map']['parent_id'])) {
                $updated = $this->updateAll(
                    array(
                        'Map.isLazy' => true
                    ),
                    array(
                        'Map.id' => $this->data['Map']['parent_id']
                    )
                );
            }
        } catch (Exception $ex) {

        }
        if ($updated) {
            $Project->commit();
            $this->commit();
        } else {
            $Project->rollback();
            $this->rollback();
        }
    }

    public function getChildrenNodes()
    {
        $maps = $this->find('all', array(
            'conditions' => array(
                'Map.parent_id' => $this->id
            ),
            'order' => array(
                'Map.name' => 'ASC'
            )
        ));
        $children = [];

        if(empty($maps)){
            $this->saveField('isLazy',false);
        }

        foreach ($maps as $map) {
            $children[] = array(
                'title' => $map['Map']['name'],
                'key' => $map['Map']['id'],
                'expand' => $map['Map']['expand'],
                'metadata' => array(
                    'type' => 'map'
                )
            );
        }
        return $children;
    }

    public function getNode()
    {
        $map = $this->read(array('id', 'name', 'expand', 'isLazy'));
        $node = array(
            'key' => $map['Map']['id'],
            'title' => $map['Map']['name'],
            'expand' => $map['Map']['expand'],
            'metadata' => array(
                'type' => 'map'
            )
        );
        return $node;
    }

    public function getRecursive($id)
    {
        $map = $this->findById($id);
        if (!empty($map)) {
            $map['Children'] = $this->getChildrenRecursive($map);
        }
        return $map;
    }

    private function getChildrenRecursive($map)
    {
        $children = $this->getChildren($map['Map']['id']);
        for ($i = 0; $i < count($children); $i++) {
            $children[$i]['Children'] = $this->getChildrenRecursive($children[$i]);
        }
        return $children;
    }

    public function afterDelete()
    {
        $Project = Project::getInstance();
        $Project->begin();
        $this->begin();
        $updated = false;
        try {
            $hasChildren = $this->hasAny(array('Map.project_id' => $this->project_id));
            if(!$hasChildren){
                $updated = $Project->updateAll(
                    array(
                        'Project.isLazy' => false
                    ),
                    array(
                        'Project.id' => $this->project_id
                    )
                );
            }
            else{
                $updated = true;
            }

            if($updated){
                $hasChildren = $this->hasAny(array('Map.parent_id' => $this->parent_id));
                if(!$hasChildren){
                    $updated = $this->updateAll(
                        array(
                            'Map.isLazy' => false
                        ),
                        array(
                            'Map.id' => $this->parent_id
                        )
                    );
                }
            }
        } catch (Exception $ex) {

        }
        if ($updated) {
            $Project->commit();
            $this->commit();
        } else {
            $Project->rollback();
            $this->rollback();
        }
    }

    public function beforeDelete($cascade = true)
    {
        $id = $this->id;
        $deleted = false;
        $this->begin();
        try {
            $deleted = $this->deleteAll(array(
                'Map.parent_id' => $id
            ));
         } catch (Exception $ex) {

        }
        if ($deleted) {
            $this->commit();
        } else {
            $this->rollback();
        }
        $this->id = $id;
        $map = $this->read(array('Map.parent_id', 'Map.project_id'));
        $this->parent_id = $map['Map']['parent_id'];
        $this->project_id = $map['Map']['project_id'];
        return $deleted;
    }

    public function getChildren($id)
    {
        $children = $this->find('all', array(
            'conditions' => array(
                'Map.parent_id' => $id
            )
        ));
        return $children;
    }

    public function getChildrenID()
    {
        $children = $this->find('list', array(
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