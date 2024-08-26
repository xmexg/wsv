<template>
    <div id="status_bar">
        <div v-if="have_token">学号:<span>{{ cookiemap['usercode'] }}</span></div>
        <div v-else >未登录</div>
        <div style="font-weight: bold;">自动运动</div>
        <div>更换账号</div>
    </div>
    <div>
        <h1><span v-for="(item, index) in loading_text" :class="{ jump: jump_index == index }">{{ item }}</span></h1>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
let cookiemap = document.cookie.split(';').reduce((prev, current) => {
    const [name, value] = current.trim().split('=')
    prev[name] = value
    return prev
}, {})
console.log(cookiemap)
let waiting_time = ref(0)
const loading_text = computed(() => ('敬请期待' + '(' + waiting_time.value + 's)...').split(''))
const have_token = ref(cookiemap['token'] != undefined)
const jump_index = ref(0)
let i = 0

let timer2 = setInterval(() => {
    waiting_time.value++
}, 1000)

let timer = setInterval(() => {
    if (i <= loading_text.value.length) {
        jump_index.value = i
        i++
    } else {
        i = 0
    }
}, 300)
onMounted(() => {
    // 把loading_text放到h1标签中，字一个一个变大变小

})
</script>

<style scoped>
@keyframes jump_animation {
    0% {
        top: 0;
    }

    50% {
        top: -.5em;
    }

    100% {
        top: 0;
    }
}

h1 {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #0050c2;
}

.jump {
    position: relative;
    color: #ff6348;
    animation-name: jump_animation;
    animation-duration: .3s;
    animation-timing-function: linear;
    transition: .3s;
}

#status_bar {
    position: relative;
    background-color: rgba(255, 255, 255, 0.5);
    transform: blur(5px);
    margin: 1rem;
    padding: 1rem;
    border-radius: 2rem;
    display: flex;
    justify-content: space-between;
}
</style>