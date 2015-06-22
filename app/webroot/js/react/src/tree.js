var Tree = React.createClass({
    mixins:[updateMixin,setIntervalMixin],
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
        this.refresh();
    },
    refresh:function(){
        this.clearInterval('update');
        var self = this;
        this.setInterval('update',function(){
            console.log('updating tree root nodes...');
            self.load();
        },30000);
    },
    componentDidUpdate:function(){
        if(!_.isEqual(this.lastLoadUrl,this.state.loadUrl) && !_.isEqual(this.lastFormData,this.state.formData)){
            this.load();
        }
    },
    load:function(){
        var self = this;

        AjaxQueue.ajax({
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
            <ol className="tree" id={this.state.id}>
                {children}
            </ol>
        );
    }
});

var TreeNode = React.createClass({
    mixins:[updateMixin,setIntervalMixin],
    propTypes: {
        isFolder: React.PropTypes.bool,
        title: React.PropTypes.string,
        children: React.PropTypes.arrayOf(React.PropTypes.object),
        hasChildren: React.PropTypes.bool,
        expand: React.PropTypes.bool,
        metadata: React.PropTypes.object,
        onLeftClick: React.PropTypes.func,
        toggle: React.PropTypes.func,
        lazyLoadUrl: React.PropTypes.string,
        formData: React.PropTypes.object,
        parent:React.PropTypes.object,
        addClass:React.PropTypes.string,
        expandClass:React.PropTypes.string
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
            children: [],
            expand: false,
            onLeftClick: null,
            toggle: null,
            metadata: {},
            show: false,
            lazyLoadUrl: null,
            hasChildren: false,
            formData: {},
            parent:null,
            id:generateUUID(),
            addClass:'',
            expandClass:''
        }
    },
    lazyLoad: function () {
        var self = this;
        if (_.isString(self.state.lazyLoadUrl)) {
            AjaxQueue.ajax({
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
                    self.loaded = true;
                }.bind(this),
                error: function () {
                    console.error('Erro ao carregar lista de nós...');
                }.bind(this)
            });
        }

    },
    componentWillMount: function () {
        this.loaded = false;
        this.refresh();
    },
    componentDidMount:function(){
        if(this.state.expand && !this.loaded){
            this.lazyLoad();
        }
    },
    refresh: function () {
        this.clearInterval('update');
        var self = this;
        self.setInterval('update',function(){
            console.log('atualizando lista de nós...');
            if(self.loaded){
                self.lazyLoad();
            }
        },30000);
    },
    render: function () {
        var self = this;

        var children = this.state.children.map(function (node, index) {
            return <TreeNode {...node} key={index}  onLeftClick={self.state.onLeftClick} parent={self} toggle={self.state.toggle}/>
        });

        var elements = [];
        var hasChildren = self.state.children.length > 0 || self.state.hasChildren;


        if(self.state.isFolder || hasChildren){
            var className = this.state.expand&&hasChildren?'expanded '+this.state.expandClass:this.state.addClass;
            elements.push(<label className={className} htmlFor={self.state.id} key={0} onContextMenu={this.contextMenu}>{self.state.title}</label>);
        }
        else{
            elements = <a href={'#'} className={this.state.addClass} onContextMenu={this.contextMenu}>{self.state.title}</a>;
        }

        if(hasChildren){
            elements.push(<input type="checkbox" checked={self.state.expand&&hasChildren} id={self.state.id} onChange={this.toggle} key={1}/>);
            elements.push(<ol key={2}>{children}</ol>);
        }

        return (
            <li className={self.state.isFolder?'folder':'file'} type={self.state.metadata.type}>
                {elements}
            </li>
        );
    },
    contextMenu: function (e) {
        e.preventDefault();
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
            this.state.toggle(!this.state.expand,e, this);
        }
        this.setState({
            expand: !this.state.expand
        });
    }
});