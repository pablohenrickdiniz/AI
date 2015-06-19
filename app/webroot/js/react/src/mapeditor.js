var MapEditor = React.createClass({
    mixins:[updateMixin,customFunctions],
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
        key: React.PropTypes.number,
        action: React.PropTypes.oneOf(['new', 'edit']),
        postUrl: React.PropTypes.string,
        loadUrl: React.PropTypes.string,
        onPostSuccess:React.PropTypes.func,
        onLoadSuccess:React.PropTypes.func,
        type: React.PropTypes.string,
        show: React.PropTypes.bool,
        message: React.PropTypes.string,
        messageType: React.PropTypes.oneOf(['success', 'error', 'warning', 'info']),
        open: React.PropTypes.bool
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
            onPostSuccess:null,
            onLoadSucess:null,
            key: ''
        };
    },
    render: function () {
        return (
            <Modal onClose={this.close} onConfirm={this.send} title={this.options.title[this.state.action]} id={this.props.id} confirmText={this.options.confirmText[this.state.action]} cancelText="cancelar" open={this.state.open}>
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
        this.setState({
            show: false,
            open:false
        });
    },
    clear: function () {
        this.node('nome').value = '';
        this.node('nomeApresentacao').value = '';
        this.node('largura').value = 10;
        this.node('altura').value = 10;
        this.node('loop').value = 0;
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
        var name = this.node('nome').value;
        var display_name = this.node('nomeApresentacao').value;
        var width = this.node('largura').value;
        var height = this.node('altura').value;
        var scroll = this.node('loop').value;
        var action = null;

        var data = {
            'data[Map][name]': name,
            'data[Map][display]': display_name,
            'data[Map][width]': width,
            'data[Map][height]': height,
            'data[Map][scroll]': scroll
        };

        data = _.merge(data,self.state.formData);
        console.log(data);
        $.ajax({
            url: self.state.postUrl,
            type: 'post',
            dataType: 'json',
            data: data,
            success: function (data) {
                if (data.success) {
                    self.close();
                    if(self.state.onPostSuccess != null){
                        self.state.onPostSuccess(data.node,self);
                    }
                }
                else {
                    var errors = data.errors;
                    var message = '';
                    var elements = [];

                    for (var index in errors) {
                        elements.push((<span key={index}>{'* ' + errors[index]}
                            <br />
                        </span>));
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
    showError: function (message) {

        this.setState({
            message: message,
            show: true,
            messageType: 'warning'
        });
    }
});


