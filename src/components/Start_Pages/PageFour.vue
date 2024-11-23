<template>
    <div id="page">
        <div id="bg"></div>
        <div id="content">
            <h2>其他产品</h2>
            <div id="product">
                <div class="normalScroll"><a href="http://124.220.82.47:9090">旧版wkyd(应该已停止服务) </a></div>
                <div class="normalScroll"><a :href="`${service}/run`">wsn(springboot)内置wkyd</a></div>
                <!-- <div>
                    <input type="number" placeholder="Xlong经度" v-model="inputx">
                    <input type="number" placeholder="Ylant经度" v-model="inputy">
                    <input type="button" @click="calLtoxy">
                    <p>{{ out }}</p>
                </div> -->
                <!-- <div>学习强国</div>
                <div>图片ai换脸</div>
                <div>视频ai换脸</div>
                <div>视频ai换声</div> -->
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            service: import.meta.env.VITE_WSN_SERVICE_URL,
            canvasWidth: 690,//画布宽度
            canvasHeight: 690,//画布高度
            OriginSX: 118.766916,//原点经度坐标
            OriginSY: 36.891086,//原点纬度坐标
            OriginEX: 118.781829,//对点经度坐标
            OriginEY: 36.879227,//对点纬度坐标
            inputx: 0,
            inputy: 0,
            out: {
                x: 0,
                y: 0
            },
        };
    },
    computed: {
        RatioX() {
            return (this.OriginEX - this.OriginSX) / this.canvasWidth;
        },
        RatioY() {
            return (this.OriginEY - this.OriginSY) / this.canvasHeight;
        },
        RatioX_half() {
            return (this.OriginEX - this.OriginSX) / (this.canvasWidth / 2);
        },
        RatioY_half() {
            return (this.OriginEY - this.OriginSY) / (this.canvasHeight / 2);
        }
    },
    methods: {
        calLtoxy() {
            console.log("全分比率: RatioX", this.RatioX, "  RatioY", this.RatioY)
            console.log("半分比率: RatioX_half", this.RatioX_half, "  RatioY_half", this.RatioY_half)
            let ituse = {
                x: (this.inputx - this.OriginSX) / this.RatioX_half,
                y: (this.inputy - this.OriginSY) / this.RatioY_half
            }
            console.log("原点: OriginSX", this.OriginSX, "  OriginSY", this.OriginSY, " 物理偏移: x", this.inputx - this.OriginSX, " y", this.inputy - this.OriginSY, "画板偏移: x", ituse.x, " y", ituse.y)
            this.out = ituse;
            return ituse;
        }
    },
};
</script>

<style scoped>
#bg {
    position: absolute;
    width: max(300vw, 300vh);
    height: max(300vw, 300vh);
    top: -100vh;
    left: -100vw;
    background-image: repeating-conic-gradient(from 0deg at center,
            #0050c2 0deg,
            #ff6348 120deg,
            #fff 240deg,
            #0050c2 360deg);
    animation: rotate-bg 60s linear infinite;
    z-index: -1;
}

@keyframes rotate-bg {
    from {
        transform: rotate(0deg);
        /* 初始角度 */
    }

    to {
        transform: rotate(360deg);
        /* 旋转一圈 */
    }
}

#page {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;

}

#content{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: #9c61d4;
}

#product{
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-around;
}

#product>div{
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 20px;
}
</style>