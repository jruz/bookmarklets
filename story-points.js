"use strict";
var storyPoints = {
  add_style: function () {
    var style = document.createElement("style")
      , sheet;
    style.setAttribute("media", "screen");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    sheet = style.sheet;
    sheet.insertRule(".story-points { width: 70%; margin: 0 auto; border: none; margin-bottom: 30px; }", 0);
    sheet.insertRule("th { font-weight: 700 !important; border-bottom: 1px solid #ccc; }", 1);
    sheet.insertRule("td:last-child { text-align: right; }", 2);
  },
  open_all_lists: function () {
    $('.js-toggle-archived').click();
  },
  is_a_story_point: function (text) {
    if (/\./.test(text) || isNaN(parseInt(text))) {
      return false;
    } else {
      return true;
    }
  },
  get_points: function (list) {
    var tags = $(list).find('a.tag')
      , self = this;
    return _.reduce(tags, function (total, node) {
      if (self.is_a_story_point(node.innerText)) {
        return total + parseInt(node.innerText);
      } else {
        return total;
      }
    }, 0);
  },
  get_tag_points: function (list) {
    var self = this
      , tag_names = _.uniq($(list).find('a.tag').map(function () {
        if (!self.is_a_story_point(this.innerText)) {
          return this.innerText;
        }
      }));
    return tag_names.map(function (tag) {
      var nodes = $(list).find('a.tag:contains(' + tag + ')')
        , points = _.reduce(nodes, function (prev, item) { return prev + self.get_points($(item).parent()); }, 0);
      return {name: tag, points: points};
    });
  },
  create_dialog: function (content) {
    var confirm_dialog = new Teambox.Views.Dialogs.Confirm({
        header: 'Story Points'
      , description: content
    });
    confirm_dialog.open();
  },
  create_table: function (title, info) {
    var header = '<table class="story-points"><thead><tr><th colspan="2">' + title + '</th></tr></thead><tbody>'
      , footer = '</tbody></table>'
      , cells = _.reduce(info, function (prev, count) { return prev + '<tr><td>' + count.name + '</td><td>' + count.points + '</td><tr />'; }, '');
    return header + cells + footer;
  },
  init: function () {
    var result = []
      , self = this
      , current_sprint_table
      , current_sprint = []
      , past_sprints
      , past_sprints_table
      , content;

    $('.tb-stream-as-block').each(function (i, list) {
      var name = $(list).find('.js-task-list-title').text()
        ,  points = self.get_points(list)
        ,  tag_points = self.get_tag_points(list);
      //console.log(tag_points);
      return result.push({name: name, points: points});
    });
    result.pop(); //for the last empty list

    function getCurrentSprint(data) {
      var arr = [];
      arr.push(data[0]);
      arr.push(data[1]);
      arr.push(data[2]);
      arr.push({name: 'Total', points: data[0].points + data[1].points + data[2].points});
      arr.push({name: 'Remaining', points: data[0].points + data[1].points});
      return arr;
    }

    function getPastSprints(data) {
      var regex = /^Done|^Release/;
      return data.filter(function (item) {
        if (regex.test(item.name)) {
          return item;
        }
      });
    }

    current_sprint = getCurrentSprint(result);
    current_sprint_table = this.create_table('Current Sprint', current_sprint);

    past_sprints = getPastSprints(result);
    past_sprints_table = this.create_table('Past Sprints', past_sprints);

    content = current_sprint_table + past_sprints_table;
    this.create_dialog(content);
  },
  run: function () {
    var self = this;
    self.add_style();
    self.open_all_lists();
    setTimeout(function () {
      self.init();
    }, 1000 * 1);
  }
};
storyPoints.run();
