var StepModal = React.createClass({
    options:{
        onConfirm:[],
        onCancel:[]
    },
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
        if(this.props.children.length > 0){
            this.setState({
                active:this.props.children[0].props.id
            });
        }
    },
    render:function(){
        var tabpanes = this.props.children.map(function(tabpane,index){

        });

        return (
            <Modal title={this.state.title} onConfirm={this.confirm} onCancel={this.cancel} confirmText={this.state.confirmText} cancelText={this.state.cancelText}>
                <Tabpanel active={this.state.active}>
                    {tabpanes}
                </Tabpanel>
            </Modal>
        );
    },
    confirm:function(){

    },
    cancel:function(){

    }
});