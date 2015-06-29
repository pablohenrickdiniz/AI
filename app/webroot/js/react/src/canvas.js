var Canvas = React.createClass({
    mixins: [updateMixin, customFunctions],
    propTypes: {
        context: React.PropTypes.array,
        id: React.PropTypes.arrayOf(React.PropTypes.string),
        width: React.PropTypes.string,
        height: React.PropTypes.string,
        frameWidth:React.PropTypes.number,
        frameHeight:React.PropTypes.number,
        execute: React.PropTypes.func,
        parent: React.PropTypes.object,
        layers: React.PropTypes.number,
        left: React.PropTypes.number,
        top: React.PropTypes.number,
        onWheel:React.PropTypes.func,
        onMove:React.PropTypes.func,
        scale:React.PropTypes.number,
        copy:[]
    },
    getScaleTop:function(){
        return this.state.top*this.state.scale;
    },
    getScaleLeft:function(){
        return this.state.left*this.state.scale;
    },
    getScaleWidth:function(){
        return this.state.width*this.state.scale;
    },
    getScaleHeight:function(){
        return this.state.height*this.state.scale;
    },
    getScaleFrameWidth:function(){
        return this.state.frameWidth*this.state.scale;
    },
    getScaleFrameHeight:function(){
        return this.state.frameHeight*this.state.scale;
    },
    getInverseScaleFrameWidth:function(){
        return this.state.frameWidth*(1/this.state.scale);
    },
    getInverseScaleFrameHeight:function(){
        return this.state.frameHeight*(1/this.state.scale);
    },
    mouse:{
        mouseDown:false,
        startPoint:{x:0,y:0},
        auxPos:{x:0,y:0}
    },
    getInitialState: function () {
        return {
            context: [],
            id: [generateUUID()],
            width: '100%',
            height: 'auto',
            frameWidth:0,
            frameHeight:0,
            loadCallback: null,
            layers: 1,
            left: 0,
            top: 0,
            onWheel:null,
            onMove:null,
            scale:1
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

        this.updateSize(state);
        this.updateIds(state);
        this.updateLayers(state);
        this.updateState(state);
    },
    updateSize:function(state){
        var container_width = Math.ceil($(this.node('container')).width());
        var container_height = Math.ceil($(this.node('container')).height());
        if(container_width != 0 && container_height != 0){
            state.width = container_width;
            state.height = container_height;
        }
    },
    setScale:function(scale,callback){
        var self = this;
        var count = 0;
        var state ={scale:scale};
        for(var layer = 0; layer < self.state.layers;layer++){
            self.getContext(layer,function(context){
                if(context != null){
                    context.scale(1/self.state.scale,1/self.state.scale);
                    context.scale(scale,scale);
                }
            });
        }

        self.updateState(state,function(){
            var state = {};
            var min_top = self.getMinTop();
            var min_left = self.getMinLeft();
            if(min_top > self.state.top){
                state.top = min_top;
            }
            if(min_left > self.state.left) {
                state.left = min_left;
            }

            self.updateState(state);
            if(_.isFunction(callback)){
                callback();
            }
        });
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
        var self = this;
        this.getContext(layer,function(context){
            if (context != null) {
                context.clearRect(0,0, self.state.width*(1/self.state.scale), self.state.height*(1/self.state.scale));
            }
        });
    },
    getVisibleArea: function () {
        var container_width = $(this.node('container')).width();
        var container_height = $(this.node('container')).height();
        var x = -(this.getScaleLeft());
        var y = -(this.getScaleTop());
        var width = this.state.frameWidth;
        var height = this.state.frameHeight;
        var w = Math.min(container_width,width);
        var h = Math.min(container_height,height);
        var visible = {x: x, y: y, w:w, h: h};
        return visible;
    },
    clearLayers: function () {
        for (var i = 0; i < this.state.layers; i++) {
            this.clearLayer(i);
        }
    },
    getContext: function (layer,callback) {
        var self = this;
        if (self.state.layers > layer) {
            if (self.state.context[layer] == null) {
                var id = self.getCanvasId(layer);
                var context = document.getElementById(id).getContext('2d');
                var state = {};
                state.context = self.state.context.map(function (context) {
                    return context;
                });
                state.context[layer] = context;
                self.updateState(state,function(){
                    if(_.isFunction(callback)){
                        callback.apply(self,[self.state.context[layer],this]);
                    }
                });
            }
            if(_.isFunction(callback)){
                callback.apply(self,[self.state.context[layer],this]);
            }
        }
        else  if(_.isFunction(callback)){
            callback.apply(self,[null,this]);
        }
    },
    render: function () {
        var canvas_layers = [];
        var style = {
            position: 'absolute',
            left:0,
            top:0,
            zIndex: layer
        };
        for (var layer = 0; layer < this.state.layers; layer++) {
            var props = {
                id: this.state.id[layer],
                width: this.state.width,
                height: this.state.height,
                key: layer,
                style: style,
                onContextMenu: this.onContext
            };
            canvas_layers.push(<canvas {...props}></canvas>);
        }

        return (
            <div className="canvas-container thumbnail  transparent-pattern" onWheel={this.onWheel} onMouseMove={this.mouseMove} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onMouseOut={this.mouseUp} ref="container">
                {canvas_layers}
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

            var left = aux.x+df.x;
            var top = aux.y+df.y;
            var min_top = this.getMinTop();
            var min_left = this.getMinLeft();
            var state = {};

            if(top <= 0 && top >= min_top) {
                state.top = top;
            }
            else if(df.y > 0){
                state.top = 0;
            }
            else{
                state.top = min_top;
            }

            if(left <= 0 && left >= min_left){
                state.left = left;
            }
            else if(df.x > 0){
                state.left = 0;
            }
            else{
                state.left = min_left;
            }
            this.updateState(state,this.state.onMove);
        }
    },
    getMinTop:function(){
        var container_height = $(this.node('container')).height();
        return  -(this.state.frameHeight)+(container_height*(1/this.state.scale));
    },
    getMinLeft:function(){
        var container_width = $(this.node('container')).width();
        var min_left = this.state.frameWidth-(container_width*(1/this.state.scale));
        min_left = min_left<0?0:min_left;
        return -(min_left);
    },
    onWheel: function (e) {
        e.preventDefault();
        var state = {};

        if (e.deltaY > 0) {
            var min_top = this.getMinTop();
            if(this.state.top- e.deltaY >= min_top){
                state.top = this.state.top- e.deltaY;
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
        this.updateState(state,this.state.onWheel);
    },
    onContext: function (e) {
        e.preventDefault();
    }
});