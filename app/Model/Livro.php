<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 15/10/14
 * Time: 21:40
 */

class Livro extends AppModel{
   public $belongsTo = array(
       'Autor' => array(
            'foreignKey' => 'autor_id'
       ),
       'ArquivoFoto' => array(
           'className' => 'Arquivo',
           'foreignKey' => 'capa'
       ),
       'ArquivoPdf' => array(
           'className' => 'Arquivo',
           'foreignKey' => 'arquivo_id'
       )
   );

   public function beforeSave($options=array()){
        if(isset($this->data['Livro']['data_publicacao'])){
            $this->data['Livro']['data_publicacao'] = implode('-',array_reverse(explode('/',$this->data['Livro']['data_publicacao'])));
        }
   }
} 