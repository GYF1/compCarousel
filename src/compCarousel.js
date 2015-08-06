(function (root, doc) {
  'use strict';

  var compCarousel = {}, utils = {}, pageNums = [], timer;

  //get first child skip TextNodes
  utils.getFirstChild = function (el) {
    var firstChild = el.firstChild;
    while (firstChild !== null && firstChild.nodeType === 3) {
      firstChild = firstChild.nextSibling;
    }
    return firstChild;
  };

  utils.extend = function (dest, src) {
    for (var property in src) {
      dest[property] = src[property];
    }
    return dest;
  };

  utils.currentStyle = function (element) {
    return element.currentStyle || doc.defaultView.getComputedStyle(element, null);
  };

  utils.bind = function (object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function () {
      return fun.apply(object, args.concat(Array.prototype.slice.call(arguments)));
    };
  };

  function CarouselClass(container, options) {

    this._container = doc.getElementById(container);
    this._slider = utils.getFirstChild(this._container);

    //切换数量
    this._count = Math.abs(this._slider.children.length);

    //定时器
    this._timer = null;

    //目标值
    this._target = 0;

    //tween参数
    this.moveTimeCounter = this.currentPosition = this.moveDistance = 0;

    //当前索引
    this.Index = 0;

    this.setOptions(options);

    this.Auto = !!this.options.Auto;
    this.Duration = Math.abs(this.options.Duration);
    this.Time = Math.abs(this.options.Time);
    this.Pause = Math.abs(this.options.Pause);

    //样式设置
    var p = utils.currentStyle(this._container).position;

    //如果不是相对或绝对定位会同时设置position为relative
    p === 'relative' || p === 'absolute' || (this._container.style.position = 'relative');

    //程序会自动设置容器overflow为hidden
    this._container.style.overflow = 'hidden';

    //滑动对象会设置为绝对定位
    this._slider.style.position = 'absolute';

    //如果没有设置Change切换参数属性，会自动根据滑动对象获取：
    this.stepSize = this._slider.offsetHeight / this._count;
  }

  CarouselClass.prototype = {
    /**
     * @param timeUsed  时间，滑动已经用掉的时间，还有个d变量会保存允许滑动的时间
     * @param currentPosition  初始值，当前的图片位置
     * @param distance  变化量，目标要到的位置和现在位置的距离
     * @param duration  允许的滑动时间总值
     * @returns {*}
     */
    tween: function (timeUsed, currentPosition, distance, duration) {
      return -distance * ((timeUsed = timeUsed / duration - 1) * timeUsed * timeUsed * timeUsed - 1) + currentPosition;
    },

    setOptions: function (options) {
      this.options = {
        Auto: true,
        //滑动持续时间, 也就是从一张图变成另一张图的一共的滑动时间
        Duration: 50,
        //移动完一小步后停顿下
        Time: 10,
        //每当一个完整图片滑动完了，停顿下
        Pause: 2000
      };
      utils.extend(this.options, options || {});
    },

    run: function (index) {
      index === undefined && (index = this.Index);
      index < 0 && (index = this._count - 1) || index >= this._count && (index = 0);

      this._target = -Math.abs(this.stepSize) * (this.Index = index);
      this.moveTimeCounter = 0;
      this.currentPosition = parseInt(utils.currentStyle(this._slider).top);
      this.moveDistance = this._target - this.currentPosition;

      for (var i = 0, len = pageNums.length; i < len; i++) {
        if (this.Index === i) {
          pageNums[i].className = 'active';
        } else {
          pageNums[i].className = '';
        }
      }

      this.move();
    },

    /**
     * 切换一个图片的时候，这个方法会被多次的调用
     * 从而形成图片有切换的动态效果
     *
     * Duration(持续时间)是自定义属性。
     * 参数设置好后就执行Move程序开始移动了。
     * 里面很简单，首先判断_c是否有值（等于0表示不需要移动）和_t是否到达Duration，
     * 未满足条件就继续移动，否则直接移动到目标值并进行下一次切换：
     */
    move: function () {
      clearTimeout(this._timer);
      if (this.moveDistance && this.moveTimeCounter < this.Duration) {
        var tweenval = this.tween(this.moveTimeCounter++, this.currentPosition, this.moveDistance, this.Duration);
        this.moveSomeDistance(Math.round(tweenval));
        this._timer = setTimeout(utils.bind(this, this.move), this.Time);
      } else {
        this.moveSomeDistance(this._target);
        this.Auto && (this._timer = setTimeout(utils.bind(this, this.next), this.Pause));
      }
    },

    moveSomeDistance: function (i) {
      this._slider.style.top = i + 'px';
    },

    next: function () {
      this.run(++this.Index);
    },

    addPageNumbers: function () {
      var that = this;
      var ulPageNums = doc.createElement('ul');

      ulPageNums.id = 'idNum';
      ulPageNums.className = 'num';

      this._container.appendChild(ulPageNums);

      function addNum(i) {
        var num = doc.getElementById('idNum').appendChild(doc.createElement('li'));
        num.innerHTML = i + 1;
        num.onmouseover = function () {
          timer = setTimeout(function () {
            num.className = 'active';
            that.Auto = false;
            that.run(i);
          }, 200);
        };
        num.onmouseout = function () {
          clearTimeout(timer);
          num.className = '';
          that.Auto = true;
          that.run();
        };
        pageNums[i] = num;
      }

      for (var i = 0; i < this._count; i++) {
        addNum(i);
      }
    }
  };

  compCarousel.init = function (container, options) {
    var carouselInstance = new CarouselClass(container, options);
    carouselInstance.addPageNumbers();
    carouselInstance.run();
  };

  root.compCarousel = compCarousel;
})(window, document);
