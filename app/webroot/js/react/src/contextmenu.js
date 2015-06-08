var ContextMenu = React.createClass({
    propTypes:{
        items:React.PropTypes.object,
        show:React.PropTypes.bool,
        callback:React.PropTypes.func.isRequired,
        x:React.PropTypes.number,
        y:React.PropTypes.number
    },
    getInitialState:function(){
        return {
            items:{},
            show:false,
            callback:null,
            x:0,
            y:0
        };
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    },
    componentWillMount:function(){
        var self = this;
        $(document).on('click',function(e){
            self.close();
        });
        self.updateState(this.props);
    },
    updateState:function(props){
        this.setState({
            items:props.items,
            show:props.show?true:false,
            callback:props.callback,
            x:props.x,
            y:props.y
        });
    },
    render:function(){
        var items = [];

        for(var index in this.state.items){
            var item = this.state.items[index];
            var name = item.name==undefined?'':item.name;
            var icon = item.icon==undefined?'':item.icon;

            items.push(<ContextMenuItem id={index} key={index} name={name} icon={icon} onClick={this.state.callback} parent={this}/>);
        }

        return (
            <ul className="context-menu-list context-menu-root" style={{display:this.state.show?'block':'none', zIndex:3, left:this.state.x,top:this.state.y}}>
                {items}
            </ul>
        );
    },
    close:function(){
        this.setState({show:false});
    }
});

var ContextMenuItem = React.createClass({
    propTypes:{
        name:React.PropTypes.string,
        icon:React.PropTypes.string,
        onClick:React.PropTypes.func,
        id:React.PropTypes.string
    },
    getInitialState:function(){
        return {
            name:'',
            icon:'',
            onClick:null,
            key:'',
            parent:null
        };
    },
    updateState:function(props){
        this.setState({
            name:props.name,
            icon:props.icon,
            onClick:props.onClick,
            key:props.id,
            parent:props.parent
        });
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    },
    componentWillMount:function(){
        var self = this;
        self.updateState(this.props);
    },
    render:function(){
        var icon = this.state.icon;
        var name = this.state.name;
        var className = 'context-menu-item';
        var click = null;
        if(icon == '' && name == '' || icon == undefined && name == undefined){
            className += ' context-menu-separator not-selectable';
        }
        else{
            className += ' icon icon-'+icon;
            click = this.click;
        }

        return (
            <li className={className} onClick={click} onContextMenu={this.contextMenu}><span className="name">{this.state.name}</span></li>
        );
    },
    click:function(e){
        if(typeof this.state.onClick == 'function'){
            this.state.onClick(this.state.key,e,this);
            this.state.parent.close();
        }
    },
    contextMenu:function(e){
        e.preventDefault();
    }
});