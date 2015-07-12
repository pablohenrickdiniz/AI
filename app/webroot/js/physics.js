$2 = jQuery.noConflict();

$2.fn.mousePosition = function (e) {
    var vd = 0;
    var hd = 0;
    $2(this).parents().each(function () {
        vd += $2(this).scrollTop();
        hd += $2(this).scrollLeft();
    });
    vd -= $2(this).scrollTop();
    hd -= $2(this).scrollLeft();
    var x = (e.pageX - ($2(this).offset().left - pageXOffset)) - hd;
    var y = (e.pageY - ($2(this).offset().top - pageYOffset)) - vd;
    return {
        x: x,
        y: y
    };
};


function PaintShape(canvas) {
    var self = this;
    self.canvas = canvas;
    self.width = $2(self.canvas).width();
    self.height = $2(self.canvas).height();
    self.drawingTools = [];
    self.selectedTool = '';
    self.context = $2(self.canvas)[0].getContext('2d');
    self.drawing = false;
    self.lp = null;
    self.selectedShapes = [];
    self.mouseMove = [];
    self.mouseDown = [];
    self.mouseUp = [];
    self.keyDown = [];
    self.click = [];
    self.drawingShape = null;
    self.drawingLayer = null;
    self.nextLayer = 0;
    self.layers = [];
    self.mouseIsDown = false;
    self.fillStyle = 'transparent';
    self.strokeStyle = 'black';
    self.lineWidth = 1;
    self.keys = {};
    self.keySequence = [];

    $2(self.canvas).on('mousedown', function (e) {
        self.mouseIsDown = true;
        var pa = $2(this).mousePosition(e);
        self.lp = pa;
        self.mouseDown.forEach(function (action) {
            action.apply(self, [pa]);
        });
    });

    $2(self.canvas).on('mouseup', function (e) {
        self.mouseIsDown = false;
        var pa = $2(this).mousePosition(e);
        self.mouseUp.forEach(function (action) {
            action.apply(self, [pa]);
        });
    });

    $2(document).on('mouseup', function (e) {
        self.mouseIsDown = false;
    });

    $2(self.canvas).on('mousemove', function (e) {
        var pa = $2(this).mousePosition(e);
        self.mouseMove.forEach(function (action) {
            action.apply(self, [pa]);
        });
    });

    $2(self.canvas).on('click', function (e) {
        var pa = $2(this).mousePosition(e);
        self.lp = pa;
        self.click.forEach(function (action) {
            action.apply(self, [pa]);
        });
    });

    $2(document).on("keydown", function (e) {
        if (self.keySequence.indexOf(e.which) == -1) {
            self.keySequence.push(e.which);
        }
        self.keys[e.which] = true;
        console.log(self.keySequence);
        self.keyDown.forEach(function (action) {
            action.apply(self, [e.which]);
        });
    });

    $2(document).on("keyup", function (e) {
        self.keys[e.which] = false;
        var index = self.keySequence.indexOf(e.which);
        if (index != -1) {
            self.keySequence.splice(index, 1);
        }
    });
}

PaintShape.prototype.sequenceIs = function (sequence) {
    var self = this;
    if (sequence.length == self.keySequence.length) {
        for (var i = 0; i < sequence.length; i++) {
            if (sequence[i] != self.keySequence[i]) {
                return false;
            }
        }
    }
    else {
        return false;
    }
    return true;
};


PaintShape.prototype.moveToLayer = function (shape, layerIndex) {
    var self = this;
    if(layerIndex < 0){
        var size = self.layers.length;
        for(var i = size;size>0;size--){
            self.layers[i] = self.layers[i-1];
            self.layers[i].index = i;
        }
        self.layers[0] = undefined;
        layerIndex = 0;
    }

    var layer = self.getLayer(layerIndex);

    var index = shape.layer.shapes.indexOf(shape);
    if(index != -1){
        shape.layer.shapes.splice(index,1);
    }
    layer.shapes.push(shape);
    shape.layer = layer;
};

PaintShape.prototype.onKeyDown = function (func) {
    var self = this;
    self.keyDown.push(func);
};


PaintShape.prototype.isKeyDown = function (key) {
    var self = this;
    return self.keys[key] == undefined ? false : self.keys[key];
};

