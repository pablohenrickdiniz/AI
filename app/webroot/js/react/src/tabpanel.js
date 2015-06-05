var Tabpanel = React.createClass({
    getInitialState: function () {
        return {
            active: 0
        };
    },
    componentWillMount: function () {
        this.setState({
            active: this.props.active
        });
    },
    render: function () {
        var nav_tabs = [];
        var children = [];
        var active = this.state.active;

        children = this.props.children.map(function (tabpane, index) {
            var title = tabpane.props.title;
            var id = tabpane.props.id;
            nav_tabs.push(<Tablistitem title={title} id={id} key={index} active={active == index}/>);
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