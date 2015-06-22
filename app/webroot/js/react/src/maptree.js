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
            <Tree id="tree" loadUrl={this.state.loadUrl} formData={{'data[id]':this.state.projectId}} onItemLeftClick={this.callback} onItemToggle={this.itemToggle}/>
        );
    },
    itemToggle:function(toggle,e,obj){
        var type = obj.state.metadata.type;
        var id = obj.state.metadata.id;
        var url = null;
        switch(type){
            case 'project':
                url = Global.project.expand;
                break;
            case 'map':
                url = Global.map.expand;
                break;
        }

        if(url != null){
            AjaxQueue.ajax({
                url:url,
                type:'post',
                dataType:'json',
                data:{
                    'data[id]':id,
                    'data[expand]':toggle
                }
            });
        }
    },
    callback:function(e,obj){
        var x = e.pageX;
        var y = e.pageY;
        this.selectedNode = obj;
        var type = obj.state.metadata.type;
        var callback = null;
        var items = this.items;
        switch(type){
            case 'project':
                callback = this.projectCallback;
                break;
            case 'map':
                callback = this.mapCallback;
                break;
        }

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
    editSuccess:function(node){
        this.selectedNode.setState({
            title:node.title
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
                    <MapEditor action={'new'} postUrl={Global.map.add}  formData={{'data[Map][parent_id]':mapId}} open={true} onPostSuccess={this.createSuccess}/>,
                    document.getElementById('map-editor-container')
                );
                break;
            case 'edit':
                React.render(
                    <MapEditor action={'edit'} loadUrl={Global.map.load} postUrl={Global.map.edit}  formData={{'data[Map][id]':mapId}} loadFormData={{'data[id]':mapId}} open={true} onPostSuccess={this.editSuccess}/>,
                    document.getElementById('map-editor-container')
                );
                break;
            case 'copy':
                this.clipboard = {type:'copy',obj:this.selectedNode};
                break;
            case 'cut':
                this.clipboard = {type:'cut',obj:this.selectedNode};
                break;
            case 'paste':
                this.pasteMap(this.selectedNode,this.clipboard);
                break;
        }
    },
    pasteMap:function(parent,clipboard){
        var data = {
            'data[id]':clipboard.obj.state.metadata.id,
            'data[type]':clipboard.type
        };

        if(parent.state.metadata.type == 'project'){
            data['data[project_id]'] = parent.state.metadata.id;
        }
        else{
            data['data[parent_id]'] = parent.state.metadata.id;
        }

        if(parent.state.metadata.id != clipboard.obj.state.metadata.id){
            AjaxQueue.ajax({
                url:Global.map.paste,
                type:'post',
                dataType:'json',
                data:data,
                success:function(data){
                    if(data.success){
                        parent.lazyLoad();
                        if(clipboard.type == 'cut'){
                            clipboard.obj.remove();
                        }
                    }
                }.bind(this),
                error:function(){

                }.bind(this)
            });
        }
    },
    deleteMap:function(id){
        var self = this;
        AjaxQueue.ajax({
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
    items:{
        "edit": {name: "Alterar propriedades", icon: "edit"},
        'new': {name: 'Novo Mapa', icon: "add"},
        "copy": {name: "Copiar", icon: "copy"},
        "cut": {name: "Recortar", icon: "cut"},
        "paste": {name: "Colar", icon: "paste"},
        "delete": {name: "Apagar", icon: "delete"}
    }
});