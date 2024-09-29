<template>
    <div id="page">
        <div> 手动运动 </div>
        <p style="font-size: 1.3rem;">该功能尚未完全完成,请<a href="#page5">添加微信</a>使用自动运动, 或使用旧版<br><a
                href="http://121.40.92.198:9090">http://121.40.92.198:9090</a>&nbsp<a
                href="http://121.40.92.198:9091/run">http://121.40.92.198:9091</a></p>
        <div class="content">
            <div id="form" class="normalScroll">
                <div class="fd">salt:<input class="U D block" type="text" name="salt" id="salt"
                        placeholder="salt(8位0-9和a-f,不合规无法提交)" v-model="salt" maxlength="8"></div>
                <div class="fd">sign:<input class="U D block" type="text" name="sign" id="sign"
                        placeholder="访问学校服务器时的sign" v-model="sign" disabled></div>
                <div class="fd">启用流(axios经由xhr)
                    <!-- <input type="checkbox" v-model="able_stream"> -->
                    <el-switch v-model="able_stream" inline-prompt active-text="启用" inactive-text="禁用"/>
                </div>
                <div class="fd">学号:<input class="H block" type="text" name="id" id="id" placeholder="学号" th:value="${user_id}" v-model="userId" required></div>
                <el-button class="downblock" @click="showRunRecodesAphonelist = !showRunRecodesAphonelist">查看跑步评分 & 更新手机型号</el-button>
                <el-dialog v-model="showRunRecodesAphonelist" title="跑步评分" class="normalScroll el-dialog" draggable>
                    <div class="el_bar">
                        <input type="number" max="15" class="el_usercode" :value="userId" ref="userId_search_input" placeholder="请输入要查询的学号">
                        <button class="el_usercode_btn" @click="getRunRecodesAphonelist($refs.userId_search_input.value)" :disabled="getRunRecodesAphonelist_lock">{{ getRunRecodesAphonelist_lock ? "更新中" : "更新" }}</button>
                    </div>
                    <div class="userrecodelist">
                        <div v-for="(user_recodes, user_id, user_index) in runRecodes" :key="user_id" style="width: 100%;">
                            <p class="normalScroll" style="margin: 0; padding: 1em 0;">
                                <span>学号: {{ decodedUserId(user_id) }}</span>
                                <span @click="el_chooseMap = !el_chooseMap, el_chooseMapUserid = user_id" style="color: #a29bfe">展开地图</span>
                            </p>
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
                                        <tr v-for="record in user_recodes" :key="record.runId">
                                            <td>{{ record.id }}</td>
                                            <td>{{ record.size }}</td>
                                            <td>{{ record.runId }}</td>
                                            <td>{{ record.score }}</td>
                                            <td>{{ record.createTime }}</td>
                                            <td>{{ record.trueLength }}</td>
                                            <td @click="usephoneInfo" style="cursor: pointer; color: blue;">{{ record.outphoneInfo }}</td>
                                            <td>{{ record.userId }}</td>
                                            <td>{{ record.serverSpendTime }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </el-dialog>
                <!-- 选择服务器端地图 -->
                <el-dialog v-if="el_chooseMap" v-model="el_chooseMap" :title="`选择${decodedUserId(el_chooseMapUserid)}的地图`" draggable>
                    <div  class="el_chooseMap">
                        <div v-for="(recode, index) in runRecodes[el_chooseMapUserid]" :key="el_chooseMapUserid" class="choose_serMap">
                            <img src="/wkmap.jpg" width="345" height="345" class="choose_serMap_img">
                            <!-- 画板尺寸坑 -->
                            <canvas class="choose_serMap_cav" :id="'canvas_' + encode_base(recode.runId)" width="345px" height="345px"></canvas>
                            <p class="choose_serMap_p">{{ recode.createTime }} {{ recode.outphoneInfo }}</p>
                            <el-button @click="setMapData(recode)" class="choose_serMap_btn">选择</el-button>
                        </div>
                    </div>
                </el-dialog>
                <div class="fd">系统类型:<input class="H block" type="text" name="ostype" id="ostype" placeholder="系统类型(android/iOS)" required v-model="ostype"></div>
                <div class="fd">版本号:<input class="H block" type="text" name="version" id="version" placeholder="安卓:系统版本号13/苹果:软件版本号1.0.3" v-model="UAversion" required></div>
                <div id="appbrand" class="fd">手机品牌:
                    <div id="appbranddiv">
                        <div id="appbrandselectdiv">
                            <button class="selectedBrand downblock" id="selectedBrand"
                                @click="showHistoryPhoneInfo = !showHistoryPhoneInfo">读取服务器端历史型号</button>
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
                <el-dialog v-model="showHistoryPhoneInfo" title="选择过往型号" class="normalScroll el-dialog" draggable>
                    <div style="cursor: pointer;" @click="showRunRecodesAphonelist = !showRunRecodesAphonelist">
                        ⚡使用评分功能更新列表</div>
                    <div style="cursor: pointer;" @click="showRunRecodesAphonelist = !showRunRecodesAphonelist">
                        在评分列表点击要使用的手机型号即可</div>
                </el-dialog>
                <div class="fd">手机型号:<input class="H block" type="text" name="phone" id="phone" v-model="phone"
                        placeholder="(Xiaomi M2011K2C/iPhone14,7)" required value="Xiaomi M2011K2C"></div>
                <div class="fd">苹果:<input class="H block" type="text" name="OsVersion" id="OsVersion"
                        placeholder="苹果额外选填系统版本号(16.3.1)(不填也行)" v-model="UAOsVersion"></div>
                <div class="fd">UA:<input class="H D block" type="text" name="useragent" id="useragent"
                        placeholder="请求头(okhttp/4.5.0)" required v-model="useragent" disabled></div>
                <div class="fd">Loc-UA:<input class="H D block" type="text" name="Loc-UA" v-model="Loc_UA" readonly>
                </div>
                <div class="fd">
                    距离(米):
                    <div class="input-wrapper">
                        <input class="block" type="number" v-model="totalGeoLength" id="totalGeoLength"
                            placeholder="(3030),锁定自动填写" :disabled="totalGeoLength_lock">
                        <button @click="totalGeoLength_lock = !totalGeoLength_lock"
                            :class="{ 'red': totalGeoLength_lock, 'blue': !totalGeoLength_lock }" class="toggle-button">
                            &#x1F512;
                        </button>
                    </div>
                </div>
                <div class="fd">
                    时间(秒):
                    <div class="input-wrapper">
                        <input class="block" type="number" v-model="totalTimeLength" id="totalTimeLength"
                            placeholder="(1469),锁定自动填写" :disabled="totalTimeLength_lock">
                        <button @click="totalTimeLength_lock = !totalTimeLength_lock"
                            :class="{ 'red': totalTimeLength_lock, 'blue': !totalTimeLength_lock }"
                            class="toggle-button">
                            &#x1F512;
                        </button>
                    </div>
                </div>
                <div class="fd">开始时间:<input class="block" type="datetime-local" v-model="beginTime" id="beginTime" step="1"
                        placeholder="开始时间(2023-03-16 11:13:27)"></div>
                <div class="fd">结束时间:<input class="block" type="datetime-local" v-model="endTime" id="endTime" step="1"
                        placeholder="结束时间(2023-03-16 11:15:40)"></div>
                <div class="fd">校区:<input class="D block" type="text" name="campus" id="campus" placeholder="校区(1)"
                        value="1" disabled>
                </div>

                <div class="fd">节点间隔(点画务必为0):<input class="block" type="number" id="nodespace" placeholder="点画:0,拖画:3,路线抗锯齿"
                        v-model="nodespace" min="0"></div>
                <div class="fd">节点合理化(仅对自画路线生效)(没用,学校不在乎跑步评分):
                    <!-- <input class="checkbox block" type="checkbox" id="pointconv" name="pointconv" checked> -->
                    <el-switch v-model="pointconv" inline-prompt active-text="启用" inactive-text="禁用"/>
                </div>

                <div class="fd">地图类型:
                    <!-- <select class="S block" name="mapdatatype" id="mapdatatype">
                        <option value="m" selected onclick="mapshowmap()">画出跑步路线</option>
                        <option class="D" value="b" onclick="mapshowtext()">自定义跑步json数据</option>
                        <option value="o" onclick="mapshowOLDMAPD()">提交学校服务器已存在的数据</option>
                    </select> -->
                    <select v-model="selectedMapType" class="S block">
                        <option v-for="subBrands in mapType" :value="subBrands.brand">{{ subBrands.name }}</option>
                    </select>
                </div>
            </div>
            <div id="map" class="normalScroll">
                <div id="mapcanvasdrawinfo">
                    <!-- <div class="mapcanvasdrawinfoc_div">
                        <div class="mapcanvasdrawinfoc_div_d1">节点总数:</div>
                        <div class="mapcanvasdrawinfoc_div_d2" id="mcdid1_1"></div>
                    </div>
                    <div class="mapcanvasdrawinfoc_div">
                        <div class="mapcanvasdrawinfoc_div_d1">记录节点:</div>
                        <div class="mapcanvasdrawinfoc_div_d2" id="mcdid1_2"></div>
                    </div> -->
                    <div class="mapcanvasdrawinfoc_div">
                        <div class="mapcanvasdrawinfoc_div_d1">参考路程(米):{{ Geolen_canvas + Geolen_temp }}</div>
                        <div class="mapcanvasdrawinfoc_div_d2" id="mcdid2"></div>
                    </div>
                </div>
                <div id="mapcanvasdiv">
                    <div v-if="selectedMapType == 'draw_mapType'" id="get4point" @click="get4point">获取打卡点(没用的功能)<div id="get4pointres"></div></div>
                    <!-- 自画路线工具 -->
                    <div v-if="selectedMapType == 'draw_mapType'" id="draw_map_tools">
                        <button v-bind="isNewStartPoint" @click="isNewStartPoint = !isNewStartPoint" :class="{ 'maptools_btn_active': isNewStartPoint, 'draw_map_tools_button': !isNewStartPoint }" class="draw_map_tools_button">断点</button>
                        <button @click="retract_drawmap" class="draw_map_tools_button">撤回</button>
                        <button @click="clean_drawmap" class="draw_map_tools_button">清空</button>
                        <button @click="enableClickEvent = !enableClickEvent" :class="{ 'maptools_btn_active': enableClickEvent, 'draw_map_tools_button': !enableClickEvent }" class="draw_map_tools_button">启用点击<br>注意节点间隔</button>
                        <!-- <button class="draw_map_tools_button">路线分段(未完成)</button> -->
                    </div>
                    <!-- 在画板顶层放置一个隐形的div,用于放置一些标记 -->
                    <div v-if="selectedMapType == 'draw_mapType'" id="canvasTOP">
                        <!-- <image id="testimg" th:src="@{/res/local_br.png}" src="../static/res/local_br.png" width="20px" style="left: 310.31583182445206px;top: 278.5985327600884px;"></image> -->
                    </div>

                    <canvas v-if="selectedMapType == 'draw_mapType'" id="mapcanvasdivcan" class="mapcanvasdivcan" width="690" height="690" @mousedown="drawMouseDown($event)" @mousemove="drawMouseMove($event)" @mouseup="drawMouseUp($event)" @click="drawMouseClick($event)"></canvas>
                    <textarea v-if="selectedMapType == 'write_mapType'" id="mapcanvasdivtext" class="D mapcanvasdivtext" name="mapdata" placeholder="自定义跑步json数据,此处文本会作为latLng的值"></textarea>
                    <div v-if="selectedMapType == 'copy_mapType'" id="mapcanvasdivcan_js_div" width="100%" height="100%" style="display: flex;" class="copy_mapType_div">
                        <div v-if="selected_recode.length==0">
                            <div @click="showRunRecodesAphonelist = !showRunRecodesAphonelist">使用"查看跑步评分 & 更新手机型号"功能选择服务器端地图</div>
                        </div>
                        <div v-else class="copy_mapType_div_show">
                            <img class="copy_mapType_div_show_img" src="/wkmap.jpg" width="690" height="690">
                            <!-- 画板尺寸坑 -->
                            <canvas id="canvas_selected" class="copy_mapType_div_show_canvas" width="690" height="690"></canvas>
                            <p>详情占位符</p>
                        </div>
                    </div>
                </div>
                <div class="fd" id="subdata" @click="subdata">完成运动</div>
            </div>
        </div>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js';
import axios from 'axios';
import VueVirtualScroller from 'vue-virtual-scroller';
import { Base64 } from 'js-base64'
import { ElNotification, translate } from 'element-plus';
import { toRaw } from 'vue'
import dayjs from 'dayjs'

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
            // userId: 获取cookie的usercode, 如果没有就是空字符串
            userId: document.cookie.replace(/(?:(?:^|.*;\s*)usercode\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
            userId_search: '',
            androidbrands: {
                Samsung: ['Samsung'],
                HUAWEI: ['HUAWEI', 'HONOR', 'CMDC'],
                Xiaomi: ['Xiaomi', 'Redmi', 'POCO'],
                OPPO: ['OPPO', 'Realme', 'OnePlus'],
                vivo: ['vivo', 'iQOO'],
                Meizu: ['Meizu'],
                Google: ['Google', 'Pixel'],
                ZTE: ['ZTE', 'Nubia'],
                Sony: ['Sony'],
                LG: ['LG'],
                HTC: ['HTC'],
                Lenovo: ['Lenovo', 'Motorola'],
                TCL: ['TCL', 'Alcatel'],
                努比亚: ['nubia'],
                Nokia: ['Nokia'],
                ASUS: ['ASUS', 'ROG'],
                Coolpad: ['Coolpad'],
                Gionee: ['Gionee'],
                LeEco: ['LeEco'],
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
            default_phone: "Xiaomi M2011K2C",
            phone: "Xiaomi M2011K2C",
            default_useragent: "okhttp/4.5.0",
            useragent: "",
            pointconv: true, // 节点合理化
            Loc_UA: navigator.userAgent,
            runRecodes: {}, // 运动记录和评分
            historyPhoneInfo: [], // 历史手机型号
            showRunRecodesAphonelist: false, // 是否显示运动记录和评分
            showHistoryPhoneInfo: false, // 是否显示历史手机型号
            totalGeoLength_lock: true, // 距离是否锁定
            totalTimeLength_lock: true, // 时间是否锁定
            getRunRecodesAphonelist_lock: false, // 获取运动记录和评分锁定
            totalGeoLength: '', // 距离
            totalTimeLength: '', // 时间
            beginTime: '', // 开始时间
            endTime: '', // 结束时间
            able_stream: true, // 是否启用流
            APPversion: "1.0.3",//跑步软件版本号,苹果系统填写此参数,安卓系统不填写此参数
            Androidversion: "",//安卓系统版本号,安卓系统应该填写此参数,苹果系统不填写此参数(本地缓存)
            UAversion: "",//通过UA获取到的系统版本,安卓系统应该填写此参数,苹果系统不填写此参数填写跑步软件的版本号(提交)
            UAOsModel: "",//安卓系统用于填写手机型号的一部分参数,这里是通过UA获取的,还有一部分是用户通过下拉框选择的
            UAOsVersion: "",//通过UA获取到的系统版本,苹果系统专有的参数
            ostype: "android",//系统类型,安卓填写android,苹果填写iOS
            mapType: [ // 地图类型
                { name: "画出跑步路线", brand: "draw_mapType" },
                { name: "自定义跑步json数据", brand: "write_mapType" },
                { name: "提交学校服务器已存在的数据", brand: "copy_mapType" }
            ],
            selectedMapType: "draw_mapType", // 当前选择的地图类型
            // 选择服务器地图相关
            el_chooseMap: false, // 是否显示服务器地图
            el_chooseMapUserid: "", // 当前选择的学号
            selected_recode: "", // 已选择的服务器端数据
            // 自画地图相关
            thecanvas: null, //画板,在组件挂载后初始化
            isStartPosition: true, // 是否是起始点
            isNewStartPoint: true, // 是否是新的起始点
            drawmap_list_canvas: [], // 画出的地图点(全程)(画板坐标)
            drawmap_list_temp: [], // 画出的地图点(临时)(画板坐标)
            drawmap_can_recode: false, // 当按下鼠标时开启记录, 当抬起鼠标时关闭记录
            enableClickEvent: false, // 是否启用点击事件
            Geolen_canvas: 0, // 已存放的地图物理距离
            Geolen_temp: 0, // 正在绘制的地图物理距离
            nodespace: 0, // 节点间隔
            nownodespace: 0, // 当前节点间隔
            // 来自wkyd_dbshow
            // 画板参数相关
            canvasWidth: 690,//画布宽度
            canvasHeight: 690,//画布高度
            OriginSX: 118.766916,//原点经度坐标
            OriginSY: 36.891086,//原点纬度坐标
            OriginEX: 118.781829,//对点经度坐标
            OriginEY: 36.879227,//对点纬度坐标
            GeoW: 1250,//地图地理宽度(cm)
            GeoH: 1250,//地图地理高度(cm)
        };
    },
    mounted() {
        // 显示设备类型
        console.log(navigator.userAgent)
        console.log(this.updateDeviceModel());
        const model = this.updateDeviceModel();
        if (model == 'Android' || model == 'iPhone') {
            this.enableClickEvent = true;
        }
        this.updateHeader();
        // 控制地图尺寸
        this.$nextTick(() => {
            this.setFixedSize();
        });
        // 找到画板元素
        this.thecanvas = document.getElementById("mapcanvasdivcan").getContext("2d")
        // 设置开始时间和结束时间, 结束时间是当前时间, 开始时间是当前时间早28分钟, 精确到秒
        const date = new Date()
        this.endTime = dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
        this.beginTime = dayjs(date.getTime() - ((Math.floor(Math.random() * 121) + 1620) * 1000)).format('YYYY-MM-DDTHH:mm:ss');

    },
    computed: {
        // 计算属性, 地图相关
        OriginW() {
            return this.OriginEX - this.OriginSX; //经度宽度
        },
        OriginH() {
            return this.OriginEY - this.OriginSY; //纬度高度
        },
        RatioX() {
            return this.OriginW / this.canvasWidth; //经度比例
        },
        RatioY() {
            return this.OriginH / this.canvasHeight; //纬度比例
        },
        GeoPixel() {
            return this.GeoW / this.canvasWidth; //地图像素点长度
        },
        RatioX_half() {
            return this.OriginW / ( this.canvasWidth / 2 ); //经度比例的一半
        },
        RatioY_half() {
            return this.OriginH / ( this.canvasHeight / 2 ); //纬度比例的一半
        },
        GeoPixel_half() {
            return this.GeoW / ( this.canvasWidth / 2 ); //地图像素点长度的一半
        }
    },
    methods: {
        // 设置画板尺寸
        setFixedSize() {
            const mapCanvasDiv = this.$el.querySelector('#mapcanvasdiv');
            if (mapCanvasDiv) {
                console.log("修正 #mapCanvasDiv 地图尺寸");
                const computedWidth = Math.min(690, window.innerWidth * 0.9, window.innerHeight * 0.9);
                const computedHeight = Math.min(690, window.innerWidth * 0.9, window.innerHeight * 0.9);
                mapCanvasDiv.style.width = computedWidth + 'px';
                mapCanvasDiv.style.height = computedHeight + 'px';
                this.canvasWidth = computedWidth
                this.canvasHeight = computedHeight
            } else {
                console.warn("找不到 #mapcanvasdiv 地图元素");
            }
            const mapcanvasdivcan = this.$el.querySelector("#mapcanvasdivcan")
            if (mapcanvasdivcan) {
                console.log("修正 #mapcanvasdivcan 画板尺寸");
                mapcanvasdivcan.width = this.canvasWidth
                mapcanvasdivcan.height = this.canvasHeight
            } else {
                console.warn("找不到 #mapcanvasdivcan 画板");
            }
        },
        // 通知
        ElNotification(title, message, type) {
            ElNotification({
                title: title,
                message: message,
                type: type
            });
        },
        // 使用base64编码
        encode_base(str){
            return Base64.encode(str)
        },
        // 使用base64解码
        decode_base(str){
            return Base64.decode(str)
        },
        // 解码用户id
        decodedUserId(id) {
            if (id == "") {
                return "";
            }
            return Base64.decode(id);
        },
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
        // 获取安卓设备信息
        getdAndroideviceInfo() {
            const androidRegex = /Android\s([\d.]+);\s?([^;\)]*)/i
            const userAgent = navigator.userAgent;
            let deviceInfo = {
                deviceType: 'Unknown',
                version: '',
                model: ''
            };
            if (/Android/.test(userAgent)) {
                let match = userAgent.match(androidRegex)
                deviceInfo.deviceType = 'Android';
                deviceInfo.version = match[1];
                deviceInfo.model = match[2].split(' ')[0].trim();
            }
            return deviceInfo;
        },
        // 本地粗略判断是安卓苹果win还是linux设备,并更新UAversion安卓版本号,UAOsModel安卓型号,UAOsVersion苹果版本号
        updateDeviceModel() {
            const androidRegex = /Android\s([\d.]+);\s?([^;\)]*)/i
            const iosRegex = /\(iPhone;.*?OS\s([\d_]+)\s?/i
            const userAgent = navigator.userAgent
            let model = 'Unknown'
            if (/Android/.test(userAgent)) {
                let match = userAgent.match(androidRegex)
                model = 'Android'
                this.ostype = "android"
                this.Androidversion = match[1]
                this.UAversion = match[1]
                this.UAOsModel = match[2].split(' ')[0].trim()
            } else if (/iPhone/.test(userAgent)) {
                let match = userAgent.match(iosRegex)
                model = 'iPhone'
                this.ostype = "iOS"
                this.UAversion = this.APPversion
                this.UAOsVersion = match[1].replace(/_/g, '.')
            } else if (/iPad/.test(userAgent)) {
                model = 'iPad'
            } else if (/Windows/.test(userAgent)) {
                model = 'Windows'
            } else if (/Mac OS X/.test(userAgent)) {
                model = 'Mac'
            } else if (/Linux/.test(userAgent)) { // 包含Android
                model = 'Linux'
            }
            return model;
        },
        // 更新header
        updateHeader() {
            console.log("更新header");
            let DeviceMode = this.updateDeviceModel()
            // 初始化时设置 sign
            this.updateSign();
            // 初始化时设置 useragent
            this.useragent = DeviceMode == "iPhone" ? "RunWay/" + this.APPversion + " (iPhone; iOS " + this.selectedBrandInput + "; Scale/3.00)" : this.default_useragent;
            // 初始化时设置 手机型号
        },
        // 在服务器获取历史型号, 过时的方法
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
        // 点击确定使用该手机型号
        usephoneInfo(event) {
            // console.log(event)
            let phoneInfo = event.target.innerText
            console.log(event.target.innerText)
            if (phoneInfo == "") {
                this.ElNotification("提示", "该手机型号为空", "warning")
            }
            if (phoneInfo.startsWith("android")) {
                // 分别是android_版本号_型号
                let phoneInfo_list = phoneInfo.split('_')
                this.selectedBrandInput = "来自历史型号"
                this.UAversion = phoneInfo_list[1]
                this.phone = phoneInfo_list[2]
                this.useragent = this.default_useragent
                this.ostype = "android"
                this.ElNotification("成功选择手机型号", "已选择: 安卓 " + phoneInfo_list[1] + " " + phoneInfo_list[2], "success")
            } else if (phoneInfo.startsWith("iOS")) {
                // 分别是iOS_版本号_型号
                let phoneInfo_list = phoneInfo.split('_')
                this.selectedBrandInput = "来自历史型号"
                this.UAversion = this.APPversion
                this.phone = phoneInfo_list[2]
                this.useragent = "RunWay/" + this.APPversion + " (iPhone; iOS " + phoneInfo_list[1] + "; Scale/3.00)"
                this.ostype = "iOS"
                this.ElNotification("成功选择手机型号", "已选择: 苹果 " + phoneInfo_list[1] + " " + phoneInfo_list[2], "success")
            } else {
                this.ElNotification("提示", "仅支持安卓和苹果手机", "info")
            }
            // this.selectedBrandInput = event.target.innerText
            // this.phone = event.target.innerText
            // this.useragent = "RunWay/"+this.APPversion+" (iPhone; iOS "+ this.selectedBrandInput +"; Scale/3.00)"
        },
        /**
         * 获取运行记录和评分和历史手机型号
         * @param userid  用户id, 应确保放入列表的是string类型而不是int类型
         */
        getRunRecodesAphonelist(userid) {
            if (this.getRunRecodesAphonelist_lock) {
                alert("正在获取中，请稍后再试")
            }
            this.getRunRecodesAphonelist_lock = true;
            let userid_base64 = Base64.encode(userid);
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
                            this.runRecodes[userid_base64].push(JSON.parse(element))
                        });
                    }
                }).then(response => { // 全部完成时
                    this.getRunRecodesAphonelist_lock = false;
                    // console.log(this.runRecodes[0])
                    // console.log(this.runRecodes)
                    // console.log(userid_base64);
                }).catch(error => {
                    console.error(error);
                    this.getRunRecodesAphonelist_lock = false;
                });
            } else {
                console.log('无流发送请求，获取运动记录和评分');
                axios.post('/webapi/dfdetection', {
                    userId: userid,
                    salt: this.salt,
                    sign: this.sign
                }).then(res => {
                    this.getRunRecodesAphonelist_lock = false;
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
                    this.getRunRecodesAphonelist_lock = false;
                });
            }
        },
        /**
         * 地图相关
         */
        // 更新自画地图
        updateDrawMapInfo() {

        },
        // 清空画板
        clean_drawmap() {
            this.clean_draw()
            this.drawmap_list_canvas = []
            this.drawmap_list_temp = []
            this.isStartPosition = true
            this.isNewStartPoint = true
            this.updateDrawMapInfo() // 更新地图信息,待完成
        },
        drawMouseDown(e) {
            this.drawmap_can_recode = true
            if(this.isStartPosition || this.isNewStartPoint) this.thecanvas.beginPath()
            this.thecanvas.strokeStyle = 'green'
            // console.log("按下点", e.offsetX, e.offsetY)
        },
        drawMouseMove(e) {
            // 如果没有按下鼠标, 就直接忽略
            if (!this.drawmap_can_recode) return
            // console.log(this.nodespace)
            if  (this.nodespace == '') this.nodespace = 0
            // latitude -> Y, longitude -> X
            let preX, preY
            if(this.isStartPosition || this.isNewStartPoint){
                this.drawmap_list_temp.push({"isStartPosition": true, "latLng": {"Ylatitude": e.offsetY, "Xlongitude": e.offsetX}})
                this.thecanvas.moveTo(e.offsetX, e.offsetY)
                preX = e.offsetX
                preY = e.offsetY
            } else {
                // 节点间隔只对普通节点有效, 保证起点节点肯定能添加
                if (this.nodespace > 0) {
                    if (this.nownodespace <= 0) {
                        this.nownodespace = this.nodespace
                        return
                    } else {
                        this.nownodespace -= 1
                    }
                }
                if (this.drawmap_list_temp.length > 0) {
                    preX = this.drawmap_list_temp[this.drawmap_list_temp.length - 1].latLng.Xlongitude
                    preY = this.drawmap_list_temp[this.drawmap_list_temp.length - 1].latLng.Ylatitude
                } else {
                    preX = this.drawmap_list_canvas[this.drawmap_list_canvas.length - 1][this.drawmap_list_canvas[this.drawmap_list_canvas.length - 1].length - 1].latLng.Xlongitude
                    preY = this.drawmap_list_canvas[this.drawmap_list_canvas.length - 1][this.drawmap_list_canvas[this.drawmap_list_canvas.length - 1].length - 1].latLng.Ylatitude
                }
                this.drawmap_list_temp.push({"latLng": {"Ylatitude": e.offsetY, "Xlongitude":e.offsetX}})
                this.thecanvas.lineTo(e.offsetX, e.offsetY)
                this.Geolen_temp += this.calGeolen(preX, preY, e.offsetX, e.offsetY)
            }

            this.thecanvas.stroke()
            
            if(this.isStartPosition) this.isStartPosition = false
            if(this.isNewStartPoint) this.isNewStartPoint = false
        },
        drawMouseUp(e) {
            this.drawmap_can_recode = false
            if(this.drawmap_list_temp.length == 0) return
            this.drawmap_list_canvas.push(this.drawmap_list_temp)
            this.drawmap_list_temp = []
            this.Geolen_temp = 0
            const rawrundata = toRaw(this.drawmap_list_canvas)

            console.log("起点", rawrundata, rawrundata[0][0].latLng)
            // console.log("抬起点", e.offsetX, e.offsetY)
            this.draw_drawmap_list_canvas()
        },
        drawMouseClick(e) {
            // console.log("点击点", e.offsetX, e.offsetY)
            // 此处获取到的坐标和抬起点一致
            // 手机也能获取到按下抬起事件,但是没有移动事件, this.drawmap_list_temp将会为空
            if (this.enableClickEvent) { // 说明没有移动事件
                if(this.isStartPosition || this.isNewStartPoint){
                    this.drawmap_list_temp.push({"isStartPosition": true, "latLng": {"Ylatitude": e.offsetY, "Xlongitude": e.offsetX}})
                } else {
                    this.drawmap_list_temp.push({"latLng": {"Ylatitude": e.offsetY, "Xlongitude": e.offsetX}})
                }
                this.drawmap_list_canvas.push(this.drawmap_list_temp)
                this.drawmap_list_temp = []
                this.draw_drawmap_list_canvas()
                if(this.isStartPosition) this.isStartPosition = false
                if(this.isNewStartPoint) this.isNewStartPoint = false
            }
        },
        // 清空画板
        clean_draw(){
            this.thecanvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        },
        // 重画地图路线
        draw_drawmap_list_canvas(){
            this.thecanvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            if(this.drawmap_list_canvas.length == 0) return
            this.thecanvas.beginPath() // 冗余的, 保证错误的数据也能绘制
            this.thecanvas.strokeStyle=this.getRandomDarkColor()
            // this.thecanvas.moveTo(this.drawmap_list_canvas[0].latLng.Xlongitude, this.drawmap_list_canvas[0].latLng.Ylatitude)
            this.thecanvas.font = "20px Arial";
            let that = this
            this.drawmap_list_canvas.forEach((blockarray, blockindex) => {
                blockarray.forEach((value, index) => {
                    if(value.isStartPosition){
                        that.thecanvas.fillText(blockindex, value.latLng.Xlongitude, value.latLng.Ylatitude)
                        that.thecanvas.beginPath()
                        that.thecanvas.strokeStyle=that.getRandomDarkColor()
                        that.thecanvas.moveTo(value.latLng.Xlongitude, value.latLng.Ylatitude)
                    }
                    that.thecanvas.lineTo(value.latLng.Xlongitude, value.latLng.Ylatitude)
                    that.thecanvas.stroke()
                })
            })
        },
        // 生成随机深色
        getRandomDarkColor() {
            const r = Math.floor(Math.random() * 200)
            const g = Math.floor(Math.random() * 200)
            const b = Math.floor(Math.random() * 200)
            return `rgb(${r}, ${g}, ${b})`;
        },
        // 撤回路线
        retract_drawmap(){
            // drawmap_list_canvas: [], // 画出的地图点(全程)(画板坐标)
            // drawmap_list_temp: [], // 画出的地图点(临时)(画板坐标)
            // console.log(this.drawmap_list_canvas.length, this.drawmap_list_canvas)
            this.drawmap_list_canvas.pop()
            if(this.drawmap_list_canvas.length == 0){
                this.isStartPosition = true
                this.isNewStartPoint = true
            }
            this.draw_drawmap_list_canvas()
        },
        //计算坐标,将地图坐标转换为画板坐标
        calLtoXY(longitude, latitude){
            let ituse = {
                x: (longitude - this.OriginSX) / this.RatioX,
                y: (latitude - this.OriginSY) / this.RatioY
            }
            return ituse;
        },
        //计算坐标,将画板坐标转换为地图坐标
        calXYtoL(X, Y){
	        let ituse = {
		        x: X * this.RatioX + this.OriginSX,
		        y: Y * this.RatioY + this.OriginSY
	        }
	        return ituse;
        },
        // 通过勾股定理计算两点之间的物理距离
        calGeolen(preX, preY, nowX, nowY){
            if(preX == nowX && preY == nowY) return 0
            if(preX == nowX) return Math.abs(nowY - preY) * this.GeoPixel
            if(preY == nowY) return Math.abs(nowX - preX) * this.GeoPixel
            return Math.sqrt(Math.pow((nowX - preX), 2) + Math.pow((nowY - preY), 2)) * this.GeoPixel
        },
        calLtoXY_half(longitude, latitude){
            let ituse = {
                x: (longitude - this.OriginSX) / this.RatioX_half,
                y: (latitude - this.OriginSY) / this.RatioY_half
            }
            return ituse;
        },
        // 自定义尺寸的, 通过传入画板宽度和高度计算坐标,将画板坐标转换为地图坐标
        calXYtoL_custom(X, Y, width, height){
            let ituse = {
                x: X * (this.OriginW / width) + this.OriginSX,
                y: Y * (this.OriginH / height) + this.OriginSY
            }
            return ituse;
        },
        // 自定义尺寸的, 通过传入画板宽度和高度计算坐标,将地图坐标转换为画板坐标
        calLtoXY_custom(longitude, latitude, width, height){
            let ituse = {
                x: (longitude - this.OriginSX) / (this.OriginW / width),
                y: (latitude - this.OriginSY) / (this.OriginH / height)
            }
            return ituse;
        },
        // 自定义尺寸的, 通过传入画板宽度和高度计算坐标, 勾股定理计算两点之间的物理距离
        calGeolen_custom_w(preX, preY, nowX, nowY, width, height){
            if(preX == nowX && preY == nowY) return 0
            if(preX == nowX) return Math.abs(nowY - preY) * (this.GeoW / width)
            if(preY == nowY) return Math.abs(nowX - preX) * (this.GeoH / height)
            return Math.sqrt(Math.pow((nowX - preX), 2) + Math.pow((nowY - preY), 2)) * Math.sqrt(Math.pow(this.GeoW / width, 2) + Math.pow(this.GeoH / height, 2))
        },
        // 传入比率的, 自定义尺寸的, 通过传入画板宽度和高度计算坐标,将画板坐标转换为地图坐标
        calXYtoL_custom(X, Y, RatioX, RatioY, OriginSX, OriginSY){
            let ituse = {
                x: X * RatioX + OriginSX,
                y: Y * RatioY + OriginSY
            }
            return ituse;
        },
        // 传入比率的, 自定义尺寸的, 通过传入画板宽度和高度计算坐标,将地图坐标转换为画板坐标
        calLtoXY_custom(longitude, latitude, RatioX, RatioY, OriginSX, OriginSY){
            let ituse = {
                x: (longitude - OriginSX) / RatioX,
                y: (latitude - OriginSY) / RatioY
            }
            return ituse;
        },
        // 传入比率的, 自定义尺寸的, 通过传入画板宽度和高度计算坐标, 勾股定理计算两点之间的物理距离
        calGeolen_custom_R(preX, preY, nowX, nowY, RatioX, RatioY){
            if(preX == nowX && preY == nowY) return 0
            if(preX == nowX) return Math.abs(nowY - preY) * RatioY
            if(preY == nowY) return Math.abs(nowX - preX) * RatioX
            return Math.sqrt(Math.pow((nowX - preX), 2) + Math.pow((nowY - preY), 2)) * Math.sqrt(Math.pow(RatioX, 2) + Math.pow(RatioY, 2))
        },
        // 自画路线获取打卡点位置
        get4point(){
            if(this.userId == ""){
                alert("请先输入学号")
                return
            }
            if(this.drawmap_list_canvas.length == 0 || this.drawmap_list_canvas[0].length == 0){
                alert("请先任意画出一个起点")
                return
            }
            let L = this.calXYtoL(this.drawmap_list_canvas[0][0].latLng.Xlongitude, this.drawmap_list_canvas[0][0].latLng.Ylatitude)
            let updata = {"HEAD": {"X-Re-Os": this.ostype, "X-Re-Version": this.UAversion, "X-Re-Device": this.phone, "User-Agent": this.useragent}, 
                        "BODY": {"campus": "1", "pointLat": L.y, "pointLong": L.x, "userCode": this.userId}}
            if(this.ostype == "iOS") updata.HEAD["X-Re-OsVersion"] = this.UAOsVersion
            axios.post(`/api/semester/queryPoint?salt=${this.salt}&sign=${this.sign}`, updata).then(res => {
                // console.log(res.data)
                if(res.data.code != 1){
                    this.ElNotification("获取打卡点失败", res.data.msg, "error")
                    return
                }
                const canvas = document.getElementById('canvasTOP')
                canvas.innerHTML = ''
                res.data.data.forEach((v) => {
                    let XY = this.calLtoXY(v.pointLong, v.pointLat)
                    const img = document.createElement('img')
                    img.src = 'location.svg'
                    img.style.position = 'absolute'
                    img.style.left = XY.x + 'px'
                    img.style.top = XY.y + 'px'
                    img.style.width = '20px'
                    img.style.height = '20px'
                    img.style.transform = 'translate(-50%, -100%)'
                    canvas.appendChild(img)
                })
            }).catch(err => {
                console.error(err)
            })
        },
        subdata(){
            switch(this.selectedMapType){
                case "draw_mapType":
                    this.subdata_draw_mapType()
                    break
                case "write_mapType":
                    this.subdata_write_mapType()
                    break
                case "copy_mapType":
                    this.subdata_copy_mapType()
                    break
            }
        },
        subdata_draw_mapType(){
            console.log("提交自画地图")
            console.log(this.drawmap_list_canvas)
            console.log(this.Geolen_canvas)
        },
        subdata_write_mapType(){
            console.log("提交自定义json数据")
        },
        subdata_copy_mapType(){
            console.log("提交学校服务器已存在的数据")
        },
        // 选择服务器地图数据
        setMapData(recode){
            this.selectedMapType = "copy_mapType"
            this.selected_recode = recode
            this.ElNotification("成功", "选择了服务器地图数据", "success")
            console.log(recode)
        },
        // 显示服务器跑步数据, 画出地图路线
        drawserMap(canvasId, recode){
            // console.log("画地图", canvasId, recode.runId)
            const canvas = document.getElementById(canvasId)
            const RatioX = this.OriginW / canvas.width
            const RatioY = this.OriginH / canvas.height
            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.beginPath()
            ctx.strokeStyle = 'green'
            const markList_json = JSON.parse(recode.markList)
            markList_json.forEach((mark, index) => {
                // const xyhalf = this.calLtoXY_half(mark.latLng.longitude, mark.latLng.latitude)
                // 使用calLtoXY_custom
                const xy = this.calLtoXY_custom(mark.latLng.longitude, mark.latLng.latitude, RatioX, RatioY, this.OriginSX, this.OriginSY)
                if(index == 0){
                    ctx.moveTo(xy.x, xy.y)
                } else if (mark.isStartPosition){
                    ctx.stroke()
                    ctx.moveTo(xy.x, xy.y)
                } else {
                    ctx.lineTo(xy.x, xy.y)
                }
            })
            ctx.stroke()
        }
    },
    watch: {
        // 监听 salt 的变化b
        salt() {
            this.updateSign();
        },
        // 监听 安卓手机型号 的变化
        selectedAndroidBrand(newValue) {
            this.selectedBrandInput = newValue
            this.UAversion = this.Androidversion
            this.phone = newValue + " " + this.UAOsModel
            this.useragent = this.default_useragent
            this.ostype = "android"
            if (newValue == "default") {
                this.phone = this.default_phone
            }
        },
        // 监听 苹果手机型号 的变化
        selectediPhoneBrand(newValue) {
            this.selectedBrandInput = newValue
            this.UAversion = this.APPversion
            this.phone = newValue
            this.useragent = "RunWay/" + this.APPversion + " (iPhone; iOS " + this.selectedBrandInput + "; Scale/3.00)"
            this.ostype = "iOS"
            if (newValue == "default") {
                this.phone = this.default_phone
            }
        },
        beginTime(newValue) {
            // console.log("新beginTime", newValue)
            if (this.totalTimeLength_lock)
                this.totalTimeLength = (new Date(this.endTime).getTime() - new Date(newValue).getTime()) / 1000
        },
        endTime(newValue) {
            // console.log("新endTime", newValue)
            if (this.totalTimeLength_lock)
                this.totalTimeLength = (new Date(newValue).getTime() - new Date(this.beginTime).getTime()) / 1000
        },
        // 监听保存的画板地图, 计算地图物理距离
        drawmap_list_canvas: {
            handler(newValue) {
                // console.log("新drawmap_list_canvas", newValue)
                let totalGeoLength = 0
                // const that = this
                this.drawmap_list_canvas.forEach((blockarray, blockindex) => {
                    blockarray.forEach((value, index) => {
                        if(value.isStartPosition && blockindex == 0) return 
                        let preX, preY
                        if(index == 0) {
                            if(value.isStartPosition) return
                            preX = this.drawmap_list_canvas[blockindex - 1][this.drawmap_list_canvas[blockindex - 1].length - 1].latLng.Xlongitude
                            preY = this.drawmap_list_canvas[blockindex - 1][this.drawmap_list_canvas[blockindex - 1].length - 1].latLng.Ylatitude
                        } else {
                            preX = blockarray[index - 1].latLng.Xlongitude
                            preY = blockarray[index - 1].latLng.Ylatitude
                        }
                        // console.log("preX", preX, "preY", preY)
                        let nowX = value.latLng.Xlongitude
                        let nowY = value.latLng.Ylatitude
                        totalGeoLength += this.calGeolen(preX, preY, nowX, nowY)
                    })
                })
                this.Geolen_canvas = totalGeoLength
            },
            deep: true
        },
        el_chooseMap(newValue){
            if(newValue){
                // 调用drawMap方法更新canvas
                this.$nextTick(() => {
                    const recodes = this.runRecodes[this.el_chooseMapUserid];
                    console.log(recodes)
                    if (recodes && recodes.length > 0) {
                        // console.log("开始绘制地图")
                        this.$nextTick(() => {
                            recodes.forEach(recode => {
                                const canvasId = 'canvas_' + this.encode_base(recode.runId);
                                // 确保DOM更新完成后调用绘制函数
                                this.drawserMap(canvasId, recode);
                            });
                        });
                    }
                })
            }
        },
        selectedMapType(new_selectedMapType){
            if(new_selectedMapType == "draw_mapType"){
                this.$nextTick(() => {
                    this.thecanvas = document.getElementById("mapcanvasdivcan").getContext("2d")
                    this.draw_drawmap_list_canvas()
                })
            }
            if(new_selectedMapType == "copy_mapType"){
                if(this.selected_recode){
                    console.log("绘制已选择的服务器端地图")
                    if(this.totalGeoLength_lock){
                        this.totalGeoLength = this.selected_recode.trueLength
                    }
                    this.$nextTick(() => {
                        this.drawserMap('canvas_selected', this.selected_recode)
                    })
                }
            }
        }
    }
}
</script>

