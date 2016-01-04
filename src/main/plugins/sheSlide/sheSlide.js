/**
 * [SheSlide description]
 * @description 轮播
 */

;(function(undefined) {

    "use strict";
	var SheSlide = function(o){
		
		o = o || {};

		var result = {};
		var opts = {
			slideCell : o.slideCell,
			isV: o.isV || false,
			auto: o.auto || false,
			autoTime: o.autoTime || 6000,
			unResize: o.unResize || false,
			titCell:o.titCell || ".J__foot li", // 导航对象，当自动分页设为true时为“导航对象包裹层”
			mainCell:o.mainCell || ".J__main", // 切换对象包裹层
			delayTime:o.delayTime || 600, // 效果持续时间
			defaultIndex:o.defaultIndex || 0, // 默认的当前位置索引。0是第一个； defaultIndex:1 时，相当于从第2个开始执行
			titOnClassName:o.titOnClassName || "on", // 当前导航对象添加的className
			prevCell:o.prevCell || ".prev", // 前一页按钮
			nextCell:o.nextCell || ".next", // 后一页按钮
			startFun:o.startFun || null, // 每次切换效果开始时执行函数，用于处理特殊情况或创建更多效果。用法 satrtFun:function(i,c){ }； 其中i为当前分页，c为总页数
			endFun:o.endFun || null, // 每次切换效果结束时执行函数，用于处理特殊情况或创建更多效果。用法 endFun:function(i,c){ }； 其中i为当前分页，c为总页数
		}

		var $slideCell = $(opts.slideCell);
		if( $slideCell.length === 0 ) return false;

		var $conBox, $conBox_child, $titCell,
			isIE = document.all ? true : false,

			// 当前页数
			index = 0,

			// 每页的长度
			slideDistant,

			// 总页数
			size,

			// 自动翻页定时器
			timeI;

		// 初始化
		var init = function(flag){
			$conBox = $slideCell.find(opts.mainCell);
			$conBox_child = $conBox.children();
			$titCell = $slideCell.find(opts.titCell);
			$conBox.css({width:"100%", height:"100%"});
			$conBox_child.css({width:"100%", height:"100%"});
			!opts.isV && $conBox_child.css("float", "left");
			if (isIE) {
				$conBox.css({"position":"relative"});
			}

			setSize();
			!flag && setEvent();
	    	!flag && doPlay(opts.defaultIndex, 0);
			!flag && doFun(0);

		}

		// 设置宽高度
		var setSize = function(){
			slideDistant = !opts.isV ? document.documentElement.clientWidth : $conBox.parent().height();
			size = $conBox_child.length;
			if (!opts.isV) {
				$conBox.css({width: size * slideDistant + "px"});
				$conBox_child.css({width: slideDistant + "px"});
			} else {
				$conBox.css({height: size * slideDistant});
				$conBox_child.css({height: slideDistant});
			}
		}

		// 处理事件
		var setEvent = function(){
			var oldAuto = opts.auto;
			
			$titCell.on("click", function(){
				var i = $titCell.index($(this));
				doPlay(i);
			});
			$slideCell.find(opts.prevCell).on("click", function(){
				var k = index;
				doPlay(--k);
			});
			$slideCell.find(opts.nextCell).on("click", function(){
				var k = index;
				doPlay(++k);
			});

			var event_start_name = "mousedown touchstart",
				event_move_name = "mousemove touchmove",
				event_end_name = "mouseup touchend", 
				flag = false,
				startX = 0, startY = 0,
				distD = 0;
			$conBox.on(event_start_name, function(e){
				var point =  (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : e.touches ? e.touches[0] : e;
		        startX =  point.pageX;
		        startY =  point.pageY;
		        flag = true;
		        // e.preventDefault();
			});
			$(document).on(event_move_name, function(e){
				if (!flag) return;
		        e.preventDefault();

				var point =  (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : e.touches ? e.touches[0] : e,
	            	distX = point.pageX - startX,
	            	distY = point.pageY - startY;

	            distD = opts.isV ? distY : distX;

	            if ((index == 0 && distD > 0) || (index >= size - 1 && distD < 0)) {
	                distD = distD * 0.4;
	            }

	            translate( -index * slideDistant + distD, 0);
			});
			$(document).on(event_end_name, function(e){
				if (!flag) return;

		        flag = false;

	            if (distD === 0) return;
		        var k = index;
		        if ( distD < -slideDistant * 0.3 ) {
		            doPlay(++k);
		        } else if ( distD > slideDistant * 0.3 ) {
		            doPlay(--k);
		        } else {
		            doPlay(k);
		        }

		        distD = 0;
			});

			if (!opts.unResize) {
				$(window).resize(function(){
					setSize();
			    	doPlay(index, 0);
				});
			}
		}

		// 滚动到
		var doPlay = function(i, speed){
			i = i || 0;

			if (index !== i) {
				doFun(speed);
			}

			if (i >= size) {
				index = size - 1;
			}else if (i < 0) {
				index = 0;
			} else {
				index = i;
			}

			var dist =  -index * slideDistant;
			translate(dist, speed);

			$titCell.removeClass(opts.titOnClassName).eq(index).addClass(opts.titOnClassName);
			$conBox_child.removeClass(opts.titOnClassName).eq(index).addClass(opts.titOnClassName);

			autoPlay();
		}

		// 自动播放
		var autoPlay = function(){
			if (!opts.auto) return;

			timeI && window.clearTimeout(timeI);
			timeI = setTimeout(function() {
				var k;
				if (opts.auto) {
					k = index;
					k++;
					if (k === size) {
						k = 0;
					}
					doPlay(k);
				}
			}, opts.autoTime);
		}

		//滑动效果
		var translate = function( dist, speed) {
			speed = (typeof speed === "undefined") ? opts.delayTime : speed;
			
			var ele_style = $conBox.get(0).style;

			if (!isIE) {
			    ele_style.webkitTransitionDuration =  ele_style.MozTransitionDuration = ele_style.msTransitionDuration = ele_style.OTransitionDuration = ele_style.transitionDuration =  speed + 'ms';
			    if (!opts.isV) {
				    ele_style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
				    ele_style.msTransform = ele_style.MozTransform = ele_style.OTransform = 'translateX(' + dist + 'px)'; 
			    } else {
			    	ele_style.webkitTransform = 'translate(0,' + dist + 'px)' + 'translateZ(0)';
				    ele_style.msTransform = ele_style.MozTransform = ele_style.OTransform = 'translateY(' + dist + 'px)'; 
			    }
		    } else {
			    if (!opts.isV) {
		    		$conBox.animate({left:dist}, speed);
			    } else {
		    		$conBox.animate({top:dist}, speed);
			    }
		    }

		  
		}

		// 折行回调
		var doFun = function(speed){
			speed = (typeof speed === "undefined") ? opts.delayTime : speed;
			o.startFun && o.startFun(index);
			setTimeout(function(){
				o.endFun && o.endFun(index);
			}, speed);
		}


		// ---- 抛出

		result.next = function(){
			var k = index;
			doPlay(++k);
			return result;
		};

		result.prev = function(){
			var k = index;
			doPlay(--k);
			return result;
		};

		result.goto = function(n, speed){
			doPlay(n, speed);
			return result;
		};

		result.refresh = function(){
			init(true);
		}

		result.getIndex = function(){
			return index;
		}


		init();

		return result;

	}

	// 检测上下文环境是否为 AMD 或者 CMD   
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() {
            return SheSlide;
        });

    // 检查上下文是否为 node
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = SheSlide;
        
    } else {
        window.SheSlide = SheSlide;
    }

})();
