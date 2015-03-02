TabPanel.prototype = new Tag();

function TabPanel(){
    var self = this;
    Tag.call(self,'div');
    self.tabList = null;
    self.tabContent = null;
    self.setAttribute('role','tabpanel');
}

TabPanel.prototype.getTabList = function(){
    var self = this;
    if(self.tabList == null){
        self.tabList = new TabList();
    }
    return self.tabList;
};

TabPanel.prototype.getTabContent = function(){
    var self = this;
    if(self.tabContent == null){
        self.tabContent = new TabContent();
    }
    return self.tabContent;
};

TabPanel.prototype.getDOM = function(){
    var self = this;
    if(self.element == null){
        Tag.prototype.getDOM.apply(self);
        self.add(self.getTabList()).add(self.getTabContent());
    }
    return self.element;
};