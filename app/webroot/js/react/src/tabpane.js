var Tabpane = React.createClass({
    mixins:[updateMixin],
    propTypes:{
        active:React.PropTypes.bool,
        id:React.PropTypes.string
    },
    getInitialState:function(){
        return {
            active:false,
            id:generateUUID()
        };
    },
    render:function(){
        var class_name = 'tab-pane'+(this.state.active?' active':'');
        return (
            <div role="tabpanel" className={class_name} id={this.state.id}>
                {this.props.children}
            </div>
        );
    }
});