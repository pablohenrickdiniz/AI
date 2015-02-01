<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 31/01/15
 * Time: 18:44
 */

class DisponibleController extends AppController{
    public $model = 'Disponible';
    public $result = 'disponible';
    public $results = 'disponibles';
    public $uses = array('Map','Project','Disponible');
} 