$2(document).ready(function () {
    var options = {
        groups:{
            0:{
                0:{
                    0:{name:'pencil',icon:'fa fa-2x fa-pencil'},
                    1:{name:'preencher',icon:'fa fa-2x fa-tint'}
                }
            }
        },
        title:'Ferramentas'
    };
    React.render(
        <ToolBox {...options}/>,
        document.getElementById('tool-box-container')
    );
});