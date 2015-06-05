var StepModal = React.createClass({
    getInitialState:function(){
        return {
            step:'',
            title:'',
            onConfirm:null,
            onCancel:null,
            active:''
        };
    },
    componentWillMount:function(){
        var state = {
            title:this.props.title
        };

        if(typeof this.props.children == 'array' && this.props.children.length > 0){
            var first = this.props.children[0];
            state.active = 0;
            state.onConfirm = first.props.onConfirm;
            state.onCancel = first.props.onCancel;
        }

        this.setState(state);
    },
    render:function(){
        return (
            <Modal id={this.props.id} title={this.state.title} onConfirm={this.onConfirm} onCancel={this.onCancel} confirmText={this.state.confirmText} cancelText={this.state.cancelText} open={this.props.open}>
                <Tabpanel active={this.state.active}>
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
        var active = this.state.active;
        if(this.props.children[active+1] != undefined){
            this.setState({
                active:active+1
            });
        }
    },
    prev:function(){
        var active = this.state.active;
        if(this.props.children[active-1] != undefined){
            this.setState({
                active:active-1
            });
        }
    }
});