<style scoped>
.hiddendiv {
    visibility: hidden;
}

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

.fd>*:last-child {
    flex-grow: 1;
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
    /* width: 270px; */
    flex-grow: 1;
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
    /* width: min(690px, 90vw, 90vh);
    height: min(690px, 90vw, 90vh); */
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
    background-color: #f08680;
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

#draw_map_tools {
    z-index: 4;
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
}

.draw_map_tools_button{
    height: 3rem;
    background: rgba(179, 162, 232, 0.5);
    margin: 1px;
    color: #45465e;
    border-radius: 10px;
    border: 1px solid #ffffff;
}

/* .draw_map_tools_button:hover{
    background: rgba(179, 162, 232, 0.7);
} */

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
    font-size: 1.5rem;
    border: none;
    border-bottom: solid 1px #e16d66;
    color: #e16d66;
    border-radius: 10px;
    outline: none;
    padding: 0 10px;
    background: rgba(255, 255, 255, 0);
}

.el_usercode_btn {
    font-size: 1.2rem;
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

.userrecodelist {
    width: 100%;
    max-height: 60vh;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

/* 地图相关 */
.maptools_btn_active {
    background: #669ed9;
    color: #fff;
}

/* 选择服务器地图相关 */
.el_chooseMap{
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
}

.choose_serMap{
    width: 345px;
    height: 345px;
    position: relative;
    border: 1px solid #ffa39e;
    border-radius: 10px;
    background: #dfe4ea;
    margin: 10px;
}

.choose_serMap_p{
    position: absolute;
    left: 0;
    top: 0;
}
.choose_serMap_img{
    position: absolute;
    top: 0;
    left: 0;
}
.choose_serMap_cav{
    position: absolute;
    top: 0;
    left: 0;
    width: 345px;
    height: 345px;
    background: rgba(255, 255, 255, 0);
}
.choose_serMap_btn{
    position: absolute;
    bottom: 0;
    right: 0;
}

.copy_mapType_div{
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
}
.copy_mapType_div_show{
    position: relative;
    width: 100%;
    height: 100%;
}
.copy_mapType_div_show_img{
    position: absolute;
    left: 0;
    top: 0;
}
.copy_mapType_div_show_canvas{
    position: absolute;
    left: 0;
    top: 0;
}
</style>
