var StepModal = React.createClass({
    mixins:[updateMixin],
    propTypes:{
        step:React.PropTypes.number,
        title:React.PropTypes.string,
        onConfirm:React.PropTypes.func,
        onCancel:React.PropTypes.func,
        id:React.PropTypes.string,
        layer:React.PropTypes.number,
        open:React.PropTypes.bool,
        children:React.PropTypes.array
    },
    getInitialState:function(){
        return {
            step:0,
            title:'Step Modal',
            onConfirm:null,
            onCancel:null,
            id:generateUUID(),
            layer:1,
            open:false,
            children:[],
            confirmText:'confirm',
            cancelText:'cancel',
            previousText:'previous',
            nextText:'next',
            inputConfirmText:'next',
            inputCancelText:'cancel'
        };
    },
    close:function(){
        this.setState({
            step:0,
            open:false
        });
    },
    render:function(){
        var props = {
            id:this.state.id,
            title:this.state.title,
            confirmText:this.state.inputConfirmText,
            cancelText:this.state.inputCancelText,
            open:this.state.open,
            layer:this.state.layer,
            confirmDisabled:true
        };

        return (
            <Modal {...props} onConfirm={this.onConfirm} onCancel={this.onCancel} onClose={this.close}>
                <Tabpanel activeTab={this.state.step} dataToggle={false}>
                    {this.state.children}
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
    componentDidMount:function(){
        this.updateInputs();
    },
    componentDidUpdate:function(){
        this.updateInputs();
    },
    updateInputs:function(){
        var state  = {};
        var initial = this.getInitialState();
        if(this.state.step == 0){
            state.inputCancelText = this.state.cancelText;
        }
        else{
            state.inputCancelText = this.state.previousText;
        }
        if(this.state.step == this.state.children.length - 1){
            state.inputConfirmText =  this.state.confirmText;
        }
        else{
            state.inputConfirmText = this.state.nextText;
        }
        this.updateState(state);
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
        if(this.state.children[step+1] != undefined){
            this.setState({
                step:step+1
            });
        }
    },
    prev:function(){
        var step = this.state.step;
        if(this.state.children[step-1] != undefined){

            this.setState({
                step:step-1
            });
        }
    }
});