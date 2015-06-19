var Tree = React.createClass({
    mixins:[updateMixin],
    propTypes: {
        data: React.PropTypes.array,
        loadUrl: React.PropTypes.string,
        id: React.PropTypes.string,
        formData: React.PropTypes.object,
        onItemLeftClick: React.PropTypes.func,
        onItemToggle: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            data: [],
            formData: {},
            loadUrl: '',
            id: generateUUID(),
            onItemLeftClick: null,
            onItemToggle: null
        };
    },
    componentDidMount:function(){
        this.load();
    },
    componentDidUpdate:function(){
        if(!_.isEqual(this.lastLoadUrl,this.state.loadUrl) && !_.isEqual(this.lastFormData,this.state.formData)){
            this.load();
        }
    },
    load:function(){
        var self = this;

        $.ajax({
            url: self.state.loadUrl,
            type: 'post',
            dataType: 'json',
            data: self.state.formData,
            success: function (data) {
                if (!_.isEqual(data, self.state.data)) {
                    console.log('updating tree data...');
                    self.lastLoadUrl = self.state.loadUrl;
                    self.lastFormData = self.state.formData;
                    self.setState({
                        data:data
                    });
                }
                console.info('Árvore carregada com sucesso...');
            }.bind(this),
            error: function (data) {
                console.warn('Erro ao tentar carregar árvore!');
            }.bind(this)
        });
    },
    render: function () {
        var data = this.state.data;
        var self = this;

        var children = data.map(function (node, index) {
            return <TreeNode {...node} key={index} onLeftClick={self.state.onItemLeftClick} toggle={self.state.onItemToggle}/>
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
    mixins:[updateMixin],
    propTypes: {
        isFolder: React.PropTypes.bool,
        icon: React.PropTypes.string,
        title: React.PropTypes.string,
        children: React.PropTypes.arrayOf(React.PropTypes.object),
        hasChildren: React.PropTypes.bool,
        expand: React.PropTypes.bool,
        metadata: React.PropTypes.object,
        onLeftClick: React.PropTypes.func,
        toggle: React.PropTypes.func,
        lazyLoadUrl: React.PropTypes.string,
        formData: React.PropTypes.object,
        parent:React.PropTypes.object
    },
    remove:function(){
        var self = this;
        var parent = self.state.parent;
        var children = parent.state.children;
        _.remove(children,function(node){
            return node.metadata.id == self.state.metadata.id;
        });
        parent.setState({
            children:children
        });
    },
    getInitialState: function () {
        return {
            title: '',
            isFolder: false,
            icon: '',
            children: [],
            expand: false,
            onLeftClick: null,
            toggle: null,
            metadata: {},
            show: false,
            lazyLoadUrl: null,
            hasChildren: false,
            formData: {},
            parent:null
        }
    },
    lazyLoad: function () {
        var self = this;
        if (_.isString(self.state.lazyLoadUrl)) {
            $.ajax({
                url: self.state.lazyLoadUrl,
                type: 'post',
                dataType: 'json',
                data: self.state.formData,
                success: function (children) {
                    if (!_.isEqual(children, self.state.children)) {
                        this.setState({
                            children: children
                        });
                        console.log('Lista de nós carregada com sucesso...');
                    }
                    this.loaded = true;
                }.bind(this),
                error: function () {
                    console.error('Erro ao carregar lista de nós...');
                }.bind(this)
            });
        }

    },
    componentWillMount: function () {
        this.loaded = false;
        this.intervals = [];
        this.refresh();
    },
    componentWillUnmount: function () {
        this.intervals.map(clearInterval);
    },

    refresh: function () {
        clearInterval(this.intervals['update']);
        var self = this;
        this.intervals['update'] = setInterval(function () {
            console.log('atualizando lista de nós...');
            if(this.loaded){
                self.lazyLoad();
            }
        }, 60000);
    },
    render: function () {
        var hasChildren = this.state.hasChildren || this.state.children.length > 0;
        var expand = this.state.expand ? 'expand' : 'closed';
        var toggle = hasChildren? this.state.expand ? 'fa fa-minus-square toggle' : 'fa fa-plus-square toggle' : 'space';
        var icon = this.state.isFolder ? (this.state.expand ? 'fa fa-folder-open icon' : 'fa fa-folder icon') : this.state.icon + ' icon';
        var title = hasChildren && this.state.isFolder ? 'title title-folder' : 'title';
        var self = this;

        var children = this.state.children.map(function (node, index) {
            return <TreeNode {...node} key={index}  onLeftClick={self.state.onLeftClick} parent={self}/>
        });

        return (
            <li className={expand}>
                <span className={toggle} onClick={hasChildren ? this.toggle : null}></span>
                <span className={icon} onDoubleClick={hasChildren ? this.toggle : null} onContextMenu={this.contextMenu}></span>
                <span className={title} onDoubleClick={hasChildren ? this.toggle : null} onContextMenu={this.contextMenu}>{this.state.title}</span>
                <ul className={this.state.expand ? 'normal' : 'hidden'}>
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
        if(!this.loaded){
            this.lazyLoad();
            this.refresh();
        }
        if (typeof this.state.toggle == 'function') {
            this.state.toggle(e, this);
        }
        this.setState({
            expand: !this.state.expand
        });
    }
});