mapboxgl.accessToken = 'pk.eyJ1IjoibGlseXlhZ24iLCJhIjoiY2xla3JxYnZkMG1xNDNybnUxbzNwZGo5bSJ9.sJQbRyPwzwxLtEdLfSjj4g';
//pk.eyJ1IjoibGlseXlhZ24iLCJhIjoiY2xla3JxYnZkMG1xNDNybnUxbzNwZGo5bSJ9.sJQbRyPwzwxLtEdLfSjj4g
//pk.eyJ1IjoiZmxpY2tlcjA1NiIsImEiOiJjbGZsOWY5dTAwMzFvM3FvM2RqancyNnAxIn0.Ovj3REHEySVbQEF3DF8SYQ
map = new mapboxgl.Map({
    container: 'map', // container id
    style:'mapbox://styles/lilyyagn/cltcfvvaq018901pie12jg7kk'  , // replace this with your style URL
    center:  [118.789724428743, 32.02977231731545],
    zoom: 12.5,
    pitch: 63.1,
    bearing: -9.9,
    logoPosition: 'bottom-right',
});

//'mapbox://styles/lilyyagn/cltcfvvaq018901pie12jg7kk' slightly-yellow
//'mapbox://styles/lilyyagn/cltcfkp0k00nm01pt8adx8vdr' slightly-green
//'mapbox://styles/lilyyagn/cltbm06q000m201oiaxe72q6f' white-base


