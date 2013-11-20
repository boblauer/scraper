var http = require('http')
  , parse = require('url').parse
  ;

function getHTMLFromUrl(url, cb) {
  url = parse(url);

  var options = {
    host: url.hostname,
    post: url.port,
    path: url.pathname,
  };

  http.get(options, function(res) {
    var html = '';
    res.setEncoding('utf-8');

    res.on('data', function(res) {
      html += res;
    });

    res.on('end', function() {
      cb(getImage(html) || getVideo(html));
    });
  });
}

function getImage(html) {
  var matches = /<img class=\"embeddedObject\" src=(.*\.(?:png|git|jpg|jpeg))/g.exec(html);
  if (matches && matches[1]) {
    return { type: 'image', html: '<img src=' + matches[1] + ' />' };
  }
}

function getVideo(html) {
  var matches = /<object[\s\S]*object>/g.exec(html);
  if (matches && matches[0]) {
    return { type: 'video', html: matches[0] };
  }
}

module.exports = {
  get: getHTMLFromUrl
};
