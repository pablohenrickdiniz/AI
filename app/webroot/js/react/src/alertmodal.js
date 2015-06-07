var AlertModal = React.createClass({
    sizes:['sm','md','lg'],
    getInitialState:function(){
        return {
            id:'',
            title:'Alert Message',
            onConfirm:null,
            open:false,
            message:'',
            type:'info',
            size:'sm',
            layer:1
        }
    },
    componentWillMount:function(){
        var id = this.props.id;
        var title = this.props.title;
        var onConfirm = this.props.onConfirm;
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
            onConfirm:onConfirm,
            open:open,
            message:message,
            type:type,
            size:size,
            layer:this.props.layer
        });
    },
    render:function(){
        return (
            <Modal id={this.state.id} title={this.state.title} onConfirm={this.state.onConfirm} confirmText="Sim" cancelText="Não" open={this.state.open} size={this.state.size} layer={this.state.layer}>
                <Alert message={this.state.message} type={this.state.type} show={true}/>
            </Modal>
        );
    },
    componentWillReceiveProps:function(props){
        this.setState(props);
    }
});