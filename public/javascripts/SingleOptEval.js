/**
 * 单项测评应用
 * @param items      题目数据
 * @param container  显示容器
 * @param callback   回调(应该在回调里面调用API接口计算分数或跳转页面)
 * @constructor
 */
var SingleOptEval = function(items, container, callback) {
    if(!items) throw new Error('items is not defined');
    if(!(items instanceof Array)) throw new Error('Type Error: items is not an array');
    if(!container) throw new Error('container is not defined');

    this.items     = items;         //测评题目
    this.index     = 0;             //题目索引
    this.container = container;     //容器
    this.answers   = [];            //答题结果
    this.callback  = callback;      //回调函数
}

/**
 * 启动
 */
SingleOptEval.prototype.start = function() {
    this._renderStructure();
    this._renderItem();
    this._renderProgressBar();
}

/**
 * 渲染基础HTML结构
 * @private
 */
SingleOptEval.prototype._renderStructure = function() {
    var htmlStructure = '<div class="am-g am-margin-top-sm"> \
                            <div class="am-u-sm-12 am-u-md-8 am-u-md-offset-2 soe-item-wrapper">\
                            </div>\
                        </div>';
    this.container.html(htmlStructure);
}

/**
 * 渲染题目
 * @private
 */
SingleOptEval.prototype._renderItem = function() {
    var item = this.items[this.index];
    var html = this._getItemHtml(item);

    this.container.find('.soe-item-wrapper .soe-item').remove();
    this.container.find('.soe-item-wrapper').prepend(html);
    this.container.find('.soe-item-wrapper input[type="radio"]').uCheck();
    this._bindSelectEvent();
}

/**
 * 渲染进度条
 * @private
 */
SingleOptEval.prototype._renderProgressBar = function() {
    var rate        = ((this.index + 1) * 100 / this.items.length) + '%';
    var progressBar = '<div class="am-g soe-progress-bar"> \
                            <div class="am-u-sm-12">\
                                <div class="am-progress am-progress-striped am-active"> \
                                    <div class="am-progress-bar am-progress-bar-secondary" style="width:' + rate + '"></div>\
                                </div> \
                            </div> \
                        </div>';
    this.container.find('.soe-progress-bar').remove();
    this.container.find('.soe-item-wrapper').append(progressBar);
}

/**
 * 获取题目HTML
 * @param item
 * @returns {string}
 * @private
 */
SingleOptEval.prototype._getItemHtml = function(item) {

    var title   = '<div class="am-g am-margin-vertical-xs soe-item-title">' +
                    '<div class="am-u-sm-12">' +
                        item.title +
                    '</div>' +
                  '</div>';

    var thumb   = '<div class="am-g am-g-collapse soe-item-thumb">' +
                    '<div class="am-u-sm-12">' +
                        '<img class="am-img-responsive" src="' + item.thumb + '" alt="缩略图"/>' +
                        '<div class="soe-item-thumb-loading">' +
                            '<i class="fa fa-circle-o-notch fa-spin soe-item-thumb-loading-icon"></i>' +
                        '</div>' +
                    '</div>' +
                  '</div>';

    var options  = item.options.map(function(option, index) {
        return '<div class="am-g am-g-collapse soe-item-option">' +
                    '<div class="am-u-sm-12"></div>' +
                    '<label class="am-radio am-secondary">' +
                        '<input type="radio" name="option" value="' + index + '" data-am-ucheck>' + option.text +
                    '</label>' +
               '</div>';
    }).join('');

    var html      = '<div class="am-g soe-item">' +
                        '<div class="am-u-sm-12">' +
                            title +
                            thumb +
                            '<div class="am-g">' +
                                '<div class="am-u-sm-12">' +
                                    '<div class="soe-item-options">' +
                                        options +
                                    '</div>' +
                                '</div>' +
                            '</div>'
                        '</div>' +
                    '</div>';
    return html;
}

/**
 * 显示下一题
 * @private
 */
SingleOptEval.prototype._showNext = function() {
    var self = this;
    if(this.index < this.items.length - 1) {
        self.container.fadeOut(500, function() {
            self.index += 1;
            self._renderItem();
            self._renderProgressBar();

            setTimeout(function() {
                self.container.slideDown(900, function() {
                });
            }, 10);
        });
    }
}

/**
 * 选择
 * @param val
 * @private
 */
SingleOptEval.prototype._select = function(val) {
    if(this.index < this.items.length - 1) {
        this.answers.push(val);
        this._showNext();
    }
    else {
        this.answers[this.items.length - 1] = val;
        this._end();
    }
}

/**
 * 绑定选择事件
 * @private
 */
SingleOptEval.prototype._bindSelectEvent = function() {
    var self = this;
    this.container.find('input[name="option"]').change(function() {
        self._select($(this).val());
    });
}

/**
 * 结束
 * @private
 */
SingleOptEval.prototype._end = function() {
    this.callback(this.answers);
}