PaintShape.prototype.onMouseDown = function (func) {
    var self = this;
    self.mouseDown.push(func);
};

PaintShape.prototype.onMouseUp = function (func) {
    var self = this;
    self.mouseUp.push(func);
};

PaintShape.prototype.updateDrawingShapeState = function (pb) {
    var self = this;
    var shape = self.drawingShape;
    var pa = self.lp;

    switch (shape.type) {
        case 'circle':
            var distance = Math.distance(pa, pb);
            var med = Math.med(pa, pb);
            shape.x = med.x;
            shape.y = med.y;
            shape.radius = distance / 2;
            break;
        case 'rect':
            var pc = {x: pa.x, y: pb.y};
            var pd = {x: pb.x, y: pa.y};
            var w = Math.distance(pa, pd);
            var h = Math.distance(pa, pc);
            if (self.isKeyDown(KEY_SH_TAB)) {
                var max = Math.max(w, h);
                w = max;
                h = max;
            }
            shape.width = w;
            shape.height = h;

            shape.x = pb.x < pa.x ? pa.x - w : pa.x;
            shape.y = pb.y < pa.y ? pa.y - h : pa.y;

            break;
    }
    self.refresh();
};

PaintShape.prototype.refresh = function () {
    var self = this;
    self.clear();
    self.drawLayers();
};


PaintShape.prototype.isDrawing = function () {
    var self = this;
    return self.drawing;
};

PaintShape.prototype.isDrawingToolSelected = function () {
    var self = this;
    return self.drawingTools.indexOf(self.selectedTool) != -1;
};

PaintShape.prototype.setDrawingTools = function (drawingTools) {
    var self = this;
    self.drawingTools = drawingTools;
};

PaintShape.prototype.setTool = function (tool) {
    var self = this;
    if (self.selectedTool != tool) {
        self.drawing = false;
        self.selectedTool = tool;
    }
};

PaintShape.prototype.onMouseMove = function (func) {
    var self = this;
    self.mouseMove.push(func);
};

PaintShape.prototype.onClick = function (func) {
    var self = this;
    self.click.push(func);
};

PaintShape.prototype.addShape = function (shape) {
    var self = this;
    var layer = self.getLayer(self.drawingLayer);
    shape.layer = layer;
    layer.shapes.push(shape);
};

PaintShape.prototype.remove = function (shape) {
    var layer = shape.layer;
    var index = layer.shapes.indexOf(shape);
    if(index != -1){
        layer.shapes.splice(index,1);
    }
};

PaintShape.prototype.getLayer = function (index) {
    var self = this;
    if (self.layers[index] == null) {
        self.layers[index] = {
            shapes: [],
            index: index
        };
    }
    return self.layers[index];
};

PaintShape.prototype.drawLayers = function () {
    var self = this;
    for (var i = 0; i < self.layers.length; i++) {
        var layer = self.layers[i];
        if (layer.shapes != undefined) {
            for (var j = 0; j < layer.shapes.length; j++) {
                self.drawShape(layer.shapes[j]);
            }
        }
    }
};

PaintShape.prototype.drawShape = function (shape) {
    var self = this;
    self.context.strokeStyle = shape.strokeStyle;
    self.context.fillStyle = shape.fillStyle;
    self.context.lineWidth = shape.lineWidth;
    if (shape.selected) {
        self.context.setLineDash([5, 5]);
    }
    else {
        self.context.setLineDash([]);
    }

    switch (shape.type) {
        case 'circle':
            self.drawCircle(shape);
            break;
        case 'rect':
            self.drawRect(shape);
    }
};

PaintShape.prototype.drawCircle = function (circle) {
    var self = this;
    self.context.beginPath();
    self.context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    self.context.fill();
    self.context.stroke();
};

PaintShape.prototype.drawRect = function (rect) {
    var self = this;
    self.context.beginPath();
    self.context.fillRect(rect.x, rect.y, rect.width, rect.height);
    self.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
};

PaintShape.prototype.clear = function () {
    var self = this;
    self.context.clearRect(0, 0, Math.ceil(self.width), Math.ceil(self.height));
};

