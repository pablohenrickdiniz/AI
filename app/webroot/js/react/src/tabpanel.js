var Tabpanel = React.createClass({
    render:function(){
        var nav_tabs = [];
        var children = this.props.children.map(function(tabpane,index){
            var title = tabpane.props.title;
            var id = generateUUID();
            nav_tabs.push(<Tablistitem title={title} id={id} key={index} active={index==0}/>);
            return <Tabpane id={id} title={title}/>;
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