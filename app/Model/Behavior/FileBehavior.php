<?php

/**
 * Created by PhpStorm.
 * User: Pablo Henrick Diniz
 * Date: 20/04/15
 * Time: 23:03
 */
class FileBehavior extends ModelBehavior
{
    private $mime_types = array(
        '323' => 'text/h323',
        'acx' => 'application/internet-property-stream',
        'ai' => 'application/postscript',
        'aif' => 'audio/x-aiff',
        'aifc' => 'audio/x-aiff',
        'aiff' => 'audio/x-aiff',
        'asf' => 'video/x-ms-asf',
        'asr' => 'video/x-ms-asf',
        'asx' => 'video/x-ms-asf',
        'au' => 'audio/basic',
        'avi' => 'video/x-msvideo',
        'axs' => 'application/olescript',
        'bas' => 'text/plain',
        'bcpio' => 'application/x-bcpio',
        'bin' => 'application/octet-stream',
        'bmp' => 'image/bmp',
        'c' => 'text/plain',
        'cat' => 'application/vnd.ms-pkiseccat',
        'cdf' => 'application/x-cdf',
        'cer' => 'application/x-x509-ca-cert',
        'class' => 'application/octet-stream',
        'clp' => 'application/x-msclip',
        'cmx' => 'image/x-cmx',
        'cod' => 'image/cis-cod',
        'cpio' => 'application/x-cpio',
        'crd' => 'application/x-mscardfile',
        'crl' => 'application/pkix-crl',
        'crt' => 'application/x-x509-ca-cert',
        'csh' => 'application/x-csh',
        'css' => 'text/css',
        'dcr' => 'application/x-director',
        'der' => 'application/x-x509-ca-cert',
        'dir' => 'application/x-director',
        'dll' => 'application/x-msdownload',
        'dms' => 'application/octet-stream',
        'doc' => 'application/msword',
        'dot' => 'application/msword',
        'dvi' => 'application/x-dvi',
        'dxr' => 'application/x-director',
        'eps' => 'application/postscript',
        'etx' => 'text/x-setext',
        'evy' => 'application/envoy',
        'exe' => 'application/octet-stream',
        'fif' => 'application/fractals',
        'flr' => 'x-world/x-vrml',
        'gif' => 'image/gif',
        'gtar' => 'application/x-gtar',
        'gz' => 'application/x-gzip',
        'h' => 'text/plain',
        'hdf' => 'application/x-hdf',
        'hlp' => 'application/winhlp',
        'hqx' => 'application/mac-binhex40',
        'hta' => 'application/hta',
        'htc' => 'text/x-component',
        'htm' => 'text/html',
        'html' => 'text/html',
        'htt' => 'text/webviewhtml',
        'ico' => 'image/x-icon',
        'ief' => 'image/ief',
        'iii' => 'application/x-iphone',
        'ins' => 'application/x-internet-signup',
        'isp' => 'application/x-internet-signup',
        'jfif' => 'image/pipeg',
        'jpeg' => 'image/jpeg',
        'jpg' => 'image/jpeg',
        'png' => 'image/png',
        'js' => 'application/x-javascript',
        'latex' => 'application/x-latex',
        'lha' => 'application/octet-stream',
        'lsf' => 'video/x-la-asf',
        'lsx' => 'video/x-la-asf',
        'lzh' => 'application/octet-stream',
        'm13' => 'application/x-msmediaview',
        'm14' => 'application/x-msmediaview',
        'm3u' => 'audio/x-mpegurl',
        'man' => 'application/x-troff-man',
        'mdb' => 'application/x-msaccess',
        'me' => 'application/x-troff-me',
        'mht' => 'message/rfc822',
        'mhtml' => 'message/rfc822',
        'mid' => 'audio/mid',
        'mny' => 'application/x-msmoney',
        'mov' => 'video/quicktime',
        'movie' => 'video/x-sgi-movie',
        'mp2' => 'video/mpeg',
        'mp3' => 'audio/mpeg',
        'mpa' => 'video/mpeg',
        'mpe' => 'video/mpeg',
        'mpeg' => 'video/mpeg',
        'mpg' => 'video/mpeg',
        'mpp' => 'application/vnd.ms-project',
        'mpv2' => 'video/mpeg',
        'ms' => 'application/x-troff-ms',
        'mvb' => 'application/x-msmediaview',
        'nws' => 'message/rfc822',
        'oda' => 'application/oda',
        'p10' => 'application/pkcs10',
        'p12' => 'application/x-pkcs12',
        'p7b' => 'application/x-pkcs7-certificates',
        'p7c' => 'application/x-pkcs7-mime',
        'p7m' => 'application/x-pkcs7-mime',
        'p7r' => 'application/x-pkcs7-certreqresp',
        'p7s' => 'application/x-pkcs7-signature',
        'pbm' => 'image/x-portable-bitmap',
        'pdf' => 'application/pdf',
        'pfx' => 'application/x-pkcs12',
        'pgm' => 'image/x-portable-graymap',
        'pko' => 'application/ynd.ms-pkipko',
        'pma' => 'application/x-perfmon',
        'pmc' => 'application/x-perfmon',
        'pml' => 'application/x-perfmon',
        'pmr' => 'application/x-perfmon',
        'pmw' => 'application/x-perfmon',
        'pnm' => 'image/x-portable-anymap',
        'pot' => 'application/vnd.ms-powerpoint',
        'ppm' => 'image/x-portable-pixmap',
        'pps' => 'application/vnd.ms-powerpoint',
        'ppt' => 'application/vnd.ms-powerpoint',
        'prf' => 'application/pics-rules',
        'ps' => 'application/postscript',
        'pub' => 'application/x-mspublisher',
        'qt' => 'video/quicktime',
        'ra' => 'audio/x-pn-realaudio',
        'ram' => 'audio/x-pn-realaudio',
        'ras' => 'image/x-cmu-raster',
        'rgb' => 'image/x-rgb',
        'rmi' => 'audio/mid',
        'roff' => 'application/x-troff',
        'rtf' => 'application/rtf',
        'rtx' => 'text/richtext',
        'scd' => 'application/x-msschedule',
        'sct' => 'text/scriptlet',
        'setpay' => 'application/set-payment-initiation',
        'setreg' => 'application/set-registration-initiation',
        'sh' => 'application/x-sh',
        'shar' => 'application/x-shar',
        'sit' => 'application/x-stuffit',
        'snd' => 'audio/basic',
        'spc' => 'application/x-pkcs7-certificates',
        'spl' => 'application/futuresplash',
        'src' => 'application/x-wais-source',
        'sst' => 'application/vnd.ms-pkicertstore',
        'stl' => 'application/vnd.ms-pkistl',
        'stm' => 'text/html',
        'svg' => 'image/svg+xml',
        'sv4cpio' => 'application/x-sv4cpio',
        'sv4crc' => 'application/x-sv4crc',
        't' => 'application/x-troff',
        'tar' => 'application/x-tar',
        'tcl' => 'application/x-tcl',
        'tex' => 'application/x-tex',
        'texi' => 'application/x-texinfo',
        'texinfo' => 'application/x-texinfo',
        'tgz' => 'application/x-compressed',
        'tif' => 'image/tiff',
        'tiff' => 'image/tiff',
        'tr' => 'application/x-troff',
        'trm' => 'application/x-msterminal',
        'tsv' => 'text/tab-separated-values',
        'txt' => 'text/plain',
        'uls' => 'text/iuls',
        'ustar' => 'application/x-ustar',
        'vcf' => 'text/x-vcard',
        'vrml' => 'x-world/x-vrml',
        'wav' => 'audio/x-wav',
        'wcm' => 'application/vnd.ms-works',
        'wdb' => 'application/vnd.ms-works',
        'wks' => 'application/vnd.ms-works',
        'wmf' => 'application/x-msmetafile',
        'wps' => 'application/vnd.ms-works',
        'wri' => 'application/x-mswrite',
        'wrl' => 'x-world/x-vrml',
        'wrz' => 'x-world/x-vrml',
        'xaf' => 'x-world/x-vrml',
        'xbm' => 'image/x-xbitmap',
        'xla' => 'application/vnd.ms-excel',
        'xlc' => 'application/vnd.ms-excel',
        'xlm' => 'application/vnd.ms-excel',
        'xls' => 'application/vnd.ms-excel',
        'xlt' => 'application/vnd.ms-excel',
        'xlw' => 'application/vnd.ms-excel',
        'xof' => 'x-world/x-vrml',
        'xpm' => 'image/x-xpixmap',
        'xwd' => 'image/x-xwindowdump',
        'z' => 'application/x-compress',
        'zip' => 'application/zip'
    );

