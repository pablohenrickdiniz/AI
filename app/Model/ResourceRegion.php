<?php

/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 30/05/2015
 * Time: 17:26
 */
class ResourceRegion extends AppModel
{
    public $useTable = 'resource_region';
    public $hasAndBelongsToMany = array(
        'Category' => array(
            'className' => 'Category',
            'joinTable' => 'resource_region_category',
            'foreignKey' => 'resource_region_id',
            'associationForeignKey' => 'category_id'
        )
    );
} 