var AlertModal = React.createClass({
    sizes:['sm','md','lg'],
    componentWillMount:function(){
        var id = this.props.id;
        var title = this.props.title;
        var confirm = this.props.confirm;
        var open = this.props.open;
        var message = this.props.message;
        var type = this.props.type;
        var size = 'sm';
        if(this.props.size != undefined && this.sizes.indexOf(this.props.size) != -1){
            size = this.props.size;
        }
        this.setState({
            id:id,
            title:title,
            confirm:confirm,
            open:open,
            message:message,
            type:type,
            size:size
        });
    },
    render:function(){
        return (
            <Modal id={this.state.id} title={this.state.title} onConfirm={this.state.onConfirm} confirmText="Sim" cancelText="Não" open={this.state.open} size={this.state.size}>
                <Alert message={this.state.message} type={this.state.type} show={true}/>
            </Modal>
        );
    },
    componentWillReceiveProps:function(props){
        this.setState(props);
    }
});