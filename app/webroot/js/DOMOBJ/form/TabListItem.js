TabListItem.prototype = new Tag();

function TabListItem(target,title){
    var self = this;
    Tag.call(self,'li');
    self.setAttribute('role','presentation');
    self.link = null;
    self.target = target;
    self.title = title;
    self.add(self.getLink());
}

TabListItem.prototype.getLink = function(){
    var self =  this;
    if(self.link == null){
        self.link = new Link(self.target);
        self.link.setAttribute('role','tab').html(self.title);
    }
    return self.link;
};
