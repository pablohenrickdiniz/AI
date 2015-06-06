var Tree = React.createClass({
    loaded:false,
    getInitialState:function(){
        return {
            id:'',
            url:'',
            data:[]
        };
    },
    componentWillMount:function(){
        this.setState({
            id:this.props.id,
            url:this.props.url,
            data:this.props.data
        });
    },
    componentDidMount:function(){
        this.load();
    },
    render:function(){
        return (
            <div className="tree" id={this.state.id}>
            </div>
        );
    },
    componentDidUpdate:function(){
        this.reload();
    },
    componentWillReceiveProps:function(props){
        this.setState({
            data:props.data
        });
    },
    reload:function(){
        var self = this;
        if(self.loaded){
            self.clear();
        }
        self.load();
    },
    clear:function(){
        $('#'+this.props.id).dynatree("destroy");
    },
    load:function(){
        var url = this.state.url;
        var onComplete = (typeof this.props.onComplete == 'function')?this.props.onComplete:null;
        var onLazyRead = (typeof this.props.onLazyRead == 'function')?this.props.onLazyRead:null;
        var self = this;
        $('#'+this.props.id).dynatree({
            initAjax: {
                url: url,
                type: 'post',
                data:this.state.data,
                complete: function () {
                    self.loaded = true;
                    if(onComplete != null){
                        onComplete.apply(this,arguments);
                    }
                }
            },
            debugLevel: 0,
            persist: false,
            generateIds: true,
            idPrefix: 'data-id:',
            onLazyRead: function (node) {
                if(onLazyRead != null){
                    onLazyRead(node);
                }
            }
        });
    }
});