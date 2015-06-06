var ResourceModal = React.createClass({
    componentWillMount:function(){
        this.updateState(this.props);
    },
    render:function(){
        return (
            <Modal title="Recursos" footer="false" id={this.state.id}>
                <Tree id="resource-tree" url={Global.resources.children} data={{'data[id]':this.state.projectId}}/>
            </Modal>
        );
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    },
    updateState:function(props){
        this.setState(props);
    }
});