//获取WGS84的经纬坐标(支持edge)
const key = '3aef2dd683075b300192fb3d5e5ac82e';
currentX = 0;
currentY = 0;

function locate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("该浏览器不支持获取当前位置信息");
    }

    function successCallback(position) {
        const latitude = position.coords.latitude; // 纬度
        const longitude = position.coords.longitude; // 经度
        console.log("经度：" + longitude);
        console.log("纬度：" + latitude);
        return longitude + ',' + latitude
    }

    function errorCallback(error) {
        alert("获取位置信息失败：" + error.message);
    }
}

/*
function locateByGaoDe() {
    //获取某地址的经纬度可用于移动端跳转app导航
    $.ajax({
        type: "GET",
        url:
            'https://restapi.amap.com/v3/ip?ip=153.3.61.146&output=json&key=' + key,
        success: function (response) {
            //location = response.geocodes[0] && response.geocodes[0].location.split(",");
            console.log(response);
        },
        error: function (e) {
            console.log("地址坐标获取失败", e);
        },
    });
}*/

function convertCoord(coord) {
    const PI = Math.PI;
    const a = 6378245.0;  //长半轴
    const ee = 0.00669342162296594323; //扁率
    var lng = coord[0] * 1.0;
    var lat = coord[1] * 1.0;
    lat = + lat
    lng = + lng

    let dlat = transformlat(lng - 105.0, lat - 35.0)
    let dlng = transformlng(lng - 105.0, lat - 35.0)
    let radlat = lat / 180.0 * PI
    let magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    let sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
    let mglat = lat + dlat
    let mglng = lng + dlng
    return [lng * 2 - mglng, lat * 2 - mglat]

    /*
    var x = coord[0] * 1.0 - 0.005;
    var y = coord[1] * 1.0 + 0.0015;
    console.log(x, y)
    return [x, y];*/
    function transformlat(lng, lat) {
        lat = +lat
        lng = +lng
        let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
        return ret
    }

    function transformlng(lng, lat) {
        lat = +lat
        lng = +lng
        let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
        return ret
    }

}