    public function setup(Model $model, $settings = array())
    {
        $class = get_class($this);
        if (!isset($this->settings[$class][$model->alias])) {
            $this->settings[$class][$model->alias] = array(
                'fields' => 'file',
                'root' => 'files',
                'folder' => null,
                'prefix' => 'File-',
                'update' => false,
                'exts' => []
            );
        }

        $this->settings[$class][$model->alias] = array_merge($this->settings[$class][$model->alias], $settings);
        $this->settings[$class][$model->alias]['fields'] = (Array)$this->settings[$class][$model->alias]['fields'];
        foreach ($this->settings[$class][$model->alias]['fields'] as $key => $field) {
            if (!is_array($field)) {
                unset($this->settings[$class][$model->alias]['fields'][$key]);
                $this->settings[$class][$model->alias]['fields'][$field] = array('exts' => []);
            }
        }
    }


    protected function checkExt(Model $model)
    {
        $class = get_class($this);
        $fields = (Array)$this->settings[$class][$model->alias]['fields'];
        $update = $this->settings[$class][$model->alias]['update'];
        $result = true;
        foreach ($fields as $key => $field) {
            $check_field = isset($model->data[$model->alias][$key]['tmp_name']);
            $check_upload = @is_uploaded_file($model->data[$model->alias][$key]['tmp_name']);

            if (!$check_field && !$update) {
                throw new Exception('Field ' . $key . ' doesn\'t exists');
            }

            if (!$check_upload && !$update) {
                throw new Exception('Field ' . $key . ' upload error');
            }

            if($check_field && $check_upload){
                $tmp_name = $model->data[$model->alias][$key]['tmp_name'];
                $ext = $this->ext($tmp_name);
                $exts = $this->settings[$class][$model->alias]['exts'];
                if (!empty($field['exts'])) {
                    $exts = $field['exts'];
                }

                if(!empty($exts) && !in_array($ext, $exts)){
                    $result = false;
                    $model->validationErrors[$key] = 'A extensão .'.$ext.' não é permitida';
                }
            }
            else if($update){
                unset($model->data[$model->alias][$key]);
            }
        }

        return $result;
    }

