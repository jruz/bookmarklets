"use strict";
var storyPoints = {
  open_all_lists: function () {
    $('.js-toggle-archived').click();
  },
  get_points: function (list) {
    var tags = $(list).find('a.tag-pr');
    return _.reduce(tags, function (total, node) {
      var content = node.innerText
      , as_number = parseInt(content);
      if (/\./.test(content) || isNaN(as_number)) {
        return total;
      } else {
        return total + as_number;
      }
    }, 0);
  },
  get_tag_points: function (list) {
    var self = this
      , tag_names = _.uniq($(list).find('a.tag').map(function () {
        if (!_.isNumber(this.innerText)) {
          return this.innerText;
        }
      }));
    return tag_names.map(function (tag) {
      var nodes = $(list).find('a.tag:contains(' + tag + ')')
        , points = _.reduce(nodes, function (prev, item) { return prev + self.get_points($(item).parent()); }, 0);
      return {name: tag, points: points};
    });
  },
  init: function () {
    var result = []
      , self = this;
    $('.tb-stream-as-block').each(function (i, list) {
      var name = $(list).find('.js-task-list-title').text()
        ,  points = self.get_points(list)
        ,  tag_points = self.get_tag_points(list);
      //console.log(tag_points);
      return result.push({name: name, points: points});
    });
    result.pop();
    result.push({name: result[0].name + ' + ' + result[1].name, points: result[0].points + result[1].points});
    this.createInfo(result);
  },
  run: function () {
    this.open_all_lists();
    this.init();
  },
  create_html: function (content) {
    var confirm_dialog = new Teambox.Views.Dialogs.Confirm({
        header: 'Story Points'
      , description: content
    });
    confirm_dialog.open();
  },
  createInfo: function (info) {
    var header = '<table><thead><tr><th></th><th></th></tr></thead><tbody>'
      , footer = '</tbody></table>'
      , cells = _.reduce(info, function (prev, count) { return prev + '<tr><td>' + count.name + '</td><td>' + count.points + '<td/><tr />'; }, '');
    this.create_html(header + cells + footer);
  }
};
storyPoints.run();
