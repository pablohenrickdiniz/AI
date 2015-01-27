<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 15/10/14
 * Time: 21:44
 */

class User extends AppModel{
    public function beforeSave($options=array()){
        $this->data['User']['password'] = AuthComponent::password($this->data['password']);
    }
} 