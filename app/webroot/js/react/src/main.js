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
                    <Dropdownitem title="Preencher" icon="fa fa-title"/>
                    <Dropdownitem title="Sombra" icon="fa fa-pencil-square"/>
                </Dropdown>
                <Dropdown title="Ferramentas">
                    <Dropdownitem title="Banco de dados" icon="fa fa-database"/>
                    <Dropdownitem title="Recursos" icon="fa fa-server"/>
                    <Dropdownitem title="Editor de script" icon="fa fa-file-code-o"/>
                    <Dropdownitem title="Música" icon="fa fa-music"/>
                    <Dropdownitem title="Gerador de Caracters" icon="fa fa-street-view"/>
                </Dropdown>
                <Dropdown title="Jogo">
                    <Dropdownitem title="Executar" icon="fa fa-play"/>
                </Dropdown>
            </Navbar>
            <NewProject />
        </div>
        ,
        document.getElementById('content')
    );
});
