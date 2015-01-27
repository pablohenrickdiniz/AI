<?php


class PagesController extends AppController {
	public $uses = array();
    public $layout = 'admin';

    public function beforeFilter(){
        parent::beforeFilter();
        $this->Auth->allow('index');
    }



    public function admin(){

    }

    public function index(){

    }
}
