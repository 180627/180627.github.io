/*
function createAnima() {

    // assume there is an existing line layer with id "w-lineStep"
    // get the source of the line layer
    const lineSource = map.getSource("w-step4");

    // get the coordinates of the line from the source
    const lineCoords = lineSource._data.geometry.coordinates;

    // 创建一个GeoJSON源，初始时只有一个点
    var geojson = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': lineCoords[0] // 第一个点
                }
            },
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [lineCoords[0]] // 初始时只有一条线段
                }
            }
        ]
    };
    // 添加GeoJSON源
    map.addSource('line-animation', {
        type: 'geojson',
        data: geojson
    });

    // 添加标记图层，初始时没有标记
    var marker = null;

    // 添加线图层
    map.addLayer({
        id: 'line',
        source: 'line-animation',
        type: 'line',
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        },
        paint: {
            'line-color': '#555555', // 初始时线的颜色是灰色
            'line-width': 10,
            'line-opacity': .8
        }
    });

    // 定义动画参数
    var speedFactor = 70; // 每一度经度对应的帧数
    var animation; // 存储和取消动画的变量
    var startTime = performance.now(); // 动画开始时间
    var progress = 0; // 动画进度 = 当前时间 - 开始时间

    animateLine();

    // 定义动画函数
    function animateLine() {

        // 计算当前点在线上的位置（百分比）
        var percent = (progress / speedFactor) / lineCoords.length;

        // 如果已经到达终点，停止动画
        if (percent > 1) {
            cancelAnimationFrame(animation);
            return;
        }

        // 获取当前点的坐标（插值）
        var currentPoint = turf.along(turf.lineString(lineCoords), percent * turf.length(turf.lineString(lineCoords)));

        // 更新GeoJSON对象中线的坐标
        var coordsUpToCurrentPoint = lineCoords.slice(0, Math.floor(percent * lineCoords.length) + 1);

        coordsUpToCurrentPoint.push(currentPoint.geometry.coordinates);
        //coordsUpToCurrentPoint[coordsUpToCurrentPoint.length - 1] = currentPoint.geometry.coordinates;

        geojson.features[1].geometry.coordinates = coordsUpToCurrentPoint;

        // 更新源数据
        map.getSource('line-animation').setData(geojson);

        // 更新线的颜色为蓝色
        map.setPaintProperty('line', 'line-color', 'red');

        // 移除旧的标记（如果有）
        if (marker) {
            marker.remove();
        }

        // 添加新的标记到当前点的位置
        marker = new mapboxgl.Marker({ color: '#007cbf' })
            .setLngLat(currentPoint.geometry.coordinates)
            .addTo(map);

        // 请求下一帧动画
        //animation = requestAnimationFrame(animateLine);
        animation = requestAnimationFrame(animateLine, {duration: 1000, easing: 'easeInOutCirc'});

        // 更新进度
        progress = performance.now() - startTime;
    }
}*/

/*
function createAnima2() {

    const lineSource = map.getSource("w-step4");

    // get the coordinates of the line from the source
    const lineCoords = lineSource._data.geometry.coordinates;

    var geojson = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {
                    'progress': 0 // 线的进度，初始为0
                },
                'geometry': {
                    'type': 'LineString',
                    'coordinates': lineCoords
                }
            }
        ]
    };

    // 添加GeoJSON源
    map.addSource('line-animation', {
        type: 'geojson',
        lineMetrics: true,
        data: geojson
    });

    // 添加线图层，并使用line-gradient属性来渐变线的颜色
    map.addLayer({
        id: 'line',
        source: 'line-animation',
        type: 'line',
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        },
        paint: {
            // 使用数据表达式来设置线的颜色，根据进度来判断是否显示蓝色或透明色
            'line-gradient': [
                'interpolate',
                ['linear'],
                ['get', 'progress'], // 获取线的进度属性
                0, '#007cbf', // 如果进度为0，显示蓝色
                1, '#007cbf', // 如果进度为1，显示蓝色
                1.01, 'rgba(0,0,0,0)' // 如果进度大于1，显示透明色
            ],
            'line-width': 5,
            'line-opacity': .8
        }
    });

    // 定义动画参数
    var speedFactor = 30; // 每一度经度对应的帧数
    var animation; // 存储和取消动画的变量
    var startTime = performance.now(); // 动画开始时间
    var progress = 0; // 动画进度 = 当前时间 - 开始时间

    // 定义动画函数
    function animateLine() {

        // 计算当前点在线上的位置（百分比）
        var percent = (progress / speedFactor) / lineCoords.length;

        // 如果已经到达终点，停止动画
        if (percent > 1) {
            cancelAnimationFrame(animation);
            return;
        }

        // 更新GeoJSON对象中线的进度属性
        geojson.features[0].properties.progress = percent;

        // 更新源数据
        map.getSource('line-animation').setData(geojson);

        // 请求下一帧动画，并传入一个AnimationOptions对象
        animation = requestAnimationFrame(animateLine, { duration: 1000, easing: 'easeInOutCirc' });

        // 更新进度
        progress = performance.now() - startTime;
    }

    // 开始动画
    animateLine();
}*/




