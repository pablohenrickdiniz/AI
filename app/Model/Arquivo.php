<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 15/10/14
 * Time: 21:40
 */

class Arquivo extends AppModel{
    public function beforeDelete($cascade=true){
        $arquivo = $this->findById($this->id);
        unlink(WWW_ROOT.'/files/arquivos/'.$arquivo['Arquivo']['path']);
    }

} 