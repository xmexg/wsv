<template>
    <div id="page">
        <div> 手动运动 </div>
        <div class="content">
            <!-- <h2>该功能尚未完全完成，请使用旧版<a href="http://121.40.92.198:9090">http://121.40.92.198:9090</a></h2> -->
            <div id="form" class="normalScroll">
                <div class="fd">salt:<input class="U D block" type="text" name="salt" id="salt" placeholder="salt(8位0-9和a-f,不合规无法提交)" v-model="salt" maxlength="8"></div>
                <div class="fd">sign:<input class="U D block" type="text" name="sign" id="sign" placeholder="访问学校服务器时的sign" v-model="sign" disabled></div>
                <div class="fd">启用流(axios+xhr)<input type="checkbox" v-model="able_stream"></div>
                <div class="fd">学号:<input class="H block" type="text" name="id" id="id" placeholder="学号" th:value="${user_id}" v-model="userId" required></div>
                <el-button class="downblock" @click="showRunRecodesAphonelist = !showRunRecodesAphonelist">查看跑步评分 & 更新手机型号</el-button>
                <el-dialog v-model="showRunRecodesAphonelist" title="跑步评分" class="normalScroll" draggable>
                    <div class="el_bar">
                        <input type="number" max="15" class="el_usercode" :value="userId" ref="userId_search_input" placeholder="请输入要查询的学号">
                        <button class="el_usercode_btn" @click="getRunRecodesAphonelist($refs.userId_search_input.value)" :disabled="getRunRecodesAphonelist_lock">{{ getRunRecodesAphonelist_lock ? "更新中" : "更新" }}</button>
                    </div>
                    <div>测试渲染</div>
                    <div v-for="(user_recodes, user_id, user_index) in runRecodes" style="max-height: 50vh; width: 100%;" >
                        <!-- bug 这个div总是不渲染 -->
                        <h3>跑步信息</h3>
                        <p>学号: {{ user_id }}</p>
                        <div style="overflow: auto; z-index: 9;">
                            <table class="normalScroll RunRecodesAphonelist" style="width: 100%; border-collapse: collapse; scrollbar-width: none; -ms-overflow-style: none;" border="1">
                                <thead>
                                    <tr>
                                        <th>id</th>
                                        <th>size</th>
                                        <th>数据ID</th>
                                        <th>评分</th>
                                        <th>创建时间</th>
                                        <th>总路程</th>
                                        <th>手机型号</th>
                                        <th>用户ID</th>
                                        <th>中转用时</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="record in user_recodes" :key="record.id">
                                        <td>{{ record.id }}</td>
                                        <td>{{ record.size }}</td>
                                        <td>{{ record.runId }}</td>
                                        <td>{{ record.score }}</td>
                                        <td>{{ record.createTime }}</td>
                                        <td>{{ record.trueLength }}</td>
                                        <td>{{ record.outphoneInfo }}</td>
                                        <td>{{ record.userId }}</td>
                                        <td>{{ record.serverSpendTime }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </el-dialog>
                <div class="fd">系统类型:<input class="H block" type="text" name="ostype" id="ostype"
                        placeholder="系统类型(android/iOS)" required value="android"></div>
                <div class="fd">版本号:<input class="H block" type="text" name="version" id="version"
                        placeholder="安卓:系统版本号13/苹果:软件版本号1.0.3" required></div>
                <div id="appbrand" class="fd">手机品牌:
                    <div id="appbranddiv">
                        <div id="appbrandselectdiv">
                            <button class="selectedBrand downblock" id="selectedBrand"
                                @click="showBrandSelect()">读取服务器端历史型号</button>
                            <select v-model="selectedAndroidBrand" class="selectedBrand" id="selectedAndroidBrand">
                                <option value="default">选择安卓品牌</option>
                                <optgroup v-for="(subBrands, brandind) in androidbrands" :label="brandind">
                                    <option v-for="subBrand in subBrands" :value="subBrand">{{ subBrand }}</option>
                                </optgroup>
                            </select>
                            <select v-model="selectediPhoneBrand" class="selectedBrand" id="selectediPhoneBrand">
                                <option value="default">选择苹果品牌</option>
                                <option v-for="(subBrands, brandind) in iPhonebrands" :value="subBrands.brand">{{
                                    subBrands.name }}</option>
                            </select>
                        </div>
                        <input v-model="selectedBrandInput" class="H block" type="text"
                            placeholder="手机品牌(Xiaomi/iPhone)" id="selectedBrandInput" disabled />
                    </div>
                </div>
                <div class="fd">手机型号:<input class="H block" type="text" name="phone" id="phone" v-model="phone"
                        placeholder="(Xiaomi M2011K2C/iPhone14,7)" required value="Xiaomi M2011K2C"></div>
                <div class="fd">苹果:<input class="H block" type="text" name="OsVersion" id="OsVersion"
                        placeholder="苹果需额外填写系统版本号(16.3.1)"></div>
                <div class="fd">UA:<input class="H D block" type="text" name="useragent" id="useragent"
                        placeholder="请求头(okhttp/4.5.0)" required value="okhttp/4.5.0" disabled></div>
                <div class="fd">Loc-UA:<input class="H D block" type="text" name="Loc-UA" v-model="Loc_UA" readonly>
                </div>
                <div class="fd">
                    距离(米):
                    <div class="input-wrapper">
                        <input class="block" type="number" name="totalGeoLength" id="totalGeoLength"
                            placeholder="运动距离(3030),锁定状态下自动填写" :disabled="totalGeoLength_lock">
                        <button @click="totalGeoLength_lock = !totalGeoLength_lock"
                            :class="{ 'red': totalGeoLength_lock, 'blue': !totalGeoLength_lock }" class="toggle-button">
                            &#x1F512;
                        </button>
                    </div>
                </div>
                <div class="fd">
                    时间(秒):
                    <div class="input-wrapper">
                        <input class="block" type="number" name="totalTimeLength" id="totalTimeLength"
                            placeholder="运动时长(1469),锁定状态下自动填写" :disabled="totalTimeLength_lock">
                        <button @click="totalTimeLength_lock = !totalTimeLength_lock"
                            :class="{ 'red': totalTimeLength_lock, 'blue': !totalTimeLength_lock }"
                            class="toggle-button">
                            &#x1F512;
                        </button>
                    </div>
                </div>
                <div class="fd">开始时间:<input class="block" type="datetime-local" name="beginTime" id="beginTime" step="1"
                        placeholder="开始时间(2023-03-16 11:13:27)"></div>
                <div class="fd">结束时间:<input class="block" type="datetime-local" name="endTime" id="endTime" step="1"
                        placeholder="结束时间(2023-03-16 11:15:40)"></div>
                <div class="fd">校区:<input class="D block" type="text" name="campus" id="campus" placeholder="校区(1)"
                        value="1" disabled>
                </div>

                <div class="fd">节点间隔:<input class="block" type="number" id="nodespace"
                        placeholder="手机:0,电脑:3,提高节点间隔,减少路线锯齿" onchange="nodespacechange()"></div>
                <div class="fd">节点合理化(仅对自画路线生效):<input class="checkbox block" type="checkbox" id="pointconv"
                        name="pointconv" checked>
                </div>

                <div class="fd">地图类型:
                    <select class="S block" name="mapdatatype" id="mapdatatype">
                        <option value="m" selected onclick="mapshowmap()">画出跑步路线</option>
                        <option class="D" value="b" onclick="mapshowtext()">自定义跑步json数据</option>
                        <option value="o" onclick="mapshowOLDMAPD()">提交学校服务器已存在的数据</option>
                    </select>
                </div>
            </div>
            <div id="map" class="normalScroll">
                <div id="mapcanvasdrawinfo">
                    <div class="mapcanvasdrawinfoc_div">
                        <div class="mapcanvasdrawinfoc_div_d1">节点总数:</div>
                        <div class="mapcanvasdrawinfoc_div_d2" id="mcdid1_1"></div>
                    </div>
                    <div class="mapcanvasdrawinfoc_div">
                        <div class="mapcanvasdrawinfoc_div_d1">记录节点:</div>
                        <div class="mapcanvasdrawinfoc_div_d2" id="mcdid1_2"></div>
                    </div>
                    <div class="mapcanvasdrawinfoc_div">
                        <div class="mapcanvasdrawinfoc_div_d1">参考路程(米):</div>
                        <div class="mapcanvasdrawinfoc_div_d2" id="mcdid2"></div>
                    </div>
                </div>
                <div id="mapcanvasdiv">
                    <div id="get4point">获取打卡点(不必要)<div id="get4pointres"></div>
                    </div>
                    <!-- 在画板顶层放置一个隐形的div,用于放置一些标记 -->
                    <div id="canvasTOP">
                        <!-- <image id="testimg" th:src="@{/res/local_br.png}" src="../static/res/local_br.png" width="20px" style="left: 310.31583182445206px;top: 278.5985327600884px;"></image> -->
                    </div>

                    <canvas id="mapcanvasdivcan" class="mapcanvasdivcan" width="690" height="690"></canvas>
                    <textarea id="mapcanvasdivtext" class="D mapcanvasdivtext" name="mapdata"
                        placeholder="自定义跑步json数据,此处文本会作为latLng的值"></textarea>
                    <div id="mapcanvasdivcan_js_div" width="100%" height="100%" style="display: none;"></div>
                </div>
                <div class="fd" id="subdata">完成运动</div>
            </div>
        </div>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js';
import axios from 'axios';
import VueVirtualScroller from 'vue-virtual-scroller';
import {Base64} from 'js-base64'
const baseHost = import.meta.env.VITE_WSN_SERVICE_URL
axios.defaults.baseURL = import.meta.env.VITE_WSN_SERVICE_URL
export default {
    components: {
    VueVirtualScroller,
  },
    data() {
        return {
            salt: this.generateRandomHex(), // 初始值为随机生成的8位数
            sign: '', // 初始为空，稍后通过watch设置
            userId: '',
            userId_search: '',
            androidbrands: {
                Samsung: ['Samsung'],
                HUAWEI: ['HUAWEI', 'HONOR', 'CMDC'],
                Xiaomi: ['Xiaomi', 'Redmi', 'POCO'],
                OPPO: ['OPPO', 'Realme'],
                vivo: ['vivo', 'iQOO'],
                OnePlus: ['OnePlus'],
                Sony: ['Sony'],
                LG: ['LG'],
                HTC: ['HTC'],
                Lenovo: ['Lenovo', 'Motorola'],
                努比亚: ['nubia'],
                Nokia: ['Nokia'],
                ASUS: ['ASUS', 'ROG'],
                Google: ['Google', 'Pixel'],
                ZTE: ['ZTE', 'Nubia'],
                Meizu: ['Meizu'],
                Coolpad: ['Coolpad'],
                Gionee: ['Gionee'],
                LeEco: ['LeEco'],
                TCL: ['TCL', 'Alcatel'],
                Sharp: ['Sharp'],
                Panasonic: ['Panasonic'],
                Blackberry: ['Blackberry'],
                Umidigi: ['Umidigi'],
                Elephone: ['Elephone'],
                Doogee: ['Doogee'],
                Vernee: ['Vernee'],
                Oukitel: ['Oukitel'],
                Cubot: ['Cubot'],
                Homtom: ['Homtom'],
                Bluboo: ['Bluboo'],
                Vkworld: ['Vkworld'],
                Gretel: ['Gretel'],
                Ulefone: ['Ulefone'],
            },
            iPhonebrands: [
                { name: "iPhone 6", brand: "iPhone7,2" },
                { name: "iPhone 6 Plus", brand: "iPhone7,1" },
                { name: "iPhone 6s", brand: "iPhone8,1" },
                { name: "iPhone 6s Plus", brand: "iPhone8,2" },
                { name: "iPhone SE (第 1 代)", brand: "iPhone8,4" },
                { name: "iPhone 7", brand: "iPhone9,1" },
                { name: "iPhone 7 Plus", brand: "iPhone9,2" },
                { name: "iPhone 8", brand: "iPhone10,1" },
                { name: "iPhone 8 Plus", brand: "iPhone10,2" },
                { name: "iPhone X", brand: "iPhone10,3" },
                { name: "iPhone XS", brand: "iPhone11,2" },
                { name: "iPhone XS Max", brand: "iPhone11,4" },
                { name: "iPhone XR", brand: "iPhone11,8" },
                { name: "iPhone 11", brand: "iPhone12,1" },
                { name: "iPhone 11 Pro", brand: "iPhone12,3" },
                { name: "iPhone 11 Pro Max", brand: "iPhone12,5" },
                { name: "iPhone SE (第 2 代)", brand: "iPhone12,8" },
                { name: "iPhone 12 mini", brand: "iPhone13,1" },
                { name: "iPhone 12", brand: "iPhone13,2" },
                { name: "iPhone 12 Pro", brand: "iPhone13,3" },
                { name: "iPhone 12 Pro Max", brand: "iPhone13,4" },
                { name: "iPhone 13 mini", brand: "iPhone14,4" },
                { name: "iPhone 13", brand: "iPhone14,5" },
                { name: "iPhone 13 Pro", brand: "iPhone14,2" },
                { name: "iPhone 13 Pro Max", brand: "iPhone14,3" },
                { name: "iPhone SE (第 3 代)", brand: "iPhone14,6" },
                { name: "iPhone 14", brand: "iPhone14,7" },
                { name: "iPhone 14 Plus", brand: "iPhone14,8" },
                { name: "iPhone 14 Pro", brand: "iPhone15,2" },
                { name: "iPhone 15", brand: "iPhone15,4" },
                { name: "iPhone 15 Plus", brand: "iPhone15,5" },
                { name: "iPhone 15 Pro", brand: "iPhone16,1" },
                { name: "iPhone 15 Pro Max", brand: "iPhone16,2" }
            ],
            selectedAndroidBrand: "Xiaomi",
            selectediPhoneBrand: "iPhone15,4",
            selectedBrandInput: "",
            phone: "Xiaomi M2011K2C",
            useragent: "okhttp/4.5.0",
            Loc_UA: navigator.userAgent,
            runRecodes: [], // 运动记录和评分
            historyPhoneInfo: [], // 历史手机型号
            showRunRecodesAphonelist: false, // 是否显示运动记录和评分
            history_RunRecodesAphonelist: [], // 历史运动记录和评分
            totalGeoLength_lock: true, // 距离是否锁定
            totalTimeLength_lock: true, // 时间是否锁定
            getRunRecodesAphonelist_lock: false, // 获取运动记录和评分锁定
            totalGeoLength: '', // 距离
            totalTimeLength: '', // 时间
            able_stream: true, // 是否启用流, 仅电脑端有效
        };
    },
    mounted() {
        // 初始化时设置 sign
        this.updateSign();
        // 显示设备类型
        console.log(navigator.userAgent)
        console.log(this.getDeviceModel());
    },
    methods: {
        // 生成8位随机数，包含0-9和a-f
        generateRandomHex() {
            const hexChars = '0123456789abcdef';
            let result = '';
            for (let i = 0; i < 8; i++) {
                result += hexChars[Math.floor(Math.random() * hexChars.length)];
            }
            return result;
        },
        // 计算MD5
        getsign(salt) {
            const date = new Date();
            const yyyyMMdd = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
            const encryptedStr = `${salt}${yyyyMMdd}duDusDut`;
            const md5 = CryptoJS.MD5(encryptedStr).toString().toLowerCase();
            return md5;
        },
        // 更新 sign
        updateSign() {
            this.sign = this.getsign(this.salt);
        },
        // 本地粗略判断是安卓苹果win还是linux设备
        getDeviceModel() {
            const userAgent = navigator.userAgent;
            let model = '未知设备';
            // 这里可以根据需要进行更复杂的解析
            if (/Android/.test(userAgent)) {
                model = 'Android设备';
            } else if (/iPhone/.test(userAgent)) {
                model = 'iPhone';
            } else if (/iPad/.test(userAgent)) {
                model = 'iPad';
            } else if (/Windows/.test(userAgent)) {
                model = 'Windows设备';
            } else if (/Mac OS X/.test(userAgent)) {
                model = 'Mac设备';
            } else if (/Linux/.test(userAgent)) {
                model = 'Linux设备';
            }
            return model;
        },
        // 在服务器获取历史型号
        showBrandSelect() {
            console.log('获取历史型号');
            if (this.able_stream) {
                axios.post('/webapi/getUserPhoneInfoList', {
                    userId: this.userId,
                    salt: this.salt,
                    sign: this.sign
                }).then(res => {
                    console.log(res.data);
                }).catch(err => {
                    console.error(err);
                });
            } else {
                alert("请在电脑端使用")
            }
        },
        /**
         * 获取运行记录和评分和历史手机型号
         * @param userid  用户id, 应确保放入列表的是string类型而不是int类型
         */
        getRunRecodesAphonelist(userid) {
            if(this.getRunRecodesAphonelist_lock) {
                alert("正在获取中，请稍后再试")
            }
            this.getRunRecodesAphonelist_lock = true;
            let userid_base64 = Base64.encode(userid);
            console.log(userid + " " + userid_base64)
            this.runRecodes[userid_base64] = [];
            let reslen = 0;
            if (this.able_stream) { // 启用流
                axios.post('/webapi/dfdetection_Stream', {
                    userId: userid,
                    salt: this.salt,
                    sign: this.sign
                }, {
                    onDownloadProgress: progressEvent => {
                        const xhr = progressEvent.event.target
                        const { responseText } = xhr
                        console.log("=====responseText====== old:" + reslen + " add:" + responseText.length)
                        // 截取字符串，输出新增加的部分
                        let addpart = responseText.substring(reslen, responseText.length)
                        reslen = responseText.length // 必须赶在下次获取到数据前执行
                        let addaprt_split = addpart.trim().split("\n")
                        addaprt_split.forEach(element => {
                            // console.log(element)
                            // console.debug(JSON.parse(element))
                            this.runRecodes[userid_base64].push(JSON.parse(element))
                        });
                    }
                }).then(response => { // 全部完成时
                    console.log(this.runRecodes)
                }).catch(error => {
                    console.error(error);
                });
                this.getRunRecodesAphonelist_lock = false;
            } else {
                console.log('发送请求，获取运动记录和评分');
                axios.post('/webapi/dfdetection_Stream', {
                    userId: userid,
                    salt: this.salt,
                    sign: this.sign
                }).then(res => {
                    console.log(res.data);
                    let responseText = res.data;
                    //如果返回的数据是空的，就不用处理了
                    if (responseText.length == 0) {
                        return;
                    }
                    let addaprt_split = responseText.trim().split("\n")
                    console.log(addaprt_split)
                    addaprt_split.forEach(element => {
                        this.runRecodes[userid_base64].push(JSON.parse(element))
                    });
                }).catch(err => {
                    console.error(err);
                });
            }
            this.getRunRecodesAphonelist_lock = false;
        },
    },
    watch: {
        // 监听 salt 的变化
        salt() {
            this.updateSign();
        },
        // 监听 安卓手机型号 的变化
        selectedAndroidBrand(newValue) {
            if (newValue !== 'default') {
                this.selectedBrandInput = newValue;
            }
        },
        // 监听 苹果手机型号 的变化
        selectediPhoneBrand(newValue) {
            this.selectedBrandInput = newValue;
            this.phone = newValue;
        }
    }
}
</script>

<style scoped>
#page {
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #ffdad4;
    /* background-image: radial-gradient(#fff 10%, transparent 10%); */
    background-image: radial-gradient(#fff 5px, transparent 5px);
    background-size: 20px 20px;
    width: 100%;
    height: 100%;
    overflow: auto;
}

.content {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 95%;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    align-items: center;
    justify-content: space-around;
    font-size: 0.6em;
    margin: 20px 0;
}

#form {
    display: flex;
    /* flex-grow: 0.4; */
    flex-direction: column;
    flex-wrap: wrap;
    max-width: 100vw;
    max-height: 100vh;
    overflow: auto;
    padding: 1rem;
    /* background: #000; */
}

