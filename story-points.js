var storyPoints = {
  run: function() {
    var text, result = [];
    $('.tb-stream-as-block').each(function(i, list){
      var name    = $(list).find('.js-task-list-title').text();
      var tags    = $(list).find('a[style="color: rgb(0, 0, 0); background-color: rgb(74, 204, 230);"]');
      var points  = _.reduce(tags, function(total, node){return total + parseInt(node.text);}, 0);
      return result.push({name: name, points: points});
    });
    result.pop();
    result.push({name: result[0].name + ' + ' + result[1].name, points: result[0].points + result[1].points});
    text = _.reduce(result, function(text, count){return text + count.name + ': ' + count.points + '\n';}, '');
    alert(text);
  }
};
