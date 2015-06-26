var Tabpanel = React.createClass({
    mixins:[updateMixin],
    propTypes:{
        activeTab:React.PropTypes.number,
        toggle:React.PropTypes.bool,
        items:React.PropTypes.array,
        panes:React.PropTypes.array
    },
    getInitialState: function () {
        return {
            activeTab: 0,
            toggle:false,
            items:[],
            panes:[]
        };
    },
    render: function () {
        var activeTab = this.state.activeTab;
        var self = this;
        var items = this.state.items.map(function(item,index){
            return <Tablistitem title={item.props.title} key={index} active={item.key == activeTab}/>
        });
        var tabs = this.state.panes.map(function(pane,index){
            return <Tabpane  key={index} active={pane.key == activeTab}>{pane.props.children}</Tabpane>
        });

        return (
            <div className="tabpanel" role="tabpanel">
                <ul className="nav nav-tabs" role="tablist">
                    {items}
                </ul>
                <div className="tab-content">
                    {tabs}
                </div>
            </div>
        );
    }
});