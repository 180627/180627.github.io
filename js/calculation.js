class calculation {
    constructor(number, price, types) {
        this._number = number
        this._price = price
        this._types = types

        this._numberMark = [];
        this._priceMark = [];
        this._distanceMark = [];
        this._typeMark = [];
        this._ratingMark = [];
        this._mark = [];

        this._maxPrice = 0;     //低于极限价格的最高价格
        this._minPrice = 0;
        this._maxD = 0;
        this._minD = 999;
        this._maxDensity = 0;
        this._minDensity = 999;
        this._maxRating = 0;
        this._minRating = 999;

        //this.animatedPoint = null;
        this.addMark = false;
    }

    calculate() {
        var that = this;

        $.get('data/文学数据库2.geojson').done(function (json) {

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
            } else {
                alert("该浏览器不支持获取当前位置信息");
            }

            function successCallback(position) {
                const latitude = position.coords.latitude; // 纬度
                const longitude = position.coords.longitude; // 经度


                closeServiceLayer();

                turf.featureEach(json, function (currentFeature, featureIndex) {
                    var price = currentFeature.properties['价格'];
                    var density = currentFeature.properties['density'];
                    var rating = currentFeature.properties['rating'];

                    if (price > that._maxPrice && price <= that._price) {
                        that._maxPrice = price;
                    }
                    if (density > that._maxDensity) {
                        that._maxDensity = density;
                    }
                    if (density < that._minDensity) {
                        that._minDensity = density;
                    }

                    var from = turf.point([longitude, latitude]);
                    var options = { units: 'kilometers' };
                    var distance = turf.distance(from, currentFeature, options);
                    if (distance > that._maxD) {
                        that._maxD = distance;
                    }
                    if (distance < that._minD) {
                        that._minD = distance;
                    }

                    if (rating > that._maxRating) {
                        that._maxRating = rating;
                    }
                    if (rating < that._minRating) {
                        that._minRating = rating;
                    }

                });


                turf.featureEach(json, function (currentFeature, featureIndex) {
                    //价格
                    var price = currentFeature.properties['价格'];


                    if (that._price == 0) {
                        that._priceMark.push(18);
                    }
                    else if (that._price > 0) {
                        //if (price > that._price) {
                        //    that._priceMark.push(-100);
                        //}
                        //else {
                        var priceSpan = 1 / (that._minPrice + 1) - 1 / (that._maxPrice + 1);
                        var priceMark = (1 / (price + 1) - 1 / (that._maxPrice + 1)) / priceSpan;
                        that._priceMark.push(priceMark * 14);
                        //}
                    }


                    //类型
                    var types = currentFeature.properties['分类'].split(';');
                    var sameCount = repeatElement(that._types, types);
                    that._typeMark.push(sameCount * 7.5)

                    function repeatElement(a, b) {
                        var count = 0;
                        for (let i = 0; i < a.length; i++) {
                            for (let j = 0; j < b.length; j++) {
                                if (a[i] == b[j]) {
                                    count++
                                }
                            }
                        }
                        return count;
                    }


                    //核密度
                    if (that._number == 1) {
                        that._numberMark.push(10);
                    }
                    else if (that._number > 1) {
                        var density = currentFeature.properties['density'];
                        that._numberMark.push(that._number * density * 2);
                    }


                    //距离
                    var from = turf.point([longitude, latitude]);
                    var options = { units: 'kilometers' };
                    var distance = turf.distance(from, currentFeature, options);
                    /*
                    var dSpan = 1 / that._minD - 1 / that._maxD;
                    var dMark = (1 / distance - 1 / that._maxD) / dSpan;
                    that._distanceMark.push(dMark * 15);*/

                    //a - bx
                    if (distance > 30) {
                        that._distanceMark.push(0);
                    }
                    else {
                        var dMark = 20 - distance / 2;
                        that._distanceMark.push(dMark);
                    }


                    //高德评分
                    var rating = currentFeature.properties['rating'];
                    var ratingMark = (rating - that._minRating) / (that._maxRating - that._minRating)
                    that._ratingMark.push(ratingMark * 4)
                });

                for (var i in that._numberMark) {
                    that._mark.push(that._numberMark[i] + that._priceMark[i] + that._distanceMark[i] + that._typeMark[i] + that._ratingMark[i])
                }


                /*
                                console.log(that._numberMark);
                                console.log(that._priceMark);
                                console.log(that._distanceMark);
                                console.log(that._typeMark);
                                console.log(that._ratingMark);
                                console.log(that._mark);*/


                turf.propEach(json, function (currentProperties, featureIndex) {
                    currentProperties.mark = that._mark[featureIndex] / 5;
                    //=currentProperties
                    //=featureIndex
                });


                function sortId(a, b) {
                    return b.properties.mark - a.properties.mark
                }
                json.features.sort(sortId);


                map.addSource('mark', {
                    type: "geojson",
                    data: json,
                })

                map.addLayer({
                    'id': 'markLayer',
                    'type': 'circle',
                    'source': 'mark',
                    'paint': {
                        'circle-color': '#A93F7E',
                        'circle-radius': ['get', 'mark'],
                        'circle-stroke-width': 2.5,
                        'circle-stroke-color': '#ffffff'
                    }
                })


                //map.setPaintProperty('serviceLayer', 'circle-color', 'red');
                //map.setPaintProperty('serviceLayer', 'circle-radius', ['get', 'mark']);

                /*
                map.addLayer({
                    id: 'animatedPointLayer0',
                    type: 'circle',
                    source: 'animatedPoint0',
                    paint: {
                        'circle-radius': ['get', 'mark'],
                        'circle-color': 'yellow',
                        'circle-opacity': 1,
                        'circle-stroke-color': 'red',
                        'circle-stroke-opacity': 1,
                    },
                })*/

                if (json.features[0].properties.photo) {
                    document.getElementById('img-rank-1').style["background-image"] = `url(${json.features[0].properties.photo})`;
                }
                else {
                    document.getElementById('img-rank-1').style["background-image"] = `url('../image/文都.jpg')`
                }
                if (json.features[1].properties.photo) {
                    document.getElementById('img-rank-2').style["background-image"] = `url(${json.features[1].properties.photo})`;
                }
                else {
                    document.getElementById('img-rank-2').style["background-image"] = `url('../image/文都.jpg')`
                }
                if (json.features[2].properties.photo) {
                    document.getElementById('img-rank-3').style["background-image"] = `url(${json.features[2].properties.photo})`;
                }
                else {
                    document.getElementById('img-rank-3').style["background-image"] = `url('../image/文都.jpg')`
                }
                document.getElementById("rank-text-1").innerHTML = `${json.features[0].properties.name}`
                document.getElementById("rank-text-2").innerHTML = `${json.features[1].properties.name}`
                document.getElementById("rank-text-3").innerHTML = `${json.features[2].properties.name}`





                map.addSource('markers', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            json.features[0], json.features[1], json.features[2]
                        ]
                    }
                });

                // 创建一个标注图层，并设置文字偏移量
                var layer = {
                    id: 'labelLayer',
                    type: 'symbol',
                    source: 'markers',
                    layout: {
                        'text-field': ['get', 'name'], // 设置文字内容为数据源中的name属性
                        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'], // 设置文字字体为Open Sans Bold或Arial Unicode MS Bold
                        'text-size': 12, // 设置文字大小为12像素
                        'text-offset': [0, 2.5], // 设置文字偏移量为向下1.5个单位
                        "text-allow-overlap": true,
                        "text-letter-spacing": 0.1,
                    }
                };
                // 将标注图层添加到地图上
                map.addLayer(layer);




                that.animatedPoint = new AnimatedPoint()
                //const animatedData = map.getSource("animatedPoint")._data;
                const animatedData = {
                    "type": "FeatureCollection",
                    "features": [
                        json.features[0], json.features[1], json.features[2]
                    ],
                }
                // 绘制示例数据
                that.animatedPoint.drawPoint(animatedData);
                // 移除示例数据的图层
                //animatedPoint.clearPoint()*/



                var coordinates1 = json.features[0].geometry.coordinates.slice();
                var popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false })
                    .setHTML("<img src='image/TOP1.png' alt='logo' style='width: 60px; height: 24px;'></img>"); // 设置HTML内容
                popup.setLngLat(coordinates1).addTo(map);

                var coordinates2 = json.features[1].geometry.coordinates.slice();
                var popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false })
                    .setHTML("<img src='image/TOP2.png' alt='logo' style='width: 60px; height: 24px;'></img>"); // 设置HTML内容
                popup.setLngLat(coordinates2).addTo(map);

                var coordinates3 = json.features[2].geometry.coordinates.slice();
                var popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false })
                    .setHTML("<img src='image/TOP3.png' alt='logo' style='width: 60px; height: 24px;'></img>"); // 设置HTML内容
                popup.setLngLat(coordinates3).addTo(map);




                var nameList = []
                var rateList = []
                var itemStyle1 = {
                    barBorderRadius: [4, 4, 4, 4],
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, // 渐变方向，从上到下
                        [
                            { offset: 0, color: '#c73a1c' }, // 渐变起始颜色，黄色 #ffff00
                            { offset: 1, color: '#d6b882' } // 渐变结束颜色，橙黄色 #ffe200
                        ]
                    )
                }
                var itemStyle2 = {
                    barBorderRadius: [4, 4, 4, 4],
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, // 渐变方向，从上到下
                        [
                            { offset: 0, color: '#483d8b' }, // 渐变起始颜色，青色 #87cefa
                            { offset: 1, color: '#c4c3d0' } // 渐变结束颜色，蓝色 #acdcfa
                        ]
                    )
                }
                for (var i = 0; i < 10; i++) {
                    nameList.push(json.features[i].properties.name)
                    rateList.push(json.features[i].properties.rating)
                }
                chart.setOption({
                    'yAxis': {
                        data: nameList
                    },
                    series: [{
                        data: [{ value: rateList[0], itemStyle: itemStyle1 },
                        { value: rateList[1], itemStyle: itemStyle1 },
                        { value: rateList[2], itemStyle: itemStyle1 },
                        { value: rateList[3], itemStyle: itemStyle2 },
                        { value: rateList[4], itemStyle: itemStyle2 },
                        { value: rateList[5], itemStyle: itemStyle2 },
                        { value: rateList[6], itemStyle: itemStyle2 },
                        { value: rateList[7], itemStyle: itemStyle2 },
                        { value: rateList[8], itemStyle: itemStyle2 },
                        { value: rateList[9], itemStyle: itemStyle2 }]
                    }]
                })




                //3d图层部分
                var buffered = {
                    "type": "FeatureCollection",
                    "features": []
                };

                // 遍历点要素集中的每一个要素
                json.features.forEach(function (point) {
                    // 对每一个点要素生成缓冲区
                    var buffer = turf.buffer(point, 200, { units: 'meters' });
                    // 将缓冲区要素添加到要素集中
                    buffered.features.push(buffer);
                });

                turf.propEach(json, function (currentProperties, featureIndex) {
                    currentProperties.mark = Math.pow(currentProperties.mark, 4.5);
                });

                map.addSource('buffered', {
                    type: "geojson",
                    data: buffered,
                })

                var minMark = Infinity;
                var maxMark = -Infinity;
                var featuress = json.features;
                for (var i = 0; i < featuress.length; i++) {
                    var mark = featuress[i].properties.mark;
                    if (mark < minMark) {
                        minMark = mark;
                    }
                    if (mark > maxMark) {
                        maxMark = mark;
                    }
                }

                var topMarks = [];
                // 把 mark 的值从大到小排序
                var sortedMarks = featuress.map(function (feature) {
                    return feature.properties.mark;
                }).sort(function (a, b) {
                    return b - a;
                });
                // 取前三个不同的值
                for (var i = 0; i < sortedMarks.length; i++) {
                    if (topMarks.length < 3 && !topMarks.includes(sortedMarks[i])) {
                        topMarks.push(sortedMarks[i]);
                    }
                }

                var topMarks4 = [];
                for (var i = 0; i < sortedMarks.length; i++) {
                    if (topMarks4.length < 4 && !topMarks4.includes(sortedMarks[i])) {
                        topMarks4.push(sortedMarks[i]);
                    }
                }

                maxMark = topMarks4[3]
                map.addLayer({
                    'id': '3DLayer',
                    'type': 'fill-extrusion',
                    'source': 'buffered',
                    'paint': {
                        'fill-extrusion-color': [
                            'case',
                            ['in', ['get', 'mark'], ['literal', topMarks]], '#ff7500', // 如果 mark 在前三，就用橙色 '#b26f8f'
                            ['interpolate', ['linear'], ['get', 'mark'], minMark, '#203a97', maxMark, '#e37a80'] // 否则用蓝红渐变色 minMark, '#18697f', maxMark, '#814c4c'
                        ],
                        // 根据源数据中的'mark'属性设置填充挤出高度
                        'fill-extrusion-height': ['^', ['get', 'mark'], 0.83],
                        //'fill-extrusion-height': ['get', 'mark'],
                        // 设置填充挤出透明度
                        'fill-extrusion-opacity': 0.7
                    }
                })
                map.setLayoutProperty('3DLayer', 'visibility', 'none');







                map.on('click', (event) => {
                    if (activeMap == serviceMap && map.getSource('mark')) {
                        const states = map.queryRenderedFeatures(event.point, {
                            layers: ['markLayer', '3DLayer']
                        });

                        if (states.length) {
                            document.getElementById('img').style["background-image"] = `url(${states[0].properties.photo})`;
                            document.getElementById('place-name-service').innerHTML = `${states[0].properties.name}`;
                            document.getElementById('address-service').innerHTML = `${states[0].properties.address}`;

                            document.getElementById("info-service").style.animation = "pop-out-fade-in 0.2s ease-out";
                            document.getElementById("info-service").style.display = "block";
                            document.getElementById("photo").style.animation = "pop-out-fade-in 0.2s ease-out";
                            document.getElementById("photo").style.display = "block";

                            currentX = event.lngLat.lng.toFixed(6);
                            currentY = event.lngLat.lat.toFixed(6);
                        }
                    }
                })
            }


            function errorCallback(error) {
                alert("获取位置信息失败：" + error.message);
            }
        })
    }


    removeAll() {
        var popups = document.querySelectorAll('.mapboxgl-popup');
        // 遍历每个Popup对象
        popups.forEach(function (popup) {
            // 调用remove方法来移除Popup对象
            popup.remove();
        })

        map.removeLayer('markLayer')
        map.removeSource('mark')
        map.removeLayer('3DLayer')
        map.removeSource('buffered')
        map.removeLayer('labelLayer');
        map.removeSource('markers')
        this.animatedPoint.clearPoint();
    }
}




