// Generated by CoffeeScript 1.6.3
(function() {
  var Booking, BookingInformation, Config, EventManager, Events, Map, SocketClient, TGS,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    _this = this;

  Config = window.Config = {
    server: {
      Settings: {
        jsonPath: '/json/world.json',
        csvPath: '/csv/booking_small.csv',
        renderer: 'canvas',
        hasGrid: false,
        hasRotation: false,
        hasLines: true
      },
      Map: {
        container: '#map-container',
        height: 1200,
        width: 1600,
        scale: 350,
        xOffset: 0,
        yOffset: 0,
        scaleMin: 0.75,
        scaleMax: 10,
        projections: ['stereographic', 'orthographic', 'mercator', 'gnomonic', 'equirectangular', 'conicEquidistant', 'conicConformal', 'conicEqualArea', 'azimuthalEquidistant', 'azimuthalEqualArea', 'albersUsa', 'transverseMercator'],
        projectionKey: 4,
        markerSize: 2,
        rotation: [0, -15],
        velocity: 20
      }
    },
    user: {
      Settings: {
        jsonPath: '/json/world.json',
        csvPath: '/csv/booking_small.csv',
        renderer: 'canvas',
        hasGrid: false,
        hasRotation: false,
        hasLines: false
      },
      Map: {
        container: '#map-container',
        height: 1200,
        width: 1600,
        scale: 350,
        xOffset: 0,
        yOffset: 0,
        scaleMin: 0.75,
        scaleMax: 10,
        projections: ['stereographic', 'orthographic', 'mercator', 'gnomonic', 'equirectangular', 'conicEquidistant', 'conicConformal', 'conicEqualArea', 'azimuthalEquidistant', 'azimuthalEqualArea', 'albersUsa', 'transverseMercator'],
        projectionKey: 4,
        markerSize: 2,
        rotation: [0, -15],
        velocity: 20
      }
    },
    TGS: {
      src: '/tgslocations/',
      students_src: '/students/'
    }
  };

  BookingInformation = (function() {
    BookingInformation.prototype.$tourTitle = null;

    BookingInformation.prototype.$bookerCityTitle = null;

    BookingInformation.prototype.$tourCityTitle = null;

    function BookingInformation() {
      this.init();
    }

    BookingInformation.prototype.init = function() {
      this.$tourCityTitle = $('#tour-city');
      this.$bookerCityTitle = $('#booker-city');
      return this.$tourTitle = $('#tour-title');
    };

    BookingInformation.prototype.changeTourTitle = function(text) {
      return this.$tourTitle.find('span').html(text);
    };

    BookingInformation.prototype.changeTourCityTitle = function(text) {
      return this.$tourCityTitle.find('span').html(text);
    };

    BookingInformation.prototype.changeBookerCityTitle = function(text) {
      return this.$bookerCityTitle.find('span').html(text);
    };

    return BookingInformation;

  })();

  Booking = (function() {
    function Booking(src) {
      this.src = src;
      this.onBookingLoaded = __bind(this.onBookingLoaded, this);
      this.createBooking();
    }

    Booking.prototype.createBooking = function() {
      return d3.csv(this.src, this.onBookingLoaded);
    };

    Booking.prototype.onBookingLoaded = function(error, data) {
      this.data = data;
      return EventManager.emitEvent(Events.BOOKING_LOADED);
    };

    return Booking;

  })();

  EventManager = new EventEmitter();

  Events = {
    MAP_LOADED: 'onMapLoaded',
    BOOKING_LOADED: 'onBookingLoaded',
    MARKER_FOCUS: 'onMarkerFocus',
    MAP_CLICKED: 'onMapClicked',
    SERVER_UPDATED: 'onServerUpdated',
    SERVER_STARTED: 'onServerStarted'
  };

  Map = (function() {
    Map.prototype.NEIGHBORS = 'neighbors';

    Map.prototype.COUNTRIES = 'countries';

    Map.prototype.projector = d3.geo;

    Map.prototype.color = d3.scale.category10();

    Map.prototype.renderer = null;

    Map.prototype.type = 'countries';

    Map.prototype.projectionType = null;

    Map.prototype.scale = null;

    Map.prototype.xOffset = null;

    Map.prototype.yOffset = null;

    Map.prototype.scaleMin = null;

    Map.prototype.scaleMax = null;

    Map.prototype.markerSize = null;

    Map.prototype.svg = null;

    Map.prototype.canvas = null;

    Map.prototype.group = null;

    Map.prototype.width = null;

    Map.prototype.height = null;

    Map.prototype.container = null;

    Map.prototype.projection = null;

    Map.prototype.students = null;

    Map.prototype.flickr = null;

    Map.prototype.data = null;

    Map.prototype.countries = null;

    Map.prototype.neighbors = null;

    Map.prototype.hasGrid = false;

    Map.prototype.arc = -100;

    Map.prototype.startRotation = [0, -15];

    function Map(src, width, height, container, renderer, scale, projectionKey, hasGrid, startRotation) {
      this.src = src;
      this.width = width;
      this.height = height;
      this.container = container;
      this.renderer = renderer;
      this.scale = scale;
      this.projectionKey = projectionKey;
      this.hasGrid = hasGrid;
      this.startRotation = startRotation;
      this.onDataRead = __bind(this.onDataRead, this);
      this.update = __bind(this.update, this);
      this.drawPointsOnCanvas = __bind(this.drawPointsOnCanvas, this);
      this.createPath = __bind(this.createPath, this);
      this.createProjection = __bind(this.createProjection, this);
      this.updateCanvas = __bind(this.updateCanvas, this);
      this.updateSVG = __bind(this.updateSVG, this);
      this.zoomed = __bind(this.zoomed, this);
      this.onMouseDownHandler = __bind(this.onMouseDownHandler, this);
      this.onLocationReceived = __bind(this.onLocationReceived, this);
      this.onMouseWheel = __bind(this.onMouseWheel, this);
      this.fillNeighbors = __bind(this.fillNeighbors, this);
      this.onMarkerMouseOver = __bind(this.onMarkerMouseOver, this);
      this.createPoint = __bind(this.createPoint, this);
      this.onServerStarted = __bind(this.onServerStarted, this);
      this.onServerUpdated = __bind(this.onServerUpdated, this);
      this.projectionType = Config[Config.userType].Map.projections[this.projectionKey];
      this.loadFromConfig();
      if (this.renderer === 'canvas') {
        this.createCanvas();
      } else {
        this.createSVG();
      }
      this.readJSON();
      this.addListeners();
    }

    Map.prototype.loadFromConfig = function() {
      this.xOffset = Config[Config.userType].Map.xOffset;
      this.yOffset = Config[Config.userType].Map.yOffset;
      this.scaleMin = Config[Config.userType].Map.scaleMin;
      this.scaleMax = Config[Config.userType].Map.scaleMax;
      return this.markerSize = Config[Config.userType].Map.markerSize;
    };

    Map.prototype.addListeners = function() {
      EventManager.addListener(Events.SERVER_UPDATED, this.onServerUpdated);
      return EventManager.addListener(Events.SERVER_STARTED, this.onServerStarted);
    };

    Map.prototype.createSVG = function() {
      this.svg = d3.select(this.container).append('svg').attr('id', 'svg-map').attr('width', this.width).attr('height', this.height);
      return this.group = this.svg.append('g').on('mousedown', this.onMouseDownHandler).call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", this.zoomed));
    };

    Map.prototype.createCanvas = function() {
      this.canvas = d3.select(this.container).append('canvas').attr('width', this.width).attr('height', this.height).attr('id', 'marker-canvas').on('click', this.onMouseDownHandler);
      return this.context = this.canvas.node().getContext('2d');
    };

    Map.prototype.readJSON = function() {
      return d3.json(this.src, this.onDataRead);
    };

    Map.prototype.drawMap = function() {
      this.drawBackground();
      if (this.hasGrid) {
        this.drawGrid();
      }
      return this.drawCountries();
    };

    Map.prototype.drawGrid = function() {
      switch (this.renderer) {
        case 'svg':
          return this.group.append("path").datum(d3.geo.graticule()).attr("d", this.path).style("stroke", "#ffffff").style("stroke-width", "0.5px");
        case 'canvas':
          this.context.strokeStyle = 'white';
          this.context.beginPath();
          this.path(d3.geo.graticule()());
          return this.context.stroke();
      }
    };

    Map.prototype.onServerUpdated = function(event) {
      this.flickr.push(event);
      this.drawBackground();
      if (this.hasGrid) {
        this.drawGrid();
      }
      this.drawCountries();
      this.drawLines(this.lines);
      this.createPoints('flickr', this.flickr, 'red');
      return this.createPoints('students', this.students, 'blue');
    };

    Map.prototype.onServerStarted = function(event) {
      var loc, _i, _len;
      for (_i = 0, _len = event.length; _i < _len; _i++) {
        loc = event[_i];
        if (loc != null) {
          console.log(loc);
          this.flickr.push(loc);
        }
      }
      this.drawBackground();
      if (this.hasGrid) {
        this.drawGrid();
      }
      this.drawCountries();
      console.log(this.lines);
      this.drawLines(this.lines);
      this.createPoints('flickr', this.flickr, 'red');
      return this.createPoints('students', this.students, 'blue');
    };

    Map.prototype.drawBackground = function() {
      var rgba, str;
      switch (this.renderer) {
        case 'svg':
          this.group.append("defs").append("path").datum({
            type: "Sphere"
          }).attr('id', 'sphere').attr("d", this.path).style("fill", "white");
          this.group.append("use").attr("class", "stroke").attr("xlink:href", "#sphere");
          return this.group.append("use").attr("class", "fill").attr("xlink:href", "#sphere");
        case 'canvas':
          rgba = [0, 40, 5, 1];
          str = 'rgba(' + rgba.join(',') + ')';
          console.log(str);
          this.context.fillStyle = str;
          return this.context.fillRect(0, 0, this.width, this.height);
      }
    };

    Map.prototype.createPoint = function(d) {
      var fn,
        _this = this;
      fn = function(el, idx, array) {
        var coords, size, _d;
        _d = el.__data__.location.coords[0];
        coords = _this.projection([_d['longitude'], _d['latitude']]);
        size = _this.markerSize * 2;
        _this.context.fillStyle = _this.color;
        return _this.context.fillRect(coords[0], coords[1], size, size);
      };
      return d[0].forEach(fn);
    };

    Map.prototype.createPoints = function(name, data, color) {
      var _this = this;
      this.color = color;
      this[name] = data;
      switch (this.renderer) {
        case 'svg':
          return this.group.selectAll('group').data(this[name]).enter().append('circle').attr('r', this.markerSize * 2).attr('fill', color).attr('transform', function(d) {
            var coords, _d;
            _d = d.location.coords[0];
            coords = _this.projection([_d['longitude'], _d['latitude']]);
            return 'translate(' + coords + ')';
          }).on('mouseover', this.onMarkerMouseOver);
        case 'canvas':
          return this.canvas.select('canvas').data(this[name]).enter().call(this.createPoint);
      }
    };

    Map.prototype.drawLines = function(lines) {
      var coords, fn, path, _i, _len, _ref, _results,
        _this = this;
      this.lines = lines;
      _ref = this[this.lines[0]];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        coords = this.projection([path.location.coords[0]['longitude'], path.location.coords[0]['latitude']]);
        switch (this.renderer) {
          case 'svg':
            _results.push(this.group.selectAll('group').data(this[this.lines[1]]).enter().append('path').attr('d', function(d) {
              var l, m, _d;
              _d = d.location.coords[0];
              m = 'M' + coords.join(' ');
              l = 'L' + _this.projection([_d['longitude'], _d['latitude']]).join(' ');
              return [m, l].join(' ');
            }).attr('stroke', 'rgba(0,0,250,0.1)').attr('stroke-width', '1').attr('fill', 'none'));
            break;
          case 'canvas':
            fn = function(d) {
              var _f;
              _f = function(el, index, array) {
                var aCoords, cb, l1;
                aCoords = [el.__data__.location.coords[0].longitude, el.__data__.location.coords[0].latitude];
                l1 = _this.projection(aCoords);
                cb = function(d) {
                  var _g;
                  _g = function(el, index, array) {
                    var bCoords, colA, colB, dist, grad, l2, op, x1, y1;
                    bCoords = [el.__data__.location.coords[0].longitude, el.__data__.location.coords[0].latitude];
                    l2 = _this.projection(bCoords);
                    op = 0.15;
                    colA = [255, 255, 0, op];
                    colB = [255, 0, 0, op];
                    grad = _this.context.createLinearGradient(l1[0], l1[1], l2[0], l2[1]);
                    grad.addColorStop('0', 'rgba(' + colA.join(',') + ')');
                    grad.addColorStop('1', 'rgba(' + colB.join(',') + ')');
                    x1 = l2[0] - l1[0];
                    x1 = x1 * x1;
                    y1 = l2[1] - l1[1];
                    y1 = y1 * y1;
                    dist = Math.sqrt(x1 + y1);
                    dist /= 3;
                    _this.context.save();
                    _this.context.beginPath();
                    _this.context.lineWidth = '0.85';
                    _this.context.strokeStyle = grad;
                    _this.context.moveTo(l1[0], l1[1]);
                    _this.context.bezierCurveTo(l1[0] + dist, l1[1] - dist, l2[0] - dist, l2[1] - dist, l2[0], l2[1]);
                    _this.context.stroke();
                    return _this.context.restore();
                  };
                  return d[0].forEach(_g);
                };
                return _this.canvas.select('canvas').data(_this[_this.lines[1]]).enter().call(cb);
              };
              return d[0].forEach(_f);
            };
            this.canvas.select('canvas').data(this[this.lines[0]]).enter().call(fn);
            _results.push(null);
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    };

    Map.prototype.onMarkerMouseOver = function(d) {
      return EventManager.emitEvent(Events.MARKER_FOCUS, [d]);
    };

    Map.prototype.fillNeighbors = function(d, i) {
      var a, b, colorString, fn, g, r,
        _this = this;
      fn = function(n) {
        return _this.countries[n].color;
      };
      r = i - 50;
      b = i;
      g = i + 0;
      a = 0.6;
      colorString = 'rgba(' + [r, g, b, a].join(',') + ')';
      return 'rgba(225,225,255,0.8)';
    };

    Map.prototype.drawCountries = function() {
      switch (this.renderer) {
        case 'svg':
          return this.group.selectAll('.country').data(this.countries).enter().insert('path', '.graticule').attr('class', 'country').attr('d', this.path).style('fill', this.fillNeighbors).style('stroke', 'rgba(100,100,255,1)');
        case 'canvas':
          this.context.save();
          this.context.fillStyle = 'rgba( 255, 255, 255, 0.5 )';
          this.context.lineWidth = '0.2px';
          this.context.strokeStyle = 'rgba( 0, 0, 0, 0.7 )';
          this.context.beginPath();
          this.context.fill();
          this.path(this.countries);
          this.context.fill();
          this.path(this.neigbors);
          this.context.stroke();
          return this.context.restore();
      }
    };

    Map.prototype.onMouseMove = function() {
      var m;
      return m = d3.mouse(this);
    };

    Map.prototype.onMouseWheel = function(e) {
      var m;
      return m = d3.event.wheelDeltaY;
    };

    Map.prototype.onLocationReceived = function(err, data) {
      var city, country, loc, obj, state;
      console.log(data[0] != null);
      if (data[0] != null) {
        country = data[0].country;
        if (country === 'United States') {
          if (data[0].city != null) {
            city = data[0].city;
            city += ', ';
          }
        }
        state = data[0].state;
        loc = '';
        loc += country + ', ';
        if (city != null) {
          loc += city;
        }
        loc += state;
        console.log(loc);
        obj = {
          location: loc,
          latitude: data[0].longitude,
          longitude: data[0].latitude
        };
        return EventManager.emitEvent(Events.MAP_CLICKED, [obj]);
      }
    };

    Map.prototype.onMouseDownHandler = function() {
      var c, coords, geo_loc, l, m, str,
        _this = this;
      console.log('mousedown');
      m = d3.event;
      coords = [m['offsetX'], m['offsetY']];
      geo_loc = this.projection.invert(coords);
      str = '/location/' + geo_loc.join('/') + '/';
      d3.json(str, this.onLocationReceived);
      switch (this.renderer) {
        case 'svg':
          c = this.group.append('circle').attr('r', this.markerSize).attr('fill', 'rgba(150,100,0,0.8)').attr('transform', function(d) {
            return 'translate(' + coords.join(',') + ')';
          });
          return l = this.group.selectAll('group').data(this.data).enter().append('path').attr('d', function(d) {
            var _d;
            _d = d.location.coords[0] || d.location;
            m = 'M' + coords.join(' ');
            l = 'L' + _this.projection([_d['longitude'], _d['latitude']]).join(' ');
            return [m, l].join(' ');
          }).attr('stroke', 'rgba(0,0,250,0.2)').attr('stroke-width', '1').attr('fill', 'none');
      }
    };

    Map.prototype.zoomed = function() {
      switch (this.renderer) {
        case 'svg':
          return this.updateSVG(d3.event.translate, d3.event.scale);
        case 'canvas':
          return this.updateCanvas(d3.event.translate, d3.event.scale);
      }
    };

    Map.prototype.updateSVG = function(pos, scale) {
      var _str;
      _str = 'matrix(' + scale + ',0,0,' + scale + ',' + pos.join(',') + ')';
      return this.group.attr('transform', _str);
    };

    Map.prototype.updateCanvas = function(pos, scale) {
      var _str;
      _str = 'translate(' + pos.join(',') + ')scale(' + scale + ')';
      this.context.save();
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.translate(pos[0], pos[1]);
      this.context.scale(scale[0], scale[1]);
      this.drawMap();
      return this.context.restore();
    };

    Map.prototype.createProjection = function() {
      return this.projection = this.projector[this.projectionType]().scale(this.scale).translate([(this.width / 2) - this.xOffset, (this.height / 2) - this.yOffset]).rotate(this.startRotation).precision(.25);
    };

    Map.prototype.createPath = function() {
      switch (this.renderer) {
        case 'canvas':
          return this.path = d3.geo.path().projection(this.projection).context(this.context);
        case 'svg':
          return this.path = d3.geo.path().projection(this.projection);
      }
    };

    Map.prototype.drawPointsOnCanvas = function() {
      var d, i, n, p, _results;
      if (this.data == null) {
        return;
      }
      i = -1;
      n = this.data.length - 1;
      _results = [];
      while (++i < n) {
        d = this.data[i];
        _results.push(p = this.projection([d.tour_lat, d.tour_lon]));
      }
      return _results;
    };

    Map.prototype.update = function() {
      return this.drawMap();
    };

    Map.prototype.onDataRead = function(error, world) {
      if (this.renderer === 'canvas') {
        this.countries = topojson.feature(world, world.objects[this.COUNTRIES]);
      } else {
        this.countries = topojson.feature(world, world.objects[this.COUNTRIES]).features;
      }
      this.neighbors = topojson.neighbors(world.objects[this.COUNTRIES].geometries);
      this.createProjection();
      this.createPath();
      this.drawMap();
      return EventManager.emitEvent(Events.MAP_LOADED);
    };

    return Map;

  })();

  SocketClient = (function() {
    SocketClient.prototype.socket = null;

    function SocketClient(host, type) {
      this.host = host;
      this.type = type;
      this.onLocationsLoaded = __bind(this.onLocationsLoaded, this);
      this.onConnectionHandler = __bind(this.onConnectionHandler, this);
      this.onReceiveHandler = __bind(this.onReceiveHandler, this);
      this.onLocationHandler = __bind(this.onLocationHandler, this);
      this.createSocketConnection();
    }

    SocketClient.prototype.createSocketConnection = function() {
      var opts, url;
      opts = {
        port: Config.port
      };
      console.log(location.origin);
      url = location.origin;
      opts = {
        'transports': ['xhr-polling']
      };
      this.socket = io.connect(url, opts);
      return this.addListeners();
    };

    SocketClient.prototype.addListeners = function() {
      switch (this.type) {
        case 'user':
          this.socket.on('location', this.onLocationHandler);
          break;
        case 'server':
          this.socket.on('receiveResponse', this.onReceiveHandler);
          this.socket.on('locationsLoaded', this.onLocationsLoaded);
      }
      this.socket.on('connection', this.onConnectionHandler);
      this.socket.on('connect', this.connect);
      this.socket.on('data', this.data);
      return this.socket.on('error', this.error);
    };

    SocketClient.prototype.connect = function(data) {
      return console.info('Successfully established a working connection');
    };

    SocketClient.prototype.data = function(data) {
      return console.log(data);
    };

    SocketClient.prototype.error = function(error) {
      return console.log(error);
    };

    SocketClient.prototype.onLocationHandler = function(data) {
      var cb,
        _this = this;
      cb = function(data) {
        var opts;
        opts = {
          location: {
            title: data.location,
            coords: [
              {
                latitude: data.longitude,
                longitude: data.latitude
              }
            ]
          }
        };
        return _this.socket.emit('gps', opts);
      };
      EventManager.addListener(Events.MAP_CLICKED, cb);
      console.info('Received location event');
      return console.log(data);
    };

    SocketClient.prototype.onReceiveHandler = function(data) {
      return EventManager.emitEvent(Events.SERVER_UPDATED, [data]);
    };

    SocketClient.prototype.onConnectionHandler = function(socket) {
      return console.log(socket);
    };

    SocketClient.prototype.onLocationsLoaded = function(data) {
      var loc, obj, objects, _locs;
      obj = JSON.parse(JSON.parse(data));
      objects = [];
      if (obj != null) {
        for (loc in obj.locations) {
          _locs = JSON.parse(obj.locations[loc]);
          objects.push(_locs);
        }
        return EventManager.emitEvent(Events.SERVER_STARTED, [objects]);
      }
    };

    return SocketClient;

  })();

  TGS = (function() {
    TGS.prototype.flickrSrc = Config.TGS.src;

    TGS.prototype.studentsSrc = Config.TGS.students_src;

    TGS.prototype.JSON_PATH = null;

    TGS.prototype.speed = 1e-2;

    TGS.prototype.mapHeight = null;

    TGS.prototype.mapWidth = null;

    TGS.prototype.velocity = null;

    TGS.prototype.scale = null;

    TGS.prototype.projectionKey = null;

    TGS.prototype.rotation = null;

    TGS.prototype.hasRotation = null;

    TGS.prototype.hasLines = null;

    TGS.prototype.hasGrid = null;

    TGS.prototype.origin = 0;

    TGS.prototype.start = null;

    TGS.prototype.map = null;

    TGS.prototype.bookingInformation = null;

    TGS.prototype.renderer = null;

    TGS.prototype.mapContainer = null;

    TGS.prototype.svg = null;

    TGS.prototype.container = null;

    TGS.prototype.loader = null;

    function TGS() {
      this.onMarkerFocused = __bind(this.onMarkerFocused, this);
      this.onBookingLoaded = __bind(this.onBookingLoaded, this);
      this.onMapLoaded = __bind(this.onMapLoaded, this);
      this.loop = __bind(this.loop, this);
      this.changeTitle = __bind(this.changeTitle, this);
      var url;
      this.loadFromConfig();
      url = 'http://' + window.location.hostname + '/';
      this.mapHeight = this.mapHeight || $(window).height();
      this.mapWidth = this.mapWidth || $(window).width();
      this.loader = $('#loader-container');
      this.socket = new SocketClient(url, Config.userType);
      this.start = Date.now();
      this.title = $('#location-title');
      $(this.mapContainer).css({
        width: this.mapWidth,
        height: this.mapHeight
      });
      this.addListeners();
      this.createMap();
    }

    TGS.prototype.changeTitle = function(event) {
      var _this = this;
      console.log(event);
      console.log(this.title);
      this.title.animate({
        'opacity': 1
      }, 'fast', function() {
        return _this.title.delay(1100).animate({
          opacity: 0
        }, 'slow');
      });
      return this.title.html('<p>' + event.location.title + '</p>');
    };

    TGS.prototype.loadFromConfig = function() {
      this.mapHeight = Config[Config.userType].Map.height;
      this.mapWidth = Config[Config.userType].Map.width;
      this.velocity = Config[Config.userType].Map.velocity / 1000;
      this.scale = Config[Config.userType].Map.scale;
      this.projectionKey = Config[Config.userType].Map.projectionKey;
      this.rotation = Config[Config.userType].Map.rotation;
      this.renderer = Config[Config.userType].Settings.renderer;
      this.hasRotation = Config[Config.userType].Settings.hasRotation;
      this.hasLines = Config[Config.userType].Settings.hasLines;
      this.hasGrid = Config[Config.userType].Settings.hasGrid;
      this.renderer = Config[Config.userType].Settings.renderer;
      this.mapContainer = Config[Config.userType].Map.container;
      return this.JSON_PATH = Config[Config.userType].Settings.jsonPath;
    };

    TGS.prototype.startRotation = function() {
      var framerate,
        _this = this;
      framerate = 1000 / 60;
      return setInterval((function() {
        return _this.loop();
      }), framerate);
    };

    TGS.prototype.loop = function() {
      if (this.renderer === 'canvas') {
        this.map.context.clearRect(0, 0, this.mapWidth, this.mapHeight);
      }
      this.map.projection = this.map.projection.rotate([this.origin + this.velocity * (Date.now() - this.start), -15]);
      this.map.drawMap();
      this.map.createPoints('students', this.studentData, 'blue');
      this.map.createPoints('flickr', this.flickrData, 'red');
      if (this.hasLines) {
        return this.map.drawLines(['students', 'flickr']);
      }
    };

    TGS.prototype.onTGSFlickrDataLoaded = function(flickrData) {
      this.flickrData = flickrData;
      this.map.createPoints('flickr', this.flickrData, 'red');
      return d3.json(this.studentsSrc, _.bind(this.onTGSStudentsDataLoaded, this));
    };

    TGS.prototype.onTGSStudentsDataLoaded = function(studentData) {
      this.studentData = studentData;
      this.map.createPoints('students', this.studentData, 'blue');
      if (this.hasLines) {
        this.map.drawLines(['students', 'flickr']);
      }
      if (this.renderer === 'canvas' && this.hasRotation) {
        return this.startRotation();
      }
    };

    TGS.prototype.createBookingData = function() {
      return this.booking = new Booking(this.CSV_PATH);
    };

    TGS.prototype.addListeners = function() {
      EventManager.addListener(Events.MAP_LOADED, this.onMapLoaded);
      return EventManager.addListener(Events.SERVER_UPDATED, this.changeTitle);
    };

    TGS.prototype.onMapLoaded = function() {
      this.loader.remove();
      return d3.json(this.flickrSrc, _.bind(this.onTGSFlickrDataLoaded, this));
    };

    TGS.prototype.onBookingLoaded = function(event) {
      this.map.createPoints(this.booking.data);
      this.bookingInformation = new BookingInformation();
      return EventManager.addListener(Events.MARKER_FOCUS, this.onMarkerFocused);
    };

    TGS.prototype.onMarkerFocused = function(event) {
      this.bookingInformation.changeTourTitle(event.booking_id);
      this.bookingInformation.changeTourCityTitle(event.tour_address);
      return this.bookingInformation.changeBookerCityTitle(event.booker_country);
    };

    TGS.prototype.createMap = function() {
      this.map = new Map(this.JSON_PATH, this.mapWidth, this.mapHeight, this.mapContainer, this.renderer, this.scale, this.projectionKey, this.hasGrid, this.rotation);
      if (this.hasGrid) {
        return this.map.hasGrid = true;
      }
    };

    return TGS;

  })();

  $(document).ready((function() {
    return new TGS();
  }));

}).call(this);
