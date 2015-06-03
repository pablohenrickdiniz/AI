var Col = React.createClass({
    getInitialState: function () {
        return {
            type:'md',
            size:12
        };
    },
    render: function () {
        return (
            <div className={'col-' + this.state.type + '-' + this.state.size}>
            </div>
        );
    },
    componentDidMount:function(){
        var size = parseInt(this.props.size);
        var type = this.props.type;

        var state = {type:this.state.type,size:this.state.size};
        var types = ['sm','md','lg'];
        if(size != undefined && !isNaN(size) && size >=  1 && size <= 12){
            state.size = size;
        }

        if(type != undefined && types.indexOf(type) != -1){
            state.type = type;
        }

        this.setState(state);
    }
});