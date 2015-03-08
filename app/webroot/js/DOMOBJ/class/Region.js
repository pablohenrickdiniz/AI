function Region(label, x, y, w, h) {
    var self = this;
    self.label = label;
    self.x = x;
    self.y = y;
    self.w = w;
    self.h = h;
    self.children = [];
}

Region.prototype.object = function () {
    var self = this;
    return {
        label: self.label,
        x: self.x,
        y: self.y,
        width: self.w,
        height: self.h
    };
};

Region.prototype.clearChildren = function () {
    var self = this;
    for (var i = 0; i < self.children.length; i++) {
        self.children[i].inContact = false;
        if (!self.children[i].inUse) {
            self.children[i].checked = false;
        }
    }
};

Region.prototype.fullClear = function () {
    var self = this;
    for (var i = 0; i < self.children.length; i++) {
        self.children[i].checked = false;
        self.children[i].inContact = false;
        self.children[i].inUse = false;
    }
};

Region.prototype.updateInUse = function () {
    var self = this;
    for (var i = 0; i < self.children.length; i++) {
        self.children[i].inUse = true;
    }
};

Region.prototype.updateSize = function () {
    var self = this;
    var xo = null;
    var yo = null;
    var xf = null;
    var yf = null;
    var cxf = null;
    var cyf = null;
    for (var i = 0; i < self.children.length; i++) {
        var child = self.children[i];
        cxf = child.x + child.w;
        cyf = child.y + child.h;

        if (xo == null || xo > child.x) {
            xo = child.x;
        }

        if (yo == null || yo > child.y) {
            yo = child.y;
        }

        if (xf == null || xf < cxf) {
            xf = cxf;
        }

        if (yf == null || yf < cyf) {
            yf = cyf;
        }
    }

    self.x = xo;
    self.y = yo;
    self.w = xf-xo;
    self.h = yf-yo;
};

Region.prototype.pointColide = function (point) {
    var self = this;
    var cx = point[0];
    var cy = point[1];
    var x = self.x;
    var y = self.y;
    var w = self.w;
    var h = self.h;

    return (cx <= x + w && cx >= x && cy <= y + h && cy >= y);
};