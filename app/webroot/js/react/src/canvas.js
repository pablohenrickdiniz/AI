var Canvas = React.createClass({
    mixins:[updateMixin],
    propTypes:{
        context:React.PropTypes.object,
        id:React.PropTypes.arrayOf(React.PropTypes.string),
        width:React.PropTypes.string,
        height:React.PropTypes.string,
        execute:React.PropTypes.func,
        parent:React.PropTypes.object,
        layers:React.PropTypes.number
    },
    getInitialState:function(){
        console.log('initial state...');
        return {
            context:[],
            id:[generateUUID()],
            width:'100%',
            height:'auto',
            loadCallback:null,
            layers:1
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
        if(_.isFunction(this.state.loadCallback)){
            this.state.loadCallback(this);
        }
        this.updateIds(state);
        this.updateLayers(state);

        this.updateState(state);
    },
    updateIds:function(state){
        if(this.state.layers != this.state.id.length){
            state.id = this.state.id;
            state.id.length = this.state.layers;
            for(var i = 0; i < this.state.layers;i++){
                if(state.id[i] == undefined){
                    state.id[i] = generateUUID();
                }
            }
        }
    },
    updateLayers:function(state){
        if(this.state.layers != this.state.context.length){
            state.context = this.state.context;
            state.context.length = this.state.layers;
            for(var i = 0; i < this.state.layers;i++){
                if(state.context[i] == undefined){
                    state.context[i] = null;
                }
            }
        }
    },
    getCanvasId:function(layer){
        if(this.state.layers > layer){
            if(this.state.id[layer] == null){
                var state ={};
                state.id = this.state.id.map(function(id){
                    return id;
                });
                state.id[layer] = generateUUID();
                this.updateState(state);
            }
            return this.state.id[layer];
        }
        return null;
    },
    getContext:function(layer){
        if(this.state.layers > layer){
            if(this.state.context[layer] == null){
                var id = this.getCanvasId(layer);
                var context = document.getElementById(id).getContext('2d');
                var state ={};
                state.context = this.state.context.map(function(context){return context;});
                state.context[layer] = context;
                this.updateState(state);
            }
            return this.state.context[layer];
        }
        return null;
    },
    render:function(){
        var canvas_layers = [];
        for(var layer = 0; layer < this.state.layers;layer++){
            canvas_layers.push(<canvas id={this.state.id[layer]} width={this.state.width} height={this.state.height} key={layer} style={{position:'absolute',left:0,top:0,zIndex:layer}}></canvas>);
        }

        return (
            <div className="canvas-container" style={{position:'relative'}}>
                {canvas_layers}
            </div>
        );
    }
});