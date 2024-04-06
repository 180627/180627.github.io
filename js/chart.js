var dom = document.getElementById('mycontainer');
chart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});
var app = {};


var option = {
    title: {
        text: '评分值（分）', // 这里设置标题的内容
        textStyle: {
            fontSize: 16, // 这里设置标题的字号
            fontWeight: 'bold' // 这里设置标题的粗细
        },
        top: '4%', // 这里设置标题距离上边界的百分比
        left: 'center' // 这里设置标题水平居中
    },

    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        min: 4,
        max: 5,
        type: 'value',
        scale: true,
        position: 'top',

        boundaryGap: false,
        splitLine: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            margin: 2,
            textStyle: {
                color: '#aaa'
            }
        },
        barGap: '10%',
        barCategoryGap: '15%',
        barWidth: '5%'
    },
    yAxis: {
        type: 'category',
        data: ['南京博物院', '古鸡鸣寺', '高二适纪念馆', '南京夫子庙-秦淮风光带', '秦淮河', '南京牛首山文化旅游区', '总统府', '明孝陵景区', '南京雨花台风景区', '中山陵景区'],
        inverse: true,
        barGap: '20%',
        axisLine: {
            show: false // 这里设置隐藏轴线
        }, axisTick: {
            show: false
        },
        axisLabel: {

        }
    },


    series: [
        {
            type: 'bar',
            barWidth: '60%',
            data: [
                {
                    value: 5.0,
                    itemStyle: {
                        barBorderRadius: [4, 4, 4, 4],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, // 渐变方向，从上到下
                            [
                                { offset: 0, color: '#ffff00' }, // 渐变起始颜色，黄色
                                { offset: 1, color: '#ffe200' } // 渐变结束颜色，橙黄色
                            ]
                        )
                    }
                },
                {
                    value: 5.0,
                    itemStyle: {
                        barBorderRadius: [4, 4, 4, 4],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, // 渐变方向，从上到下
                            [
                                { offset: 0, color: '#ffff00' }, // 渐变起始颜色，黄色
                                { offset: 1, color: '#ffe200' } // 渐变结束颜色，橙黄色
                            ]
                        )
                    }
                },
                {
                    value: 5.0,
                    itemStyle: {
                        barBorderRadius: [4, 4, 4, 4],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, // 渐变方向，从上到下
                            [
                                { offset: 0, color: '#ffff00' }, // 渐变起始颜色，黄色
                                { offset: 1, color: '#ffe200' } // 渐变结束颜色，橙黄色
                            ]
                        )
                    }
                },
                {
                    value: 4.9,
                    itemStyle: {
                        barBorderRadius: [4, 4, 4, 4],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, // 渐变方向，从上到下
                            [
                                { offset: 0, color: '#87cefa' }, // 渐变起始颜色，青色
                                { offset: 1, color: '#acdcfa' } // 渐变结束颜色，蓝色
                            ]
                        )
                    }
                },
                {
                    value: 4.9,
                    itemStyle: {
                        barBorderRadius: [4, 4, 4, 4],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, // 渐变方向，从上到下
                            [
                                { offset: 0, color: '#87cefa' }, // 渐变起始颜色，青色
                                { offset: 1, color: '#acdcfa' } // 渐变结束颜色，蓝色
                            ]
                        )
                    }
                },
                {
                    value: 4.9,
                    itemStyle: {
                        barBorderRadius: [4, 4, 4, 4],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, // 渐变方向，从上到下
                            [
                                { offset: 0, color: '#87cefa' }, // 渐变起始颜色，青色
                                { offset: 1, color: '#acdcfa' } // 渐变结束颜色，蓝色
                            ]
                        )
                    }
                },
                {
                    value: 4.9,
                    itemStyle: {
                        barBorderRadius: [4, 4, 4, 4],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, // 渐变方向，从上到下
                            [
                                { offset: 0, color: '#87cefa' }, // 渐变起始颜色，青色
                                { offset: 1, color: '#acdcfa' } // 渐变结束颜色，蓝色
                            ]
                        )
                    }
                },
                {
                    value: 4.9,
                    itemStyle: {
                        barBorderRadius: [4, 4, 4, 4],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, // 渐变方向，从上到下
                            [
                                { offset: 0, color: '#87cefa' }, // 渐变起始颜色，青色
                                { offset: 1, color: '#acdcfa' } // 渐变结束颜色，蓝色
                            ]
                        )
                    }
                },
                {
                    value: 4.9,
                    itemStyle: {
                        barBorderRadius: [4, 4, 4, 4],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, // 渐变方向，从上到下
                            [
                                { offset: 0, color: '#87cefa' }, // 渐变起始颜色，青色
                                { offset: 1, color: '#acdcfa' } // 渐变结束颜色，蓝色
                            ]
                        )
                    }
                },
                {
                    value: 4.9,
                    itemStyle: {
                        barBorderRadius: [4, 4, 4, 4],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, // 渐变方向，从上到下
                            [
                                { offset: 0, color: '#87cefa' }, // 渐变起始颜色，青色
                                { offset: 1, color: '#acdcfa' } // 渐变结束颜色，蓝色
                            ]
                        )
                    }
                }
            ]
        }]
}

chart.setOption(option);

//window.addEventListener('resize', chart.resize);