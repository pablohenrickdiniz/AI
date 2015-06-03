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
    public $components = array(
        'Session',
        'Auth' => array(
            'loginRedirect' => array('controller' => 'pages', 'action' => 'index'),
            'logoutRedirect' => array('controller' => 'users', 'action' => 'login'),
            'loginError' => "<div class='alert alert-danger'>Usuário e/ou senha incorreto(s)</div>",
            'authError' => "<div class='alert alert-warning'>Você precisa estar <b>autenticado</b> para acessar esta página</div>",
            'authorize' => array('Controller') // Adicionamos essa linha
        )
    );
    public $result = 'result';
    public $results = 'results';
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
    public $authorization = array(
        'adm' => array(
            'add',
            'addAjax',
            'all',
            'edit',
            'delete',
            'deleteAjax'
        )
    );
    public $layout = 'panel';

    public function beforeFilter(){
        if(isset($this->authorization['public'])){
            $this->Auth->allow($this->authorization['public']);
        }
    }

    public function isAuthorized($user){
        if(isset($user['role'])){
            if(isset($this->authorization[$user['role']])){
                $authorization = $this->authorization[$user['role']];
                return in_array($this->action,$authorization);
            }

        }
        return false;
    }

    public function add(){
        $model = $this->modelClass;
        if($this->request->is('post')){
            $success = $this->$model->saveAll($this->request->data);
            if(!isset($this->messages['add']['show']) || $this->messages['add']['show']){
                $this->showMessage('add',$success);
            }
            return $success;
        }
        return false;
    }


    public function addAjax(){
        $result['success'] = false;
        if($this->request->is('ajax')){
            $result['success'] = $this->add()?true:false;
        }
        echo json_encode($result);
    }

    public function edit($id=null){
        $model = $this->modelClass;
        $row = $this->$model->findById($id);
        $success = false;
        if($this->request->is('post')){
            $show = !isset($this->messages['edit']['show']) || $this->messages['edit']['show'];
            if(empty($row)){
                if($show){
                    $this->showMessage('edit',false);
                }
            }
            else{
                $this->request->data[$model]['id'] = $id;
                $success = $this->$model->saveAll($this->request->data);
                if($success){
                    $row = $this->$model->findById($id);
                }
                if($show){
                    $this->showMessage('edit',$success);
                }
            }
        }
        $this->request->data = $row;
        $this->set($this->result,$row);
        return $success;
    }

    public function deleteAjax(){
        $this->autoRender = false;
        if($this->request->is('ajax') && $this->request->is('post')){
            $model = $this->modelClass;
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
            $model = $this->modelClass;
            $deleted = $this->$model->delete($id);
            $show = !isset($this->messages['delete']['show']) || $this->messages['delete']['show'];
            if($show){
                $this->showMessage('delete',$deleted);
            }
        }
        $this->redirect(array('action' => 'all'));
    }

    public function all($options=array(),$return = false){
        $model = $this->modelClass;
        $default = array(
            'limit' => 20,
            'order' => array(
                $model.'.id' => 'DESC'
            )
        );
        foreach($options as $key => $option){
            $default[$key] = $option;
        }
        $this->paginate = $default;
        $rows = $this->paginate($model);
        if($return){
            return $rows;
        }
        $this->set($this->results,$rows);
    }

    public function view($id){
        $model = $this->modelClass;
        $row = $this->$model->findById($id);
        $show = !isset($this->messages['view']['show']) || $this->messages['view']['show'];
        if(empty($row) && $show){
            $this->showMessage('view',false);
        }
        $this->set($this->result,$row);
    }

    public function index(){

    }

    public function showMessage($action,$status){
        if($status && isset($this->messages[$action]['success'])){
            $this->Session->setFlash(__($this->messages[$action]['success']),'sucesso');
        }
        else if(isset($this->messages[$action]['error'])){
            $this->Session->setFlash(__($this->messages[$action]['error']),'erro');
        }
    }

    public function allow(Array $array){
        foreach($array as $role => $actions){
            if(!isset($this->authorization[$role])){
                $this->authorization[$role] = [];
            }

            for($i=0;$i<count($actions);$i++){
                if(!in_array($actions[$i],$this->authorization[$role])){
                    $this->authorization[$role][] = $actions[$i];
                }
            }
        }
    }

    public function deny(Array $array){
        foreach($array as $role => $actions){
            if(isset($this->authorization[$role])){
                $result = array_diff($this->authorization[$role],$actions);
                $this->authorization[$role] = $result;
            }
        }
    }
}
