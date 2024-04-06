class serviceMap {
    constructor() {

    }

    create() {
        showServiceLayer();
        //document.getElementById("info-service").style.display = 'block';
        document.getElementById("offcanvasExample").style.display = 'block';
        document.getElementById("open").style.display = 'block';

        map.easeTo({
            // 设置目标中心点坐标
            center: [118.8146451663406, 32.07033216531005],
            // 设置目标缩放层级
            zoom: 9.8,
            // 设置目标水平倾角
            pitch: 0,
            // 设置目标方位角
            bearing: 0,
            // 设置过渡时间为 2 秒
            duration: 2000
        });
    }

    remove() {
        closeInfo();
        closeServiceLayer();
        document.getElementById("offcanvasExample").style.display = 'none';
        document.getElementById("open").style.display = 'none';

        if (lineLayerType != '') {
            map.removeLayer(lineLayerType + '-lineStep');
            map.removeLayer(lineLayerType + '-lineStep-outline');
            map.removeSource(lineLayerType + '-step');
            anima.remove();
        }

        lineLayerType = '';

        if (cal != null)
            cal.removeAll();
        cal = null;
        /*document.getElementById("info-place").style = 'none';*/
    }
}
