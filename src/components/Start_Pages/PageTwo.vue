<template>
    <div id="page">
        <div id="status_bar">
            <div v-if="have_token"><span>{{ cookiemap['usercode'] }}</span></div>
            <div v-else class="loginbtn" @click="showloginDialog = !showloginDialog">未登录</div>
            <div style="font-weight: bold;">自动运动</div>
            <div @click="showloginDialog = !showloginDialog" class="loginbtn">更换账号</div>
            <el-dialog v-model="showloginDialog" draggable>
                <h2>登录</h2>
                <el-input placeholder="请输入学号" v-model="usercode" class="input_usercode" type="number"></el-input>
                <el-input placeholder="请输入密码" v-model="password" class="input_password" type="text"></el-input>
                <el-button @click="login_sub" class="el_login_sub" :disable="canclickloginbtn">登录</el-button>
            </el-dialog>
        </div>
        <div class="ctrl_main">
            <h1 v-if="showstatus"><span v-for="(item, index) in loading_text" :class="{ jump: jump_index == index }">{{
                    item }}</span></h1>
            <div v-if="!showstatus" class="status_form">
                <div>注意必须有至少一条跑步记录(可以手动刷步也可以真人跑步)才能自动运动,否则不会自动运动</div>
                <div>
                    <span>是否每日自动运动</span>
                    <el-switch v-model="Canautopush_bol" :active-icon="Check" :inactive="Close" size="large"
                        inline-prompt></el-switch>
                </div>
                <div>
                    <span>上次自动运动时间</span>
                    <span>{{ Lastautopush_show }}</span>
                </div>
                <div>
                    <button class="el_login_sub status_form_btn" @click="getAutoPush">刷新</button>
                    <button class="el_login_sub status_form_btn" @click="setAutoPush">确认</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Close } from '@element-plus/icons-vue'
import axios from 'axios'
import moment from 'moment'

axios.defaults.baseURL = import.meta.env.VITE_WSN_SERVICE_URL

let getcookiemap = () => document.cookie.split(';').reduce((prev, current) => {
    const [name, value] = current.trim().split('=')
    prev[name] = value
    return prev
}, {})
let cookiemap = getcookiemap()
const have_token = ref(cookiemap['token'] != undefined)
console.log(cookiemap)
let waiting_time = ref(0)
const loading_text = computed(() => (status_text.value + '(' + waiting_time.value + 's)...').split(''))
// const showstatus = ref(!have_token.value);
// 是否显示登录对话框
const showloginDialog = ref(false)
// 是否显示加载状态
const showstatus = ref(!have_token.value)
console.log("showstatus", showstatus)
// 是否可以点击登录按钮
const canclickloginbtn = ref(true)
// 加载状态文字
const status_text = ref('账户未登录')
// 自动运动状态 1为开启 0为关闭
const Canautopush = ref(0)
const Canautopush_bol = computed({
    get() {
        return Canautopush.value !== 0;
    },
    set(value) {
        Canautopush.value = value ? 1 : 0;
    }
});
// 上次自动运动时间
const Lastautopush = ref()
const Lastautopush_show = computed(() => {
    if (Lastautopush.value == null) {
        return '无'
    } else {
        // 这是时间戳, 转成年月日 时分秒毫秒时间
        return moment(Lastautopush.value).format('YYYY-MM-DD HH:mm:ss.SSS');
    }
})
const jump_index = ref(0)
const usercode = ref('')
const password = ref('')
let i = 0 // 字符跳动

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

watch(have_token, () => {
    cookiemap = getcookiemap()
    if (have_token.value) {
        clearInterval(timer)
        clearInterval(timer2)
        showstatus.value = false
    } else {
        showstatus.value = true
    }
})

