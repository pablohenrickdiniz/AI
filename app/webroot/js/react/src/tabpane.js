var Tabpane = React.createClass({
    getInitialState:function(){
        return {
            active:false
        };
    },
    componentWillMount:function(){
        this.setState({
            active:this.props.active?true:false
        });
    },
    render:function(){
        var class_name = 'tab-pane'+(this.state.active?' active':'');
        return (
            <div role="tabpanel" className={class_name} id={this.props.id} data={this.props.data}>
                {this.props.children}
            </div>
        );
    }
});