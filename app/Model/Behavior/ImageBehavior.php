<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 20/04/15
 * Time: 23:04
 */
App::import('Behavior','File');

class ImageBehavior extends FileBehavior{
    public function setup(Model $model, $settings=array()){
        $settings = array_merge(
            array(
                'fields' => 'imagem',
                'root' => 'img',
                'prefix' => 'Image-',
                'largura' => 700,
                'exts' => array('jpg','png','jpeg')
            ),
            $settings
        );

        parent::setup($model,$settings);
    }

    public function afterValidate(Model $model)
    {
        $class = get_class($this);
        $fields = (Array)$this->settings[$class][$model->alias]['fields'];
        $update = $this->settings[$class][$model->alias]['update'];
        $continue = false;
        foreach($fields as $key => $field){
            if(isset($model->data[$model->alias][$key]['tmp_name'])){
                $tmp_name = $model->data[$model->alias][$key]['tmp_name'];
                $complete_path = $this->getCompletePath($model);
                $name =  $this->settings[$class][$model->alias]['prefix'].sha1(uniqid(rand(),true)).'.'.$this->ext($tmp_name);
                $path = $this->cleanPath($complete_path.DS.$name);
                $mime = $this->mime($tmp_name);
                $image = null;
                $nova = null;
                switch($mime){
                    case 'image/jpeg':
                        $image = @imagecreatefromjpeg($tmp_name);
                        break;
                    case 'image/png':
                        $image = @imagecreatefrompng($tmp_name);
                }

                $continue = !is_null($image);
                if($continue){
                    if($continue){
                        if($continue){
                            $x = @imagesx($image);
                            $y = @imagesy($image);
                            $continue = $x > 0 && $y > 0;
                            if($continue){
                                $altura = ($this->settings[$class][$model->alias]['largura'] * $y) / $x;
                                $nova = @imagecreatetruecolor($this->settings[$class][$model->alias]['largura'], $altura);
                                if($mime == 'image/png'){
                                    @imagecolortransparent($nova, imagecolorallocatealpha($image, 0, 0, 0, 127));
                                    $continue = @imagealphablending($nova, false);
                                    if($continue){
                                        $continue = @imagesavealpha($nova, true);
                                    }
                                }
                                $continue = !is_null($nova);
                                if($continue){
                                    if($continue){
                                        $continue = @imagecopyresampled($nova, $image, 0, 0, 0, 0, $this->settings[$class][$model->alias]['largura'], $altura, $x, $y);
                                    }
                                }
                            }
                        }
                    }
                }
                if($continue){
                    switch($mime){
                        case 'image/jpeg':
                            $continue = @imagejpeg($nova,$path);
                            break;
                        case 'image/png':
                            $continue = @imagepng($nova,$path);
                    }
                }
                @imagedestroy($nova);
                @imagedestroy($image);
                $model->data[$model->alias][$key] = $name;
            }
        }
        return $continue || $update;
    }
} 