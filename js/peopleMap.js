class peopleMap {
    constructor() {

    }

    create() {
        showPeopleLayer();

        timeline.setOption({
            baseOption: {
                timeline: {
                    show: true,
                    currentIndex: 0
                },
            }
        })

        map.easeTo({
            // 设置目标中心点坐标
            center: [118.789724428743, 32.02977231731545],
            // 设置目标缩放层级
            zoom: 12.5,
            // 设置目标水平倾角
            pitch: 63.1,
            // 设置目标方位角
            bearing: -9.9,
            // 设置过渡时间为 2 秒
            duration: 2000
        });
        //document.getElementById("info-people").style.display = 'block';
    }

    remove() {
        closePeopleLayer();
        
        timeline.setOption({
            baseOption: {
                timeline: {
                    show: false,
                },
            }
        })
        closeInfo();
        /*document.getElementById("info-people").style = 'none';*/
    }
}