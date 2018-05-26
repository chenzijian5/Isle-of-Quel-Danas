<template>
    <div id="app" style="height:100%">
        <view-box>
            <!-- 通过属性设置参数 -->
            <x-header
                slot = "header"
                title = "网易"
                :left-options = "{showBack:true,backText: '直播'}"
                style="width:100%;position:fixed;left:0;top:0;z-index:100;"
            >
                <!-- 插槽方式替代数据 promise-->
                <div slot = "right">搜索</div>
                <div>网易</div>
            </x-header>
            <scroller
            :on-refresh="refresh"
            :on-infinite="infinite"
            refreshText="奔跑吧"
            ref = "myRef"
            >
                <sc :lock-y = "true"
                style>
                    <div class="">
                        <tab class = "tab">
                            <tab-item selected>推荐</tab-item>
                            <tab-item>要闻</tab-item>
                            <tab-item>游戏</tab-item>
                            <tab-item>COS</tab-item>
                            <tab-item>娱乐</tab-item>
                            <tab-item>体育</tab-item>
                        </tab>
                    </div>
                </sc>
                <swiper :list="swiperList"
                        :loop="true"
                        :auto="true"
                >

                </swiper>
                <marquee class = "wy-marquee">
                    <marquee-item v-for = "item in marqueeList">{{item.title}}</marquee-item>
                </marquee>
                <panel
                  :list="dataList"
                >
                </panel>
            </scroller>
            <tabbar sloat="bottom" style="position:fixed">
                <tabbar-item>
                    <img src="./assets/dota.png" alt="" slot = "icon">
                    <span slot = "label">首页</span>
                </tabbar-item>
                <tabbar-item>
                    <img src="./assets/wow.png" alt="" slot = "icon">
                    <span slot = "label">推荐</span>
                </tabbar-item>
                <tabbar-item>
                    <img src="./assets/ovw.png" alt="" slot = "icon">
                    <span slot = "label">我的</span>
                </tabbar-item>
            </tabbar>
        </view-box>
    <router-view/>
    </div>
</template>

<script>
    import {ViewBox, XHeader, Tabbar, TabbarItem, Scroller as sc, Tab, TabItem, Swiper, Marquee, MarqueeItem, Panel} from "vux"
    var refArr = ["A","B01","B02", "B03", "B04", "B05", "BO6", "B07", "B08", "B09", "B10"];
    var start = 0;
    var end = start + 9;
    var key = 0;
    var keyIndex = 0;
    var isLogining = false;
    export default {
        name: 'App',
        components:{
            ViewBox,
            XHeader,
            Tabbar,
            TabbarItem,
            sc,
            Tab,
            TabItem,
            Swiper,
            Marquee,
            MarqueeItem,
            Panel

        },
        data: function(){
            return {
                swiperList: [],
                dataList:[],
                marqueeList:[],
                moreDataList:[]
            }
        },
        methods:{
            refresh(){
                isLogining=false;
                keyIndex =key++ % refArr.length;
                var url = "http://3g.163.com/touch/jsonp/sy/recommend/0-9.html";
                this.$jsonp(url,{
                    miss:"00",
                    refresh:refArr[keyIndex]
                }).then(data => {
                    this.dataList = data.list.filter(item => {
                        return item.addata === null;
                    }).map(item => {
                        return{
                            src: item.picInfo[0].url,
                            title: item.title,
                            desc: item.digest,
                            url: item.link
                        }
                    })
                    this.$refs.myRef.finishPullToRefresh();
                    this.$vux.toast.show({
                        text: '刷新成功'
                    })
                     this.$vux.toast.text("刷新了" + this.dataList.length +"数据", "top");
                     isLogining=true;
                })
            },
            infinite(){
                if(!isLogining){
                    this.$refs.myRef.finishInfinite();
                    return;
                }
                console.log("上啦加载");
                var url = "http://3g.163.com/touch/jsonp/sy/recommend/${start}-${end}.html";
                this.$jsonp(url,{
                    miss:"00",
                    refresh:refArr[keyIndex]
                }).then(data => {
                //将数据添加到页面上去
                this.moreDataList = data.list.filter(item => {
                    return item.addata === null && item.picInfo[0];
                }).map(item => {
                    return {
                        src: item.picInfo[0].url,
                        title: item.title,
                        desc: item.digest,
                        url: item.link
                    }
                })
                this.dataList.push(...this.moreDataList);
                    start += 10;
                    end = start + 9;
                    this.$refs.myRef.finishInfinite();
                })

            }
        },
        created(){
            isLogining=false;
            var url = "http://3g.163.com/touch/jsonp/sy/recommend/0-9.html"
            this.$jsonp(url).then(data => {
                this.swiperList = data.focus.filter(item => {
                    return item.addata === null;
                }).map(item => {
                    return{
                        url: item.link,
                        img: item.picInfo[0].url,
                        title: item.title
                    }
                })
                this.dataList = data.list.filter(item => {
                    return item.addata === null;
                }).map(item => {
                    return{
                        src: item.picInfo[0].url,
                        title: item.title,
                        desc: item.digest,
                        url: item.link
                    }
                })
                isLogining = true;
                this.marqueeList = data.list.filter(item => {
                    return item.addata === null;
                }).map(item => {
                    return{
                        title: item.title,
                    }
                })
                isLogining=true;
                console.log(this.marqueeList);
            })

        }
    }
</script>

<style lang = "less">
    @import '~vux/src/styles/reset.less';
    html,body{
        height:100%;
        width:100%;
        overflow-x:hidden;
    }
    #app {
        height: 100%;

        .header {
            width: 100%;
            position: absolute;
            z-index: 9;
            left: 0;
            top: 0;
        }

        .wy-tab {
            height: 44px;
            position: relative;
            margin-top: 46px;
        }
        .wy-marquee{
            margin: 10px
        }
        .weui-media-box__hd, weui-media-box__hd img{
            width: 102px;
            height: 78px
        }
        .weui-media-box__bd{
            height:78px
        }
    }
    .tab{margin-top:47px}
</style>
