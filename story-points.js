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
    sheet.insertRule(".story-points th { font-weight: 700 !important; border-bottom: 1px solid #ccc; }", 1);
    sheet.insertRule(".story-points td:last-child { text-align: right; }", 2);
    sheet.insertRule(".story-points__title { font-weight: 700; }", 3);
    sheet.insertRule(".story-points__select { float: right; }", 4);
    sheet.insertRule(".story-points__select-wrapper { width: 70%; margin: 0 auto 5px auto; }", 5);
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
  create_select: function (data) {
    var i
      , option
      , select = document.createElement('select');
    select.className = 'js-list-tag-select story-points__select';
    for (i = 0; i < data.length; i++) {
      option = document.createElement('option');
      option.text = data[i].name;
      option.value = i;
      select.add(option);
    }
    return select.outerHTML;
  },
  init: function () {
    var result = []
      , self = this
      , current_sprint
      , done
      , other
      , content = []
      , tag_points
      , lists = $('.js-task-list');

    result = lists.map(function (i, list) {
      var title = list.getElementsByClassName('js-task-list-title')[0];
      if (title) {
        return {
          name: title.innerText,
          points: self.get_points(list)
        };
      }
    });

    function getCurrentSprint(data) {
      var arr = [];
      arr.push(data[0]);
      arr.push(data[1]);
      arr.push(data[2]);
      arr.push({name: 'Total', points: data[0].points + data[1].points + data[2].points});
      arr.push({name: 'Remaining', points: data[0].points + data[1].points});
      return arr;
    }

    function getDone(data) {
      var regex = /^Done|^Release/;
      return data.filter(function () {
        if (regex.test(this.name)) {
          return this;
        }
      });
    }

    function getOther(data) {
      var regex = /^Done|^Release|^To Do|^In Progress/;
      return data.filter(function () {
        if (!regex.test(this.name)) {
          return this;
        }
      });
    }

    current_sprint = getCurrentSprint(result);
    content.push(this.create_table('Current Sprint', current_sprint));

    done = getDone(result);
    content.push(this.create_table('Done/Released', done));

    other = getOther(result);
    content.push(this.create_table('Other', other));

    content.push('<div class="story-points__select-wrapper">');
    content.push('<span class="story-points__title">Report for:</span>');
    content.push(this.create_select(result));
    content.push('</div>');

    tag_points = this.get_tag_points(lists[0]);
    content.push('<div class="js-list-tag-table">');
    content.push(this.create_table('Tag', tag_points));
    content.push('</div>');

    this.create_dialog(content.join(''));
  },
  select: function (el) {
    var self = this;
    $('.js-dialog').on('change', '.js-list-tag-select', function () {
      var list_id = $(this).val()
        , list = $('.js-task-list')[list_id]
        , tag_points = self.get_tag_points(list)
        , table = self.create_table('Tag', tag_points);
      $('.js-list-tag-table').html(table);
    });
  },
  run: function () {
    var self = this;
    self.add_style();
    self.open_all_lists();
    setTimeout(function () {
      self.init();
    }, 1000 * .8);
    self.select();
  }
};
storyPoints.run();
