var ResourceModal = React.createClass({
    render:function(){
        return (
            <Modal title="Recursos" footer="false" id={this.props.id}>
                <Tree id="resource-tree" url={Global.resources.children} data={{'data[id]':Global.project.id}}/>
            </Modal>
        );
    }
});