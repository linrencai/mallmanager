<template>
<el-card>
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <div id="main" style="width: 700px;height:400px;"></div>
</el-card>
</template>

<script>
var echarts = require('echarts')
export default {
    mounted() {
        this.useEchats()
    },
    methods: {
        async useEchats() {
            // 请求数据
            const res = await this.$http.get(`reports/type/1`)
            //初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            //指定图表的数据和配置项
            let option2 = res.data.data
            console.log(res)
            let option1 = {
                title: {
                    text: '堆叠区域图'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }
            };
            var option = { ...option1,
                ...option2
            }
            //使用配置项和现实图表
            myChart.setOption(option);
        }

    }
}
</script>

<style>
#main {
    margin-top: 10px;
}
</style>
