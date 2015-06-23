var Tabpanel = React.createClass({
    mixins:[updateMixin],
    propTypes:{
        activeTab:React.PropTypes.number,
        toggle:React.PropTypes.bool,
        children:React.PropTypes.array
    },
    getInitialState: function () {
        return {
            activeTab: 0,
            toggle:false,
            children:[]
        };
    },
    render: function () {
        var nav_tabs = [];
        var children = [];
        var activeTab = this.state.activeTab;
        var self = this;
        children = this.state.children.map(function (tabpane, index) {
            var title = tabpane.props.title;

            nav_tabs.push(<Tablistitem title={title} key={index} active={activeTab == index} toggle={self.state.toggle}/>);
            return <Tabpane title={title} active={activeTab == index} key={index}>{tabpane.props.children}</Tabpane>;
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