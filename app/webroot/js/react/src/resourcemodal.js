var ResourceModal = React.createClass({
    getInitialState:function(){
        return {
            loadUrl:'',
            projectId:0,
            id:''
        };
    },
    componentWillMount:function(){
        this.updateState(this.props);
    },
    render:function(){
        return (
            <Modal title="Recursos" footer="false" id={this.state.id}>
                <Tree id="resource-tree" loadUrl={this.state.loadUrl} formData={{'data[id]':this.state.projectId}}/>
            </Modal>
        );
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    },
    updateState:function(props){
        var state = {};

        if(_.isString(props.id) && props.id != this.state.id){
            state.id = props.id;
        }

        if(_.isString(props.loadUrl) && props.loadUrl != this.state.loadUrl){
            state.loadUrl = props.loadUrl;
        }

        if(_.isNumber(props.projectId) && props.projectId != this.state.projectId ){
            state.projectId = props.projectId;
        }

        if(!_.isEmpty(state)){
            this.setState(state);
        }
    }
});