// Generated by CoffeeScript 1.6.3
(function() {
  var DevConsole, init,
    _this = this;

  DevConsole = (function() {
    DevConsole.prototype.option = {
      mode: 'coffeescript',
      lineNumbers: 'true',
      keyMap: 'vim',
      theme: 'night',
      lineWrapping: true,
      autoMatchParens: false,
      passDelay: 50,
      path: 'javascripts/',
      tabMode: 'shift'
    };

    DevConsole.prototype.container = null;

    DevConsole.prototype.size = null;

    function DevConsole(element) {
      this.element = element;
      this.container = document.getElementById('dev');
      this.setUpContainer();
      this.setUpCodeMirror();
    }

    DevConsole.prototype.setUpContainer = function() {
      return this.setContainerSize();
    };

    DevConsole.prototype.setContainerSize = function() {
      this.size = {
        width: this.getWidth(),
        height: this.getHeight() / 2
      };
      return $(this.container).css(this.size);
    };

    DevConsole.prototype.setUpCodeMirror = function() {
      this.option.content = this.element.value;
      this.codeMirror = CodeMirror.fromTextArea(this.element, this.option);
      this.codeMirror.setValue('# CoffeeScript');
      return console.log(this.codeMirror);
    };

    DevConsole.prototype.getWidth = function() {
      return $(window).width();
    };

    DevConsole.prototype.getHeight = function() {
      return $(window).height();
    };

    return DevConsole;

  })();

  init = function() {
    var element;
    console.log('dev');
    element = document.getElementById('codem');
    return new DevConsole(element);
  };

  $(document).ready((function() {
    return init();
  }));

}).call(this);
