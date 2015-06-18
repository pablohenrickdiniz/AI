var Tree = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
        loadUrl: React.PropTypes.string,
        id: React.PropTypes.string,
        formData: React.PropTypes.object,
        onItemLeftClick: React.PropTypes.func,
        onItemToggle:React.PropTypes.func
    },
    getInitialState: function () {
        return {
            data: [],
            formData: {},
            loadUrl: '',
            id: generateUUID(),
            onItemLeftClick: null,
            onItemToggle:null
        };
    },
    componentWillMount: function () {
        console.log('mounting tree...');
        this.updateState(this.props);
    },
    updateState: function (props) {
        var state = {};

        var urlChange = false;
        var formChange = false;


        if (_.isArray(props.data) && !_.isEqual(props.data, this.state.data)) {
            state.data = props.data;
        }

        if (_.isString(props.loadUrl) && props.loadUrl != this.state.loadUrl) {
            state.loadUrl = props.loadUrl;
            urlChange = true;
        }

        if (_.isObject(props.formData) && !_.isEqual(props.formData, this.state.formData)) {
            state.formData = props.formData;
            formChange = true;
        }

        if (_.isFunction(props.onItemLeftClick) && !_.isEqual(props.onItemLeftClick != this.state.onItemLeftClick)) {
            state.onItemLeftClick = props.onItemLeftClick;
        }

        if(_.isFunction(props.onItemToggle) && !_.isEqual(props.onItemToggle != this.state.onItemToggle)){
            state.onItemToggle = props.onItemToggle;
        }

        var self = this;
        if (!_.isEmpty(state)) {
            console.log('updating tree state...');
            if (urlChange || formChange) {
                var url =  urlChange?state.loadUrl:this.state.loadUrl;
                var formData = formChange?state.formData:this.state.formData;

                $.ajax({
                    url:url,
                    type: 'post',
                    dataType: 'json',
                    data: formData,
                    success: function (data) {
                        if (!_.isEqual(data, this.state.data)) {
                            console.log('updating tree data...');
                            state.data = data;
                        }
                        self.setState(state);
                        console.info('Árvore carregada com sucesso...');
                    }.bind(this),
                    error: function (data) {
                        console.warn('Erro ao tentar carregar árvore!');
                    }.bind(this)
                });
            }
            else {
                this.setState(state);
            }
        }

    },
    componentWillReceiveProps: function (props) {
        console.log('updating tree props...');
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
            var metadata = typeof node.metadata == 'object' ? node.metadata : {};
            return <TreeNode title={title}  isFolder={isFolder} icon={icon} expand={expand} key={index}  children={children} onLeftClick={self.state.onItemLeftClick} toggle={self.state.onItemToggle} metadata={metadata}/>
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
        children: React.PropTypes.arrayOf(React.PropTypes.object),
        expand: React.PropTypes.bool,
        metadata: React.PropTypes.object,
        onLeftClick:React.PropTypes.func,
        toggle:React.PropTypes.func,
        lazyLoadUrl:React.PropTypes.string,
        formData:React.PropTypes.object,
        update:React.PropTypes.bool
    },
    getInitialState: function () {
        return {
            title: '',
            isFolder: false,
            icon: '',
            children: [],
            expand: false,
            onLeftClick: null,
            toggle:null,
            metadata: {},
            show:false,
            lazyLoadUrl:null,
            formData:{},
            update:false
        }
    },
    lazyLoad:function(){
        var self = this;
        $.ajax({
            url:self.state.lazyLoadUrl,
            type:'post',
            dataType:'json',
            data:self.state.formData,
            success:function(children){
                if(!_.isEqual(children,self.state.children)){
                    this.setState({
                        children:children
                    });
                    console.log('Lista de nós carregada com sucesso...');
                }
            }.bind(this),
            error:function(){
                console.error('Erro ao carregar lista de nós...');
            }.bind(this)
        });
    },
    componentWillReceiveProps: function (props) {
        this.updateState(props);
    },
    componentWillMount: function () {
        this.updateState(this.props);
        this.intervals = [];
    },
    updateState: function (props) {
        var self = this;
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

        if(_.isFunction(props.onLeftClick) && !_.isEqual(props.onLeftClick,this.state.onLeftClick)){
            state.onLeftClick = props.onLeftClick;
        }

        if(_.isObject(props.metadata) && !_.isEqual(props.metadata,this.state.metadata)){
            state.metadata = props.metadata;
        }

        if(_.isBoolean(props.show) && props.show != this.state.show){
            state.show = props.show;
        }

        if(_.isFunction(props.toggle) && _.isEqual(props.toggle, this.state.toggle)){
            state.toggle = props.toggle;
        }

        if(_.isString(props.lazyLoadUrl) && props.lazyLoadUrl != this.state.lazyLoadUrl){
            state.lazyLoadUrl = props.lazyLoadUrl;
        }

        if(_.isBoolean(props.update)){
            if(props.update != this.state.update){
                state.update = props.update;
                if(props.update){
                    clearInterval(this.updateInterval);
                    this.updateInterval = setInterval(function(){
                        if(_.isString(self.state.lazyLoadUrl)){
                            self.lazyLoad();
                        }
                        else{
                            clearInterval(self.updateInterval);
                            self.setState({
                               update:false
                            });
                        }
                    },60000);
                }
                else{
                    clearInterval(this.updateInterval);
                }
            }
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
            var metadata = typeof node.metadata == 'object' ? node.metadata : {};
            return <TreeNode title={title}  isFolder={isFolder} icon={icon} expand={expand} key={index} children={children} onLeftClick={self.state.onLeftClick} metadata={metadata}/>
        });

        var title = hasChildren && this.state.isFolder?'title title-folder':'title';


        return (
            <li className={expand}>
                <span className={toggle} onClick={this.state.isFolder && hasChildren ? this.toggle : null}></span>
                <span className={icon} onDoubleClick={this.state.isFolder && hasChildren ? this.toggle : null} onContextMenu={this.contextMenu}></span>
                <span className={title} onDoubleClick={this.state.isFolder && hasChildren ? this.toggle : null} onContextMenu={this.contextMenu}>{this.state.title}</span>
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
    toggle: function (e) {
        if(typeof this.state.toggle == 'function'){
            this.state.toggle(e, this);
        }
        this.setState({
            expand: !this.state.expand
        });
    }
});