(function() {
  exports.index = function(req, res) {
    var obj;
    obj = {
      title: 'd3 ——  Data Visualization'
    };
    return res.render('index', obj);
  };

}).call(this);
