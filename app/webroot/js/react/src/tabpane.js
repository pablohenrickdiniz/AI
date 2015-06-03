var Tabpane = React.createClass({
    render:function(){
        return (
            <div role="tabpanel" className="tab-pane" id={this.props.id}>
                {this.props.children}
            </div>
        );
    }
});