<?php
/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 15/10/14
 * Time: 21:46
 */


class FileComponent extends Component{
    const  READ_LEN = 4096;

    public function upload(Array $arquivo, $nome, Array $permitidos, $destino){
        $ext = pathinfo($arquivo['name'],PATHINFO_EXTENSION);
        if(empty($permitidos) || in_array($ext, $permitidos)){
            if (!file_exists($destino)){
                @mkdir($destino, 0777,true);
            }
            if(@move_uploaded_file($arquivo['tmp_name'],$destino.$nome.'.'.$ext)){
                return $nome.'.'.$ext;
            }
        }
        return null;
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