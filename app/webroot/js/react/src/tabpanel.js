var Tabpanel = React.createClass({
    getInitialState: function () {
        return {
            active: this.props.active
        };
    },
    componentWillReceiveProps:function(nextProps){
        this.setState({
            active:nextProps.active
        });
    },
    render: function () {
        var nav_tabs = [];
        var children = [];
        var active = this.state.active;
        var self = this;
        children = this.props.children.map(function (tabpane, index) {
            var title = tabpane.props.title;
            var id = tabpane.props.id==undefined?generateUUID():tabpane.props.id;

            nav_tabs.push(<Tablistitem title={title} id={id} key={index} active={active == index} dataToggle={self.props.dataToggle}/>);
            return <Tabpane id={id} title={title} active={active == index} key={index}/>;
        });

        return (
            <div className="tabpanel" role="tabpanel">
                <ul className="nav nav-tabs" role="tablist">
                    {nav_tabs}
                </ul>
                <div className="tab-content">
                    {children}
                </div>
            </div>
        );
    }
});