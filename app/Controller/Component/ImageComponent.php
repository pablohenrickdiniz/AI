<?php

class ImageComponent extends Component{
    public $exts = array(
        'jpg',
        'png',
        'gif'
    );
    public $mime = array(
        'image/jpg',
        'image/png',
        'image/gif'
    );

    public function getMime($file){
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo,$file);
        finfo_close($finfo);
        return $mime;
    }

    public function redimensionar($imagem, $name, $largura, $pasta) {
        $path = WWW_ROOT . "img/" . $pasta;
        $mime = $this->getMime($imagem['tmp_name']);

        $image = null;
        $nova = null;

        switch($mime){
            case 'image/jpeg':
                $image = @imagecreatefromjpeg($imagem['tmp_name']);
                break;
            case 'image/png':
                $image = @imagecreatefrompng($imagem['tmp_name']);
        }

        $continue = !is_null($image);
        if($continue){
            if($mime == 'image/png'){
                $continue = @imagealphablending($image, false);
                if($continue){
                    $continue = @imagesavealpha($image, true);
                }
            }
            if($continue){
                if($continue){
                    $x = @imagesx($image);
                    $y = @imagesy($image);
                    $continue = $x > 0 && $y > 0;
                    if($continue){
                        $altura = ($largura * $y) / $x;
                        $nova = @imagecreatetruecolor($largura, $altura);
                        $continue = !is_null($nova);
                        if($continue){
                            if($mime == 'image/png'){
                                $continue = @imagealphablending($image, true);
                            }
                            if($continue){
                                $continue = @imagecopyresampled($nova, $image, 0, 0, 0, 0, $largura, $altura, $x, $y);
                                if($continue){
                                    $continue = @imagepng($nova, $path .'/'. $name);
                                }
                            }
                        }
                    }
                }
            }
        }

        if($continue){
            switch($mime){
                case 'image/jpeg':
                    $continue = @imagejpeg($nova, $path .'/'. $name);
                    break;
                case 'image/png':
                    $continue = @imagepng($nova, $path .'/'. $name);
            }
        }
        @imagedestroy($nova);
        @imagedestroy($image);
        return $continue;
    }

}

