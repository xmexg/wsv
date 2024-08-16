<template>
    <div id="logo">
        <div v-if="show" class="animate__animated animate__zoomInDown">
            <span style="color: #ff6348">The Next</span>&nbsp<span style="color: #0050c2">wkyd</span>
        </div>
        <div class="animate__animated animate__bounceInLeft text_color">下一代运动神器！</div>
    </div>
    <div v-if="showbar" id="bar" class="animate__animated animate__fadeInUp">
        <a href="#page2">立即使用</a>
        <a href="#page3">产品介绍</a>
        <a href="#page4">其他产品</a>
        <a href="#page5">关于我们</a>
    </div>
</template>

<style scoped>
.animate__animated {
    animation-duration: 2s;
    /* 可选，调整动画持续时间 */
}

#bar {
    position: absolute;
    top: 60%;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

#bar a {
    color: #fff;
    text-decoration: none;
    border-radius: 1em;
    padding: 1.1rem;
    transition: .5s;
}

#bar a:hover {
    background-color: #fff;
    color: #0050c2;
}

#logo {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    color: #333;
    text-align: center;
}

#logo div {
    margin: 2rem 0;
}

.text_color {
    background-image: linear-gradient(135deg, #ff6348, #0050c2);
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
let show = ref(true)
let showbar = ref(false)
onMounted(() => {
    setTimeout(() => {
        showbar.value = true
    }, 2000)
})
</script>