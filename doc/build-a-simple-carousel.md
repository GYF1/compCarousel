title: 'build a simple carousel'
date: 2015-05-28 13:58:59
categories: JavaScript
tags: Practices

---

[Demo]()


### 首先要有一个容器，容器里面放图片，但是每次只显式一张图片
实现思路：
每次显示一张的方法有：
1. 固定容器大小，大小和一张图片的大小一样，然后通过控制每张图片的position来切换图片
2. 通过display属性，控制显式与否

实现中觉得第1种方法更好，第1种在切换位置的时候，可以做动态过渡效果。
第2种方法要做过渡效果，可能就需要用css3来做动画了

代码实现：
0. 外面一个大容器，里面两个小容器，一个是图片显式，一个是图片页码的显式
1. 容器的overflow设为hidden，这样固定宽度和高度后，其他的图片会被隐藏
2. 图片子容器的position设为absolute, 这样才可以通过top属性改变显式的图片
3. 父容器的position必须要是relative或者absolute, 这样容器里面的子容器，设置完absolute才可以把位置控制在父容器里面，不然直接会以浏览器窗口的位置显式子容器。
而且父元素设置的高度和宽度也才会起作用。不然图片还是会全部显示，脱离了父元素的限制。


### 每切换一次，相当于改变一下top的位置
每次改变的高度是根据单张图片的高度决定的
第一次为top:0, 第二次为top:-(height), 依此类推
所以我们可以通过 (图片index * 图片height) 算出的值决定显示哪张图片


### 切换的动画效果
上面移动的是一个目标的位置，但是为了出现滑动效果，我们可以在每一页里再细化移动的距离。
一点点的移动，就会给人滑动的效果。

滑动效果用到的计算参数
现在的位置
目标的位置
滑动的时间

这里使用了Tween的算法

    tween: function (timeUsed, currentPosition, distance, duration) {
      return -distance * ((timeUsed = timeUsed / duration - 1) * timeUsed * timeUsed * timeUsed - 1) + currentPosition;
    }
    








# THANKS
[JavaScript 图片滑动展示效果](http://www.cnblogs.com/cloudgamer/archive/2008/05/13/1194272.html)




http://www.cnblogs.com/cloudgamer/archive/2008/07/06/SlideTrans.html
http://www.cnblogs.com/cloudgamer/archive/2008/05/13/1194272.html
http://www.cnblogs.com/cloudgamer/archive/2009/01/06/Tween.html
http://www.lanrentuku.com/js/jiaodiantu-330.html
http://jsfiddle.net/M8GhH/1/
http://stackoverflow.com/questions/26818180/pure-javascipt-carousel-restricting-style-left-value-change-to-dynamic-max-val
http://cssdeck.com/labs/image-slider-1
http://www.cssscript.com/a-minimal-carousel-javascript-library/


    实现要求:
    
    1. 从左往右，图片往上滚动
    
    2. 从右往左，图片往下滚动
    
    
    实现细节：
    1. container的宽度和高度写死，overflow设置为hidden，默认只能显式一张图片
    
    
    
    
    
    # Options:
    
    ## Vertical
    type: boolean
    
    ## Auto
    type: boolean