.downblock {
    background: #fff;
    border-color: #ffa39e;
    transition: .3s;
}

.downblock:hover {
    background: #f9f2f2;
    color: #e16d66;
}

.fd {
    display: flex;
    flex-direction: row;
    text-align: left;
    /* background: #ffa39e; */
    margin: 0.4rem 0;
    color: #5c5c5c;
}

.fd>*:first-child {
    margin: 0 20px;
}


.input-wrapper {
    position: relative;
    display: flex;
    /* background-color: #5c5c5c; */
}

.toggle-button {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    /* font-size: 14px;
    line-height: 20px; */
    text-align: center;
    padding: 0;
}

.toggle-button.red {
    background-color: red;
}

.toggle-button.blue {
    background-color: blue;
}

.block {
    font-size: 0.8em;
    width: 300px;
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.7);
    outline: solid 1px #ffa39e;
}

.D {
    background: #ffa39e;
}

#appbranddiv {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ffa39e;
}

#appbrandselectdiv {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: auto;
}

.selectedBrand {
    font-size: 0.7em;
    margin: 5px 0;
}

#selectedBrandInput {
    margin: 0;
    padding: 0;
    width: 100%;
}

.checkbox {
    width: auto;
    font-size: 2em;
}

#map {
    margin: 20px 0;
}

