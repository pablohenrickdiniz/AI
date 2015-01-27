<?php

App::uses('Component', 'Controller');

class ImagemComponent extends Component{

    /**
     * Watermark image file (must be png)
     */
    public $watermarkImage;

    /**
     * Property that will contain execution errors
     */
    public $errors;

    /**
     * Initialize method. Initialize class properties.

      public function initialize(){
      $this->watermarkImage = "img" . DIRECTORY_SEPARATOR . "watermark.png";
      $this->errors = array();
      }
     */
    public function save(array $file, $tamanho, $pasta, $substitituir = null) {
        $tmp_name = $file['tmp_name'];
        $nomeOriginal = $file['name'];
        $name = ($substitituir != null && $substitituir != "semimagem.jpg") ? $substitituir : md5(uniqid(rand(), true)) . ".jpg";

        // Get new dimensions
        list($width, $height) = getimagesize($tmp_name);
        if ($width > $height)
            $percent = $tamanho / $height;
        else
            $percent = $tamanho / $width;
        $new_width = $width * $percent;
        $new_height = $height * $percent;

        // Resample
        $image_p = imagecreatetruecolor($tamanho, $tamanho);
        $image = imagecreatefromjpeg($tmp_name);
        imagecopyresampled($image_p, $image, ($new_width - $tamanho) / 2 * -1, 0, 0, 0, $new_width, $new_height, $width, $height);

        // Output
        $path = WWW_ROOT . "/img/" . $pasta . "/";

        if (!file_exists($path))
            @mkdir($path, 0777);

        imagejpeg($image_p, $path . $name, 100);
        return $name;
    }

    public function redimensionar($imagem, $name, $largura, $pasta) {
        $path = WWW_ROOT . "img/" . $pasta;

        if($imagem['type'] == 'image/jpeg') { 
            $image = imagecreatefromjpeg($imagem['tmp_name']); 
            $x = imagesx($image);
            $y = imagesy($image);
            $altura = ($largura * $y) / $x;
            $nova = imagecreatetruecolor($largura, $altura);
            imagecopyresampled($nova, $image, 0, 0, 0, 0, $largura, $altura, $x, $y);                  
            imagejpeg($nova, $path.'/'.$name, 100); 
            imagedestroy($image);
            imagedestroy($nova);
        } else if($imagem['type'] == 'image/png') { 
            $image = imagecreatefrompng($imagem['tmp_name']); 
            imagealphablending($image, false); 
            imagesavealpha($image, true);   
            $x = imagesx($image);
            $y = imagesy($image);
            $altura = ($largura * $y) / $x;
            $nova = imagecreatetruecolor($largura, $altura);
            imagealphablending($image, true); 
            imagecopyresampled($nova, $image, 0, 0, 0, 0, $largura, $altura, $x, $y);     
            imagepng($nova, $path .'/'. $name); 
            imagedestroy($image);
            imagedestroy($nova);
        } else if($imagem['type'] == 'image/gif') { 
            move_uploaded_file($imagem['tmp_name'], $path .'/'. $name);
        } 

        return $name;
    }

    public function redimensionarmarca($imagem, $name, $largura, $pasta) {
        $img = imagecreatefrompng($imagem['tmp_name']);
        $x = imagesx($img);
        $y = imagesy($img);
        $altura = ($largura * $y) / $x;

        $nova = imagecreatetruecolor($largura, $altura);
        imagealphablending($nova, true);
        $transparente = imagecolorallocatealpha($nova, 0, 0, 0, 127);
        imagefill($nova, 0, 0, $transparente);
        imagecopyresampled($nova, $img, 0, 0, 0, 0, $largura, $altura, $x, $y);
        imagesavealpha($nova, true);
        
        $path = WWW_ROOT . "/img/" . $pasta;
        
        imagepng($nova, "$path/$name");
        imagedestroy($img);
        imagedestroy($nova);

        return($name);
    }
    
    public function upload_marca_jpg($tmp, $nome, $largura, $pasta){	
	$img = imagecreatefromjpeg($tmp);
	$x = imagesx($img);
	$y = imagesy($img);
	$altura = ($largura*$y) / $x;
	$nova = imagecreatetruecolor($largura, $altura);
	imagecopyresampled($nova, $img, 0, 0, 0, 0, $largura, $altura, $x, $y);
	imagedestroy($img);

        $pathMarca = WWW_ROOT . "/img/marcadagua/";    
        
	$marca = imagecreatefrompng($pathMarca.'marca.png');
	$marcax = imagesx($marca);
	$marcay = imagesy($marca);
	$localx = $largura-550;
	$localy = $altura-70;
	imagecopyresampled($nova, $marca, $localx, $localy, 0, 0, 550, 70, $marcax, $marcay);
	
        $path = WWW_ROOT . "/img/" . $pasta;
        
	imagejpeg($nova, "$path/$nome",90);
	imagedestroy($nova);
	return($nome);
    }

