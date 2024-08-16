<template>
    <h1>关于我们</h1>
    <hr>
    <div id="QAlist" @wheel="handleScroll">
        <ul>
            <li class="QAblock" v-for="item in QA" :key="item.question">
                <p class="QAq">{{ item.question }}</p>
                <p class="QAa" v-if="Array.isArray(item.answer)">
                <ul>
                    <li v-for="subItem in item.answer" :key="subItem">{{ subItem }}</li>
                </ul>
                </p>
                <p v-else>{{ item.answer }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            count: 0,
            QA: [
                {
                    question: '我(们)是谁?',
                    answer: '曾经的本校学生,现已毕业。'
                },
                {
                    question: '这是什么项目?',
                    answer: '一个某学院自动运动的项目,是wsb的后续版本,我叫它wsn'
                },
                {
                    question: '这个项目和wsb是同一开发者吗?',
                    answer: '是的,自始至终只有一人开发。'
                },
                {
                    question: '为什么要另辟蹊径?',
                    answer: '旧项目不想维护了,实际上wsb早已消极更新,最近3次更新日期分别是2023年6月7日、2023年9月6日、2024年6月8日。'
                },
                {
                    question: '为什么收费?',
                    answer: 'wsb起初免费,代码开源,且在软件里注明了源码地址,是想让校友们共同学习,一起对抗校园跑,但被学生在csdn、贴吧、QQ、微信收费倒卖,遂在0.0.7版本起不公开收费。早期版本至今仍可在 https://github.com/xmexg/wkyd 免费获取。'
                },
                {
                    question: '机刷靠谱吗?',
                    answer: ['如果不是作死设置完全不合理的跑步数据,是不会被查出的。', '1. 我们完全逆向了学校跑步软件,机刷数据和真人跑数据格式完全一致,所有数据均可更改,对于一些明确定义的常量,wsb默认禁止修改,wsb前端源码完全公开没有任何加密,全部参数均在用户电脑生成,页面上所有不可编辑的输入框,均可通过删除disable属性解锁编辑,这是我们故意设计的,对于极客可完全查看并修改网站源码,生成任意格式的数据包。', '2.我们还研究了学校服务器,自wsb0.0.9起实现了复用任意服务器中已存在的跑步数据,我们建议的使用方法是打听到真人跑的学生学号,然后复用该学号的跑步数据,数据敏感信息会在wsb和wsn后台处理,不会被学校查出。']
                },
                {
                    question: 'wsb和wsn有什么区别?',
                    answer: 'wsn是wsb的全新版本,代码完全重写,借助过去两年来的数据集,wsn解决了wsb不能自动刷的缺点,在未来可能会训练ai,自动生成跑步路线,从根本上解决跑步路线。'
                },
                {
                    question: '我(们)的其他业务?',
                    answer: '正在考虑图片视频ai换脸、ai换声,进一步应对晚间合拍查寝,需要借助在线算力平台,价格应该不会便宜。'
                },
                {
                    question: '联系方式?',
                    answer: ['Github: https://github.com/xmexg', 'TG: https://t.me/mge0_0']
                }
            ]
        }
    },

    methods: {
        increment() {
            this.count++
        },
        handleScroll(event) {
            // 阻止事件传播，确保其他元素无法获取该事件
            event.stopPropagation();
        }
    },

    mounted() {
        console.log(`The initial count is ${this.count}.`)
    }
}
</script>
<style scoped>
#QAlist {
    margin: 0 auto;
    width: 80%;
    text-align: left;
    font-size: 1.5rem;
    z-index: 10;
}

#QAlist p {
    margin: 0;
}

.QAblock {
    list-style-type: georgian;
    padding: 1.1rem 0;
}

.QAq {
    font-weight: bold;
}

.QAa {
    margin-left: 1rem;
}
</style>