#mapcanvasdrawinfo {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    /* width: 690px; */
    font-size: 0.8em;
    border-radius: 20px 20px 0 0;
    border: #ffa39e solid 3px;
    background: rgba(255, 255, 255, 0.7);
}

#mapcanvasdrawinfo div {
    display: flex;
}

.mapcanvasdrawinfoc_div_d2 {
    color: #9254de;
}

#mapcanvasdiv {
    position: relative;
    width: min(690px, 90vw, 90vh);
    height: min(690px, 90vw, 90vh);
    /* width: 690px;
	height: 690px; */
    /* max-width: 690px;
	max-height: 690px; */
    font-size: 0.8em;
    border: #ffa39e solid 3px;
    background: #e9ecef;
}

#canvasTOP {
    width: 100%;
    height: 100%;
    z-index: 9;
    position: relative;
    /*background: rgba(255, 255, 255, 0.7);*/
    pointer-events: none;
    /*不响应鼠标事件*/
}

.mapcanvasdivcan {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    /* 背景图片 */
    background-image: url(wkmap.jpg);
    background-repeat: no-repeat;
    /* 不重复 */
    background-size: 100% 100%;
    /* 大小 */
}

.mapcanvasdivtext {
    outline: none;
    width: 100%;
    height: 100%;
    border: none;
    margin: 0px;
    max-width: 690px;
    max-height: 690px;
    display: none;
    resize: none;
}

