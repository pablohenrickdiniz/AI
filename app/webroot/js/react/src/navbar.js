var Navbar = React.createClass({
    getInitialState:function(){
        return {
            collapseId:generateUUID()
        };
    },
    render:function(){
        return (
            <nav className="navbar navbar-default" id={this.props.id}>
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target={'#'+this.state.collapseId}>
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className="collapse navbar-collapse" id={this.state.collapseId}>
                        <ul className="nav navbar-nav">
                            {this.props.children}
                        </ul>
                    </div>
                </div>

            </nav>
        );
    }
});