    /**
     *
     * @method: copy(array $data). Return image filename on success or false on error
     *
     * @description: copy an uploaded image to the destination path
     *
     * @params:
     * $data['file'] 	-> array with image data (found in $_FILES)
     * $data['path'] 	-> destination path
     *
     */
    public function copy(array $data) {

        /**
         * Verify file name and path
         */
        if (!isset($data['file']) || !isset($data['path']) || !is_array($data['file'])) {
            $this->errors[] = 'Name or path not found!';
            return false;
        }

        /**
         * Verify permissions of the destination directory
         */
        if (!is_writable($data['path'])) {
            $this->errors[] = 'Destination path is not writable!';
            return false;
        }

        /**
         * Verify if file is an image
         */
        if (!$this->verifyMime($data['file']['name'])) {
            $this->errors[] = 'The file must be an image!';
            return false;
        }

        /**
         * Generate name of the destination file
         */
        $ext = strtolower(end(explode('.', $data['file']['name'])));
        $name = uniqid() . date('dmYHis') . '.' . $ext;
        $complete_path = $data['path'] . $name;

        /**
         * Move file to the destination path
         */
        if (!move_uploaded_file($data['file']['tmp_name'], $data['path'] . $name)) {
            $this->errors[] = 'Error while upload the image!';
            return false;
        }

        /**
         * Return filename of the image
         */
        return $name;
    }

    /**
     *
     * @method: watermark(array $data)
     * Return false on error
     *
     * @description: Method that adds a watermark in the footer of an image.
     * The watermark image file must be informed in public $watermarkImage.
     *
     * @params:
     * $data['file'] -> full path of the image that will be added to water mark
     *
     */
    public function watermark(array $data) {

        /**
         * Verify watermark image file
         */
        if (!is_file($this->watermarkImage)) {
            $this->errors[] = 'Invalid watermark file!';
            return false;
        }

        /**
         * Verify if the data file is a file
         */
        if (!is_file($data['file'])) {
            $this->errors[] = 'Invalid file!';
            return false;
        }

        /**
         * Verify mime type of the image
         */
        if (!$this->verifyMime($data['file'])) {
            $this->errors[] = 'Invalid file type!';
            return false;
        }

        /**
         * Get data of the image
         */
        $img = getimagesize($data['file']);

        /**
         * Get infos of the watermark image
         */
        $watermark = imagecreatefrompng($this->watermarkImage);
        $watermark_width = imagesx($watermark);
        $watermark_height = imagesy($watermark);

        /**
         * Define marges of the watermark
         */
        $marge_right = $img[0] - $watermark_width - 15;
        $marge_bottom = $img[1] - $watermark_height - 15;

        /**
         * Define the function to be used for each image type
         */
        if ($img['mime'] == 'image/jpeg' || $img['mime'] == 'image/pjpeg') {
            $createFunction = 'imagecreatefromjpeg';
            $finalizeFunction = 'imagejpeg';
        } elseif ($img['mime'] == 'image/gif') {
            $createFunction = 'imagecreatefromgif';
            $finalizeFunction = 'imagegif';
        } elseif ($img['mime'] == 'image/png') {
            $createFunction = 'imagecreatefrompng';
            $finalizeFunction = 'imagepng';
        } else {
            $this->errors[] = 'Invalid file type!';
            return false;
        }

        /**
         * Generate image with watermark
         */
        $image = $createFunction($data['file']);
        imagecopy($image, $watermark, $marge_right, $marge_bottom, 0, 0, $watermark_width, $watermark_height);

        /**
         * Replace the original image with the new image with watermark
         */
        if ($img['mime'] == 'image/jpeg' || $img['mime'] == 'image/pjpeg') {
            $finalizeFunction($image, $data['file'], 100);
        } else {
            $finalizeFunction($image, $data['file']);
        }
    }

