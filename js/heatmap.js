
function createHeatmap() {
    map.addLayer(
        {
            id: "heatmap",
            type: "heatmap",
            source: "places",
            paint: {
                /*
                "heatmap-weight": [
                    "step",
                    ["get", "month"],
                    0,
                    1,
                    1,
                    2,
                    0
                ],*/
                "heatmap-intensity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    0.2,
                    16,
                    2
                ],
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0,
                    "rgba(0, 0, 0, 0)",
                    0.1,
                    "#927903",
                    0.3,
                    "#ffd403",
                    0.5,
                    "#ffcb1f",
                    0.7,
                    "#F17E11",
                    1,
                    '#F1210C'
                ],
                "heatmap-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    4,
                    5,
                    16,
                    10,
                    32,
                    15,
                    64,
                    20,
                    128,
                    25,
                    256,
                    30,
                    512,
                    35,
                    1024
                ],
                "heatmap-opacity": 0.7
            }
        }
    );
    map.setLayoutProperty('heatmap', 'visibility', 'none');
    map.moveLayer("heatmap", 'placeLayer')
}

function showHeatmap() {
    map.setLayoutProperty('heatmap', 'visibility', 'visible');
}

function closeHeatmap() {
    map.setLayoutProperty('heatmap', 'visibility', 'none');
}