var StepModal = React.createClass({
    getInitialState:function(){
        var state = {
            step:0,
            title:'Step Modal',
            onConfirm:null,
            onCancel:null,
            id:this.props.id
        };

        if(typeof this.props.children == 'array' && this.props.children.length > 0){
            var first = this.props.children[0];
            state.step = 0;
            state.onConfirm = first.props.onConfirm;
            state.onCancel = first.props.onCancel;
        }

        return state;
    },
    render:function(){
        return (
            <Modal id={this.state.id} title={this.state.title} onConfirm={this.onConfirm} onCancel={this.onCancel} confirmText={this.state.confirmText} cancelText={this.state.cancelText} open={this.props.open}>
                <Tabpanel active={this.state.step} dataToggle={false}>
                    {this.props.children}
                </Tabpanel>
            </Modal>
        );
    },
    onConfirm:function(){
        var action = this.state.onConfirm;
        var self = this;
        if(typeof action == 'function'){
            action.apply(this,function(success){
                if(success){
                    self.next();
                }
            });
        }
        else{
            self.next();
        }
    },
    onCancel:function(){
        var action = this.state.onCancel;
        var self = this;
        if(typeof action == 'function'){
            action.apply(this,function(success){
                if(success){
                    self.prev();
                }
            });
        }
        else{
            self.prev();
        }
    },
    next:function(){
        var step = this.state.step;
        if(this.props.children[step+1] != undefined){
            this.setState({
                step:step+1
            });
        }
    },
    prev:function(){
        var step = this.state.step;
        if(this.props.children[step-1] != undefined){
            this.setState({
                active:step-1
            });
        }
    }
});