    /**
     *
     * @method: resize(array $data)
     *
     * @description: Method responsible for resize a image. Return false on error.
     *
     * @params: 
     * $data['file']   		-> complete path of original image file
     * $data['width']  		-> width of the new size
     * $data['height'] 		-> height of the new size
     * $data['output'] 		-> output path where resized image will be saved
     * $data['proportional'] -> (true or false). If true, the image will be resized 
     * only if its dimensions are larger than the values reported in width and height 
     * parameters. Default: true.
     *
     * If only the width or height is given, the function will automatically calculate 
     * whether the image is horizontal or vertical and will automatically apply the informed 
     * size in the correct property (width or height).
     *
     */
    public function resize(array $data) {

        /**
         * Verify parameters
         */
        if (!isset($data['file']) || (!isset($data['width']) && !isset($data['height']))) {
            $this->errors[] = 'Invalid filename or width/height!';
            return false;
        }

        if (!isset($data['output']) || !is_dir($data['output'])) {
            $this->errors[] = 'Invalid output dir!';
            return false;
        }

        /**
         * Proportional parameter. Default: true.
         */
        $data['proportional'] = (isset($data['proportional'])) ? $data['proportional'] : true;

        /**
         * Force define $data['width'] and $data['height']
         */
        $data['height'] = (isset($data['height'])) ? $data['height'] : 0;
        $data['width'] = (isset($data['width'])) ? $data['width'] : 0;

        /**
         * Verify if output directory is writable
         */
        if (!is_writable($data['output'])) {
            $this->errors[] = 'Output dir is not writable!';
            return false;
        }

        if (!is_file($data['file'])) {
            $this->errors[] = 'Invalid file!';
            return false;
        }

        /**
         * Verify mime type of the image
         */
        if (!$this->verifyMime($data['file'])) {
            $this->errors[] = 'Invalid file type!';
            return false;
        }

        /**
         * Verify if thumb must be proportional
         */
        if (!isset($data['proportional']))
            $data['proportional'] = true;

        /**
         * Validates width and height
         */
        $width = (isset($data['width'])) ? (int) $data['width'] : 0;
        $height = (isset($data['height'])) ? (int) $data['height'] : 0;

        /**
         * Get attributes of the image
         */
        $img = getimagesize($data['file']);
        $original_width = $img[0];
        $original_height = $img[1];
        $mime = $img['mime'];

        /**
         * Get the image source
         */
        $source = ($mime == 'image/png') ? imagecreatefrompng($data['file']) : imagecreatefromstring(file_get_contents($data['file']));

        /**
         * Get the image filename
         */
        $filename = basename($data['file']);

        /**
         * Generate output path
         */
        $output = $data['output'] . $filename;

        /**
         * Verify if its necessary resize the image
         */
        if (($width > $original_width || $height > $original_height) && $data['proportional'] === true) {

            $width = $original_width;
            $height = $original_height;
        } else {

            /**
             * If width or height not defined, its necessary calculate proportional resize
             */
            if (!($width > 0 && $height > 0)) {


                /**
                 * Verify if the image is horizontal or vertical
                 */
                if ($original_height > $original_width) {
                    $height = ($data['width'] > 0) ? $data['width'] : $data['height'];
                    $width = ($height / $original_height) * $original_width;
                } else {
                    $width = ($data['height'] > 0) ? $data['height'] : $data['width'];
                    $height = ($width / $original_width) * $original_height;
                }
            }
        }

        /**
         * Generate thumb
         */
        $thumb = imagecreatetruecolor($width, $height);

        /**
         * Add transparency if image is png
         */
        if ($mime == 'image/png') {
            imagealphablending($thumb, false);
            imagesavealpha($thumb, true);
            $transparent = imagecolorallocatealpha($thumb, 255, 255, 255, 127);
            imagefilledrectangle($thumb, 0, 0, $width, $height, $transparent);
        }

        /**
         * Finalize the image
         */
        imagecopyresampled($thumb, $source, 0, 0, 0, 0, $width, $height, $original_width, $original_height);

        /**
         * Verify the type of the image
         */
        if ($mime == 'image/jpeg' || $mime == 'image/pjpeg') {
            imagejpeg($thumb, $output, 100);
        } elseif ($mime == 'image/gif') {
            imagegif($thumb, $output);
        } elseif ($mime == 'image/png') {
            imagepng($thumb, $output);
        } else {
            $this->errors[] = 'Invalid file type.';
            return false;
        }
    }

    /**
     * 
     * @method: verifyMime(string $file) 
     * (Return true if the file is image and false on error)
     *
     * @description: method responsible for verify the mime-type of a file
     *
     * @params:
     * $file -> complete path file
     *
     */
    private function verifyMime($file) {

        $extension = (end(explode('.', $file)));

        $extension = strtolower($extension);

        $mimes = array('jpeg', 'jpg', 'png', 'gif');

        if (in_array($extension, $mimes)) {
            return true;
        } else {
            return false;
        }
    }

}

?>
