<style type="text/css">
    .tree li {
        list-style: none;
        z-index: 2;
    }

    .space:before {
        content: '\00a0\00a0\00a0';
        border-top: 1px dashed black;
        border-left: 1px dashed black;
        position: relative;
        top: 9px;
        left: 5px;
    }

    .tree ul > li:last-child .space:before, ul.tree > li:last-child .space:before {
        border-top: none;
        border-bottom: 1px dashed black;
        top: -7px;
    }

    .tree li.expanded:before {
        border-left: 1px dashed black;
        display: block;
        height: 100%;
        width: 1px;
        content: '';
        position: absolute;
        top: 20px;
        left: 5px;
    }

    .tree ul > li:first-child:after {
        border-left: 1px dashed black;
        display: block;
        content: '';
        height: 10px;
        position: absolute;
        left: 5px;
        top: -2px;
    }

    .tree li.closed:before {
        border-left: 1px dashed black;
        display: block;
        height: 8px;
        width: 1px;
        content: '';
        position: absolute;
        top: 20px;
        left: 5px;
    }

    .space {
        position: relative;
    }

    .tree {
        padding-left: 5px;
        padding-bottom: 0;
    }

    ul.tree {
        display: inline-block;
        overflow: hidden;
        position: relative;
    }

    .tree li {
        position: relative;
    }

    .tree ul {
        padding-left: 16px;
    }

    .tree .fa {
        z-index: 2;
        background-color: white;
    }

    .expanded > ul {
        display: block !important;
    }

    .tree ul {
        display: none;
    }

    .icon:hover, .toggle:hover {
        cursor: pointer;
    }
</style>
<script type="text/javascript">
    var tree = [
        {
            title: 'Documentos',
            expanded: false,
            isFolder: true,
            children: [
                {
                    title'composer.json',
                    icon: 'fa fa-file-text-o',
                    isFolder: false
                    children: [
                        {title'teste', icon: '', isFolder: false},
                        {title'teste', icon: '', isFolder: false},
                        {title'teste', icon: '', isFolder: false}
                    ]
                },
                {
                    title:'index.html',
                    icon:'',
                    isFolder:true
                },
                {
                    title:'htaccess',
                    icon:'',
                    isFolder:false
                }
            ]
        },
        {
            title:'Imagens',
            expanded:false,
            isFolder:true,
            children:[]
        },
        {
            title:'Vídeos',
            expanded:false,
            isFolder:true,
            children:[]
        }
    ];
</script>
<ul class="tree">
    <li class="expanded">
        <span class="fa fa-minus-square toggle"></span>
        <span class="fa fa-folder-open icon"></span>
        <span class="title">Documentos</span>
        <ul>
            <li class="expanded">
                <span class="space"></span>
                <span class="fa fa-file-text-o icon"></span>
                <span class="title">composer.json</span>
                <ul>
                    <li>
                        <span class="space"></span>
                        <span class="title">teste</span>
                    </li>
                    <li>
                        <span class="space"></span>
                        <span class="title">teste</span>
                    </li>
                    <li>
                        <span class="space"></span>
                        <span class="title">teste</span>
                    </li>
                </ul>
            </li>
            <li>
                <span class="fa fa-plus-square toggle"></span>
                <span class="fa fa-folder-open icon"></span>
                <span class="title">index.html</span>
            </li>
            <li>
                <span class="space"></span>
                <span class="fa fa-folder-open icon"></span>
                <span class="title">htaccess.txt</span>
            </li>
        </ul>
    </li>
    <li>
        <span class="space"></span>
        <span class="fa fa-folder-open icon"></span>
        <span class="title">Imagens</span>
    </li>
    <li>
        <span class="space"></span>
        <span class="fa fa-folder-open icon"></span>
        <span class="title"> Vídeos</span>
    </li>
</ul>