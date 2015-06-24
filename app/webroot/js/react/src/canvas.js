var Canvas = React.createClass({
    mixins:[updateMixin],
    propTypes:{
        context:React.PropTypes.object,
        id:React.PropTypes.string,
        width:React.PropTypes.string,
        height:React.PropTypes.string,
        execute:React.PropTypes.func,
        parent:React.PropTypes.object
    },
    getInitialState:function(){
        console.log('initial state...');
        return {
            context:null,
            id:generateUUID(),
            width:'100%',
            height:'auto',
            loadCallback:null
        };
    },
    componentDidMount:function(){
        this.refresh();
    },
    componentDidUpdate:function(){
        this.refresh();
    },
    refresh:function(){
        var state = {};
        if(this.state.context == null){
            var context = document.getElementById(this.state.id).getContext('2d');
            state.context = context;
        }
        if(_.isFunction(this.state.loadCallback)){
            this.state.loadCallback(this);
        }
        this.updateState(state);
    },
    render:function(){
        return (
            <canvas id={this.state.id} width={this.state.width} height={this.state.height}>
            </canvas>
        );
    }
});