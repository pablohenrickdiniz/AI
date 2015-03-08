function MouseReader(element) {
    var self = this;
    self.element = element;
    self.vertex = [0, 0];
    self.leftdown = [];
    self.rightdown = [];
    self.middledown = [];
    self.leftup = [];
    self.rightup = [];
    self.middleup = [];
    self.mousemove = [];
    self.left = false;
    self.middle = false;
    self.right = false;
}

MouseReader.prototype.start = function () {
    var self = this;
    $(self.element).mousemove(function (event) {
        var x = (event.pageX - $(this).offset().left);
        var y = (event.pageY - $(this).offset().top);
        self.vertex = [x,y];
        self.mousemove.forEach(function(callback){
            callback.apply(self,[event]);
        });
    });

    $(self.element).mousedown(function (event) {
        switch (event.which) {
            case 1:
                self.left = true;
                self.leftdown.forEach(function (callback) {
                    callback.apply(self,[event]);
                });
                break;
            case 2:
                self.middle = true;
                self.middledown.forEach(function (callback) {
                    callback.apply(self,[event]);
                });
                break;
            case 3:
                self.right = true;
                self.rightdown.forEach(function (callback) {
                    callback.apply(self,[event]);
                });
        }
    });

    $(self.element).mouseup(function (event) {
        switch (event.which) {
            case 1:
                self.left = false;
                self.leftup.forEach(function (callback) {
                    callback.apply(self,[event]);
                });
                break;
            case 2:
                self.middle = false;
                self.middleup.forEach(function (callback) {
                    callback.apply(self,[event]);
                });
                break;
            case 3:
                self.right = false;
                self.rightup.forEach(function (callback) {
                    callback.apply(self,[event]);
                });
        }
    });
};

MouseReader.prototype.onmousedown = function (which, callback) {
    var self = this;
    switch (which) {
        case 1:
            self.leftdown.push(callback);
            break;
        case 2:
            self.middledown.push(callback);
            break;
        case 3:
            self.rightdown.push(callback);
    }
};

MouseReader.prototype.onmouseup = function (which, callback) {
    var self = this;
    switch (which) {
        case 1:
            self.leftup.push(callback);
            break;
        case 2:
            self.middleup.push(callback);
            break;
        case 3:
            self.rightup.push(callback);
    }
};

MouseReader.prototype.onmousemove = function (callback) {
    var self = this;
    self.mousemove.push(callback);
};






MouseReader.LEFT = 1;
MouseReader.MIDDLE = 2;
MouseReader.RIGHT = 3;