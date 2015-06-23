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
        action: React.PropTypes.oneOf(['new', 'edit']),
        postUrl: React.PropTypes.string,
        loadUrl: React.PropTypes.string,
        onPostSuccess:React.PropTypes.func,
        onLoadSuccess:React.PropTypes.func,
        type: React.PropTypes.string,
        showError: React.PropTypes.bool,
        message: React.PropTypes.string,
        messageType: React.PropTypes.oneOf(['success', 'error', 'warning', 'info']),
        open: React.PropTypes.bool,
        formData:React.PropTypes.object,
        loadFormData:React.PropTypes.object
    },
    getInitialState: function () {
        return {
            type: '',
            action: 'new',
            postUrl: '',
            loadUrl: '',
            showError: false,
            message: '',
            messageType: 'success',
            onPostSuccess:null,
            onLoadSucess:null,
            nome:'',
            nomeApresentacao:'',
            largura:10,
            altura:10,
            loop:0,
            open:false
        };
    },
    close:function(){
        this.setState(this.getInitialState());
    },
    componentDidMount:function(){
        this.start();
    },
    start:function(){
        if(this.state.action == 'edit' && this.state.open){
            this.load();
        }
    },
    componentDidUpdate:function(){
        this.start();
    },
    change:function(e){
        for(var index in this.refs){
            if(e.target == this.refs[index].getDOMNode()){
                var state = {};
                state[index] = e.target.value;
                this.setState(state);
                break;
            }
        }
    },
    render: function () {
        return (
            <Modal onClose={this.close} onCancel={this.close} onConfirm={this.send} title={this.options.title[this.state.action]} confirmText={this.options.confirmText[this.state.action]} cancelText="cancelar" open={this.state.open}>
                <div className="form-group col-md-6">
                    <input type="text" className="form-control" placeholder="Nome" required="true" ref="nome" value={this.state.nome} onChange={this.change}/>
                </div>
                <div className="form-group col-md-6">
                    <input type="text" className="form-control" placeholder="Nome de apresentação" required="true" ref="nomeApresentacao" value={this.state.nomeApresentacao} onChange={this.change}/>
                </div>
                <div className="form-group col-md-6">
                    <input type="number" className="form-control" placeholder="Largura" required="true" min="10" max="100" ref="largura" value={this.state.largura} onChange={this.change}/>
                </div>
                <div className="form-group col-md-6">
                    <input type="number" className="form-control" placeholder="Altura" required="true" min="10" max="100" ref="altura" value={this.state.altura} onChange={this.change}/>
                </div>
                <div className="form-group col-md-12">
                    <Select ref="loop" options={this.options.loop} value={this.state.loop} onChange={this.change}/>
                </div>
                <div className="clearfix"/>
                <Alert message={this.state.message} type={this.state.messageType} show={this.state.showError}/>
            </Modal>
        );
    },
    load: function () {
        var self = this;
        AjaxQueue.ajax({
            url: self.state.loadUrl,
            type: 'post',
            dataType: 'json',
            data:self.state.loadFormData,
            success: function (data) {
                if (data.success) {
                    var map = data.map;
                    self.node('nome').value = map.name;
                    self.node('nomeApresentacao').value = map.display;
                    self.node('largura').value = map.width;
                    self.node('altura').value = map.height;
                    self.node('loop').value = map.scroll;
                }
                else {
                    self.showError('Erro ao tentar carregar informações do mapa...');
                }
            }.bind(this),
            error: function () {
                self.showError('Erro de conexão...');
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
        AjaxQueue.ajax({
            url: self.state.postUrl,
            type: 'post',
            dataType: 'json',
            data: data,
            success: function (data) {
                if (data.success) {
                    if(self.state.onPostSuccess != null){
                        self.state.onPostSuccess(data.node,self);
                    }
                    self.close();
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
                self.showError('Erro de conexão...');
            }.bind(this)
        });
    },
    showError:function(message){
        this.setState({
            showError:true,
            message:message,
            messageType: 'danger'
        });
    }
});


