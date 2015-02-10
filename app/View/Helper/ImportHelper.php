<?php

/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 09/02/15
 * Time: 09:43
 */
class ImportHelper extends AppHelper
{
    public $ignore = array('.','..');

    public function script($folder, $recursive = false)
    {
        $urls = $this->getURLS('js', '/js', $folder, $recursive);
        $html = '';
        foreach($urls as $url){
            $html .= '<script src="'.Router::url($url).'"></script>';
        }
        echo $html;
    }

    public function getURLS($ext, $root, $folder, $recursive = false)
    {
        $complete_path = WWW_ROOT . '/' . $root . '/' . $folder;
        $urls = [];
        if (file_exists($complete_path)) {
            $files = scandir($complete_path);
            foreach ($files as $file) {
                if(!in_array($file,$this->ignore)){
                    $file_path = $folder . '/' . $file;
                    $file_import_path = $root.'/'.$file_path;
                    $file_complete_path = WWW_ROOT.'/'.$file_import_path;
                    if (!is_dir($file_complete_path)) {
                        $file_ext = pathinfo($file_complete_path, PATHINFO_EXTENSION);

                        if ($file_ext == $ext) {
                            $urls[] = $file_import_path;
                        }
                    } else if ($recursive) {
                        $urls = array_merge($urls,$this->getURLS($ext,$root,$file_path,$recursive));
                    }
                }
            }
        }
        return $urls;
    }

} 