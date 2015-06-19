/**
 * Created by Pablo Henrick Diniz on 07/06/2015.
 */

var MapTree = React.createClass({
    mixins:[updateMixin],
    propTypes:{
        loadUrl:React.PropTypes.string,
        projectId:React.PropTypes.number
    },

    getInitialState:function() {
        return {
            loadUrl: '',
            projectId: 0
        }
    },
    render:function(){
        console.log('maptree render...');
        return (
            <Tree id="tree" loadUrl={this.state.loadUrl} formData={{'data[id]':this.state.projectId}} onItemLeftClick={this.callback}/>
        );
    },
    callback:function(e,obj){
        var x = e.pageX;
        var y = e.pageY;
        var items = this.projectItems;
        this.selectedNode = obj;


        var callback = obj.state.metadata.type == 'project'?this.projectCallback:this.mapCallback;

        React.render(
            <ContextMenu x={x} y={y} items={items} callback={callback} show={true}/>,
            document.getElementById('context-menu-container')
        );
    },
    createSuccess:function(node){
        var children = this.selectedNode.state.children;
        children.push(node);
        this.selectedNode.setState({
            children:children
        });
    },
    mapCallback:function(key,e,obj){
        var mapId = this.selectedNode.state.metadata.id;
        switch(key){
            case 'delete':
                this.deleteMap(mapId);
                break;
            case 'new':
                React.render(
                    <MapEditor id="map-editor" action={'new'} postUrl={Global.map.add}  formData={{'data[Map][parent_id]':mapId}} open={true} onPostSuccess={this.createSuccess}/>,
                    document.getElementById('map-editor-container')
                );
                break;
        }
    },
    deleteMap:function(id){
        var self = this;
        $.ajax({
            url:Global.map.delete,
            type:'post',
            dataType:'json',
            data:{
                'data[id]':id
            },
            success:function(data){
                if(data.success){
                    self.selectedNode.remove();
                }
            }.bind(this)
        });
    },
    projectCallback:function(key,e,obj){
        var projectId = this.selectedNode.state.metadata.id;
        switch(key){
            case 'edit':
                break;
            case 'new':
                React.render(
                    <MapEditor id="map-editor" action={'new'} postUrl={Global.map.add}  formData={{'data[Map][project_id]':projectId}} open={true} onPostSuccess={this.createSuccess}/>,
                    document.getElementById('map-editor-container')
                );
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