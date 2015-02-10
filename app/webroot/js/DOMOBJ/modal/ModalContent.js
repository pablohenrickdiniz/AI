ModalContent.prototype = new Tag();

function ModalContent(){
    var self = this;
    Tag.call(self,'div');
    self.addClass('modal-content');
    self.header = null;
    self.body = null;
    self.footer = null;
}

ModalContent.prototype.getHeader = function(){
    var self = this;
    if(self.header == null){
        self.header = new ModalHeader();
    }
    return self.header;
};

ModalContent.prototype.getBody = function(){
    var self = this;
    if(self.body == null){
        self.body = new ModalBody();
    }
    return self.body;
};

ModalContent.prototype.getFooter = function(){
    var self = this;
    if(self.footer == null){
        self.fgoter = new ModalFooter();
    }
    return self.footer;
};