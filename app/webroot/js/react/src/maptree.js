/**
 * Created by Pablo Henrick Diniz on 07/06/2015.
 */

var MapTree = React.createClass({
    getInitialState:function() {
        return {
            url: Global.project.mapTree,
            projectId: Global.project.id,
            id:null
        }
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    },
    updateState:function(props){
        this.setState({
            url:props.url,
            projectId:props.projectId
        });
    },
    render:function(){
        return (
            <TreeView id="tree" url={this.state.url} formData={{'data[id]':this.state.projectId}} onItemLeftClick={this.callback}/>
        );
    },
    callback:function(e,obj){
        var x = e.pageX;
        var y = e.pageY;
        var id = obj.state.metadata.type;
        var items = this.projectItems;
        this.setState({id:id});
        React.render(
            <ContextMenu x={x} y={y} items={items} callback={this.projectCallback} show={true}/>,
            document.getElementById('context-menu-container')
        );
    },
    projectCallback:function(key,e,obj){
        switch(key){
            case 'edit':


                break;
            case 'new':

                break;
            case 'copy':

                break;
            case 'cut':

                break;
            case 'paste':

                break;
            case 'delete':
                break;
            default:
                console.log('Nenhuma ação definida para a chave...'+key);
        }
    },
    projectItems:{
        "edit": {name: "Alterar propriedades", icon: "edit"},
        'sp1': '-----------',
        'new': {name: 'Novo Mapa', icon: "add"},
        'sp2': '-----------',
        "copy": {name: "Copiar", icon: "copy"},
        "cut": {name: "Recortar", icon: "cut"},
        "paste": {name: "Colar", icon: "paste"},
        "delete": {name: "Apagar", icon: "delete"}
    }
});