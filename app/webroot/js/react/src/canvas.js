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
        return {
            context:null,
            id:generateUUID(),
            width:'100%',
            height:'auto',
            parent:null
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
        if(this.state.parent != null){
            this.state.parent.updateState({
                canvas:this
            });
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