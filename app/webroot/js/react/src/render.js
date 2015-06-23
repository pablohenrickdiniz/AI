var Render = {
    project: {
        updateMapTree: function () {
            React.render(
                <MapTree loadUrl={Global.project.mapTree} projectId={Global.project.id} update={true}/>,
                document.getElementById('map-container')
            );
        },
        treeLazyRead: function (node) {
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
        }
    },
    map: {
        new:function(){
            React.render(
                <MapEditor id="map-editor" action={'new'} postUrl={Global.map.add} loadUrl={Global.map.load} open={true}/>,
                document.getElementById('map-editor-container')
            );
        }
    },
    modal:{
        openProjectModal:function(){
            React.render(
                <OpenProject open={true}/>,
                document.getElementById('open-project-modal-container')
            );
        },
        newProjectModal:function(){
            React.render(
                <NewProject postUrl={Global.project.add} open={true} />,
                document.getElementById('new-project-modal-container')
            );
        },
        resourcesModal:function(){
            React.render(
                <ResourceModal projectId={Global.project.id} loadUrl={Global.resource.children} layer={1} open={true}/>,
                document.getElementById('resources-modal-container')
            );
        }
    },
    main: {
        renderMenu: function () {
            React.render(
                <div id="content">
                    <Navbar>
                        <Dropdown title="Projeto">
                            <Dropdownitem title="Novo" icon="fa  fa-file-o" onClick={Render.modal.newProjectModal}/>
                            <Dropdownitem title="Abrir" icon="fa  fa-folder-open-o" onClick={Render.modal.openProjectModal}/>
                            <Dropdownitem title="Salvar" icon="fa  fa-floppy-o"/>
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
                            <Dropdownitem title="Recursos" icon="fa fa-server" onClick={Render.modal.resourcesModal}/>
                            <Dropdownitem title="Editor de script" icon="fa fa-file-code-o"/>
                            <Dropdownitem title="Música" icon="fa fa-music"/>
                            <Dropdownitem title="Gerador de Caracters" icon="fa fa-street-view"/>
                        </Dropdown>
                        <Dropdown title="Jogo">
                            <Dropdownitem title="Executar" icon="fa fa-play"/>
                        </Dropdown>
                    </Navbar>
                </div>,
                document.getElementById('content')
            );


        }
    }
};


