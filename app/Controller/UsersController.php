<?php

App::uses('AppController', 'Controller');
App::uses('CakeEmail', 'Network/Email');

class UsersController extends AppController {
    public $name = 'User';
    public $layout = "admin";
    
    public function beforeFilter() {
        $this->Auth->allow('logout','recover', 'recoverpassword','checkLogin','checkEmail');
    }


    public function view($id) {
        if($this->request->is('get')){
            $id = (int) $id;
            $user = $this->User->findById($id);
            $this->set('user', $user);
        }
    }

    public function login() {

    }
    
    public function disable($id){
        if($this->request->is('get')){
            $id = (int) $id;
            $this->User->read(null, $id);
            $this->User->set('active', 0);
            $this->User->save();
            $this->redirect (array('action' => 'view', $id));
        }
    }
    
    public function enable($id){

    }

    public function logout() {

    }

    public function delete($id = null){

    }

    public function recover() {

    }

    public function recoverpassword($userhash, $username) {

    }
    
    public function edit($id = null) {

    }

    public function changepass($id = null) {

    }
    
    public function all()
    {


    }


    public function add(){
        if($this->request->is('post')) {
            $this->request->data['User']['active'] = 1;
            if ($this->User->saveAll($this->request->data)) {
                $this->Session->setFlash(__('Usuario cadastrado com sucesso!'), 'sucesso');
                $this->redirect(array('controller' => 'users','action' => 'all'));
            }
            else{
                $this->Session->setFlash(__('Erro ao tentar cadastrar usuário'), 'erro');
            }
        }
    }

    public function checkLogin($login){
        if($this->request->is('post')){
            $this->autoRender = false;
            $user = $this->User->findByUsername($login);
            $user = array('user' => array('loginExists' => !empty($user)));
            echo json_encode($user);
        }
    }

    public function checkEmail($email){
        if($this->request->is('post')){
            $this->autoRender = false;
            $user = $this->User->findByEmail($email);
            $user = array('user' => array('emailExists' => !empty($user)));
            echo json_encode($user);
        }
    }
}
?>