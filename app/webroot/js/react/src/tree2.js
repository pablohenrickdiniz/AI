var TreeView = React.createClass({
    propTypes:{
        data:React.PropTypes.array,
        url:React.PropTypes.string
    },
    componentWillMount:function(){
        this.updateState(this.props);
    },
    updateState:function(props){
        this.setState({
            data:props.data,
            url:props.url
        });
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    },
    render:function(){
        var data = this.state.data;
        var children = data.map(function(node,index){
            var isFolder = node.isFolder?true:false;
            var title = node.title == undefined?'':node.title;
            var icon = node.icon == undefined?'':node.icon;
            var expanded = node.expanded?true:false;
            var children = node.children instanceof Array?node.children:[];
            return <TreeNode title={title}  isFolder={isFolder} icon={icon} expanded={expanded} key={index} children={children}/>
        });

        return (
            <ul className="tree">
                {children}
            </ul>
        );
    }
});

var TreeNode = React.createClass({
    propTypes:{
        isFolder:React.PropTypes.bool,
        icon:React.PropTypes.string,
        title:React.PropTypes.string,
        children:React.PropTypes.array,
        expanded:React.PropTypes.bool
    },
    getInitialState:function(){
        return {
            title:'',
            isFolder:false,
            icon:'',
            children:[],
            expanded:false
        }
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    },
    componentWillMount:function(){
        this.updateState(this.props);
    },
    updateState:function(props){
        this.setState({
            title:props.title,
            isFolder:props.isFolder,
            icon:props.icon,
            children:props.children,
            expanded:props.expanded
        });
    },
    render:function(){
        var expanded = this.state.expanded?'expanded':'closed';
        var toggle = this.state.isFolder && this.state.children.length > 0?this.state.expanded?'fa fa-minus-square toggle':'fa fa-plus-square toggle':'space';
        var icon = this.state.isFolder?(this.state.expanded?'fa folder-open icon':'fa folder icon'):this.state.icon+ ' icon';
        console.log(icon);
        var children = this.state.children.map(function(node,index){
            var isFolder = node.isFolder?true:false;
            var title = node.title == undefined?'':node.title;
            var icon = node.icon == undefined?'':node.icon;
            var expanded = node.expanded?true:false;
            var children = node.children instanceof Array?node.children:[];
            return <TreeNode title={title}  isFolder={isFolder} icon={icon} expanded={expanded} key={index} children={children}/>
        });

        return (
            <li className={expanded}>
                <span className={toggle} onClick={this.toggle}></span>
                <span clasName={icon}></span>
                <span className="title">{this.state.title}</span>
                <ul>
                    {children}
                </ul>
            </li>
        );
    },
    toggle:function(){
        this.setState({
            expanded:!this.state.expanded
        });
    }
});