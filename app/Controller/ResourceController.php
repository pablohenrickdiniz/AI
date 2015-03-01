<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 01/02/15
 * Time: 16:18
 */

class ResourceController extends AppController{
    public function getResourcesTree()
    {
        $result['success'] = false;
        if (isset($this->request->data['id'])) {
           $result = $this->Resource->getTree();
        }
        echo json_encode($result);
    }
} 