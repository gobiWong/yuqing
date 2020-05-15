//行政区域划分
export const getBoundary = map => {
    var bdary = new BMap.Boundary();
    bdary.get("东营市东营区", function (rs) {
        //获取行政区域
        map.clearOverlays(); //清除地图覆盖物
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
            this.$message.error("未能获取当前输入行政区域");
            return;
        }
        var pointArray = [];
        for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {
                strokeWeight: 2,
                strokeColor: "#D89544",
                fillColor: "#F8DAB6",
                strokeStyle: "dashed"
            }); //建立多边形覆盖物
            map.addOverlay(ply); //添加覆盖物
            pointArray = pointArray.concat(ply.getPath());
        }
        map.setViewport(pointArray); //调整视野
    });
}

//地球模式
export const getEarth = map => {
    map.setMapType(BMAP_HYBRID_MAP); // 设置地图类型为地球模式
}

//地图模式
export const getMap = map => {
    map.setMapType(BMAP_NORMAL_MAP); //设置地图模式
}