function navigate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("该浏览器不支持获取当前位置信息");
    }

    function successCallback(position) {

        const latitude = position.coords.latitude; // 纬度
        const longitude = position.coords.longitude; // 经度

        const locationStr = longitude + ',' + latitude

        $.ajax({
            type: "GET",
            url:
                "https://restapi.amap.com/v3/assistant/coordinate/convert?locations=" + locationStr
                + '&coordsys=gps&output=json&key=' + key,
            success: function (response) {
                if (lineLayerType != '') {
                    map.removeLayer(lineLayerType + '-lineStep');
                    map.removeLayer(lineLayerType + '-lineStep-outline');
                    map.removeSource(lineLayerType + '-step');
                    anima.remove();
                }

                var locations = response.locations;
                //console.log(locations)
                locations = [118.914323,32.114547]

                switch (pathType) {
                    case 'walking':
                        $.ajax({
                            type: "GET",
                            url:
                                'https://restapi.amap.com/v3/direction/walking?origin=' + locations + '&destination='
                                + currentX + ',' + currentY + '&key=' + key,
                            success: function (response) {
                                console.log(response)
                                const steps = response.route.paths[0].steps;
                                lineLayerType = 'w';
                                var coordinates = [];

                                for (var i in steps) {
                                    var step = steps[i].polyline;
                                    var locArr = step.split(';');
                                    //var coordinates = [];
                                    for (var j in locArr) {
                                        var coordinate = locArr[j].split(',');
                                        coordinate = convertCoord(coordinate);
                                        coordinates.push(coordinate);
                                    }
                                }

                                map.addSource('w-step', {
                                    type: 'geojson',
                                    data: {
                                        type: "Feature",
                                        geometry: {
                                            type: 'LineString',
                                            coordinates: coordinates
                                        }
                                    }
                                });

                                map.addLayer({
                                    id: 'w-lineStep-outline',
                                    type: "line",
                                    source: 'w-step',
                                    layout: {
                                        'line-cap': "round",
                                        'line-join': "round",
                                    },
                                    paint: {
                                        "line-width": 14,
                                        "line-opacity": 0.8, // 线条透明度
                                        "line-color": '#ffffff', // 线条颜色
                                    }
                                });

                                map.addLayer({
                                    id: 'w-lineStep',
                                    type: "line",
                                    source: 'w-step',
                                    layout: {
                                        'line-cap': "round",
                                        'line-join': "round",
                                    },
                                    paint: {
                                        //"line-gap-width": 5,
                                        // 设置 line 的宽度为 6 像素
                                        "line-width": 8,
                                        "line-opacity": 0.8, // 线条透明度
                                        "line-color": "#BDFFCE", // 线条颜色
                                    }
                                });

                                const lineSource = map.getSource("w-step");
                                createAnima(lineSource);
                            },
                            error: function (e) {
                                console.log("导航失败", e);
                            },
                        })
                    break;
                    case 'driving':
                        $.ajax({
                            type: "GET",
                            url:
                                'https://restapi.amap.com/v3/direction/driving?origin=' + locations + '&destination='
                                + currentX + ',' + currentY + '&key=' + key,
                            success: function (response) {
                                console.log(response)
                                const steps = response.route.paths[0].steps;
                                lineLayerType = 'd';
                                var coordinates = [];

                                for (var i in steps) {
                                    var step = steps[i].polyline;
                                    var locArr = step.split(';');
                                    
                                    for (var j in locArr) {
                                        var coordinate = locArr[j].split(',');
                                        coordinate = convertCoord(coordinate);
                                        coordinates.push(coordinate);
                                    }
                                }

                                map.addSource('d-step', {
                                    type: 'geojson',
                                    data: {
                                        type: "Feature",
                                        geometry: {
                                            type: 'LineString',
                                            coordinates: coordinates
                                        }
                                    }
                                });

                                map.addLayer({
                                    id: 'd-lineStep-outline',
                                    type: "line",
                                    source: 'd-step',
                                    layout: {
                                        'line-cap': "round",
                                        'line-join': "round",
                                    },
                                    paint: {
                                        "line-width": 14,
                                        "line-opacity": 0.8, // 线条透明度
                                        "line-color": '#ffffff', // 线条颜色
                                    }
                                });

                                map.addLayer({
                                    id: 'd-lineStep',
                                    type: "line",
                                    source: 'd-step',
                                    layout: {
                                        'line-cap': "round",
                                        'line-join': "round",
                                    },
                                    paint: {
                                        //"line-gap-width": 5,
                                        // 设置 line 的宽度为 6 像素
                                        "line-width": 8,
                                        "line-opacity": 0.8, // 线条透明度
                                        "line-color": "#F8E4B6", // 线条颜色
                                    }
                                });

                                const lineSource = map.getSource("d-step");
                                createAnima(lineSource);
                            },
                            error: function (e) {
                                console.log("导航失败", e);
                            },
                        })
                    break;
                    case 'bicycling':
                        $.ajax({
                            type: "GET",
                            url:
                                'https://restapi.amap.com/v4/direction/bicycling?origin=' + locations + '&destination='
                                + currentX + ',' + currentY + '&key=' + key,
                            success: function (response) {
                                console.log(response)
                                const steps = response.data.paths[0].steps;
                                lineLayerType = 'b';
                                var coordinates = [];

                                for (var i in steps) {
                                    var step = steps[i].polyline;
                                    var locArr = step.split(';');
                                    for (var j in locArr) {
                                        var coordinate = locArr[j].split(',');
                                        coordinate = convertCoord(coordinate);
                                        coordinates.push(coordinate);
                                    }
                                }

                                map.addSource('b-step', {
                                    type: 'geojson',
                                    data: {
                                        type: "Feature",
                                        geometry: {
                                            type: 'LineString',
                                            coordinates: coordinates
                                        }
                                    }
                                });

                                map.addLayer({
                                    id: 'b-lineStep-outline',
                                    type: "line",
                                    source: 'b-step',
                                    layout: {
                                        'line-cap': "round",
                                        'line-join': "round",
                                    },
                                    paint: {
                                        "line-width": 14,
                                        "line-opacity": 0.8, // 线条透明度
                                        "line-color": '#ffffff', // 线条颜色
                                    }
                                });

                                map.addLayer({
                                    id: 'b-lineStep',
                                    type: "line",
                                    source: 'b-step',
                                    layout: {
                                        'line-cap': "round",
                                        'line-join': "round",
                                    },
                                    paint: {
                                        //"line-gap-width": 5,
                                        // 设置 line 的宽度为 6 像素
                                        "line-width": 8,
                                        "line-opacity": 0.8, // 线条透明度
                                        "line-color": "#BDE7F6", // 线条颜色
                                    }
                                });

                                const lineSource = map.getSource("b-step");
                                createAnima(lineSource);
                            },
                            error: function (e) {
                                console.log("导航失败", e);
                            },
                        })
                    break;
                }
            },
            error: function (e) {
                console.log("地址坐标获取失败", e);
            },
        });
        //const lon = location[0];
        //const lat = location[1];
    }

    function errorCallback(error) {
        alert("获取位置信息失败：" + error.message);
    }
}