// 点击了登录按钮, 发送登录请求
const login_sub = () => {
    if (!canclickloginbtn.value) {
        ElMessage.error('按钮冷却中')
        return
    }
    status_text.value = '正在登录'
    console.log(usercode.value, password.value)
    if (usercode.value == '' || password.value == '') {
        ElMessage.error('学号或密码不能为空')
        return
    }
    ElMessage.info('登录中')
    // 定时器禁用登录按钮5秒
    canclickloginbtn.value = false
    setTimeout(() => {
        canclickloginbtn.value = true
    }, 5000)
    // 发送登录请求
    axios.post('/user/login_wsv', {
        usercode: usercode.value,
        password: password.value
    }).then(res => {
        if (res.data.code == 200) {
            // 登录成功
            document.cookie = 'usercode=' + usercode.value + ';max-age=' + 60 * 60 * 24 * 30 * 6
            ElMessage.success('登录成功')
            for (let key in res.data.cookie) {
                // 时间6个月
                document.cookie = key + '=' + res.data.cookie[key] + ';max-age=' + 60 * 60 * 24 * 30 * 6  // 6个月
            }
            showloginDialog.value = false
            have_token.value = true
            Canautopush.value = res.data.data.Canautopush
            Lastautopush.value = res.data.data.Lastautopush
        } else {
            ElMessage.error('登录失败')
            status_text.value = '账户未登录'
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error('登录失败')
        status_text.value = '账户未登录'
    })
}

const getAutoPush = () => {
    if(!cookiemap['token']){
        console.log("本地没有账户")
        return
    }
    ElMessage.info('正在获取自动运动状态')
    axios.post('/user/getautopush', {
        token: cookiemap['token']
    }).then(res => {
        if (res.data.code == 200) {
            Canautopush.value = res.data.data.Canautopush
            Lastautopush.value = res.data.data.Lastautopush
            ElMessage.success('获取自动运动状态成功')
        } else {
            ElMessage.error('获取自动运动状态失败')
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error('获取自动运动状态失败')
    })
}

const setAutoPush = () => {
    ElMessage.info('正在设置自动运动状态')
    axios.post('/user/setautopush', {
        token: cookiemap['token'],
        Canautopush: Canautopush.value
    }).then(res => {
        if (res.data.code == 200) {
            ElMessage.success('设置自动运动状态成功')
        } else {
            ElMessage.error('设置自动运动状态失败, ', res.data.msg)
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error('设置自动运动状态失败, 无法连接服务器')
    })
}

onMounted(() => {
    getAutoPush()
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

#page {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    justify-content: space-between;
}

.loginbtn {
    /* background-color: #ff6348; */
    color: #0984e3;
    padding: 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
}

/* el-dialog相关 */
:deep(.el-dialog) {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    max-height: 90vh;
    overflow: auto;
    width: auto;
    max-width: 1000px;
}

/* 对话框标题 */
:deep(.el-dialog__title) {
    font-size: 1.2em;
}

/* 对话框关闭按钮 */
:deep(.el-icon svg) {
    transform: scale(2);
}

.el_login_sub {
    text-decoration: none;
    padding: 15px 40px;
    margin: 10px 0;
    display: inline-block;
    text-align: center;
    font-size: 1.2rem;
    border-radius: 100px;
    transition: all .2s;
    color: #777;
}

.el_login_sub:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.el_login_sub:active {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.ctrl_main {
    display: flex;
    flex-grow: 1;
    background-color: rgba(255, 255, 255, 0.5);
    transform: blur(5px);
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.5);
    transform: blur(5px);
    margin: 1rem;
    padding: 1rem;
    border-radius: 2rem;
}

.ctrl_main>div {
    width: auto;
    height: auto;
}

.status_form>div {
    margin-top: 2rem;
    /* background: #777; */
    padding: 1rem;
    display: flex;
    justify-content: space-around;
}

.status_form>div>span {
    margin-right: 2rem;
}

.status_form_btn {
    padding: 10px;
    margin: 10px;
    background: rgba(255, 255, 255, 0.7);
    border: 2px solid #0984e3;
    color: #0984e3;
}
</style>