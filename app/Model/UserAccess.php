<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 28/02/15
 * Time: 09:47
 */

class UserAccess extends AppModel{
    public $useTable = 'user_access_log';
    public $validate = array(
        'ip' => array(
            'rule' => array('ip'),
            'message' => 'Endereço de ip Inválido'
        )
    );

    public function beforeSave($options=array()){
        $this->data['UserAccess']['date'] = date('Y-m-d H:i:s');
    }
} 