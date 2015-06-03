var Dropdown = React.createClass({
    render:function(){
        return (
            <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{this.props.title}<span className="caret"></span></a>
                <ul className="dropdown-menu" role="menu">
                    {this.props.children}
                </ul>
            </li>
        );
    }
});