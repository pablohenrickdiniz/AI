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
        panes:React.PropTypes.array,
        items:React.PropTypes.array,
        confirmDisabled:React.PropTypes.arrayOf(React.PropTypes.bool),
        loadCallback:React.PropTypes.func,
        onClose:React.PropTypes.func,
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
            panes:[],
            items:[],
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
        var modal_props = {
            id:this.state.id,
            title:this.state.title,
            confirmText:this.state.inputConfirmText,
            cancelText:this.state.inputCancelText,
            open:this.state.open,
            layer:this.state.layer,
            confirmDisabled:this.state.confirmDisabled[this.state.step],
            onConfirm:this.onConfirm,
            onCancel:this.onCancel,
            onClose:this.close
        };

        var tabpane_props = {
            activeTab:this.state.step,
            dataToggle:false,
            items:this.state.items,
            panes:this.state.panes
        };


        return (
            <Modal {...modal_props}>
                <Tabpanel {...tabpane_props}/>
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
        this.updateChildren();
        this.updateInputs();
        if(_.isFunction(this.state.loadCallback)){
            this.state.loadCallback(this);
        }
    },
    componentDidUpdate:function(){
        this.updateChildren();
        this.updateInputs();
    },
    updateChildren:function(){
        var state = {
            panes:[],
            items:[]
        };
        this.state.children.map(function(child){
            if(child.type == Tablistitem){
                state.items.push(child);
            }
            else if(child.type == Tabpane){
                state.panes.push(child);
            }
        });
        this.updateState(state);
    },
    updateInputs:function(){
        var state  = {};
        var length = this.state.items.length;
        state.confirmDisabled = this.state.confirmDisabled.map(function(disabled){return disabled;});

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
        if(this.state.step == this.state.items.length - 1){
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
        if(this.state.items[step+1] != undefined){
            this.setState({
                step:step+1
            });
        }
    },
    prev:function(){
        var step = this.state.step;
        if(this.state.items[step-1] != undefined){
            this.setState({
                step:step-1
            });
        }
    }
});