function show2D() {
    //if(showType)
    map.setLayoutProperty('3DLayer', 'visibility', 'none');
    map.setLayoutProperty('animatedPoint', 'visibility', 'visible');
    map.setLayoutProperty('markLayer', 'visibility', 'visible');

    var popups = document.querySelectorAll('.mapboxgl-popup');
    popups.forEach(function (popup) {
        // 调用remove方法来移除Popup对象
        popup.style.display = 'block'
    })


    map.easeTo({
        // 设置目标中心点坐标
        center: [118.77266371770838, 32.03024757858705],
        // 设置目标缩放层级
        zoom: 12.5,
        // 设置目标水平倾角
        pitch: 48.8,
        // 设置目标方位角
        bearing: 0,
        // 设置过渡时间为 2 秒
        duration: 2000
    });
}

function show3D() {
    map.setLayoutProperty('3DLayer', 'visibility', 'visible');
    map.setLayoutProperty('animatedPoint', 'visibility', 'none');
    map.setLayoutProperty('markLayer', 'visibility', 'none');
    var popups = document.querySelectorAll('.mapboxgl-popup');
    popups.forEach(function (popup) {
        // 调用remove方法来移除Popup对象
        popup.style.display = 'none'
    })

    map.easeTo({
        // 设置目标中心点坐标
        center: [118.75568662998688, 32.17573184349824],
        // 设置目标缩放层级
        zoom: 10.3,
        // 设置目标水平倾角
        pitch: 70.67,
        // 设置目标方位角
        bearing: 0,
        // 设置过渡时间为 2 秒
        duration: 2000
    });
}