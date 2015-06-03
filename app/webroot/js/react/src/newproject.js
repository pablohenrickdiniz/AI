var NewProject = React.createClass({
    getInitialState:function(){
        return {
            message:'',
            messageType:'success',
            show:false
        };
    },
    render:function(){
        return (
            <Modal title="Novo Projeto" id="new-project-modal" confirmText="Criar" cancelText="cancelar" confirmAction={this.confirm}>
                <div className="form-group">
                    <input type="text" className="form-control" refs="nome" placeholder="Nome do projeto"/>
                </div>
                <Alert message={this.state.message} type={this.state.messageType} show={this.state.show}/>
            </Modal>
        );
    },
    confirm:function(){
        var data = {
            'data[Project][name]':this.refs.nome.value.trim()
        };
        console.log(data);
        $.ajax({
            url: Global.project.add,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    FolderManager.id = data.id;
                    FolderManager.type = 'project';
                    ProjectManager.reload(function () {
                        self.getModal().close();
                        self.getWarning().hide();
                    });
                }
                else {
                    var msg = '';
                    for (var index in data.errors) {
                        msg += '* ' + data.errors[index] + '<br>';
                    }
                    self.getWarning().setMessage(msg).show();
                }
            }.bind(this),
            error: function (data) {

            }.bind(this)
        });
    }
});