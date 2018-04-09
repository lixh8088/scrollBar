# scrollBar
首先download下来插件，并引入scrollBar.js(基于jquery)<br>
然后初始化滚动条 $('domClass').scrollBar();

配置项：        width: 1000,<br>
                height: 500,<br>
                orient: 'v',// 滚动条类型：h水平 v垂直<br>
                position: 'right',// 滚动条位置 top bottom left right<br>
                scrollDistance: 10,//鼠标滚动一次或者键盘按一次滚动的距离（px）<br>
                wrapperClass: 'ScrollDiv',<br>
                railClass: 'scrollRail',<br>
                barClass: 'scrollBar',<br>
                keyEvent:true,//是否支持键盘事件<br>
                barShow:true,//是否显示滚动条<br>
                isFadeOut:false,//隐藏滚动条，鼠标移上是否淡入(支持IE9以上)<br>
                wrapperBorderColor:'#e1e1e1',<br>
                barColor:'rgba(0, 0, 0, 0.2)',<br>
                barSize:8,//滚动条的宽或高<br>
                barRadius:'',<br>
                railColor:'transparent',<br>
                railSize:10//滚动轴的宽或高<br>
