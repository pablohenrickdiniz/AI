<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 01/02/15
 * Time: 16:18
 */

class ResourceController extends AppController{
    public $layout = 'painel';
    public $result = 'resource';
    public $results = 'resources';



    public function index(){
        $this->paginate = array(
            'limit' => 20,
            'order' => array(
                'Resource.name'
            )
        );
        $resources = $this->paginate('Resource');
        $this->set('resources',$resources);
    }
} 