var Tabpane = React.createClass({
    getInitialState:function(){
        return {
            active:(this.props.active != undefined && this.props.active),
            id:this.props.id,
            data:this.props.data
        };
    },
    render:function(){
        var class_name = 'tab-pane'+(this.state.active?' active':'');
        return (
            <div role="tabpanel" className={class_name} id={this.state.id} data={this.state.data}>
                {this.props.children}
            </div>
        );
    }
});