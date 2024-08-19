<template>
    <div id="page">
        <div>
            手动运动
        </div>
        <div class="content">
            <div id="form">
                <div class="fd">salt:<input class="U D block" type="text" name="salt" id="salt" placeholder="salt(8位0-9和a-f,不合规无法提交)" oninput="saltchange()" maxlength="8" ><image th:src="@{/res/redo.png}" src="../static/res/redo.png" id="saltredo" class="forminputimg" onclick="setsaltsign()"></image></div>
				<div class="fd">sign:<input class="U D block" type="text" name="sign" id="sign" placeholder="访问学校服务器时的sign" disabled></div>
				<div class="fd">学号:<input class="H block" type="text" name="id" id="id" placeholder="学号" th:value="${user_id}" required></div>
				<div class="fd">系统类型:<input class="H block" type="text" name="ostype" id="ostype" placeholder="系统类型(android/iOS)" required value="android"></div>
				<div class="fd">版本号:<input class="H block" type="text" name="version" id="version" placeholder="安卓:系统版本号13/苹果:软件版本号1.0.3" required></div>
				<div id="appbrand" class="fd">手机品牌:
					<div id="appbranddiv">
						<div id="appbrandselectdiv">
							<select v-model="selectedAndroidBrand" class="selectedBrand" id="selectedAndroidBrand">
								<option value="default">选择安卓品牌</option>
								<optgroup v-for="(subBrands, brandind) in androidbrands" :label="brandind">
									<option v-for="subBrand in subBrands" :value="subBrand">{{ subBrand }}</option>
								</optgroup>
							</select>
							<select v-model="selectediPhoneBrand" class="selectedBrand" id="selectediPhoneBrand">
								<option value="default">选择苹果品牌</option>
								<option v-for="(subBrands, brandind) in iPhonebrands" :value="subBrands.brand">{{ subBrands.name }}</option>
							</select>
						</div>
						<input v-model="selectedBrandInput" class="H block" type="text" placeholder="手机品牌(Xiaomi/iPhone)" id="selectedBrandInput" disabled/>
					</div>
				</div>
				<div class="fd">手机型号:<input class="H block" type="text" name="phone" id="phone" v-model="phone" placeholder="(Xiaomi M2011K2C/iPhone14,7)" required value="Xiaomi M2011K2C"></div>
				<div class="fd">苹果:<input class="H block" type="text" name="OsVersion" id="OsVersion" placeholder="苹果需额外填写系统版本号(16.3.1)"></div>
				<div class="fd">UA:<input class="H D block" type="text" name="useragent" id="useragent" placeholder="请求头(okhttp/4.5.0)" required value="okhttp/4.5.0" disabled></div>

				<div class="fd">运动距离(米):<input class="block" type="number" name="totalGeoLength" id="totalGeoLength" placeholder="运动距离(3030),锁定状态下自动填写" disabled><image th:src="@{/res/lock.png}" src="../static/res/lock.png" id="totalGeoLengthLock" class="forminputimg" alt="锁定该值"></image></div>
				<div class="fd">运动时间(秒):<input class="block" type="number" name="totalTimeLength" id="totalTimeLength" placeholder="运动时长(1469),锁定状态下自动填写" disabled><image th:src="@{/res/lock.png}" src="../static/res/lock.png" id="totalTimeLengthLock" class="forminputimg" alt="锁定该值"></image></div>
				<div class="fd">开始时间:<input class="block" type="datetime-local" name="beginTime" id="beginTime" step="1" placeholder="开始时间(2023-03-16 11:13:27)"></div>
				<div class="fd">结束时间:<input class="block" type="datetime-local" name="endTime" id="endTime" step="1" placeholder="结束时间(2023-03-16 11:15:40)"></div>
				<div class="fd">校区:<input class="D block" type="text" name="campus" id="campus" placeholder="校区(1)" value="1" disabled></div>

				<div class="fd">节点间隔:<input class="block" type="number" id="nodespace" placeholder="手机:0,电脑:3,提高节点间隔,减少路线锯齿" onchange="nodespacechange()"></div>
				<div class="fd">节点合理化(仅对自画路线生效):<input class="checkbox block" type="checkbox" id="pointconv" name="pointconv" checked></div>
            </div>
            <div id="map"></div>
        </div>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js';
