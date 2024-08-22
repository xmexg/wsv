<template>
    <div id="page">
        <div id="bg"></div>
        <div id="content">
            <h2>其他产品</h2>
            <div id="product">
                <div><a href="http://121.40.92.198:9090">旧版wkyd</a></div>
                <div><a :href="`${service}/run`">wsn(springboot)内置wkyd</a></div>
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
            service: import.meta.env.VITE_WSN_SERVICE_URL
        };
    },
    methods: {
        
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