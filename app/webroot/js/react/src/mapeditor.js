var MapEditor = React.createClass({
    options: {
        title: {
            'new': 'Novo Mapa',
            'edit': 'Editar Mapa'
        },
        confirmText: {
            'new': 'Criar',
            'edit': 'Salvar Alterações'
        },
        loop: [
            'Nenhum',
            'Loop Vertical',
            'Loop Horizontal',
            'Loop Vertical e Horizontal'
        ]
    },
    propTypes: {
        key:React.PropTypes.number,
        action: React.PropTypes.oneOf(['new', 'edit']),
        postUrl: React.PropTypes.string,
        loadUrl: React.PropTypes.string,
        type: React.PropTypes.string,
        show: React.PropTypes.bool,
        message: React.PropTypes.string,
        messageType: React.PropTypes.oneOf(['success', 'error', 'warning', 'info'])
    },
    updateState: function (props) {
        var state = {};

        if(_.isNumber(props.key) && props.key != this.state.key){
            state.key = props.key;
        }

        if (_.isString(props.type) && props.type != this.state.type) {
            state.type = props.type;
        }

        if (_.isString(props.action) && props.action != this.state.action && ['new', 'edit'].indexOf(props.action) != -1) {
            state.action = props.action;
        }

        if (_.isString(props.postUrl) && props.postUrl != this.state.postUrl) {
            state.postUrl = props.postUrl;
        }

        if (_.isString(props.loadUrl) && props.loadUrl != this.state.loadUrl) {
            state.loadUrl = props.loadUrl;
        }

        if (_.isBoolean(props.show) && props.show != this.state.show) {
            state.show = props.show;
        }

        if (_.isString(props.message) && props.message != this.state.message) {
            state.message = props.message;
        }

        if (_.isString(props.messageType) && props.messageType != this.state.messageType && ['success', 'error', 'warning', 'info'].indexOf(props.messageType) != -1) {
            state.messageType = props.messageType;
        }

        if (!_.isEmpty(state)) {
            this.setState(state);
        }
    },
    componentWillReceiveProps: function (props) {
        this.updateState(props);
    },
    componentWillMount: function () {
        this.updateState(this.props);
    },
    getInitialState: function () {
        return {
            type: '',
            action: 'new',
            postUrl: '',
            loadUrl: '',
            show: false,
            message: '',
            messageType: 'success',
            key:''
        };
    },
    render: function () {
        return (
            <Modal onClose={this.close} onConfirm={this.send} title={this.options.title[this.state.action]} id={this.props.id} confirmText={this.options.confirmText[this.state.action]} cancelText="cancelar">
                <div className="form-group col-md-6">
                    <input type="text" className="form-control" placeholder="Nome" required="true" ref="nome"/>
                </div>
                <div className="form-group col-md-6">
                    <input type="text" className="form-control" placeholder="Nome de apresentação" required="true" ref="nomeApresentacao"/>
                </div>
                <div className="form-group col-md-6">
                    <input type="number" className="form-control" placeholder="Largura" required="true" min="10" max="100" ref="largura"/>
                </div>
                <div className="form-group col-md-6">
                    <input type="number" className="form-control" placeholder="Altura" required="true" min="10" max="100" ref="altura"/>
                </div>
                <div className="form-group col-md-12">
                    <Select ref="loop" options={this.options.loop} />
                </div>
                <div className="clearfix"/>
                <Alert message={this.state.message} type={this.state.messageType} show={this.state.show}/>
            </Modal>
        );
    },
    close: function () {
        $('#' + this.props.id).modal('hide');
        this.clear();
        this.setState({show: false});
    },
    clear: function () {
        this.node('nome').value = '';
        this.node('nomeApresentacao').value = '';
        this.node('largura').value = 10;
        this.node('altura').value = 10;
        this.node('loop').value = 0;
    },
    node: function (name) {
        return React.findDOMNode(this.refs[name]);
    },
    load: function () {
        var self = this;

        $.ajax({
            url: self.state.loadUrl,
            type: 'post',
            dataType: 'json',
            data: {
                'data[id]': self.state.key
            },
            success: function (data) {
                if (data.success) {
                    var map = data.map;
                    self.node('nome').value = map.name;
                    self.node('nomeApresentacao').value = map.display;
                    self.node('largura').value = map.width;
                    self.node('altura').value = map.height;
                    self.node('loop').value = map.scroll;
                    self.setState({
                        show: false
                    });
                }
                else {
                    self.setState({
                        show: true,
                        message: 'Erro ao tentar carregar informações do mapa...',
                        messageType: 'danger'
                    });
                }
            }.bind(this),
            error: function () {
                self.setState({
                    show: true,
                    message: 'Erro de conexão!',
                    messageType: 'warning'
                });
            }.bind(this)
        });
    },
    send: function () {
        var self = this;
        var key = self.state.key;
        var name = React.findDOMNode(this.refs.nome).value;
        var display_name = React.findDOMNode(this.refs.nomeApresentacao).value;
        var width = React.findDOMNode(this.refs.largura).value;
        var height = React.findDOMNode(this.refs.altura).value;
        var scroll = React.findDOMNode(this.refs.loop).value;
        var action = null;
        var data = {
            'data[Map][name]': name,
            'data[Map][display]': display_name,
            'data[Map][width]': width,
            'data[Map][height]': height,
            'data[Map][scroll]': scroll
        };

        switch (this.state.action) {
            case 'new':
                if (self.state.type == 'map') {
                    data['data[Map][parent_id]'] = key;
                }
                else {
                    data['data[Map][project_id]'] = key;
                }
                break;
            case 'edit':
                data['data[Map][id]'] = key;
                break;
            default:
        }

        $.ajax({
            url: self.state.postUrl,
            type: 'post',
            dataType: 'json',
            data: data,
            success: function () {
                if (data.success) {
                    self.close();
                    Render.updateMapTree();
                }
                else {
                    var errors = data.errors;
                    var message = '';
                    var elements = [];
                    for (var index in errors) {
                        elements.push((<span key={index}>{'* ' + errors[index]}<br /></span>));
                    }
                    self.showError(elements);
                }
            }.bind(this),
            error: function () {
                self.setState({
                    message: 'Erro de conexão',
                    show: true,
                    messageType: 'danger'
                });
            }.bind(this)
        });
    },
    showError:function(message){
        this.setState({
            message: message,
            show: true,
            messageType: 'warning'
        });
    }
});


