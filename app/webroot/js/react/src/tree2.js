var TreeView = React.createClass({
    propTypes:{
        data:React.PropTypes.array,
        url:React.PropTypes.string,
        id:React.PropTypes.string,
        formData:React.PropTypes.object,
        onItemLeftClick:React.PropTypes.func
    },
    getInitialState:function(){
        return {
            data:[],
            formData:{},
            url:'',
            id:generateUUID(),
            onItemLeftClick:null
        };
    },
    componentWillMount:function(){
        this.updateState(this.props);
    },
    updateState:function(props){
        var state = [];
        state.data = props.data instanceof Array?props.data:[];
        state.url = props.url == undefined?'':props.url;
        state.formData = typeof props.formData == 'object'?props.formData:{};
        state.onItemLeftClick = typeof props.onItemLeftClick == 'function'?props.onItemLeftClick:null;

        if(state.url != ''){
            var self = this;
            $.ajax({
                url:state.url,
                type:'post',
                dataType:'json',
                data:state.formData,
                success:function(data){
                    state.data = data;
                    self.setState(state);
                }.bind(this),
                error:function(data){

                }.bind(this)
            });
        }
        else{
            this.setState(state);
        }
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    },
    render:function(){
        var data = this.state.data;
        var prefix = this.state.prefix == undefined?'data-id:':this.state.prefix;
        var self = this;

        var children = data.map(function(node,index){
            var isFolder = node.isFolder?true:false;
            var title = node.title == undefined?'':node.title;
            var icon = node.icon == undefined?'':node.icon;
            var expand = node.expand?true:false;
            var children = node.children instanceof Array?node.children:[];
            var key = node.key == undefined?index:node.key;
            var metadata = typeof node.metadata == 'object'?node.metadata:{};
            return <TreeNode title={title}  isFolder={isFolder} icon={icon} expand={expand} key={index} id={key} children={children} onLeftClick={self.state.onItemLeftClick} metadata={metadata}/>
        });

        return (
            <ul className="tree" onContextMenu={this.contextMenu} id={this.state.id}>
                {children}
            </ul>
        );
    },
    contextMenu:function(e){
        e.preventDefault();
    }
});

var TreeNode = React.createClass({
    propTypes:{
        isFolder:React.PropTypes.bool,
        icon:React.PropTypes.string,
        title:React.PropTypes.string,
        children:React.PropTypes.array,
        expand:React.PropTypes.bool,
        key:React.PropTypes.number,
        metadata:React.PropTypes.object
    },
    getInitialState:function(){
        return {
            title:'',
            isFolder:false,
            icon:'',
            children:[],
            expand:false,
            key:0,
            onLeftClick:null,
            metadata:{}
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
            expand:props.expand,
            key:props.id,
            onLeftClick:props.onLeftClick,
            metadata:props.metadata
        });
    },
    render:function(){
        var expand = this.state.expand?'expand':'closed';
        var toggle = this.state.isFolder && this.state.children.length > 0?this.state.expand?'fa fa-minus-square toggle':'fa fa-plus-square toggle':'space';
        var icon = this.state.isFolder?(this.state.expand?'fa fa-folder-open icon':'fa fa-folder icon'):this.state.icon+ ' icon';
        var hasChildren = this.state.children.length > 0;
        var self = this;

        var children = this.state.children.map(function(node,index){
            var isFolder = node.isFolder?true:false;
            var title = node.title == undefined?'':node.title;
            var icon = node.icon == undefined?'':node.icon;
            var expand = node.expand?true:false;
            var children = node.children instanceof Array?node.children:[];
            var key = node.key == undefined?index:node.key;
            var metadata = typeof node.metadata == 'object'?node.metadata:{};
            return <TreeNode title={title}  isFolder={isFolder} icon={icon} expand={expand} key={index} id={key} children={children} onLeftClick={self.state.onLeftClick} metadata={metadata}/>
        });

        return (
            <li className={expand}>
                <span className={toggle} onClick={this.state.isFolder && hasChildren?this.toggle:null}></span>
                <span className={icon} onDoubleClick={this.state.isFolder && hasChildren?this.toggle:null} onContextMenu={this.contextMenu}></span>
                <span className="title" onDoubleClick={this.state.isFolder && hasChildren?this.toggle:null} onContextMenu={this.contextMenu}>{this.state.title}</span>
                <ul>
                    {children}
                </ul>
            </li>
        );
    },
    contextMenu:function(){
        if(typeof this.state.onLeftClick == 'function'){
            this.state.onLeftClick.apply(this,arguments);
        }
    },
    toggle:function(){
        this.setState({
            expand:!this.state.expand
        });
    }
});