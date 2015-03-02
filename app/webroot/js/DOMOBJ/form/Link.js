
Link.prototype = new Tag();

function Link(target){
    var self = this;
    Tag.call(self,'a');
    self.setAttribute('href',target);
}