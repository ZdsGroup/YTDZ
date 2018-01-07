/**
 * Created by lyuwei on 2018/1/1.
 */
Ext.define('yt.view.monpot.timeline.TimeLine', {
    extend: 'Ext.DataView',
    xtype: 'timeline',

    maxHeight: 550,
    minHeight: 200,
    scrollable: 'y',

    cls: 'timeline-items-wrap',

    requires: [
        'yt.view.monpot.timeline.TimeLineModel',
		'yt.view.monpot.timeline.TimeLineController'
    ],

    viewModel: {
        type: 'timeline'
    },

    controller: 'timeline',

    bind: '{deviceWarning}',

    itemSelector: '.timeline-item',

    itemTpl:[
        '<div class="timeline-item{deviceid:this.cls(values,parent[xindex-2],xindex-1,xcount)}">' +
            '{alarmtime:this.epoch(values,parent[xindex-2],xindex-1,xcount)}' +
            '<div class="profile-pic-wrap">' +
                '<img src="resources/images/yt/timeline/1.png" alt="Smiley face" style="{rank:this.setImgBackgroudColor}">' +
                '<div>{alarmtime:this.elapsed}</div>' +
            '</div>' +
            '<tpl>' +
                '<div class="line-wrap">' +
                    '<div class="contents-wrap">' +
                        '<div class="shared-by"><a href="#">{devicename}</a></div>' +
                        '<div>{content}</div>' +
                    '</div>' +
                '</div>' +
            '</tpl>' +
        '</div>',
        {
            setImgBackgroudColor: function (value) {
                var ret = '';
                if( value >= 4 )
                    ret = 'background-color: red';
                else if( value >= 3 )
                    ret = 'background-color: yellow';
                else if( value >= 2 )
                    ret = 'background-color: orange';
                else
                    ret = 'background-color: #0093ff';
                return ret;
            },

            cls: function (value, record, previous, index, count) {
                var cls = '';

                if (!index) {
                    cls += ' timeline-item-first';
                }
                if (index + 1 === count) {
                    cls += ' timeline-item-last';
                }

                return cls;
            },

            elapsed: function (value) {
                var now = Date.now();
                var seconds = Math.floor((now - value) / 1000),
                    minutes = Math.floor(seconds / 60),
                    hours = Math.floor(minutes / 60),
                    days = Math.floor(hours / 24),
                    weeks = Math.floor(days / 7),
                    months = Math.floor(days / 30),
                    years = Math.floor(days / 365),
                    ret;

                months %= 12;       // 距现在月
                weeks %= 52;        // 距现在周
                days %= 365;        // 距现在日
                hours %= 24;        // 距现在小时
                minutes %= 60;      // 距现在分钟
                seconds %= 60;      // 距现在秒

                return Ext.Date.format(value,'m月d日 H:i:s'); //Y年
            },

            epoch: function (value, record, previous, index, count) {
                var previousValue = previous &&
                    (previous.isModel ? previous.data : previous)['alarmtime'];
                // TODO use previousValue and value to determine "Yesterday", "Last week",
                // "Last month", etc...

                // if (index === 4) {
                //     return '<div class="timeline-epoch">Yesterday</div>';
                // }

                return '';
            }
        }
    ]
});