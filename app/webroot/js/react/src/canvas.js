var Canvas = React.createClass({
    mixins: [updateMixin, customFunctions],
    propTypes: {
        context: React.PropTypes.object,
        id: React.PropTypes.arrayOf(React.PropTypes.string),
        width: React.PropTypes.string,
        height: React.PropTypes.string,
        execute: React.PropTypes.func,
        parent: React.PropTypes.object,
        layers: React.PropTypes.number,
        left: React.PropTypes.number,
        top: React.PropTypes.number,
        onWheel:React.PropTypes.func
    },
    mouse:{
        mouseDown:false,
        startPoint:{x:0,y:0},
        auxPos:{x:0,y:0}
    },
    getInitialState: function () {
        console.log('initial state...');
        return {
            context: [],
            id: [generateUUID()],
            width: '100%',
            height: 'auto',
            loadCallback: null,
            layers: 1,
            left: 0,
            top: 0,
            onWheel:null
        };
    },
    componentDidMount: function () {
        this.refresh();
    },
    componentDidUpdate: function () {
        this.refresh();
    },
    refresh: function () {
        var state = {};
        if (_.isFunction(this.state.loadCallback)) {
            this.state.loadCallback(this);
        }
        this.updateIds(state);
        this.updateLayers(state);

        this.updateState(state);
    },
    updateIds: function (state) {
        if (this.state.layers != this.state.id.length) {
            state.id = this.state.id;
            state.id.length = this.state.layers;
            for (var i = 0; i < this.state.layers; i++) {
                if (state.id[i] == undefined) {
                    state.id[i] = generateUUID();
                }
            }
        }
    },
    updateLayers: function (state) {
        if (this.state.layers != this.state.context.length) {
            state.context = this.state.context;
            state.context.length = this.state.layers;
            for (var i = 0; i < this.state.layers; i++) {
                if (state.context[i] == undefined) {
                    state.context[i] = null;
                }
            }
        }
    },
    getCanvasId: function (layer) {
        if (this.state.layers > layer) {
            if (this.state.id[layer] == null) {
                var state = {};
                state.id = this.state.id.map(function (id) {
                    return id;
                });
                state.id[layer] = generateUUID();
                this.updateState(state);
            }
            return this.state.id[layer];
        }
        return null;
    },
    clearLayer: function (layer) {
        var context = this.getContext(layer);
        if (context != null) {
            context.clearRect(0, 0, this.state.width, this.state.height);
        }
    },
    getVisibleArea: function () {
        var container_width = $(this.node('container')).width();
        var container_height = $(this.node('container')).height();
        var x = this.state.left;
        var y = -(this.state.top);
        var w = Math.min(container_width,this.state.width);
        var h = Math.min(container_height,this.state.height);
        return {
            x: x,
            y: y,
            w:w,
            h: h
        };
    },
    clearLayers: function () {
        for (var i = 0; i < this.state.layers; i++) {
            this.clearLayer(i);
        }
    },
    getContext: function (layer) {
        if (this.state.layers > layer) {
            if (this.state.context[layer] == null) {
                var id = this.getCanvasId(layer);
                var context = document.getElementById(id).getContext('2d');
                var state = {};
                state.context = this.state.context.map(function (context) {
                    return context;
                });
                state.context[layer] = context;
                this.updateState(state);
            }
            return this.state.context[layer];
        }
        return null;
    },
    render: function () {
        var canvas_layers = [];
        var style = {
            position: 'absolute',
            left: this.state.left,
            top: this.state.top,
            zIndex: layer
        };
        for (var layer = 0; layer < this.state.layers; layer++) {
            var props = {
                id: this.state.id[layer],
                width: this.state.width,
                height: this.state.height,
                key: layer,
                style: style,
                onContext: this.onContext
            };
            canvas_layers.push(<canvas {...props}></canvas>);
        }

        return (
            <div className="canvas-container thumbnail  transparent-pattern" onWheel={this.onWheel} onMouseMove={this.mouseMove} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onMouseOut={this.mouseUp} ref="container">
                <div className="canvas-aligner" style={{width:this.state.width}}>
                     {canvas_layers}
                </div>
            </div>
        );
    },
    mouseDown:function(e){
        e.preventDefault();
        this.mouse.mouseDown = true;
        this.mouse.startPoint = {x: e.clientX,y: e.clientY};
        this.mouse.auxPos =  {x: this.state.left,y: this.state.top};
    },
    mouseUp:function(e){
        e.preventDefault();
        this.mouse.mouseDown = false;
    },
    mouseMove:function(e){
        if(this.mouse.mouseDown){
            var pa = {x:e.clientX,y:e.clientY};
            var pb = this.mouse.startPoint;
            var df = {x:pa.x-pb.x,y:pa.y-pb.y};
            var aux = this.mouse.auxPos;

            var state = {
                left:aux.x+df.x,
                top:aux.y+df.y
            };
            this.updateState(state);
        }
    },


    onWheel: function (e) {
        e.preventDefault();
        var state = {};
        var container_height = $(this.node('container')).width();


        if (e.deltaY > 0) {
            var min_top = -(this.state.height - container_height);
            if (this.state.top - e.deltaY >= min_top) {
                state.top = this.state.top - e.deltaY;
            }
            else{
                state.top = min_top;
            }
        }
        else if (e.deltaY < 0) {
            if (this.state.top - e.deltaY <= 0) {
                state.top = this.state.top - e.deltaY;
            }
            else{
                state.top = 0;
            }
        }
        this.updateState(state);
        if(_.isFunction(this.state.onWheel)){
            this.state.onWheel();
        }
    },
    onContext: function (e) {
        e.preventDefault();
    }
});