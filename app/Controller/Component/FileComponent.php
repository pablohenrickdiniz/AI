<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 15/10/14
 * Time: 21:46
 */


class FileComponent extends Component{
    public $errors;
    const  READ_LEN = 4096;
    public function upload(Array $arquivo, $name, Array $permitidos, $pasta){
        $info = pathinfo($arquivo['name']);
        $ext = isset($info['extension'])?$info['extension']:'';
        if(empty($permitidos) || in_array($ext, $permitidos)){
            $destination =  WWW_ROOT . '/files/' . $pasta . '/';
            if (!file_exists($destination))
                @mkdir($destination, 0777,true);
            if(move_uploaded_file($arquivo['tmp_name'], $destination . $name . '.' . $ext)){
                return $name . "." . $ext;
            }else{
                throw new Exception('Falha ao mover arquivo',0);
            }
        }else{
            throw new InvalidExtensionException('Extensão '.$ext.' não é permitida',1);
        }
    }

    public function identical($file1, $file2){
        if(filetype($file1) !== filetype($file2))
            return FALSE;

        if(filesize($file1) !== filesize($file2))
            return FALSE;

        if(!$fp1 = fopen($file1, 'rb'))
            return FALSE;

        if(!$fp2 = fopen($file2, 'rb')) {
            fclose($fp1);
            return FALSE;
        }

        $same = TRUE;
        while (!feof($fp1) and !feof($fp2))
            if(fread($fp1, self::READ_LEN) !== fread($fp2, self::READ_LEN)) {
                $same = FALSE;
                break;
            }

        if(feof($fp1) !== feof($fp2))
            $same = FALSE;

        fclose($fp1);
        fclose($fp2);

        return $same;
    }
} 