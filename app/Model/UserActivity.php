<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 28/02/15
 * Time: 09:48
 */

class UserActivity extends AppModel{
    public $useTable = 'user_activity';
    public $validate = array(
        'last_ip' => array(
            'rule' => array('ip'),
            'message' => 'Endereço de ip Inválido'
        )
    );


    public function beforeSave($options=array()){
        $this->data['UserActivity']['last_login'] = date('Y-m-d H:i:s');
    }
} 