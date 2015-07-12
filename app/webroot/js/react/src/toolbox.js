var ToolBox = React.createClass({
    mixins: [updateMixin],
    getInitialState: function () {
        return {
            id: generateUUID(),
            groups: [],
            title: '',
            activeTool:null
        }
    },
    render: function () {
        var groups = [];
        var self = this;

        for(var index in self.state.groups){
            groups.push(self.createGroup(self.state.groups[index], index));
        }

        return (
            <div className="tool-box" id={self.state.id}>
                <div className="tool-box-header">{self.state.title}</div>
                <div className="tool-box-body">
                    {groups}
                </div>
            </div>
        );
    },
    createGroup: function (group, groupIndex) {
        var self = this;
        var rows = [];

        for(var index in group){
            rows.push(self.createRow(group[index],index));
        }

        return (
            <div className="tool-box-group" key={groupIndex}>
                {rows}
            </div>
        );
    },
    createRow: function (row, rowIndex) {
        var tools = [];
        var self = this;

        var tool = null;
        var click = null;

        for(var index in row){
            tool = row[index];
            tools.push(
                <div name={tool.name} className={'tool' + (tool.name == self.state.activeTool ? ' active' : '')} onClick={this.click} key={index}>
                    <i name={tool.name} className={tool.icon}></i>
                </div>
            );
        }

        return (
            <div className="row" key={rowIndex}>
                {tools}
            </div>
        );
    },
    click:function(e){
        e.preventDefault();
        var name = $2(e.target).attr('name');
        this.updateState({
            activeTool:name
        });
    }
});