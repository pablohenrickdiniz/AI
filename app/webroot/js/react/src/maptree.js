/**
 * Created by Pablo Henrick Diniz on 07/06/2015.
 */

var MapTree = React.createClass({
    propTypes:{
        loadUrl:React.PropTypes.string,
        projectId:React.PropTypes.number
    },
    getInitialState:function() {
        return {
            loadUrl: '',
            projectId: 0
        }
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    },
    componentWillMount:function(){
        this.updateState(this.props);
    },
    updateState:function(props){
        var state = {};

        if(_.isBoolean(props.update) && props.update){
           state.update = props.update;
        }

        if(_.isString(props.loadUrl) && props.loadUrl != this.state.loadUrl){
            state.loadUrl = props.loadUrl;
        }

        if(_.isNumber(props.projectId) && props.projectId != this.state.projectId){
            state.projectId = props.projectId;
        }

        if(!_.isEmpty(state)){
            console.log('updating state maptree...');
            this.setState(state);
            console.log('maptree state update complete...');
        }


    },
    render:function(){
        console.log('maptree render...');
        return (
            <Tree id="tree" loadUrl={this.state.loadUrl} formData={{'data[id]':this.state.projectId}} onItemLeftClick={this.callback}/>
        );
    },
    callback:function(e,obj){
        var x = e.pageX;
        var y = e.pageY;
        var items = this.projectItems;
        console.log(obj.state);


        React.render(
            <ContextMenu x={x} y={y} items={items} callback={this.projectCallback} show={true}/>,
            document.getElementById('context-menu-container')
        );
    },
    projectCallback:function(key,e,obj){
        switch(key){
            case 'edit':
                break;
            case 'new':
                Render.map.new();
                break;
            case 'copy':
                break;
            case 'cut':

                break;
            case 'paste':

                break;
            case 'delete':
                break;
            default:
                console.log('Nenhuma ação definida para a chave...'+key);
        }
    },
    projectItems:{
        "edit": {name: "Alterar propriedades", icon: "edit"},
        'sp1': '-----------',
        'new': {name: 'Novo Mapa', icon: "add"},
        'sp2': '-----------',
        "copy": {name: "Copiar", icon: "copy"},
        "cut": {name: "Recortar", icon: "cut"},
        "paste": {name: "Colar", icon: "paste"},
        "delete": {name: "Apagar", icon: "delete"}
    }
});