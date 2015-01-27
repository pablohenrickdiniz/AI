<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 17/10/14
 * Time: 07:31
 */

class ArquivosController extends AppController{
    public $name = 'Arquivo';
    public $model = 'Arquivo';
    public $components = array('File');
    public $uses = array('Arquivo');
    public $pasta = 'arquivos';
    public $allowedExt = array('pdf','png','jpg');
    public $prefix = 'arquivos';

    public function beforeFilter(){
        parent::beforeFilter();
        $this->messages['add']['show'] = false;
        $this->messages['edit']['show'] = false;
        $this->messages['view']['show'] = false;
    }

    public function add(){
        $this->autoRender = false;
        if(!empty($this->request->data['Arquivo']['arquivo'])){
            $arquivo = $this->request->data['Arquivo']['arquivo'];
            $result['success'] = false;
            if(!empty($arquivo['tmp_name']) && file_exists($arquivo['tmp_name'])){
                $info = pathinfo($arquivo['name']);
                $sha1 = sha1_file($arquivo['tmp_name']);
                $repetidos = $this->Arquivo->find('all',array(
                    'conditions' => array(
                        'Arquivo.sha1' => $sha1
                    )
                ));
                if(count($repetidos) > 0){
                    foreach($repetidos as $repetido){
                        if($this->File->identical($arquivo['tmp_name'],WWW_ROOT.'/files/arquivos/'.$repetido['Arquivo']['path'])){
                            $result['id'] = $repetido['Arquivo']['id'];
                            $result['success'] = true;
                            $result['completepath'] = Router::url('/files/arquivos/'.$repetido['Arquivo']['path']);
                            break;
                        }
                    }
                }
                else if(isset($info['extension'])){
                    $name = $this->prefix.'-'.md5(uniqid(rand(), true));
                    try{
                        $filename = $this->File->upload($arquivo,$name,$this->allowedExt,$this->pasta);
                        $this->request->data['Arquivo']['nome'] = $arquivo['name'];
                        $this->request->data['Arquivo']['path'] = $filename;
                        $this->request->data['Arquivo']['tipo'] = $info['extension'];
                        $this->request->data['Arquivo']['sha1'] = $sha1;
                        $this->request->data['Arquivo']['ativo'] = 0;
                        $this->request->data['Arquivo']['data_envio'] = date('Y-m-d H:i:s');
                        $result['success'] = false;
                        if(parent::add()){
                            $model = $this->model;
                            $id = $this->$model->getLastInsertId();
                            $completePath = Router::url('/files/'.$this->pasta.'/'.$filename);
                            $result['id'] = $id;
                            $result['success'] = true;
                            $result['completepath'] = $completePath;
                        }

                    }catch(Exception $x){

                    }
                }
            }
            echo json_encode($result);
        }
    }
} 