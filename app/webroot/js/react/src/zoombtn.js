var ZoomBtn = React.createClass({
    mixins: [updateMixin],
    propTypes: {
        onZoomIn: React.PropTypes.func,
        onZoomOut: React.PropTypes.func,
        className: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            onZoomIn: null,
            onZoomOut: null,
            className: ''
        }
    },
    render: function () {

        return (
            <div className={'btn-group'+(this.state.className != ''?' '+this.state.className:'')}>
                <button type="button" className="btn btn-default" key={0} onClick={this.state.onZoomOut}>
                    <span className="glyphicon glyphicon-zoom-out"/>
                </button>
                <button type="button" className="btn btn-default" key={1} onClick={this.state.onZoomIn}>
                    <span className="glyphicon glyphicon-zoom-in"/>
                </button>
            </div>
        );
    }
});