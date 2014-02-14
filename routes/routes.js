// Generated by CoffeeScript 1.6.3
(function() {
  var Flickr, Geocoder;

  exports.codem = function(req, res) {
    var obj;
    obj = {
      title: 'Dev'
    };
    return res.render('codem');
  };

  exports.demos = function(req, res) {
    var demoType, obj, title;
    demoType = req.params['type'];
    obj = title = demoType;
    return res.render('demos/' + demoType, obj);
  };

  exports.index = function(req, res) {
    var obj;
    obj = {
      title: 'd3 ——  Data Visualization'
    };
    return res.render('index', obj);
  };

  exports.loaders = function(req, res) {
    var obj;
    obj = {
      title: 'Loaders',
      amount: 10
    };
    return res.render('loaders', obj);
  };

  exports.map = function(req, res) {
    var options, renderer;
    renderer = req.params['renderer'];
    options = {
      renderer: {
        name: renderer,
        isCanvas: renderer === 'canvas'
      },
      title: renderer.toUpperCase() + ' Map'
    };
    return res.render('maps', options);
  };

  Flickr = (function() {
    Flickr.prototype.api_key = {
      'api_key': '7e6f810e37d4482c2da35dd883bbd7f6'
    };

    Flickr.prototype.flickr = require('node-flickr');

    Flickr.prototype.api = null;

    function Flickr() {
      this.createFlickr();
    }

    Flickr.prototype.createFlickr = function() {
      return this.api = new this.flickr(this.api_key);
    };

    Flickr.prototype.getPhotos = function(page, cb) {
      var obj, photos;
      photos = {};
      obj = {
        user_id: '42877615@N04',
        tags: 'wexplore',
        has_geo: '0',
        per_page: '500',
        page: page
      };
      return this.api.get('photos.search', obj, cb);
    };

    Flickr.prototype.getLocations = function(photos, cb) {
      var i, maxPhotos, obj, photoLoaded, resp,
        _this = this;
      maxPhotos = 10;
      i = 0;
      resp = [];
      photoLoaded = function(data) {
        var obj;
        resp.push(data);
        obj = {
          photo_id: photos.photo[++i].id
        };
        if (data.stat === 'fail') {
          return _this.api.get('photos.geo.getLocation', obj, photoLoaded);
        } else {
          return cb(data);
        }
      };
      obj = {
        photo_id: photos.photo[++i].id
      };
      return this.api.get('photos.geo.getLocation', obj, photoLoaded);
    };

    return Flickr;

  })();

  Geocoder = (function() {
    Geocoder.prototype.api_key = 'AIzaSyDn9BPGUMYumxXdTT_jSx4KL68jQZBlcKk';

    Geocoder.prototype.provider = 'google';

    Geocoder.prototype.adapter = 'http';

    Geocoder.prototype.geocoder = null;

    function Geocoder() {
      this.createGeocoder();
    }

    Geocoder.prototype.createGeocoder = function() {
      var opts;
      opts = {
        apiKey: this.api_key,
        formatter: null
      };
      return this.geocoder = require('node-geocoder').getGeocoder(this.provider, this.adapter, opts);
    };

    Geocoder.prototype.getLocationByCityName = function(city, cb) {
      return this.geocoder.geocode(city, cb);
    };

    Geocoder.prototype.getLocationByLatLong = function(coords, cb) {
      return this.geocoder.reverse(coords[0], coords[1], cb);
    };

    return Geocoder;

  })();

  exports.thinkData = function(req, res) {
    var cb, citycount, correctNames, f, filename, fs, geo, i, obj, pages, photos, _,
      _this = this;
    fs = require('fs');
    _ = require('underscore');
    correctNames = {
      'Ringha Village, China': 'Deqin, China',
      'Ringha Village, Tibet': 'Deqin, China',
      'Garmisch-Partinkirchen, Germany': 'Garmisch-Partenkirchen, Germany',
      'Kleinmachnow, Germany': 'Dahlem, Germany',
      'Karlsruhe, Germany': 'Durlach, Germany',
      'Thimphu, Bhutan': 'Paro, Bhutan',
      'Osorakan Park, Japan': 'Hiroshima, Japan',
      'Donsao, Laos': 'Nong Ruea Sao, Thailand',
      'Punahka, Bhutan': 'Paro, Bhutan',
      'Colonia, Uruguay': 'Colonia del Sacramento, Uruguay'
    };
    f = new Flickr();
    geo = new Geocoder();
    filename = 'public/json/tgs.json';
    obj = {};
    obj.flickr = f;
    pages = 7;
    i = 1;
    photos = {};
    citycount = 0;
    fs.readFile(filename, 'utf-8', function(err, _data) {
      return res.send(eval(_data));
    });
    return;
    cb = function(data) {
      var city, fn, photo, photoArray, photoCount, _photo;
      for (photo in data.photos.photo) {
        _photo = data.photos.photo[photo];
        city = _photo.title.split('(')[1];
        if (city != null) {
          ++citycount;
          city = city.substring(0, city.length - 1);
          if (city.split(',').length > 1) {
            if (photos[city] != null) {
              photos[city].photos.push(_photo);
            } else {
              photos[city] = {
                photos: [_photo],
                location: {
                  title: city,
                  coords: []
                }
              };
            }
          }
        }
      }
      if (++i > pages) {
        photoArray = _.toArray(photos);
        photoCount = photoArray.length;
        fn = function(err, resp) {
          var property, _i, _json, _len;
          if (resp != null) {
            photoArray[photoCount].location.title;
            for (_i = 0, _len = resp.length; _i < _len; _i++) {
              property = resp[_i];
              photoArray[photoCount].location.coords.push(property);
            }
          } else {
            geo.getLocationByCityName(correctNames[photoArray[photoCount].location.title], fn);
            return;
          }
          if (photoCount > 0) {
            photoCount--;
            return geo.getLocationByCityName(photoArray[photoCount].location.title, fn);
          } else {
            res.json(photoArray);
            _json = JSON.stringify(photoArray);
            return fs.writeFile('.' + filename, _json, function(err) {
              if (err != null) {
                return console.log(err);
              } else {
                return console.log('saved');
              }
            });
          }
        };
        return geo.getLocationByCityName(photoArray[--photoCount].location.title, fn);
      } else {
        return f.getPhotos(i, cb);
      }
    };
    return f.getPhotos(i, cb);
  };

  exports.tgs = function(req, res) {
    var opts;
    opts = {
      renderer: req.params['renderer'],
      scale: req.params['scale'],
      projectionKey: req.params['projectionKey'],
      amount: 10
    };
    return res.render('tgs', opts);
  };

  exports.getstudents = function(req, res) {
    var c, cb, csv, filename, fs, geo, i, onEnd, opts, students, _, _path, _stream,
      _this = this;
    csv = require('fast-csv');
    fs = require('fs');
    _ = require('underscore');
    _path = 'public/csv/students.csv';
    _stream = fs.createReadStream(_path);
    i = 0;
    opts = {};
    students = [];
    filename = 'public/json/students.json';
    fs.readFile(filename, 'utf-8', function(err, _data) {
      return res.send(eval(_data));
    });
    return;
    geo = new Geocoder();
    cb = function(data) {
      var o, obj, prop, property, _i, _len;
      if (i === 0) {
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          prop = data[_i];
          opts[prop] = '';
        }
        return ++i;
      } else {
        obj = {};
        o = 0;
        for (property in opts) {
          obj[property] = data[o];
          ++o;
        }
        students.push(obj);
        return ++i;
      }
    };
    onEnd = function() {
      var fn, l, loc, student;
      l = students.length;
      fn = function(err, data) {
        var loc, student;
        console.log(err, data);
        if (!err) {
          if (l >= 0) {
            student = students[l];
            loc = student.City + ', ' + student.Country;
            console.log(loc);
            opts = {
              location: {
                coords: [data[0]]
              }
            };
            _.extend(students[l], opts);
            geo.getLocationByCityName(loc, fn);
            return --l;
          } else {
            fs.writeFile('public/json/students.json', JSON.stringify(students));
            return res.json(students);
          }
        }
      };
      student = students[--l];
      loc = student.City + ', ' + student.Country;
      console.log(loc);
      return geo.getLocationByCityName(loc, fn);
    };
    c = csv(_stream).on('data', cb).on('end', onEnd).parse();
  };

  exports.list = function(req, res) {
    return res.send('respond with a resource');
  };

  exports.getlocation = function(req, res) {
    var cb, coords, geo, l,
      _this = this;
    coords = [req.params['long'], req.params['lat']];
    l = {
      coords: coords
    };
    geo = new Geocoder();
    cb = function(err, data) {
      return res.json(data || err);
    };
    return geo.getLocationByLatLong(coords, cb);
  };

}).call(this);
