<?php

/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 30/01/15
 * Time: 22:11
 */
class MapController extends AppController
{
    public $model = 'Map';
    public $results = 'maps';
    public $result = 'map';
    public $autoRender = false;
    public $types = array('cut', 'copy');
    public $authorization = array(
        'user' => array(
            'add',
            'paste',
            'load',
            'edit',
            'expand',
            'delete',
            'getChildren'
        )
    );

    public function beforeFilter()
    {
        if ($this->request->is('ajax') && $this->request->is('post')) {
            parent::beforeFilter();
        }
    }

    public function add()
    {
        $response['success'] = false;
        if ($this->Map->save($this->request->data)) {
            $this->Map->id = $this->Map->getLastInsertID();
            $response['node'] = $this->Map->getNode();
            $response['success'] = true;
        }
        $response['errors'] = $this->Map->validationErrors;
        echo json_encode($response);
    }

    private function existInParent($id, $parent)
    {
        $parent = $this->Map->findById($parent);
        $exists = false;
        if (!empty($parent) && !is_null($parent['Map']['parent_id'])) {
            if ($parent['Map']['parent_id'] == $id) {
                $exists = true;
            } else {
                $exists = $this->existInParent($id, $parent['Map']['parent_id']);
            }
        }
        return $exists;
    }

    public function paste()
    {
        $response['success'] = false;
        $response['errors'] = [];
        $continue = $this->request->data['id'];
        if ($continue) {
            $parent_label = null;
            $null_label = null;
            $parent_id = null;
            if (isset($this->request->data['parent_id'])) {
                $parent_id = $this->request->data['parent_id'];
                $parent_label = 'parent_id';
                $null_label = 'project_id';
            } else if (isset($this->request->data['project_id'])) {
                $parent_id = $this->request->data['project_id'];
                $parent_label = 'project_id';
                $null_label = 'parent_id';
            } else {
                $continue = false;
            }
            if ($continue) {
                $continue = isset($this->request->data['type']);
                if ($continue) {
                    $id = $this->request->data['id'];
                    $continue = ($id != $parent_id);
                    if ($continue) {
                        $type = $this->request->data['type'];
                        $continue = in_array($type, $this->types);
                        if ($continue) {
                            $this->Map->id = $id;
                            if ($this->Map->exists() && $this->Map->isAuthorized()) {
                                $map = $this->Map->read();
                                if ($type == 'cut') {
                                    if (!$this->existInParent($id, $parent_id)) {
                                        try {
                                            $continue = $this->Map->updateAll(
                                                array(
                                                    $parent_label => $parent_id,
                                                    $null_label => null
                                                ),
                                                array(
                                                    'id' => $id
                                                )
                                            );
                                        } catch (Exception $ex) {
                                            $continue = false;
                                            $response['errors']['cut'] = $ex->getCode();
                                        }
                                    } else {
                                        $continue = false;
                                    }
                                } else if ($type == 'copy') {
                                    $map = $this->Map->getRecursive($map['Map']['id']);
                                    $map['Map'][$parent_label] = $parent_id;
                                    unset($map['Map'][$null_label]);
                                    $this->Map->begin();
                                    $continue = $this->copyRecursive($map);
                                    if ($continue) {
                                        $this->Map->commit();
                                    } else {
                                        $this->Map->rollback();
                                    }
                                } else {
                                    $continue = false;
                                }
                                $response['errors'] = array_merge($response['errors'], $this->Map->validationErrors);
                                if ($continue) {
                                    $response['success'] = true;
                                    $this->Map->id = $map['Map']['id'];
                                    $node = $this->Map->getNode();
                                    $response['node'] = $node;
                                }
                            }
                        }
                    }
                }
            }
        }
        echo json_encode($response);
    }

    private function copyRecursive(&$map)
    {
        $children = $map['Children'];
        unset($map['Children']);
        unset($map['Map']['id']);
        $this->Map->create();
        $continue = $this->Map->save($map);
        if ($continue) {
            $parent_id = $this->Map->getLastInsertId();
            $map['Map']['id'] = $parent_id;
            for ($i = 0; $i < count($children); $i++) {
                if ($continue) {
                    $children[$i]['Map']['parent_id'] = $parent_id;
                    $continue = $this->copyRecursive($children[$i]);
                } else {
                    break;
                }
            }
        }
        return $continue;
    }

    public function load()
    {
        $result['success'] = false;
        if (isset($this->request->data['id'])) {
            $id = $this->request->data['id'];
            $this->Map->id = $id;
            if ($this->Map->exists() && $this->Map->isAuthorized()) {
                $map = $this->Map->read(array('Map.name', 'Map.display', 'Map.width', 'Map.height', 'Map.scroll', 'Map.user_id'));
                $map = array(
                    'name' => $map['Map']['name'],
                    'display' => $map['Map']['display'],
                    'width' => $map['Map']['width'],
                    'height' => $map['Map']['height'],
                    'scroll' => $map['Map']['scroll']
                );
                $result['map'] = $map;
                $result['success'] = true;
            }
        }
        echo json_encode($result);
    }

    public function edit($id = null)
    {
        $result['success'] = false;
        if (isset($this->request->data['Map']['id'])) {
            $id = $this->request->data['Map']['id'];
            $this->Map->id = $id;
            if ($this->Map->exists() && $this->Map->isAuthorized()) {
                $map_edit = $this->request->data['Map'];
                $map = $this->Map->read();
                $map['Map']['name'] = $map_edit['name'];
                $map['Map']['display'] = $map_edit['display'];
                $map['Map']['width'] = $map_edit['width'];
                $map['Map']['height'] = $map_edit['height'];
                $map['Map']['scroll'] = $map_edit['scroll'];
                if ($this->Map->save($map)) {
                    $result['success'] = true;
                    $result['node'] = $this->Map->getNode();
                }
                else{
                    $result['errors'] = $this->Map->validationErrors;
                }
            }
        }
        echo json_encode($result);
    }

    public function expand()
    {
        $result['success'] = false;
        if (isset($this->request->data['expand'])) {
            $expand = $this->request->data['expand'];
            $id = $this->request->data['id'];
            $this->Map->id = $id;
            if ($this->Map->exists() && $this->Map->isAuthorized()) {
                $user_id = AuthComponent::user('id');
                $saved = $this->Map->updateAll(
                    array(
                        'Map.expand' => $expand
                    ),
                    array(
                        'Map.id' => $id,
                        'Map.user_id' => $user_id
                    )
                );
                if ($saved) {
                    $result['success'] = true;
                }
            }
        }
        echo json_encode($result);
    }

    public function delete($id = null)
    {
        $result['success'] = false;
        $result['errors'] = [];
        if (isset($this->request->data['id'])) {
            $id = $this->request->data['id'];
            $this->Map->id = $id;
            if ($this->Map->exists() && $this->Map->isAuthorized()) {
                try {
                    if ($this->Map->delete($id)) {
                        $result['success'] = true;
                    }
                } catch (Exception $ex) {
                    $result['errors']['exception'] = $ex->getMessage();
                }
            }
        }
        echo json_encode($result);
    }

    public function getChildren()
    {
        if (isset($this->request->data['id'])) {
            $id = $this->request->data['id'];
            $result = [];
            $this->Map->id = $id;
            if ($this->Map->exists() && $this->Map->isAuthorized()) {
                try {
                    $children = $this->Map->getChildrenNodes();
                    $result = $children;
                } catch (Exception $ex) {

                }
            }
            echo json_encode($result);
        }
    }
} 