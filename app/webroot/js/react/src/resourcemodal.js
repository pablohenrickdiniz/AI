var ResourceModal = React.createClass({
    mixins: [updateMixin],
    items: {
        'new': {name: 'Importar recurso', icon: "add"}
    },
    allowedExtensions: {
        img: ['jpg', 'png', 'jpeg']
    },
    getInitialState: function () {
        return {
            loadUrl: '',
            projectId: 0,
            id: generateUUID(),
            open: false,
            fileInputId: generateUUID(),
            canvasImage: null,
            canvasGrid: null,
            stepModal: null,
            image: null,
            rows: 1,
            cols: 1,
            maxRows: 1,
            maxCols: 1,
            rowsInput: null,
            colsInput: null
        };
    },
    close: function () {
        this.setState({
            open: false
        });
    },
    render: function () {
        return (
            <Modal title="Recursos" footer={false} id={this.state.id} onClose={this.close} open={this.state.open} layer={2}>
                <Tree id="resource-tree" loadUrl={this.state.loadUrl} formData={{'data[id]': this.state.projectId}} onItemLeftClick={this.onItemLeftClick}/>
            </Modal>
        );
    },
    onItemLeftClick: function (e, obj) {
        if (obj.state.metadata.type == 'resource-folder') {
            var x = e.pageX;
            var y = e.pageY;
            this.selectedFolder = obj;
            React.render(
                <ContextMenu x={x} y={y} items={this.items} callback={this.callback} show={true}/>,
                document.getElementById('context-menu-container')
            );
        }
    },
    callback: function (key, e, obj) {
        switch (key) {
            case 'new':
                var props = {
                    title: 'Novo Recurso',
                    layer: 3,
                    open: true,
                    confirmText: 'confirmar',
                    cancelText: 'cancelar',
                    nextText: 'próximo',
                    previousText: 'anterior',
                    loadCallback: this.stepModal,
                    onClose: this.closeStepModal
                };

                var rowStyle = {
                    marginLeft: 0,
                    marginRight: 0,
                    paddingTop: 10
                };

                React.render(
                    <StepModal {...props} onNext={this.onNext} onPrev={this.onPrev}>
                        <Tablistitem title="Imagem" key={0}/>
                        <Tablistitem title="Grid" key={1}/>
                        <Tabpane key={0}>
                            <div className="row" style={rowStyle}>
                                <div className="col-md-12">
                                    <canvas id="step-1-canvas" width="550" height="300"></canvas>
                                </div>
                                <div className="col-md-12">
                                    <ZoomBtn className="pull-right" onZoomIn={this.zoomIn} onZoomOut={this.zoomOut}/>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="arquivo">Selecione o arquivo</label>
                                    <input className="form-control" type="file" name="arquivo" required="true" onChange={this.inputFileChange}/>
                                </div>
                            </div>
                        </Tabpane>
                        <Tabpane key={1}>
                            <div className="row form-group" style={rowStyle}>
                                <div className="col-md-12">
                                    <canvas id="step-2-canvas" width="550" height="300"></canvas>
                                </div>
                            </div>
                            <div className="row form-group" style={rowStyle}>
                                <div className="col-md-6">
                                    <label>Linhas</label>
                                    <InputNumber min={1} value={1} onChange={this.rowsChange} loadCallback={this.rowsInput}/>
                                </div>
                                <div className="col-md-6">
                                    <label>Colunas</label>
                                    <InputNumber min={1} value={1} layers={2} onChange={this.colsChange} loadCallback={this.colsInput}/>
                                </div>
                            </div>
                        </Tabpane>
                    </StepModal>,
                    document.getElementById('resource-step-modal-container')
                );
                break;
        }

    },
    onNext: function (step, modal) {

        return true;
    },
    onPrev: function (step, modal) {

        return true;
    },
    zoomIn: function () {
        $('#step-1-canvas,#step-2-canvas').scaleCanvas({
            scaleX: 1.1,
            scaleY: 1.1
        });
    },
    zoomOut: function () {
        $('#step-1-canvas,#step-2-canvas').scaleCanvas({
            scaleX: 0.9,
            scaleY: 0.9
        });
    },
    onWheel: function () {

    },
    closeStepModal: function () {
        this.setState({
            image: null
        });
    },
    rowsChange: function (value) {
        if (this.state.rows != value) {
            this.updateState({rows: value},this.drawCanvasGrid);
        }
    },
    colsChange: function (value) {
        if (this.state.cols != value) {
            this.updateState({cols: value},this.drawCanvasGrid);
        }
    },
    componentDidUpdate: function () {
        if (this.state.image != null) {
            if (this.state.image.onload == null) {
                var self = this;
                this.state.image.onload = function () {
                    self.redrawImage();
                };
            }
        }
    },
    drawCanvasGrid:function(){
        var self = this;
        if(self.state.image != null){

            var x = 0;
            var y = 0;


            var layer = $('#step-2-canvas').getLayer('graphic');
            if(layer != undefined){
                x = layer.x;
                y = layer.y;
            }

            var width =  self.state.image.width/this.state.cols;
            var height = self.state.image.height/this.state.rows;

            $('#step-2-canvas').removeLayer('gridLayer').draw({
                type:'function',
                name:'gridLayer',
                index:1,
                fillStyle:'transparent',
                layer:true,
                fn:function(ctx){
                    ctx.strokeStyle = 'black';
                    for(var rows = 0; rows < self.state.rows;rows++){
                        for(var cols = 0; cols < self.state.cols;cols++){
                            ctx.strokeRect(cols*width,rows*height,width,height);
                        }
                    }
                }
            }).drawLayers();
        }
    },
    redrawImage: function () {
        var self = this;
        if (self.state.image != null) {
            self.drawCanvasGrid();
            var parent_width = $('#step-1-canvas').parent().width();
            var parent_height = $('#step-1-canvas').parent().height();
            var img = self.state.image;

            var x = 0;
            var y = 0;
            var layer = $('#step-1-canvas').getLayer('graphic');
            if(layer != undefined){
                x = layer.x;
                y = layer.y;
            }

            $('#step-1-canvas,#step-2-canvas').drawImage({
                source: img,
                x: x,
                y: y,
                name: 'graphic',
                fromCenter: false,
                draggable: true,
                layer: true,
                index:0,
                drag:function(layer){
                    var x = layer.x;
                    var y = layer.y;
                    var layerA = $('#step-1-canvas').getLayer('graphic');
                    var layerB = $('#step-2-canvas').getLayer('graphic');
                    var layerC = $('#step-2-canvas').getLayer('gridLayer');
                    layerA.x = x;
                    layerB.x = x;
                    layerC.x = x;
                    layerA.y = y;
                    layerB.y = y;
                    layerC.y = y;
                }
            });

        }
    },
    stepModal: function (stepModal) {
        var state = {};
        state.stepModal = stepModal;
        this.updateState(state);
    },
    rowsInput: function (rowsInput) {
        var state = {};
        state.rowsInput = rowsInput;
        this.updateState(state);
    },
    colsInput: function (colsInput) {
        var state = {};
        state.colsInput = colsInput;
        this.updateState(state);
    },
    inputFileChange: function (e) {
        e.preventDefault();

        var self = this;
        var src = e.target.files[0].name;
        var index = _.lastIndexOf(src, '.');
        var valid = false;

        if (index != -1) {
            var ext = src.substring(index + 1, src.length).toLowerCase();
            if (_.indexOf(this.allowedExtensions.img, ext) != -1) {
                valid = true;
            }
        }

        if (valid) {
            var img = new Image;
            img.src = URL.createObjectURL(e.target.files[0]);
            this.updateState({
                image: img
            });

        }
        else {
            this.updateState({
                image: null
            });
        }

        this.state.stepModal.setDisabled(!valid);
    }
});