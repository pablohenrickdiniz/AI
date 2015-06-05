var AlertModal = React.createClass({
    render:function(){
        return (
            <Modal id={this.props.id} title={this.props.title} onConfirm={this.props.onConfirm} confirmText="Sim" cancelText="Não" open={this.props.open} size="sm">
                <Alert message={this.props.message} type={this.props.type} show={true}/>
            </Modal>
        );
    }
});