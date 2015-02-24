<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 15/10/14
 * Time: 21:44
 */

class User extends AppModel{
    public $validate = array(
        'username' => array(
            'aplphaNumeric' => array(
                'rule' => 'AlphaNumeric',
                'messagem' => 'O nome de usuário deve conter letras e números apenas',
                'required' => true
            ),
            'size' => array(
                'rule' => array('minLength','6'),
                'message' => 'O nome de usuário deve conter no mínimo 6 caracteres'
            ),
            'unique' => array(
                'rule' => 'isUnique',
                'message' => 'Esse nome de usuário já esta sendo utilizado'
            )
        ),
        'password' => array(
            'rule' => array('minLength','8'),
            'message' => 'A senha deve conter no mínimo 8 caracteres',
            'required' => true,
        ),
        'confirm' => array(
            'rule' => 'checkPassword',
            'message' => 'As senhas não combinam'
        ),
        'email' => array(
            'expressao' => array(
                'rule' => 'email',
                'message' => 'Esse endereço de email não é válido',
                'required' => true
            ),
            'unique' => array(
                'rule' => 'isUnique',
                'message' => 'Esse endereço de email já está sendo usado'
            )
        )
    );

    public function checkPassword(){
        $password = $this->data['User']['password'];
        $confirm = $this->data['User']['confirm'];
        return $password === $confirm;
    }

    public function beforeSave($options=array()){
        $this->data['User']['password'] = AuthComponent::password($this->data['User']['password']);
    }
} 