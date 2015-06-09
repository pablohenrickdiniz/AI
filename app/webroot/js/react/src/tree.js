var Tree = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
        url: React.PropTypes.string,
        id: React.PropTypes.string,
        formData: React.PropTypes.object,
        onItemLeftClick: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            data: [],
            formData: {},
            url: '',
            id: generateUUID(),
            onItemLeftClick: null
        };
    },
    componentWillMount: function () {
        this.updateState(this.props);
    },
    updateState: function (props) {
        var state = {};

        var urlChange = false;
        var formChange = false;


        if (_.isArray(props.data) && !_.isEqual(props.data, this.state.data)) {
            state.data = props.data;
        }


        if (props.url != undefined && props.url != this.state.url && _.isString(props.url)) {
            state.url = props.url;
            urlChange = true;
        }

        if (_.isObject(props.formData) && !_.isEqual(props.formData, this.state.formData)) {
            state.formData = props.formData;
            formChange = true;
        }

        if (_.isFunction(props.onItemLeftClick) && !_.isEqual(props.onItemLeftClick != this.state.onItemLeftClick)) {
            state.onItemLeftClick = props.onItemLeftClick;
        }

        var self = this;
        if (!_.isEmpty(state)) {
            if (urlChange || formChange) {
                $.ajax({
                    url: state.url,
                    type: 'post',
                    dataType: 'json',
                    data: state.formData,
                    success: function (data) {
                        if (!_.isEqual(data, this.state.data)) {
                            state.data = data;
                        }
                        self.setState(state);
                        console.info('Árvore carregada com sucesso...');
                    }.bind(this),
                    error: function (data) {
                        console.warn('Erro ao tentar carregar árvore!');
                        console.log(data);
                    }.bind(this)
                });
            }
            else {
                this.setState(state);
            }
        }

    },
    componentWillReceiveProps: function (props) {
        this.updateState(props);
    },
    render: function () {
        var data = this.state.data;
        var self = this;

        var children = data.map(function (node, index) {
            var isFolder = node.isFolder ? true : false;
            var title = node.title == undefined ? '' : node.title;
            var icon = node.icon == undefined ? '' : node.icon;
            var expand = node.expand ? true : false;
            var children = node.children instanceof Array ? node.children : [];
            var key = node.key == undefined ? index : node.key;
            var metadata = typeof node.metadata == 'object' ? node.metadata : {};
            return <TreeNode title={title}  isFolder={isFolder} icon={icon} expand={expand} key={index} id={key} children={children} onLeftClick={self.state.onItemLeftClick} metadata={metadata}/>
        });

        return (
            <ul className="tree" onContextMenu={this.contextMenu} id={this.state.id}>
                {children}
            </ul>
        );
    },
    contextMenu: function (e) {
        e.preventDefault();
    }
});

var TreeNode = React.createClass({
    propTypes: {
        isFolder: React.PropTypes.bool,
        icon: React.PropTypes.string,
        title: React.PropTypes.string,
        children: React.PropTypes.array,
        expand: React.PropTypes.bool,
        key: React.PropTypes.number,
        metadata: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            title: '',
            isFolder: false,
            icon: '',
            children: [],
            expand: false,
            key: 0,
            onLeftClick: null,
            metadata: {},
            show:false
        }
    },
    componentWillReceiveProps: function (props) {
        this.updateState(props);
    },
    componentWillMount: function () {
        this.updateState(this.props);
    },
    updateState: function (props) {
        var state = {};

        if(props.title != this.state.title && _.isString(props.title)){
            state.title = props.title;
        }

        if(props.isFolder != this.state.isFolder && _.isBoolean(props.isFolder)){
            state.isFolder = props.isFolder;
        }

        if(props.icon != this.state.icon && _.isString(props.icon)){
            state.icon = props.icon;
        }

        if(_.isArray(props.children) && !_.isEqual(props.children, this.state.children)){
            state.children = props.children;
        }

        if(_.isBoolean(props.expand) && props.expand != this.state.expand){
            state.expand = props.expand;
        }

        if(props.id != undefined && props.id != this.state.key){
            state.key = props.id;
        }

        if(_.isFunction(props.onLeftClick) && !_.isEqual(props.onLeftClick,this.state.onLeftClick)){
            state.onLeftClick = props.onLeftClick;
        }

        if(_.isObject(props.metadata) && _.isEqual(props.metadata,this.state.metadata)){
            state.metadata = props.metadata;
        }

        if(_.isBoolean(props.show) && props.show != this.state.show){
            state.show = props.show;
        }

        if(!_.isEmpty(state)){
            this.setState(state);
        }
    },
    render: function () {
        var expand = this.state.expand ? 'expand' : 'closed';
        var toggle = this.state.isFolder && this.state.children.length > 0 ? this.state.expand ? 'fa fa-minus-square toggle' : 'fa fa-plus-square toggle' : 'space';
        var icon = this.state.isFolder ? (this.state.expand ? 'fa fa-folder-open icon' : 'fa fa-folder icon') : this.state.icon + ' icon';
        var hasChildren = this.state.children.length > 0;
        var self = this;

        var children = this.state.children.map(function (node, index) {
            var isFolder = node.isFolder ? true : false;
            var title = node.title == undefined ? '' : node.title;
            var icon = node.icon == undefined ? '' : node.icon;
            var expand = node.expand ? true : false;
            var children = node.children instanceof Array ? node.children : [];
            var key = node.key == undefined ? index : node.key;
            var metadata = typeof node.metadata == 'object' ? node.metadata : {};
            return <TreeNode title={title}  isFolder={isFolder} icon={icon} expand={expand} key={index} id={key} children={children} onLeftClick={self.state.onLeftClick} metadata={metadata}/>
        });

        return (
            <li className={expand}>
                <span className={toggle} onClick={this.state.isFolder && hasChildren ? this.toggle : null}></span>
                <span className={icon} onDoubleClick={this.state.isFolder && hasChildren ? this.toggle : null} onContextMenu={this.contextMenu}></span>
                <span className="title" onDoubleClick={this.state.isFolder && hasChildren ? this.toggle : null} onContextMenu={this.contextMenu}>{this.state.title}</span>
                <ul className={this.state.expand?'normal':'hidden'}>
                    {children}
                </ul>
            </li>
        );
    },
    contextMenu: function (e) {
        if (typeof this.state.onLeftClick == 'function') {
            this.state.onLeftClick(e, this);
        }
    },
    toggle: function () {
        this.setState({
            expand: !this.state.expand
        });
    }
});