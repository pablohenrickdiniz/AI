var MapEditor = React.createClass({
    options: {
        title: {
            0: 'Novo Mapa',
            1: 'Editar Mapa'
        },
        confirmText: {
            0: 'Criar',
            1: 'Salvar Alterações'
        },
        loop: [
            'Nenhum',
            'Loop Vertical',
            'Loop Horizontal',
            'Loop Vertical e Horizontal'
        ]
    },
    getInitialState: function () {
        return {
            type: 0,
            show: false,
            message: '',
            messageType: 'success'
        };
    },
    render: function () {
        return (
            <Modal onClose={this.close} onConfirm={this.send} title={this.options.title[this.state.type]} id={this.props.id} confirmText={this.options.confirmText[this.state.type]} cancelText="cancelar">
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
        React.findDOMNode(this.refs.nome).value = '';
        React.findDOMNode(this.refs.nomeApresentacao).value = '';
        React.findDOMNode(this.refs.largura).value = 10;
        React.findDOMNode(this.refs.altura).value = 10;
        React.findDOMNode(this.refs.loop).value = 0;
        $('#' + this.props.id).modal('hide');
        this.setState({show: false});
    },
    send: function () {
        var self = this;
        var name = React.findDOMNode(this.refs.nome).value;
        var display_name =  React.findDOMNode(this.refs.nomeApresentacao).value;
        var width = React.findDOMNode(this.refs.largura).value;
        var height = React.findDOMNode(this.refs.altura).value;
        var scroll = React.findDOMNode(this.refs.loop).value;

        var data = {
            'data[Map][name]': name,
            'data[Map][display]': display_name,
            'data[Map][width]': width,
            'data[Map][height]': height,
            'data[Map][scroll]': scroll
        };

        if (FolderManager.type == 'map') {
            data['data[Map][parent_id]'] = FolderManager.id;
        }
        else {
            data['data[Map][project_id]'] = FolderManager.id;
        }

        $.ajax({
            url: Global.map.add,
            type: 'post',
            dataType: 'json',
            data: data,
            success: function (data) {
                if (data.success) {
                    self.close();
                    var tree = $('#tree').dynatree('getTree');
                    var node = tree.getNodeByKey(FolderManager.id);
                    if (node != null) {
                        node.addChild(data.node);
                    }
                    self.setState({
                        message:'',
                        show:false
                    });
                }
                else {
                    var errors = data.errors;
                    var message = '';
                    var elements = [];
                    for (var index in errors) {
                        elements.push((<span key={index}>{'* ' + errors[index]}<br /></span>));
                    }
                    self.setState({
                        message:elements,
                        show:true,
                        messageType:'warning'
                    });
                }
            }.bind(this)
        });

    }
});