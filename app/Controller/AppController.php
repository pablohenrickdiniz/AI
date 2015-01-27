<?php
/**
 * Application level Controller
 *
 * This file is application-wide controller file. You can put all
 * application-wide controller-related methods here.
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Controller
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

App::uses('Controller', 'Controller');

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @package		app.Controller
 * @link		http://book.cakephp.org/2.0/en/controllers.html#the-app-controller
 */
class AppController extends Controller {
    public $layout = 'admin';
    public $components = array(
        'Session',
        'Auth' => array(
            'loginRedirect' => array('controller' => 'pages', 'action' => 'index'),
            'logoutRedirect' => array('controller' => 'pages', 'action' => 'index'),
            'loginError' => "<div class='alert alert-danger'>Usuário e/ou senha incorreto(s)</div>",
            'authError' => "<div class='alert alert-warning'>Você precisa estar <b>autenticado</b> para acessar esta página</div>",
            'authorize' => array('Controller') // Adicionamos essa linha
        )
    );
    public $model = 'App';
    public $messages = array(
        'add' => array(
            'success' => '',
            'error' => '',
            'show' => true
        ),
        'delete' => array(
            'success' => '',
            'error' => '',
            'show' => true
        ),
        'edit' => array(
            'success' => '',
            'error' => '',
            'show' => true
        ),
        'view' => array(
            'success' => '',
            'error' => '',
            'show' => true
        ),
        'all' => array(
            'success' => '',
            'error' => '',
            'show' => true
        )
    );

    public function beforeFilter(){
        $this->Auth->allow('add','edit','view','delete','all','deleteAjax');
    }

    public function isAuthorized($user){
        return true;
    }

    public function add(){
        $model = $this->model;
        if($this->request->is('post')){
            $success = $this->$model->save($this->request->data);
            if($this->messages['add']['show']){
                $this->showMessage('add',$success);
            }
            return $success;
        }
        return false;
    }


    public function edit($id=null){
        $model = $this->model;
        $row = $this->$model->findById($id);
        if($this->request->is('post')){
            $show = $this->messages['edit']['show'];
            if(empty($row)){
                if($show){
                    $this->showMessage('edit',false);
                }
            }
            else{
                $this->request->data[$model]['id'] = $id;
                $success = $this->$model->save($this->request->data);
                if($show){
                    if($success){
                        $row = $this->$model->findById($id);
                    }
                    $this->showMessage('edit',$success);
                }
            }
        }
        $this->request->data = $row;
        $this->set(strtolower($model),$row);
    }

    public function deleteAjax(){
        if($this->request->is('ajax') && $this->request->is('post')){
            $model = $this->model;
            $id = $this->request->data['id'];
            if($this->$model->delete($id)){
                echo json_encode(array('success' => true));
            }
            else{
                echo json_encode(array('success' => false));
            }
        }
    }

    public function delete($id = null){
        if($this->request->is('post')){
            $model = $this->model;
            $deleted = $this->$model->delete($id);
            $show = $this->messages['delete']['show'];
            if($show){
                $this->showMessage('delete',$deleted);
            }
        }
        $this->redirect(array('action' => 'all'));
    }

    public function all(){
        $model = $this->model;
        $paginate = array(
            'limit' => 20,
            'order' => array(
                $model.'.id' => 'DESC'
            )
        );
        $this->paginate = $paginate;
        $rows = $this->paginate($model);
        $this->set(strtolower($model).'s',$rows);
    }

    public function view($id){
        $model = $this->model;
        $row = $this->$model->findById($id);
        $show = $this->messages['view']['show'];
        if(empty($row) && $show){
            $this->showMessage('view',false);
        }
        $this->set(strtolower($model),$row);
    }

    public function showMessage($action,$status){
        if($status && isset($this->messages[$action]['success'])){
           $this->Session->setFlash(__($this->messages[$action]['success']),'sucesso');
        }
        else if(isset($this->messages[$action]['error'])){
            $this->Session->setFlash(__($this->messages[$action]['error']),'erro');
        }
    }
}