#get4point {
    z-index: 4;
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0px;
    top: 0px;
    padding: 0 10px 10px 0;
    max-width: 30%;
    color: #722ed1;
    background: rgba(179, 162, 232, 0.7);
    border-radius: 0 0 10px 0;
    cursor: pointer;
}

#get4point:hover {
    background: rgba(179, 162, 232, 0.9);
}

#get4pointres {
    color: #e74c3c;
}

#subdata {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 1.3em;
    color: #e9ecef;
    background: rgb(246, 151, 135);
    transition: 0.5s;
    cursor: pointer;
}

#subdata:hover {
    background: rgb(255, 99, 75);
}

#subdata:active {
    background: rgb(159, 62, 45);
}

/* 跑步评分对话框 */
:deep(.el-dialog) {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    max-height: 90vh;
    overflow: auto;
    width: auto;
    max-width: 1000px;
}

/* 跑步评分对话框标题 */
:deep(.el-dialog__title) {
    font-size: 1.2em;
}

/* 跑步评分对话框关闭按钮 */
:deep(.el-icon svg) {
    transform: scale(2);
}

.el_bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
}

.el_usercode {
    display: flex;
    flex-grow: 1;
    font-size: 1.6rem;
    border: none;
    border-bottom: solid 1px #e16d66;
    color: #e16d66;
    border-radius: 10px;
    outline: none;
    padding: 0 10px;
    background: rgba(255, 255, 255, 0);
}

.el_usercode_btn {
    font-size: 1.3rem;
    margin: 20px;
    padding: 5px;
    background: #f08680;
    color: #e9ecef;
    border: solid 1px #e16d66;
    border-radius: 10px;
}

.el_usercode_btn:hover {
    background: rgb(244, 138, 132);
    color: #fff;
}

.el_usercode_btn:active {
    background: #e16d66;
    color: #fff;
}
</style>