function createAnima(lineSource) {
    // get the coordinates of the line from the source
    const lineCoords = lineSource._data;

    var envelope = turf.envelope(lineCoords).geometry.coordinates[0];
    var zoom = map.cameraForBounds([envelope[0], envelope[2]]).zoom;
    //console.log(map.cameraForBounds([envelope[0],envelope[2]]))
    //map.fitBounds([envelope[0],envelope[2]], { pitch: 65 })
    //var currentZoom = map.getZoom();
    var center = map.cameraForBounds([envelope[0], envelope[2]]).center;

    map.easeTo({
        // 设置目标中心点坐标
        center: center,
        // 设置目标缩放层级
        zoom: zoom - 1.3,
        // 设置目标水平倾角
        pitch: 60,
        // 设置目标方位角
        bearing: 0,
        // 设置过渡时间为 2 秒
        duration: 1000
    });
    //map.setZoom(currentZoom - 1);
    //map.setPitch(65);

    setTimeout(function () { anima = new AnimationRoute(lineCoords, zoom, center); }, 1200);
}
//const arrow = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAnElEQVQ4T63TsQ0CMQyF4f/NgMQQ0CBR0FIx190cFIiWhhFoKdgEiRUeSoF0gO8cjkub+Evs2OLPpc9422dgBRwlNZn/BtjeApdOUJsh0QuuwKYWiYAFcAKWHaSR1EbpfAHlkO0ICdMJgV+QXmAAmUu6v9IZA8wkPVKgtg7TF7H25t4UbN+A9ahGmqqVD8AO2GdzUF45+I3ZJJb9JxbwRhEhB66xAAAAAElFTkSuQmCC'
const lineAnima = 'play-'

class AnimationRoute {
    constructor(json, zoom, center, play = true) {
        this._json = json
        this._play = play
        //this._currentZoom = currentZoom
        this._zoom = zoom
        this._center = center
        this.init()
    }

    init() {
        const that = this
        that._index = 0
        that._count = 105
        that._step = turf.length(that._json) / that._count
        that._flag = 0

        // 添加路径图层
        map.addSource(lineAnima, {
            type: 'geojson',
            data: that._json
        })

        /*
        map.addLayer({
            id: lineAnima,
            type: 'line',
            source: lineAnima,
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#aaaaaa',
                'line-width': 10
            }
        })*/

        // 添加已播放路径
        map.addSource(lineAnima + '-played', {
            type: 'geojson',
            data: that._json
        })

        map.addLayer({
            id: lineAnima + '-played',
            type: 'line',
            source: lineAnima + '-played',
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                "line-width": 14,
                "line-opacity": 1, // 线条透明度
                "line-color": '#ffffff', // 线条颜色
            }
        })

