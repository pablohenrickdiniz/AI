var Tree = React.createClass({
    componentDidMount:function(){
        this.load();
    },
    render:function(){
        return (
            <div className="tree" id={this.props.id}>
            </div>
        );
    },
    load:function(){
        var url = this.props.url;
        var onComplete = (typeof this.props.onComplete == 'function')?this.props.onComplete:null;
        var onLazyRead = (typeof this.props.onLazyRead == 'function')?this.props.onLazyRead:null;
        var self = this;
        $('#'+this.props.id).dynatree({
            initAjax: {
                url: url,
                type: 'post',
                data:this.props.data,
                complete: function () {
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