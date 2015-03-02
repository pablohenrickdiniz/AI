
TabList.prototype = new Tag();

function TabList(){
    var self = this;
    Tag.call(self,'ul');
    self.addClass('nav nav-tabs').setAttribute('role','tablist');
}

TabList.prototype.add = function(tabListItem){
    var self = this;
    if(tabListItem instanceof TabListItem){
        $(self.getDOM()).append(tabListItem.getDOM());
    }
    return self;
};