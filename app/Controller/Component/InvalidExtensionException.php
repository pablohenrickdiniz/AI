<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 17/10/14
 * Time: 07:40
 */

class InvalidExtensionException extends Exception{
    public function __construct($message, $code = 0, Exception $previous = null) {
        parent::__construct($message, $code, $previous);
    }

    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
} 