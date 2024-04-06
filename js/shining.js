class AnimatedPoint {
    constructor() {
        const size = 140;
        const pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            // When the layer is added to the map,
            // get the rendering context for the map canvas.
            onAdd: function () {
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');
            },

            // Call once before every frame where the icon will be used.
            render: function () {
                const duration = 1000;
                const t = (performance.now() % duration) / duration;

                const radius = (size / 2) * 0.3;
                const outerRadius = (size / 2) * 0.7 * t + radius;
                //const outerRadius = radius;
                const context = this.context;

                // Draw the outer circle.
                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    outerRadius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
                context.fill();

                // Draw the inner circle.
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    radius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = 'rgba(255, 100, 100, 1)';
                context.strokeStyle = 'white';
                context.lineWidth = 2 + 4 * (1 - t);
                context.fill();
                context.stroke();

                // Update this image's data with data from the canvas.
                this.data = context.getImageData(
                    0,
                    0,
                    this.width,
                    this.height
                ).data;

                // Continuously repaint the map, resulting
                // in the smooth animation of the dot.
                map.triggerRepaint();

                // Return `true` to let the map know that the image was updated.
                return true;
            }
        };
        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
    }


    // 绘制点
    drawPoint(features) {
        // 如果已经存在名为animatedPoint的数据源了，就更新数据
        // 否则就新建一个数据源和图层
        if (map.getSource('animatedPoint')) {
            map.getSource('animatedPoint').setData({
                type: "FeatureCollection",
                features: features,
            });
        } else {
            map.addSource('animatedPoint', {
                type: "geojson",
                data: features
            })
            map.addLayer({
                'id': 'animatedPoint', //图层ID
                'type': 'symbol', //图层类型
                'source': 'animatedPoint', //数据源
                layout: {
                    'icon-image': 'pulsing-dot',
                    'icon-anchor': 'center',
                },
            })
        }
    }

    // 移除点图层
    clearPoint() {
        if (map.getSource('animatedPoint')) {
            map.removeLayer('animatedPoint')
            map.removeSource('animatedPoint')
            map.removeImage('pulsing-dot')
        }
    }
}