PaintShape.prototype.generateInitialShape = function (type, position) {
    var self = this;
    var shape = {
        type: type,
        id: generateUUID(),
        x: position.x,
        y: position.y,
        selected: false,
        fillStyle: self.fillStyle,
        strokeStyle: self.strokeStyle,
        lineWidth: self.strokeWidth
    };
    switch (type) {
        case 'circle':
            shape.radius = 1;
            break;
        case 'rect':
            shape.width = 1;
            shape.height = 1;
            break;
    }

    return shape;
};


$2(document).ready(function () {
    var Paint = new PaintShape('#draw');
    Paint.setDrawingTools(['circle', 'rect']);

    Paint.onClick(function (position) {
        var self = this;
        if (!self.drawing && self.isDrawingToolSelected()) {
            self.drawing = true;
            self.drawingLayer = self.layers.length;
            var shape = self.generateInitialShape(self.selectedTool, position);
            self.addShape(shape);
            self.drawingShape = shape;
        }
        else {
            self.drawing = false;
        }
    });


    Paint.onMouseDown(function (position) {
        var self = this;
        if (self.selectedTool == 'move') {
            self.selectedShapes = [];
            var selected = false;
            for (var i = self.layers.length-1; i >= 0; i--) {
                var layer = self.layers[i];
                if(layer.shapes != undefined){
                    for(var j = 0; j < layer.shapes.length;j++){
                        var shape = layer.shapes[j];
                        if (shape.type == 'circle') {
                            var cc = {x: shape.x, y: shape.y};
                            var distance = Math.distance(position, cc);
                            if (distance <= shape.radius && !selected) {
                                shape.selected = true;
                                self.selectedShapes.push(shape);
                                selected = true;
                            }
                            else {
                                shape.selected = false;
                            }
                        }
                        else if (shape.type == 'rect') {
                            var xo = shape.x;
                            var yo = shape.y;
                            var xf = shape.x + shape.width;
                            var yf = shape.y + shape.height;

                            if (xo <= position.x && yo <= position.y && xf >= position.x && yf >= position.y && !selected) {
                                shape.selected = true;
                                self.selectedShapes.push(shape);
                                selected = true;
                            }
                            else {
                                shape.selected = false;
                            }
                        }
                        shape.oldX = shape.x;
                        shape.oldY = shape.y;
                    }
                }
            }
            self.refresh();
        }
    });

    Paint.onMouseMove(function (position) {
        var self = this;
        if (self.isDrawingToolSelected() && self.drawing) {
            self.updateDrawingShapeState(position);
        }
    });


    Paint.onMouseMove(function (position) {
        var self = this;
        if (self.selectedTool == 'move' && self.mouseIsDown) {
            var move = {
                x: position.x - self.lp.x,
                y: position.y - self.lp.y
            };
            for (var i = 0; i < self.selectedShapes.length; i++) {
                var shape = self.selectedShapes[i];
                shape.x = shape.oldX + move.x;
                shape.y = shape.oldY + move.y;
            }
            self.refresh();
        }
    });

    Paint.onMouseUp(function (position) {
        var self = this;
        if (self.selectedTool == 'move') {
            for (var i = 0; i < self.selectedShapes.length; i++) {
                var shape = self.selectedShapes[i];
                shape.oldX = shape.x;
                shape.oldY = shape.y;
            }
        }
    });


    Paint.onKeyDown(function () {
        var self = this;
        if (self.sequenceIs([KEY_ALT, KEY_SBL])) {
            self.selectedShapes.forEach(function (shape) {
                var index = shape.layer.index;
                index--;
                self.moveToLayer(shape, index);
            });
            self.refresh();
        }
        else if (self.sequenceIs([KEY_ALT, KEY_SBR])) {
            self.selectedShapes.forEach(function (shape) {
                var index = shape.layer.index;
                index++;
                if (index <= self.layers.length) {
                    self.moveToLayer(shape, index);
                }
            });
            self.refresh();
        }
    });


    Paint.onKeyDown(function (key) {
        var self = this;
        if (key == KEY_DEL) {
            self.selectedShapes.forEach(function (shape) {
                self.remove(shape);
            });
            self.selectedShapes = [];
            self.refresh();
        }
    });


    $2('#fillColor').minicolors({
        control: 'wheel',
        theme: 'bootstrap',
        change: function (hex) {
            Paint.fillStyle = hex;
        }
    });

    $2('input[name=tool]').change(function () {
        Paint.setTool($2(this).val());
    });
});

