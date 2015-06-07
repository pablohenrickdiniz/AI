$(document).ready(function(){
    Render.project.updateMapTree();
    Render.resource.updateResourceModal();
    Render.main.renderMenu();

    var tree = [
        {
            title: 'Documentos',
            expanded: false,
            isFolder: true,
            children: [
                {
                    title:'composer.json',
                    icon: 'fa fa-file-text-o',
                    isFolder: false,
                    children: [
                        {title:'teste', icon: '', isFolder: false},
                        {title:'teste', icon: '', isFolder: false},
                        {title:'teste', icon: '', isFolder: false}
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


    React.render(
        <TreeView data={tree} />,
        document.getElementById('map-container')
    );
});
