/*
* @name: dialog
* @overview:
* @required: jquery
* @return: obj [description]
* @author: she
*/


define([], function () {


	var result = {};

	// 基本类
	function Widget() {
	    this.boundingBox = null;
	}

	Widget.prototype = {
	    // 自定义事件绑定
	    on: function(type, handler) {
	      if(typeof this.handlers[type] == 'undefined') {
	        this.handlers[type] = [];
	      }
	      this.handlers[type].push(handler);

	      return this;
	    },
	    // 自定义事件触发
	    fire: function(type, data) {
	      if(this.handlers[type] instanceof Array) {
	        var handlers = this.handlers[type];
	        for(var i=0, len=handlers.length; i<len; i++) {
	          handlers[i].apply(this, [data]);
	        }
	      }
	      return this;
	    },

		// 删除自定义事件
		off: function(type){
			if (this.handlers) {
				this.handlers[type] = [];
			}
		},

	    render: function(container) {
	      this.renderUI();
	      this.handlers = {};
	      this.bindUI();
	      this.syncUI();
	      // $(container || document.body).append(this.boundingBox);
	    },
	    destroy: function() {
	      this.destructor();
	      this.boundingBox.off();
	      this.boundingBox.remove();
	    },
	    renderUI: function(){},
	    showUI: function(){},
	    hideUI: function(){},
	    bindUI: function(){},
	    syncUI: function(){},
	    destructor: function(){}
	}


	function Chosen(cfg) {
		// 返回对象
		if (!(this instanceof Chosen)) {
			return new Chosen(cfg);
		}

	    this.cfg = {
	      title: '',
	      content: '',
	      wrap: $("#J__wrap"),
	      text4Btn: null,
	      class4Btn: null,
	      handler4Btn: null,
	      hasMask: true,
	      maskClose: false,
	      hasShow: false,
	      contentClass : "",
	      pifuClass : "",
		  type : 1, // 1中间弹框(默认)  2下拉弹框
	    };

		$.extend(this.cfg, cfg);
		this.render();
		return this;

	}

	// 按钮html
	function getFootHtml(text4Btn, class4Btn) {
		var i = 0, l = text4Btn ? text4Btn.length : 0,
			html = "",
			class4Btn = class4Btn,
			className = "";

		for(; i < l; i++ ){
			className = "btn m_active_bgw";
			if(class4Btn && class4Btn[i]){
				className += " " + class4Btn[i];
			}
			html += "<div class='"+ className +"'>" +text4Btn[i]+ "</div>";
		}
		return html;
	}


	Chosen.prototype = $.extend({}, new Widget(), { // 继承Widget类
	    renderUI: function() {

		    var html = getFootHtml(this.cfg.text4Btn, this.cfg.class4Btn);

			this.boundingBox = $(
				'<div '+ (this.cfg.id ? ('id="'+ this.cfg.id +'"') : "") +' class="m_boundingBox"><div class="m_boundingBox_inner">' +
				  '<div class="header">' +this.cfg.title+ '</div>' +
				  ( this.cfg.content ? '<div class="body '+ this.cfg.contentClass +'">' +this.cfg.content+ '</div>' : '') +
				  '<div class="footer">' +html+ '</div></div>' +
				'</div></div>'
			);

			// 外层
			var $container = this.cfg.wrap;
			if ($container.length !== 1) {
				$container = $(document.body);
			}

			// 遮罩层
			if(this.cfg.hasMask) {
				this._mask = $('<div class="m_mask"></div>');
				this._mask.appendTo($container);
			}

			// 关闭标题
			if(!this.cfg.title) {
				this.boundingBox.find(".header").css("display","none");
			}

			this.boundingBox.appendTo($container);
			if(this.cfg.pifuClass) {
				this.boundingBox.addClass(this.cfg.pifuClass);
			} else {
				if (this.cfg.type == 2) {
					this.boundingBox.addClass("m_boundingBoxDown");
				} else {
					this.boundingBox.addClass("m_boundingBoxCenter");
				}
			}
			if (!this.cfg.hasShow) {
				this.hideUI();
			} else {
				this.showUI();
			}
	    },

	    // 事件
	    bindUI: function() {
	    	var that = this;
	    	this.boundingBox.on('click', '.btn', function() {

				if ($(this).hasClass("disabled")) return;
				var i = $(this).index();
	        	that.fire('alert', i);
	        	that.fire('showAlert', i);
				// that.destroy();
			});


			if(this.cfg.handler4Btn) {
			  this.on('alert', this.cfg.handler4Btn);
			};

			if(this.cfg.maskClose && this.cfg.hasMask) {
				this._mask.on("click", function(){
					that.hideUI();
				});
			}
	    },

	    showUI: function(fn){
			this.boundingBox.addClass("on");
			if(this.cfg.hasMask) {
				this._mask.addClass("on");
			}
			if (typeof fn === "function") {
				this.on('showAlert', fn);
			}
			return this;
		},
		hideUI: function(){

			var _this = this;
			_this.boundingBox.removeClass("on");
			if(_this.cfg.hasMask) {
				_this._mask.removeClass("on");
			}
			this.off('showAlert');
			return _this;

		},

	    // 样式
	    syncUI: function() {
	    	// this.boundingBox.css({
	    	//         width: this.cfg.width ? (this.cfg.width + 'px') : "auto",
	    	//         height: this.cfg.height ? (this.cfg.height + 'px') : "auto"
	    	// });
	    },

	    destructor: function() {
	      this._mask && this._mask.remove();
	    },

	    changeCfg: function(cfg){
	    	$.extend(this.cfg, cfg);
			this.boundingBox.find(".header").html(this.cfg.title);
			this.boundingBox.find(".body").html(this.cfg.content);

			var html = getFootHtml(this.cfg.text4Btn, this.cfg.class4Btn);
			this.boundingBox.find(".footer").html(html);

		},


	});


 	return Chosen;

});
