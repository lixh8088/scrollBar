/**
 * 
 * @authors lixh
 * @date    2018-03-28 13:59:16
 * @email: lixh.xingyuanauto.com
 * @version: 1.0
 */


(function($) {
    jQuery.fn.extend({
        scrollBar: function(option) {
            // 配置项
            var defaults = {
                width: 1000,
                height: 300,
                // 滚动条类型：h水平 v垂直
                orient: 'v',
                // 滚动条位置 top bottom left right
                position: 'right',
                scrollDistance: 10,//鼠标滚动一次或者键盘按一次滚动的距离（px）
                wrapperClass: 'ScrollDiv',
                railClass: 'scrollRail',
                barClass: 'scrollBar',
                keyEvent:true,//是否支持键盘事件
                barShow:true,//是否显示滚动条
                isFadeOut:false,//隐藏滚动条，鼠标移上是否淡入(支持IE9以上)
                wrapperBorderColor:'#e1e1e1',
                barColor:'rgba(0, 0, 0, 0.2)',
                barSize:8,//滚动条的宽或高
                barRadius:'',
                railColor:'transparent',
                railSize:10//滚动轴的宽或高
            };

            // 更新配置
            var o = $.extend(defaults, option);

            var Divs = "<div></div>",
                me = this;

            // 样式设置
            var wrapper = $(Divs).addClass(o.wrapperClass);
            var rail = $(Divs).addClass(o.railClass);
            var bar = $(Divs).addClass(o.barClass);
            
            setStyle();
            me.wrap(wrapper);
            me.parent().append(rail);
            me.parent().append(bar);

            var bar = $('.' + o.barClass),
                rail = $('.' + o.railClass);

            // 滚动条的拖动
            bar.on('mousedown', function(e) {
                e.stopPropagation();
                e.preventDefault();
                $('body').css('cursor', 'pointer');
                var priDistance = getCurrentDistance();
                $(document).mousemove(function(eve) {   
                    scrollContent(computeDistance(e, eve, priDistance, 2));
                });
            });
            $(document).on('mouseup', function(e) {
                e.stopPropagation();     
                $(document).off('mousemove');
                $('body').css('cursor', 'default'); 
            }).on('mouseleave',function(e){
                console.log(111);
                e.stopPropagation();     
                $(document).off('mousemove');
                $('body').css('cursor', 'default'); 
            });

            me.on('mouseenter',function(){
                if(!o.barShow && o.isFadeOut){
                    bar.css('opacity',1);
                }
            }).on('mouseleave',function(){
                if(!o.barShow && o.isFadeOut){
                    bar.css('opacity',0);
                }
            });
            me.on('mouseover', function(e) {
                e.stopPropagation();
                var priDistance;
                if (o.orient == 'h') {
                    priDistance = bar.position().left;
                } else if (o.orient == 'v') {
                    priDistance = bar.position().top;
                }

                // 鼠标滚轮事件
                // 非FF
                document.body.onmousewheel = function(event) {
                    event.preventDefault();
                    event = event || window.event;
                    scrollContent(computeDistance(e, event, priDistance, 1));
                }
                // FF
                document.body.addEventListener("DOMMouseScroll", function(event) {
                    event.preventDefault();
                    scrollContent(computeDistance(e, event, priDistance, 1));
                });
                // 键盘方向键
                $(document).off('keydown').on('keydown',function(event){
                    if(o.keyEvent){
                        event.preventDefault();
                        event.stopPropagation();
                        scrollContent(computeDistance(e, event, priDistance, 3));
                    }
                });
            });

            function setStyle(){
                me.css({
                    position: 'absolute',
                    left: 0,
                    top: 0
                });
                wrapper.css({
                    width: o.width+'px',
                    height: o.height+'px',
                    overflow: 'hidden',
                    position: 'relative',
                    border:'1px solid '+o.wrapperBorderColor
                });
                bar.css({
                    backgroundColor: o.barColor,
                    borderRadius: o.barRadius?o.barRadius+'px': Math.ceil(o.barSize/2)+'px',
                    cursor: 'pointer',
                    opacity:o.barShow?1:0,
                    position: 'absolute',
                    transition:'opacity 0.5s'
                });
                rail.css({
                    backgroundColor: o.railColor,
                    position: 'absolute',
                });
                if (o.orient == 'h') {
                    rail.css({
                        width:o.width+'px',
                        height:o.railSize+'px',
                        left: 0,
                        top: (o.position == 'bottom') ? 'auto' : 0,
                        bottom: (o.position == 'bottom') ? 0 : 'auto',

                    });
                    bar.css({
                        height: o.barSize+'px',
                        width: Math.floor(parseInt(o.width) * parseInt(o.width) / me.width()),
                        left: 0,
                        right: 'auto',
                        top: (o.position == 'bottom') ? 'auto' : Math.ceil(railSize-barSize)/2+'px',
                        bottom: (o.position == 'bottom') ? Math.ceil(o.railSize-o.barSize)/2+'px' : 'auto',

                    });
                } else if (o.orient == 'v') {
                    rail.css({
                        width:o.railSize+'px',
                        height: o.height,
                        left: (o.position == 'left') ? 0 : 'auto',
                        right: (o.position == 'left') ? 'auto' : 0,
                        top: 0,
                        bottom: 'auto',

                    });
                    bar.css({
                        width: o.barSize+'px',
                        height: Math.floor(parseInt(o.height) * parseInt(o.height) / me.outerHeight(true)),
                        left: (o.position == 'left') ? Math.ceil(o.railSize-o.barSize)/2+'px' : 'auto',
                        right: (o.position == 'left') ? 'auto' : Math.ceil(o.railSize-o.barSize)/2+'px',
                        top: 0,
                        bottom: 'auto',

                    });
                }
            }
            /*
                计算内容滚动距离
                @isWheel:1(滚轮事件)，2(鼠标拖动滚动条),3(键盘控制)
            */
            function computeDistance(e, eve, priDistance, isWheel) {
                var distance = {
                    scrollDistance: null,
                    barDistance: null
                };

                var positionDiv, distenceX, distenceY, x, y, maxX, maxY, distance, scrollDistance, barDistance;
                maxX = rail.outerWidth(true) - bar.outerWidth(true);
                maxY = rail.outerHeight(true) - bar.outerHeight(true);
                if (isWheel == 1) {//鼠标滚轮
                    if (o.orient == 'h') {
                        priDistance = bar.position().left;
                    } else if (o.orient == 'v') {
                        priDistance = bar.position().top;
                    }
                    if (eve.wheelDelta) { //非FF
                        if (eve.wheelDelta > 0) {
                            y = priDistance - o.scrollDistance
                        } else {
                            y = priDistance + o.scrollDistance
                        }
                    } else if (eve.detail) { //FF
                        if (eve.detail > 0) {
                            y = priDistance + o.scrollDistance
                        } else {
                            y = priDistance - o.scrollDistance
                        }

                    }
                } else if(isWheel == 2){ //鼠标拖动
                    positionDiv = rail.offset();  
                    distenceX = e.pageX - positionDiv.left;
                    distenceY = e.pageY - positionDiv.top; //原本的top值
                    x = eve.pageX - distenceX - positionDiv.left + priDistance;
                    y = eve.pageY - distenceY - positionDiv.top + priDistance;
                }else if(isWheel == 3){//键盘控制
                    if (o.orient == 'h') {
                        priDistance = bar.position().left;
                    } else if (o.orient == 'v') {
                        priDistance = bar.position().top;
                    }
                    if (o.orient == 'h') {
                        switch(eve.keyCode){
                            case 37://左
                                x = priDistance - o.scrollDistance;
                                break;
                            case 38://上
                                y = 0
                                break;
                            case 39://右
                                x=priDistance + o.scrollDistance;
                                break;
                            case 40://下
                                y = 0;
                                break;
                        }
                    } else if (o.orient == 'v') {
                        switch(eve.keyCode){
                            case 37://左
                                x = 0;
                                break;
                            case 38://上
                                y = priDistance - o.scrollDistance
                                break;
                            case 39://右
                                x=0;
                                break;
                            case 40://下
                                y = priDistance + o.scrollDistance
                                break;
                        }
                        priDistance = bar.position().top;
                    }
                }
                if (x < 0) {        
                    x = 0;      
                } else if (x > maxX) { 
                    x = maxX;      
                }
                if (y < 0) {        
                    y = 0;      
                } else if (y > maxY) { 
                    y = maxY;      
                }

                if (o.orient == 'h') {
                    scrollDistance = Math.ceil(x / rail.outerWidth(true) * me.outerWidth(true));
                    barDistance = x;
                } else if (o.orient == 'v') {
                    scrollDistance = Math.ceil(y / rail.outerHeight(true) * me.outerHeight(true));
                    barDistance = y;
                }
                distance = {
                    scrollDistance: scrollDistance,
                    barDistance: barDistance
                };

                return distance;
            }
            /*
                滚动内容
                @distance:滚动条移动的距离
            */
            function scrollContent(distance) {
                if (o.orient == 'h') {
                    me.css({
                        left: -distance.scrollDistance + 'px'
                    });
                    bar.css({
                        left: distance.barDistance + 'px'
                    });
                } else if (o.orient == 'v') {
                    me.css({
                        top: -distance.scrollDistance + 'px'
                    });
                    bar.css({
                        top: distance.barDistance + 'px'
                    });
                }
            }

            function getCurrentDistance() {
                if (o.orient == 'h') {
                    return bar.position().left;
                } else if (o.orient == 'v') {
                    return bar.position().top;
                }
            }
        }
    });

    jQuery.fn.extend({
        scrollBar: jQuery.fn.scrollBar
    });

})(jQuery);