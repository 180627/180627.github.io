class placeMap {
    constructor() {

    }

    create() {
        $('[name="status"]').bootstrapSwitch({
            onText: "热力图开启",
            offText: "热力图关闭",
            onColor: "success",
            offColor: "default",
            labelWidth: 10,
            size: "mini",
            handleWidth: 70,
            onSwitchChange: function (event, state) {
                if (state == true) {
                    showHeatmap();
                } else {
                    closeHeatmap();
                }
            }
        })

        showPlaceLayer();
        document.getElementById('showHeatmap').style.display = 'block';
        document.getElementById('showHeatmapSwitch').style.display = 'block';
        //document.getElementById("info-place").style.display = 'block';
        document.getElementById('legend').style.display = 'block';

        const buttons = document.querySelectorAll(".btn-district");
        buttons.forEach(function(button){
            button.style.display ='block ';
        });
        map.easeTo({
            // 设置目标中心点坐标
            center: [118.76327497085276, 32.065340326662366],
            // 设置目标缩放层级
            zoom: 11,
            // 设置目标水平倾角
            pitch: 45.54,
            // 设置目标方位角
            bearing: -20.27,
            // 设置过渡时间为 2 秒
            duration: 2000
        });
    }

    remove() {
        closeInfo();        //必须在关闭图层前完成
        closePlaceLayer();
        document.getElementById('showHeatmapSwitch').style.display = 'none';
        document.getElementById('showHeatmap').style.display = 'none';
        closeHeatmap();

        var legendItems = document.querySelectorAll(".legend-item");
        legendItems.forEach(function (item) {
            item.classList.remove("legend-item-inactive");
            item.classList.add("legend-item-active");
        });
        map.setPaintProperty("placeLayer", "circle-opacity", 1);
        map.setPaintProperty("placeLayer", "circle-stroke-opacity", 1);
        map.setFilter('heatmap', null);

        document.getElementById('legend').style.display = 'none';

        $('[name="status"]').bootstrapSwitch('state', false);
        const buttonContainer = document.querySelector('div');

        // 选择所有按钮并遍历 buttons = document.queryselectall
        const buttons = document.querySelectorAll('.btn-district');
        buttons.forEach(function(button) {
            // 隐藏按钮
            button.style.display = 'none';
        });
        /*document.getElementById("info-place").style = 'none';*/
    }
}
