var ResourceModal = React.createClass({
    mixins:[updateMixin],
    items:{
        'new': {name: 'Importar recurso', icon: "add"}
    },
    getInitialState:function(){
        return {
            loadUrl:'',
            projectId:0,
            id:''
        };
    },
    close:function(modal){
        modal.hide();
    },
    render:function(){
        return (
            <Modal title="Recursos" footer={false} id={this.state.id} onClose={this.close}>
                <Tree id="resource-tree" loadUrl={this.state.loadUrl} formData={{'data[id]':this.state.projectId}} onItemLeftClick={this.onItemLeftClick}/>
            </Modal>
        );
    },
    onItemLeftClick:function(e,obj){
        if(obj.state.metadata.type == 'resource-folder'){
            var x = e.pageX;
            var y = e.pageY;
            this.selectedFolder = obj;
            React.render(
                <ContextMenu x={x} y={y} items={this.items} callback={this.callback} show={true}/>,
                document.getElementById('context-menu-container')
            );
        }
    },
    callback:function(){

    }
});