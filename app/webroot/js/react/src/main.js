$(document).ready(function(){
    React.render(
        <div>
            <Navbar>
                <Dropdown title="Projeto">
                    <Dropdownitem title="Novo" icon="fa  fa-file-o" target="new-project-modal"/>
                    <Dropdownitem title="Abrir" icon="fa  fa-folder-open-o" target="open-project-modal"/>
                    <Dropdownitem title="Salvar" icon="fa  fa-floppy-o" target="#"/>
                </Dropdown>
                <Dropdown title="Editar">
                    <Dropdownitem title="Recortar" icon="fa  fa-scissors"/>
                    <Dropdownitem title="Copiar" icon="fa fa-copy"/>
                    <Dropdownitem title="Colar" icon="fa fa-paste"/>
                    <Dropdownitem title="Apagar" icon="fa fa-eraser"/>
                    <Dropdownitem title="Desfazer" icon="fa fa-repeat"/>
                </Dropdown>
                <Dropdown title="Modo">
                    <Dropdownitem title="Mapa" icon="fa fa-picture-o"/>
                    <Dropdownitem title="Evento" icon="fa fa-users"/>
                    <Dropdownitem title="Região" icon="fa fa-th"/>
                </Dropdown>
                <Dropdown title="Desenho">
                    <Dropdownitem title="Lápis" icon="fa fa-pencil"/>
                    <Dropdownitem title="Retangulo" icon="fa fa-square"/>
                    <Dropdownitem title="Círculo" icon="fa fa-circle"/>
                    <Dropdownitem title="Preencher" icon="fa fa-tint"/>
                    <Dropdownitem title="Sombra" icon="fa fa-pencil-square"/>
                </Dropdown>
                <Dropdown title="Ferramentas">
                    <Dropdownitem title="Banco de dados" icon="fa fa-database"/>
                    <Dropdownitem title="Recursos" icon="fa fa-server" target="resources-modal"/>
                    <Dropdownitem title="Editor de script" icon="fa fa-file-code-o"/>
                    <Dropdownitem title="Música" icon="fa fa-music"/>
                    <Dropdownitem title="Gerador de Caracters" icon="fa fa-street-view"/>
                </Dropdown>
                <Dropdown title="Jogo">
                    <Dropdownitem title="Executar" icon="fa fa-play"/>
                </Dropdown>
            </Navbar>
            <NewProject />
            <OpenProject/>
            <ResourceModal id="resources-modal"/>
            <MapEditor id="map-editor"/>
            <StepModal id="resource-step-modal"  open={true} title="New Resource">
                <Tabpane title="A">
                </Tabpane>
                <Tabpane title="B">
                </Tabpane>
            </StepModal>
        </div>
        ,
        document.getElementById('content')
    );

    var lazy_load = function(node){
        var span = node.span;
        var action = '';

        if ($(span).hasClass('project')) {
            action = Global.project.children;
        }
        else if ($(span).hasClass('map')) {
            action = Global.map.children;
        }
        node.appendAjax({
            url: action,
            type: 'post',
            data: {
                'data[id]': node.data.key
            }
        });
    };


    React.render(
        <Tree id="tree" url={Global.project.mapTree} data={{'data[id]':Global.project.id}} onLazyRead={lazy_load}/>,
        document.getElementById('map-container')
    );
});