export default {
    data() {
        return {
            salt: this.generateRandomHex(), // 初始值为随机生成的8位数
            sign: '', // 初始为空，稍后通过watch设置
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
                {name: "iPhone 6", brand: "iPhone7,2"},
                {name: "iPhone 6 Plus", brand: "iPhone7,1"},
                {name: "iPhone 6s", brand: "iPhone8,1"},
                {name: "iPhone 6s Plus", brand: "iPhone8,2"},
                {name: "iPhone SE", brand: "iPhone8,4"},
                {name: "iPhone 7", brand: "iPhone9,1"},
                {name: "iPhone 7 Plus", brand: "iPhone9,2"},
                {name: "iPhone 8", brand: "iPhone10,1"},
                {name: "iPhone 8 Plus", brand: "iPhone10,2"},
                {name: "iPhone X", brand: "iPhone10,3"},
                {name: "iPhone XS", brand: "iPhone11,2"},
                {name: "iPhone XS Max", brand: "iPhone11,4"},
                {name: "iPhone XR", brand: "iPhone11,8"},
                {name: "iPhone 11", brand: "iPhone12,1"},
                {name: "iPhone 11 Pro", brand: "iPhone12,3"},
                {name: "iPhone 11 Pro Max", brand: "iPhone12,5"},
                {name: "iPhone SE (第 2 代)", brand: "iPhone12,8"},
                {name: "iPhone 12 mini", brand: "iPhone13,1"},
                {name: "iPhone 12", brand: "iPhone13,2"},
                {name: "iPhone 12 Pro", brand: "iPhone13,3"},
                {name: "iPhone 12 Pro Max", brand: "iPhone13,4"},
                {name: "iPhone 13 mini", brand: "iPhone14,4"},
                {name: "iPhone 13", brand: "iPhone14,5"},
                {name: "iPhone 13 Pro", brand: "iPhone14,2"},
                {name: "iPhone 13 Pro Max", brand: "iPhone14,3"},
                {name: "iPhone SE (第 3 代)", brand: "iPhone14,6"},
                {name: "iPhone 14", brand: "iPhone14,7"},
                {name: "iPhone 14 Plus", brand: "iPhone14,8"},
                {name: "iPhone 14 Pro", brand: "iPhone15,2"},
				{name: "iPhone 15", brand: "iPhone15,4"},
				{name: "iPhone 15 Plus", brand: "iPhone15,5"},
				{name: "iPhone 15 Pro", brand: "iPhone16,1"},
				{name: "iPhone 15 Pro Max", brand: "iPhone16,2"}
            ],
            selectedAndroidBrand: "Xiaomi",
            selectediPhoneBrand: "iPhone15,4",
            selectedBrandInput: "",
            phone: "Xiaomi M2011K2C",
            useragent: "okhttp/4.5.0"
        };
    },
    mounted() {
        // 初始化时设置 sign
        this.updateSign();
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
        }
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
			if (newValue !== 'default') {
				this.selectedBrandInput = newValue;
			}
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
    width: 100%;
    height: 100%;
    overflow: auto;
}

.content {
    /* flex-grow: 1; */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 95%;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    justify-content: space-around;
    font-size: 0.8em;
}

#form {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-width: 100vw;
    max-height: 100vh;
    overflow: auto;
    padding: 1rem;
}

.fd{
    display: flex;
    flex-direction: row;
    text-align: left;
    /* background: #ffa39e; */
    margin: 0.3rem 0;
    color: #5c5c5c;
}

.block{
    /* flex-grow: 1; */
    font-size: 0.6em;
    width: 300px;
    margin: 0 20px;
    border-top: none;
	border-left: none;
	border-right: none;
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.7);
    outline: solid 1px #ffa39e;
}

.D{
	background: #ffa39e;
}

#appbranddiv{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ffa39e;
}

#appbrandselectdiv{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: auto;
}

.selectedBrand{
    font-size: 0.7em;
    margin: 5px 0;
}

#selectedBrandInput{
    margin: 0;
    padding: 0;
    width: 100%;
}

.checkbox{
    width: auto;
    font-size: 2em;
}
</style>
