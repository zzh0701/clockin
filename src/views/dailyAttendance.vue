<template>
    <div class="app-modal">
        <div id="baidumap"></div>
        <div class="content">
            <div class="circle">
                <div class="circle-top">
                    <span>打&nbsp;&nbsp;卡</span>
                </div>
                <div class="circle-bottom">
                    <span>{{curTime}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BMap from 'BMap';
export default {
    name: "dailyAttendance",
    data() {
        return {
            fade: true, //控制进入对话
            startTime: '',
            map: null,
            curTime: new Date(),
            // timer: ''
        };
    },
    methods: {
        rentCheck() {
        },
        initMap() {
            this.map = new BMap.Map("baidumap");
            var point = new BMap.Point(120.12979, 30.25949);
            this.map.centerAndZoom(point,15);
            this.map.enableScrollWheelZoom();
            this.map.enableContinuousZoom();
            var circle = new BMap.Circle(point,500,{
                strokeColor:"#000046", 
                strokeWeight: 0.01, 
                strokeOpacity: 0.0,
                fillColor: "#000046", 
                fillOpacity: 0.4
            }); //创建圆
            var circleM = new BMap.Circle(point,300,{
                strokeColor:"#000046", 
                strokeWeight: 0.01, 
                strokeOpacity: 0.0,
                fillColor: "#000046", 
                fillOpacity: 0.5
            }); //创建圆
            var circleSmall = new BMap.Circle(point,50,{
                strokeColor:"#000046", 
                strokeWeight: 0.01, 
                strokeOpacity:0.0,
                fillColor: "#000046", 
                fillOpacity: 0.8
            }); //创建圆
            this.map.addOverlay(circle);
            this.map.addOverlay(circleM);
            this.map.addOverlay(circleSmall);
            // this.map.addEventListener('click', function(e) {
            //     alert(e.point.lng + "," + e.point.lat);
            // })
            var worker = new BMap.Point(120.127788,30.258254);
            var iconPng = new BMap.Icon(require("../../static/img/gps.png"), new BMap.Size(48,48),{
                imageSize: new BMap.Size(20, 20),
            });
            var maker = new BMap.Marker(worker,{icon:iconPng});
            this.map.addOverlay(maker);
        }
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    mounted() {
      this.$nextTick(()=> {
          setTimeout(() => {
            this.initMap();
          }, 1500);
      })
      let that = this;
      this.timer = setInterval(function() {
          that.curTime = new Date().toISOString().replace("T", " ").substring(0,19);
      })
    }
};
</script>
<style lang="scss" scoped>
@import "~@/mixin.scss";
.app-modal {
  width: 100%;
  padding-top: px2rem(30);
}
#baidumap {
    height: px2rem(600);
    width: 100%;
}
.content {
    width: 100%;
    .circle {
        margin: 0 auto;
        padding: px2rem(20);
        width: px2rem(200);
        height: px2rem(200);
        border-radius: 50%;
        background-image: url('../../static/img/bg.jpg');
        background-size: 100% 100%;
    }
    .circle-top {
        margin-bottom: px2rem(20);
        span {
            color: #ffffff;
            font-size: px2rem(48);
        }
    }
    .circle-bottom {
        span {
            color: #ffffff;
            font-size: px2rem(30);
        }
    }
}

</style>