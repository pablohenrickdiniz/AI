Alert.prototype = new Tag();

function Alert(type){
    var self = this;
    type == undefined?type=1:type;
    Tag.call(self,'div');

    var className = '';
    switch(type){
        case Alert.error:
            className = 'alert alert-error';
            break;
        case Alert.warning:
            className = 'alert alert-warning';
            break;
        default:
            className = 'alert alert-success'
    }

    $(self.getDOM()).attr('class',className);
}

Alert.prototype.setMessage = function(message){
    var self = this;
    $(self.getDOM()).html(message);
    return self;
};

Alert.success = 1;
Alert.error = 0;
Alert.warning = -1;