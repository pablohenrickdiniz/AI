var Tabpanel = React.createClass({
    render:function(){
        var nav_tabs = [];
        var active = this.props.active;
        var children = this.props.children.map(function(tabpane,index){
            var title = tabpane.props.title;
            var id = tabpane.props.id;
            nav_tabs.push(<Tablistitem title={title} id={id} key={index} active={active == id}/>);
            return <Tabpane id={id} title={title} active={active == id}/>;
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