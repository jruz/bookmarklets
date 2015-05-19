"use strict";
var storyPoints = {
  open_all_lists: function() {
    $('.js-toggle-archived').click();
  },
  get_points: function(list) {
    var tag_style = 'background:#D0F0ED;color:#000000;';
    var tags = $(list).find('a[style="' + tag_style + '"]');
    return _.reduce(tags, function(total, node){ return total + parseInt(node.text); }, 0);
  },
  get_tag_points: function(list){
    var self = this;
    var tag_names = _.uniq($(list).find('a.tag').map(function(){ if(isNaN(this.innerText)){ return this.innerText; } }));
    return tag_names.map(function(tag){
      var nodes = $(list).find('a.tag:contains(' + tag + ')');
      var points = _.reduce(nodes, function(prev, item){ return prev + self.get_points($(item).parent()); }, 0);
      return {name: tag, points: points};
    });
  },
  init: function() {
    var result = [];
    var self = this;
    $('.tb-stream-as-block').each(function(i, list){
      var name = $(list).find('.js-task-list-title').text();
      var points = self.get_points(list);
      var tag_points = self.get_tag_points(list);
      console.log(tag_points);
      return result.push({name: name, points: points});
    });
    result.pop();
    result.push({name: result[0].name + ' + ' + result[1].name, points: result[0].points + result[1].points});
    this.createInfo(result);
  },
  run: function() {
    this.open_all_lists();
    this.init();
  },
  create_html: function(content) {
    var confirm_dialog = new Teambox.Views.Dialogs.Confirm({
        header: 'Story Points'
      , description: content
    });
    confirm_dialog.open();
  },
  createInfo: function(info) {
    var header = '<table><thead><tr><th></th><th></th></tr></thead><tbody>';
    var footer = '</tbody></table>';
    var cells = _.reduce(info, function(prev, count){ return prev + '<tr><td>' + count.name + '</td><td>' + count.points + '<td/><tr />'; }, '');
    this.create_html(header + cells + footer);
  }
};
storyPoints.run();