map.on('load', function () {
    timeline = createTimeline();   //根据年份序列创建时间轴

    timeline.on("timelinechanged", function (e) {
        currentDyna = dynasty[e.currentIndex];

        map.setFilter('peopleLayer', ['==', '朝代', currentDyna]);
        map.setFilter('peopleLabel', ['==', '朝代', currentDyna]);
        map.setFilter('peopleLabel2', ['==', '朝代', currentDyna]);
    })

    map.addSource('places', {
        type: "geojson",
        data: "data/文学地标84.geojson",
        //cluster: true,
        //clusterMaxZoom: 15, // Max zoom to cluster points on
        //clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)*/
    });

    map.addSource('people', {
        type: "geojson",
        data: "data/文人最终84.geojson",
    });

    map.addSource('service', {
        type: "geojson",
        data: "data/文学数据库.geojson",
    })

    map.addLayer({
        'id': 'placeLayer',
        'type': 'circle',
        'source': 'places',
        'paint': {
            'circle-color': [
                'match',        //数值则为step
                ['get', 'type'],
                '景点', colorList['景点'],
                '图书馆', colorList['图书馆'],
                '书店', colorList['书店'],
                '博物馆', colorList['博物馆'],
                '展览馆', colorList['展览馆'],
                '档案馆', colorList['档案馆'],
                '文化宫', colorList['文化宫'],
                '出版社', colorList['出版社'],
                '杂志社', colorList['杂志社'],
                '报社', colorList['报社'],
                /*other*/ '#ccc'
            ],
            'circle-radius': ["interpolate", ["linear"], ["zoom"], 10, 3, 15, 12],//10, 3, 15, 10
            'circle-stroke-width': 1,
            'circle-stroke-color': '#C3DCBE'
        },
        'layout': {
            'visibility': 'none'
        }
    });

    map.addLayer({
        'id': 'peopleLayer',
        'type': 'circle',
        'source': 'people',
        'paint': {
            'circle-color': '#AD6678',//'rgb(3, 105, 129)',
            'circle-radius': ["interpolate", ["linear"], ["zoom"], 10, 5, 15, 12],
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff'
        },
        'layout': {
            'visibility': 'none'
        }
    });

    // 创建一个标注图层，并设置文字偏移量
    map.addLayer({
        id: 'peopleLabel',
        type: 'symbol',
        source: 'people',
        layout: {
            'text-field': ['get', 'name'], // 设置文字内容为数据源中的name属性
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'], // 设置文字字体为Open Sans Bold或Arial Unicode MS Bold
            'text-size': 13, // 设置文字大小为12像素
            'text-offset': [0, 3.8],
            "text-letter-spacing": 0.1,
            "text-max-width": 11,
            'visibility': 'none',
            "text-allow-overlap": false
        },
        paint: {
            "text-halo-color": 'white',
            'text-halo-width': 1.5,
            "text-halo-blur": 1,
        }
    });
    
    // 创建一个标注图层，并设置文字偏移量
    map.addLayer({
        id: 'peopleLabel2',
        type: 'symbol',
        source: 'people',
        layout: {
            'text-field': ['get', '相关文人'], // 设置文字内容为数据源中的name属性
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'], // 设置文字字体为Open Sans Bold或Arial Unicode MS Bold
            'text-size': 12, // 设置文字大小为12像素
            'text-offset': [0, 2],
            "text-letter-spacing": 0.1,
            "text-max-width": 11,
            'visibility': 'none',
            "text-allow-overlap": false
        },
        paint: {
            'text-color': 'rgb(165, 65, 4 )',
            "text-halo-color": 'white',
            'text-halo-width': 1.5,
            "text-halo-blur": 1,
        }
    });

    map.addLayer({
        'id': 'serviceLayer',
        'type': 'circle',
        'source': 'service',
        'paint': {
            'circle-color': '#346c9d',//'#08658d',
            'circle-radius': ["interpolate", ["linear"], ["zoom"], 10, 4, 15, 13],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#DFE1EC'
        },
        'layout': {
            'visibility': 'none'
        }
    })


    // 从外部域名加载图片
    map.loadImage(
        '../image/bicycle.png', // svg的url
        (error, image) => {
            if (error) throw error;
            // 将图片添加到style中作为图标
            map.addImage('icon-bicycle', image);
        }
    );

    // 从外部域名加载图片
    map.loadImage(
        '../image/car.png', // svg的url
        (error, image) => {
            if (error) throw error;
            // 将图片添加到style中作为图标
            map.addImage('icon-drive', image);
        }
    );

    // 从外部域名加载图片
    map.loadImage(
        '../image/walk.png', // svg的url
        (error, image) => {
            if (error) throw error;
            // 将图片添加到style中作为图标
            map.addImage('icon-walk', image);
        }
    );

    //var div = document.getElementById('info');
    //var closeButton = document.getElementById("close-button");
    var closeButtons = document.querySelectorAll(".close-button");

    map.on('click', (event) => {
        const states = map.queryRenderedFeatures(event.point, {
            layers: ['placeLayer', 'peopleLayer', 'serviceLayer']
        });
        if (states.length) {
            if (activeMap == peopleMap) {
                if (states[0].properties.photo != null) {
                    document.getElementById('img').style["background-image"] = `url(${states[0].properties.photo})`;
                }
                else {
                    document.getElementById('img').style["background-image"] = `url('../image/文都.jpg')`
                }
                document.getElementById('place-name-people').innerHTML = `${states[0].properties.name}`;
                document.getElementById('people').innerHTML = `${states[0].properties['相关文人']}`;
                document.getElementById('works').innerHTML = `${states[0].properties['相关文学作品']}`;
                document.getElementById('information').innerHTML = `${states[0].properties.discription}`;


            }
            if (activeMap == placeMap) {
                if (states[0].properties.photo != null) {
                    document.getElementById('img').style["background-image"] = `url(${states[0].properties.photo})`;
                }
                else {
                    document.getElementById('img').style["background-image"] = `url('../image/文都.jpg')`
                }
                document.getElementById('place-name-place').innerHTML = `${states[0].properties.name}`;
                //document.getElementById('photo').style["background-image"] = 'url("http://store.is.autonavi.com/showpic/b47ed5eec55f862d3c184e5000a8e125")';
                document.getElementById('address-place').innerHTML = `${states[0].properties.address}`;
                document.getElementById('region-place').innerHTML = `${states[0].properties.aname}`;
                document.getElementById('type-place').innerHTML = `${states[0].properties.type}`;
            }
            if (activeMap == serviceMap) {
                if (states[0].properties.photo != null) {
                    document.getElementById('img').style["background-image"] = `url(${states[0].properties.photo})`;
                }
                else {
                    document.getElementById('img').style["background-image"] = `url('../image/文都.jpg')`
                }
                document.getElementById('place-name-service').innerHTML = `${states[0].properties.name}`;
                //document.getElementById('photo').style["background-image"] = 'url("http://store.is.autonavi.com/showpic/b47ed5eec55f862d3c184e5000a8e125")';
                document.getElementById('address-service').innerHTML = `${states[0].properties.address}`;
                //document.getElementById('region-service').innerHTML = `${states[0].properties.aname}`;
            }


            currentX = event.lngLat.lng.toFixed(6);
            currentY = event.lngLat.lat.toFixed(6);
            /*
            // 判断div标签的显示状态
            if (div.style.display != "block") {
                //div.style.animation = "none";
                //div.style.animation = "";
                div.style.animation = "pop-out-fade-in 0.2s ease-out";
                div.style.display = "block";
            }*/

            /*
            var elements = document.querySelectorAll(".map-overlay");
            // 遍历每个标签
            elements.forEach(function (element) {
                // 给每个标签添加动画
                // 播放收缩消失的动画效果，并在动画结束后，把显示状态设置为none
                element.style.animation = "pop-out-fade-in 0.2s ease-out";
                element.style.display = "block";
            });*/

            document.getElementById("photo").style.animation = "pop-out-fade-in 0.2s ease-out";
            document.getElementById("photo").style.display = "block";
            if (activeMap == peopleMap) {
                document.getElementById("info-people").style.animation = "pop-out-fade-in 0.2s ease-out";
                document.getElementById("info-people").style.display = "block";
            }
            if (activeMap == placeMap) {
                document.getElementById("info-place").style.animation = "pop-out-fade-in 0.2s ease-out";
                document.getElementById("info-place").style.display = "block";
            }
            if (activeMap == serviceMap) {
                document.getElementById("info-service").style.animation = "pop-out-fade-in 0.2s ease-out";
                document.getElementById("info-service").style.display = "block";
            }


        }
    });

    // 遍历每个标签
    closeButtons.forEach(function (closeButton) {
        closeButton.addEventListener("click", function () {
            closeInfo();
        });
    });
    /*
    // 给关闭按钮添加点击事件监听器
    closeButton.addEventListener("click", function () {
        closeInfo();
        /*
        div.style.animation = "shrink-fade-out .5s ease-out";
        setTimeout(function () {
            div.style.display = "none";
        }, 500);
    });*/


    var legendItems = document.querySelectorAll(".legend-item");
    // 给每个标签元素添加点击事件监听器
    legendItems.forEach(function (item) {
        item.addEventListener("click", function () {
            // 判断当前点击的标签是否已经是激活状态
            if (item.classList.contains("legend-item-active")) {
                // 如果是，判断是否所有的标签都为激活状态
                var allActive = true;
                legendItems.forEach(function (other) {
                    if (other !== item && !other.classList.contains("legend-item-active")) {
                        allActive = false;
                    }
                });
                // 如果是，遍历其他的标签元素，将它们设置为非激活状态
                if (allActive) {
                    legendItems.forEach(function (other) {
                        if (other !== item) {
                            other.classList.remove("legend-item-active");
                            other.classList.add("legend-item-inactive");
                        }
                    });
                    map.setPaintProperty(
                        "placeLayer",
                        "circle-opacity",
                        ["case", ["==", ["get", "type"], item.id], 1, 0.2]
                    );
                    map.setPaintProperty(
                        "placeLayer",
                        "circle-stroke-opacity",
                        ["case", ["==", ["get", "type"], item.id], 1, 0.2]
                    );
                    map.setFilter('heatmap', ['==', 'type', item.id]);
                } else {
                    // 如果不是，遍历其他的标签元素，将它们设置为激活状态
                    legendItems.forEach(function (other) {
                        if (other !== item) {
                            other.classList.remove("legend-item-inactive");
                            other.classList.add("legend-item-active");
                        }
                    });
                    map.setPaintProperty("placeLayer", "circle-opacity", 1);
                    map.setPaintProperty("placeLayer", "circle-stroke-opacity", 1);
                    map.setFilter('heatmap', null);
                }
            } else {
                // 如果不是，切换当前点击的标签的激活状态
                item.classList.toggle("legend-item-active");
                item.classList.toggle("legend-item-inactive");
                map.setPaintProperty(
                    "placeLayer",
                    "circle-opacity",
                    ["case", ["==", ["get", "type"], item.id], 1, 0.2]
                );
                map.setPaintProperty(
                    "placeLayer",
                    "circle-stroke-opacity",
                    ["case", ["==", ["get", "type"], item.id], 1, 0.2]
                );
                map.setFilter('heatmap', ['==', 'type', item.id]);
                // 遍历其他的标签元素，将它们设置为非激活状态
                legendItems.forEach(function (other) {
                    if (other !== item) {
                        other.classList.remove("legend-item-active");
                        other.classList.add("legend-item-inactive");
                    }
                });
            }
        });
    });


    createHeatmap();

    activeMap.create();


    map.on('click', (event) => {
        console.log(map.getCenter())
        console.log(map.getZoom())
        console.log(map.getPitch())
        console.log(map.getBearing())
    })
})

function closeInfo() {

    var elements = document.querySelectorAll(".map-overlay");
    // 遍历每个标签
    elements.forEach(function (element) {
        // 给每个标签添加动画
        // 播放收缩消失的动画效果，并在动画结束后，把显示状态设置为none
        element.style.animation = "shrink-fade-out .5s ease-out";
        setTimeout(function () {
            element.style.display = "none";
        }, 500); // 这里的时间要等于动画的持续时间
    });
    /*
    // 播放收缩消失的动画效果，并在动画结束后，把显示状态设置为none
    var div = document.getElementById('info');
    div.style.animation = "shrink-fade-out .5s ease-out";
    setTimeout(function () {
        div.style.display = "none";
    }, 500); // 这里的时间要等于动画的持续时间*/
}

