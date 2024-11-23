<template>
    <div id="logo">
        <div v-if="show" class="animate__animated animate__zoomInDown normalScroll">
            <span v-for="item in thenext" class="textanimate" style="color: #ff6348">{{ item }}</span>&nbsp<span v-for="item in wkyd" class="textanimate" style="color: #0050c2">{{ item }}</span>
        </div>
        <div class="animate__animated animate__bounceInLeft text_color"><span v-for="item in text" class="textanimate">{{ item }}</span></div>
    </div>
    <div v-if="showbar" id="bar" class="animate__animated animate__fadeInUp normalScroll">
        <a href="#page2">自动运动</a>
        <a href="#page3">手动运动</a>
        <a href="#page4">其他产品</a>
        <a href="#page5">关于我们</a>
    </div>
    <div class="animate__animated animate__bounceInRight" style="position: absolute; bottom: 0; right: 0; color: #6b798e; text-align: right; font-size: 1rem; user-select: none;">
        <p>version: <br>wsnv in wsnv{{ appVersion }}<br>wsns in {{ wsns_version }}</p>
        <p>require: wsns >= {{ require_wsnv }}</p>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            wsns_version: '无法连接到wsns',
            appVersion: __APP_VERSION__,
            require_wsnv: __REQUIRE_WSNS_VERSION__
        }
    },
    methods: {
        getwsnsVersion() {
            axios.get(import.meta.env.VITE_WSN_SERVICE_URL + '/version')
                .then(res => {
                    this.wsns_version = res.data
                    // console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
    mounted() {
        this.getwsnsVersion()
    }
}
</script>

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

.textanimate {
    transition: .5s;
}

.textanimate:hover {
    font-size: 1.5em;
    font-weight: bolder;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
let show = ref(true)
let showbar = ref(false)
const thenext = ref('The Next'.split(''))
const wkyd = ref('wkyd'.split(''))
const text = ref('下一代运动神器！'.split(''))

onMounted(() => {
    setTimeout(() => {
        showbar.value = true
    }, 1500)
})
</script>