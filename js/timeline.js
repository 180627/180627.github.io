function createTimeline() {
    var myChart = echarts.init(document.getElementById('timeline'));

    dynasty = ['六朝', '唐', '宋', '元', '明', '清', '近现代'];


    var option = {
        timeline: {
            axisType: 'category',
            data: dynasty,
            height: '100%',
            width: '80%',
            left: '12%',
            top: '25%',
            autoPlay: false,
            //rewind: true,
            //currentIndex: 0,
            symbol: 'circle',
            symbolSize: 20, // 让圆圈变大
            label: {
                normal: {
                    textStyle: {
                        color: '#2A2A2A', // 让文字颜色为灰色
                        fontSize: 16
                    },
                    position: 20 // 让文字位于轴线下方
                },
                emphasis: {
                    textStyle: {
                        color: '#00000', // 让当前播放位置对应的文字颜色为黑色
                        fontSize: 17,
                        fontWeight:'bold'
                    },
                    position: 20 // 让文字位于轴线下方
                },
            },
            itemStyle: {
                color: '#F5F5F5',
                borderColor: '#404040',
                borderWidth: 2.5
            },
            lineStyle: {
                color: '#800080', // 让播放过的线颜色为紫色
                width: 3
            },
            checkpointStyle: {
                color: '#FFE74D',
                borderColor: '#404040',
                borderWidth: 2.5,
                symbolSize: 22, 
            },
            progress: {
                lineStyle: {
                    color: '#800080', // 让播放过的线颜色为紫色
                    width: 3
                },
                itemStyle: {
                    color: '#F5F5F5',
                    borderColor: '#404040',
                    borderWidth: 2.5,
                },
                label: {
                    color: '#2A2A2A', // 让当前播放位置对应的文字颜色为黑色
                    fontSize: 16,
                }
            },
            controlStyle: {
                show: false
            },
            show: false
        },
        options: []
    };


    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option, true);

    /*
    myChart.on("timelinechanged", function (e) {
        console.log(year[e.currentIndex]);
        activeYear = year[e.currentIndex]
    });*/
    return myChart;
}