    public function beforeSave(Model $model, $options = array())
    {

        $class = get_class($this);
        if ($this->settings[$class][$model->alias]['update']) {
            $id = $model->data[$model->alias]['id'];
            $names = array_keys($this->settings[$class][$model->alias]['fields']);
            if ($model->exists($id)) {
                foreach ($names as $name) {
                    $this->settings[$class][$model->alias]['names'][$name] = $model->field($name, array('id' => $id));
                }
            }
        }
        return true;
    }

    public function afterSave(Model $model, $created, $options = array())
    {

        if (!$created) {
            $class = get_class($this);
            $names = array_keys($this->settings[$class][$model->alias]['fields']);
            $complete_path = $this->getCompletePath($model);
            foreach ($names as $name) {
                if (isset($this->settings[$class][$model->alias]['names'][$name])) {
                    if ($model->data[$model->alias][$name] != $this->settings[$class][$model->alias]['names'][$name]) {
                        $path = $this->cleanPath($complete_path . DS . $this->settings[$class][$model->alias]['names'][$name]);
                        if (file_exists($path)) {
                            @unlink($path);
                        }
                    }
                }
            }
        }
    }

    public function beforeDelete(Model $model, $cascade = false)
    {
        $class = get_class($this);
        $names = array_keys($this->settings[$class][$model->alias]['fields']);
        foreach ($names as $name) {
            $this->settings[$class][$model->alias]['names'][$name] = $model->field($name);
        }
    }

    public function afterDelete(Model $model)
    {
        $class = get_class($this);
        if(isset($this->settings[$class][$model->alias]['names'])){
            $names = $this->settings[$class][$model->alias]['names'];
            $complete_path = $this->getCompletePath($model);
            foreach ($names as $name) {
                $path = $this->cleanPath($complete_path . DS . $name);
                if (file_exists($path)) {
                    @unlink($path);
                }
            }
        }
    }

    public function beforeValidate(Model $model, $options = array())
    {
        $class = get_class($this);
        if (isset($model->data[$model->alias]['id'])) {
            $this->settings[$class][$model->alias]['update'] = true;
        }
        $continue = $this->checkExt($model);
        return $continue;
    }

    public function afterValidate(Model $model)
    {
        $class = get_class($this);
        $fields = array_keys($this->settings[$class][$model->alias]['fields']);
        $created = true;
        $complete_path = $this->getCompletePath($model);
        foreach($fields as $field){
            if (isset($model->data[$model->alias][$field]['tmp_name'])) {
                $tmp_name = $model->data[$model->alias][$field]['tmp_name'];
                $name = $this->settings[$class][$model->alias]['prefix'] . sha1(uniqid(rand(), true)) .'.'. $this->ext($tmp_name);
                $path = $this->cleanPath($complete_path . DS . $name);
                if (!@move_uploaded_file($tmp_name, $path)) {
                    $created = false;
                    unset($model->data[$model->alias][$field]);
                }
                else{
                    $model->data[$model->alias][$field] = $name;
                }
            }
        }

        return ($created || $this->settings[$class][$model->alias]['update']);
    }

    protected function cleanPath($path){
        return  str_replace(array('//','\\\\','\/'),DS,$path);
    }

    protected function getCompletePath(Model $model)
    {
        $class = get_class($this);
        $sub = !is_null($this->settings[$class][$model->alias]['folder']) ? DS . $this->settings[$class][$model->alias]['folder'] : '';
        $complete_path = $this->cleanPath(WWW_ROOT . DS . $this->settings[$class][$model->alias]['root'] . $sub);
        if (!file_exists($complete_path)) {
            @mkdir($complete_path, 777, true);
        }
        return $complete_path;
    }

    protected function ext($file)
    {
        $mime = $this->mime($file);
        $find = array_search($mime, $this->mime_types);
        return $find;
    }

    protected function mime($file)
    {
        $mime = '';
        if (file_exists($file)) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = finfo_file($finfo, $file);
            finfo_close($finfo);
        }
        return $mime;
    }
} 