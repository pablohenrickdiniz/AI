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
        children:React.PropTypes.array,
        confirmDisabled:React.PropTypes.arrayOf(React.PropTypes.bool),
        loadCallback:React.PropTypes.func,
        onClose:React.PropTypes.func
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
            inputCancelText:'cancel',
            confirmDisabled:[true],
            loadCallback:null,
            onClose:null
        };
    },
    close:function(){

        if(_.isFunction(this.state.onClose)){
            this.state.onClose();
        }
        this.setState(this.getInitialState());
    },
    setDisabled:function(disabled){

        var state ={};
        var self = this;
        state.confirmDisabled = this.state.confirmDisabled.map(function(val,index){
            return (index == self.state.step?disabled:val);
        });
        this.updateState(state);
    },
    render:function(){

        var props = {
            id:this.state.id,
            title:this.state.title,
            confirmText:this.state.inputConfirmText,
            cancelText:this.state.inputCancelText,
            open:this.state.open,
            layer:this.state.layer,
            confirmDisabled:this.state.confirmDisabled[this.state.step]
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
        if(_.isFunction(this.state.loadCallback)){
            this.state.loadCallback(this);
        }
    },
    componentDidUpdate:function(){

        this.updateInputs();
    },
    updateInputs:function(){

        var state  = {};
        var length = this.state.children.length;
        state.confirmDisabled = this.state.confirmDisabled;

        if(state.confirmDisabled.length != length){
            state.confirmDisabled.length = length;
            for(var i = 0; i < length;i++){
                state.confirmDisabled[i] = (_.isBoolean(state.confirmDisabled[i])?state.confirmDisabled[i]:true);
            }
        }

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