        switch (pathType) {
            case 'walking':
                map.addLayer({
                    id: lineAnima + '-played-outline',
                    type: 'line',
                    source: lineAnima + '-played',
                    'layout': {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    'paint': {
                        "line-width": 8,
                        "line-opacity": 1, // 线条透明度
                        "line-color": "#40C446", //绿色
                    }
                })
                break;
            case 'driving':
                map.addLayer({
                    id: lineAnima + '-played-outline',
                    type: 'line',
                    source: lineAnima + '-played',
                    'layout': {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    'paint': {
                        "line-width": 8,
                        "line-opacity": 1, // 线条透明度
                        "line-color": "#F2BF4A", //橙色
                    }
                })
                break;
            case 'bicycling':
                map.addLayer({
                    id: lineAnima + '-played-outline',
                    type: 'line',
                    source: lineAnima + '-played',
                    'layout': {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    'paint': {
                        "line-width": 8,
                        "line-opacity": 1, // 线条透明度
                        "line-color": "#59B9C6", //蓝色
                    }
                })
                break;
        }

        /*
        // 添加路径上的箭头
        map.loadImage(arrow, function(error, image) {
          if (error) throw error
          map.addImage(lineAnima + '-arrow', image)
          map.addLayer({
            'id': lineAnima + '-arrow',
            'source': lineAnima,
            'type': 'symbol',
            'layout': {
              'symbol-placement': 'line',
              'symbol-spacing': 50,
              'icon-image': lineAnima + '-arrow',
              'icon-size': 0.6,
              'icon-allow-overlap': true
            }
          })
        })*/

        /*
        // 添加动态图标
        map.addSource(lineAnima + '-point', {
            'type': 'geojson',
            'data': that._getDataByCoords()
        })
        map.addLayer({
            'id': lineAnima + '-point',
            'source': lineAnima + '-point',
            'type': 'circle',
            'paint': {
                'circle-radius': 6,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
            }
        })*/



        map.addSource(lineAnima + '-point', {
            'type': 'geojson',
            'data': that._getDataByCoords()
        })

        switch (pathType) {
            case 'walking':
                map.addLayer({
                    'id': lineAnima + '-point',
                    'type': 'symbol',
                    'source': lineAnima + '-point', // 引用数据源
                    'layout': {
                        'icon-image': 'icon-walk', // 使用数据源中的icon属性作为图标图片
                        'icon-size': 0.5, // 图标大小
                        'icon-allow-overlap': true
                    }
                });
                break;
            case 'driving':
                map.addLayer({
                    'id': lineAnima + '-point',
                    'type': 'symbol',
                    'source': lineAnima + '-point', // 引用数据源
                    'layout': {
                        'icon-image': 'icon-drive', // 使用数据源中的icon属性作为图标图片
                        'icon-size': 0.5, // 图标大小
                        'icon-allow-overlap': true
                    }
                });
                break;
            case 'bicycling':
                map.addLayer({
                    'id': lineAnima + '-point',
                    'type': 'symbol',
                    'source': lineAnima + '-point', // 引用数据源
                    'layout': {
                        'icon-image': 'icon-bicycle', // 使用数据源中的icon属性作为图标图片
                        'icon-size': 0.5, // 图标大小
                        'icon-allow-overlap': true
                    }
                });
                break;
        }


        /*
        // 从外部域名加载图片
        map.loadImage(
            '../image/bicycle.svg', // svg的url
            (error, image) => {
                if (error) throw error;
                // 将图片添加到style中作为图标
                map.addImage('icon-bicycle', image);
                map.addSource(lineAnima + '-point', {
                    'type': 'geojson',
                    'data': that._getDataByCoords()
                })
                // 添加一个layer使用图标来表示数据
                map.addLayer({
                    'id': lineAnima + '-point',
                    'type': 'symbol',
                    'source': lineAnima + '-point', // 引用数据源
                    'layout': {
                        'icon-image': 'icon-bicycle', // 使用数据源中的icon属性作为图标图片
                        'icon-size': 0.25 // 图标大小
                    }
                });
            }
        );

        // 从外部域名加载图片
        map.loadImage(
            '../image/bicycle.png', // svg的url
            (error, image) => {
                if (error) throw error;
                // 将图片添加到style中作为图标
                map.addImage('icon-bicycle', image);
                map.addSource(lineAnima + '-point', {
                    'type': 'geojson',
                    'data': that._getDataByCoords()
                })
                // 添加一个layer使用图标来表示数据
                map.addLayer({
                    'id': lineAnima + '-point',
                    'type': 'symbol',
                    'source': lineAnima + '-point', // 引用数据源
                    'layout': {
                        'icon-image': 'icon-bicycle', // 使用数据源中的icon属性作为图标图片
                        'icon-size': 0.25 // 图标大小
                    }
                });
            }
        );*/



        that._animatePath()
    }

    _animatePath() {
        if (this._index > this._count) {
            var that = this;
            setTimeout(function () {
                map.easeTo({
                    // 设置目标中心点坐标
                    center: that._center,
                    // 设置目标缩放层级
                    zoom: that._zoom - 1.5,
                    // 设置目标水平倾角
                    pitch: 0,
                    // 设置目标方位角
                    bearing: 0,
                });
            }, 200)

            window.cancelAnimationFrame(this._flag)

        } else {
            const coords = turf.along(this._json, this._step * this._index).geometry.coordinates
            // 已播放的线
            const start = turf.along(this._json, 0).geometry.coordinates
            map.getSource(lineAnima + '-played').setData(turf.lineSlice(start, coords, this._json))

            // 车的图标位置
            map.getSource(lineAnima + '-point').setData(this._getDataByCoords(coords))
            // 计算旋转角度
            const nextIndex = this._index === this._count ? this._count - 1 : this._index + 1
            const coordsNext = turf.along(this._json, this._step * nextIndex).geometry.coordinates
            /*
            let angle = turf.bearing(
                turf.point(coords),
                turf.point(coordsNext)
            ) - 90
            if (this._index === this._count) angle += 180
            map.setLayoutProperty(lineAnima+'point', 'icon-rotate', angle)*/

            this._index++
            if (this._play) this._flag = requestAnimationFrame(() => {
                this._animatePath()
            })
        }

        map.setBearing(this._index / 5);
        //map.fitBounds([this._envelope[0], this._envelope[2]], { pitch: 65 })
        map.setZoom(this._zoom - 1.3);
        map.setCenter(this._center)
    }

    _getDataByCoords(coords) {
        if (!coords || coords.length !== 2) return null
        return turf.point(coords, {
            'label': this._formatDistance(this._step * this._index)
        })
    }

    _formatDistance(dis) {
        if (dis < 1) {
            dis = dis * 1000
            return dis.toFixed(0) + '米'
        } else {
            return dis.toFixed(2) + '千米'
        }
    }

    remove() {
        window.cancelAnimationFrame(this._flag)
        if (map.getSource(lineAnima + '-point')) {
            map.removeLayer(lineAnima + '-point')
            // map.removeLayer(lineAnima + '-label')
            map.removeSource(lineAnima + '-point')
        }
        if (map.getSource(lineAnima)) {
            map.removeLayer(lineAnima + '-played')
            map.removeLayer(lineAnima + '-played-outline')
            map.removeSource(lineAnima)
            map.removeSource(lineAnima + '-played')
        }
    }
}
