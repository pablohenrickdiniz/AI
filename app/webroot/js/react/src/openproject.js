var OpenProject = React.createClass({
    getInitialState: function () {
        return {
            data: [],
            checked: Global.project.id
        };
    },
    componentDidMount: function () {
        var self = this;
        $('#open-project-modal').on('show.bs.modal', function (e) {
            self.loadProjects();
        });
    },
    render: function () {
        var self = this;
        var rows = this.state.data.map(function (obj, index) {
            return (
                <tr  key={index}>
                    <td>{obj.name}</td>
                    <td>
                        <input type="radio" ref="project" value={obj.id} name="project_id" onChange={self.change} checked={self.state.checked == obj.id} />
                    </td>
                    <td className="text-center">
                        <span className="close" onClick={self.remove} data-id={obj.id} data-nome={obj.name}>&times;</span>
                    </td>
                </tr>
            );
        });


        return (
            <Modal id="open-project-modal" confirmText="Abrir" cancelText="Cancelar" title="Abrir Projeto" onConfirm={this.openProject}>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th colSpan="3">Nome do projeto</th>
                        </tr>
                         {rows}
                    </tbody>
                </table>
            </Modal>
        );
    },
    close: function () {
        $('#open-project-modal').modal('hide');
    },
    loadProjects: function () {
        var self = this;
        $.ajax({
            url: Global.project.all,
            type: 'post',
            dataType: 'json',
            success: function (data) {
                var projects = data.projects;
                self.setState({
                    data: projects
                });
            }.bind(this)
        });
    },
    openProject: function () {
        Global.project.id = this.state.checked;
        React.render(
            <Tree id="tree" data={{'data[id]': Global.project.id}} />,
            document.getElementById('map-container')
        );
        this.close();

    },
    node: function (name) {
        return React.findDOMNode(this.refs[name]);
    },
    change: function (e) {
        this.setState({
            checked: e.target.value
        });
    },
    remove: function (e) {
        var id = $(e.target).attr('data-id');
        var nome = $(e.target).attr('data-nome');
        var message = 'Tem certeza que deseja apagar o projeto '+nome+'?';
        var self = this;

        var remove = function(){
            $.ajax({
                url:Global.project.delete,
                data:{
                    'data[id]':id
                },
                type:'post',
                dataType:'json',
                complete:function(data){
                    $('#confirm-action-modal').modal('hide');
                    self.loadProjects();
                }.bind(this)
            });
        };

        React.render(
            <AlertModal id="confirm-action-modal" title="Confirmar Ação" message={message} onConfirm={remove} open={true} type="warning"/>,
            document.getElementById('tmp')
        );
    }
});