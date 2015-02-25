<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 01/02/15
 * Time: 14:16
 */

class Resource extends AppModel{
    public $useTable = 'resource';
    public static $category = array(
        0 => 'Animation',
        1 => 'Battleback',
        2 => 'Battler',
        3 => 'Character',
        4 => 'Face',
        5 => 'Parallaxe',
        6 => 'Picture',
        7 => 'System',
        8 => 'Tileset',
        9 => 'Title',
        10 => 'BGM',
        11 => 'BGS',
        12 => 'ME',
        13 => 'SE'
    );

    public static function getCategories(){
        return self::$category;
    }
} 