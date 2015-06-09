var ResourceModal = React.createClass({
    getInitialState:function(){
        return {
            url:'',
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
                <Tree id="resource-tree" url={Global.resource.children} formData={{'data[id]':this.state.projectId}}/>
            </Modal>
        );
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    },
    updateState:function(props){
        var state = {};

        if(props.id != undefined && props.id != this.state.id && _.isString(props.id)){
            state.id = props.id;
        }

        if(props.url != undefined && props.url != this.state.url && _.isString(props.url)){
            state.url = props.url;
        }


        if(props.projectId != undefined && props.projectId != this.state.projectId ){
            state.projectId = props.projectId;
        }


        if(!_.isEmpty(state)){
            this.setState(state);
        }
    }
});