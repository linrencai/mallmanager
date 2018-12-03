<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="添加商品"></my-bread>
    <!-- alert带图标 -->
    <el-alert title="成功提示的文案" type="success" center show-icon closeable class="alert1">
    </el-alert>
    <!-- steps步骤条 -->
    <el-steps :active="1*active" finish-status="success" simple style="margin-top: 20px">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- 外层嵌套一个表单,用于提交信息 -->
    <el-form label-position="top" label-width="80px" :model="form" style="height: 400px;overflow:auto">
        <!-- tabs切换栏 -->
        <el-tabs tabPosition="left" v-model="active" @tab-click="tabChange()">
            <el-tab-pane name="1" label="基本信息">
                <!-- 基本信息 -->
                <el-form-item label="商品名称">
                    <el-input v-model="form.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="form.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="form.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <!-- 级联选择器 -->
                    <!-- {{selectedOptions}} -->
                    <el-cascader clearable expand-trigger="hover" 
                    :options="options" 
                    :props="defaultProp" 
                    v-model="selectedOptions" 
                    @change="handleChange">
                    </el-cascader>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="2" label="商品参数">
                <!-- // 显示三级分类的商品参数 -->
                <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrattributes" :key="i">
                    <!-- 复选框组 -->
                    <el-checkbox-group v-model="item1.attr_vals">
                        <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="3" label="商品属性">
                <!-- 静态参数 -->
                <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrStatic" :key="i">
                    <el-input v-model="item1.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="4" label="商品图片">
                <el-form-item>
                    <!-- baseurl 在这里无效 -->
                    <el-upload class="upload-demo" :headers="headers" action="http://localhost:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="5" label="商品内容">
                <el-form-item>
                    <el-button type="primary" @click="addGoods()">点我-添加商品</el-button>
                    <quill-editor class="editor" v-model="form.goods_introduce"></quill-editor>
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
    </el-form>
</el-card>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
import { quillEditor } from 'vue-quill-editor'
export default {
    created() {
        this.getGoodsCate()
    },
    methods: {
        // 添加商品
        async addGoods(){

            // form 提交分类 
            this.form.goods_cat = this.selectedOptions.join(',')
            // 商品的参数  数组     attrs
            // console.log(this.arrattributes)
            // 动态参数 参数格式
            let arr1 = this.arrattributes.map((item)=>{
                // item.attr_id  item.attr_vals
                return {attr_id:item.attr_id,attr_vals:item.attr_vals}
            })
            // console.log(arr1)
            // 静态参数 参数格式
            // console.log(this.arrStatic)
            let arr2 = this.arrStatic.map((item)=>{
                return {attr_id:item.attr_id,attr_vals:item.attr_vals}
            })
            // 合并动态参数和静态参数
            this.form.attrs = [...arr1,...arr2]
            // console.log(this.form.attrs)
            // 添加商品 ---发送请求
            const res = await this.$http.post(`goods`,this.form)
            // console.log(res)
            this.$router.push({name:'goods'})
        },
        // 图片上传
        handleRemove(file, fileList) {
            // console.log(file, fileList)
            // console.log('yichule')
            // 移除图片
            let index = this.form.pics.findIndex((item)=>{
                return item.pic === file.response.data.tmp_path
                
            })
            this.form.pics.splice(index,1)
            
            // console.log(fileList)
        },
        handlePreview(file) {
            // console.log(file)
            // 添加图片到表单提交的pic对象
            this.form.pics.push({
                pic:file.data.tmp_path
            })
            // console.log(this.form.pics)
        },
        handleSuccess(file) {
            // console.log('chengg');
            
            // console.log(file)
        },
        // 点击不同的tab时
        async tabChange() {
            // 如果点击是第二个tab  同时  三级分类要有值
            if (this.active === "2") {
                if (this.selectedOptions.length !== 3) {
                    // 提示要先选择三级分类
                    this.$message.warning('请先选择商品三级分类！')
                    return
                }
                // 获取动态参数列表
                const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
                // console.log(res)
                this.arrattributes = res.data.data
                this.arrattributes.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
                });

            }

            // 如果点击的是第三个tab  同时  三级分类要有值
            else if (this.active === "3") {
                if (this.selectedOptions.length !== 3) {
                    this.$message.warning('请先选择商品三级分类！')
                    return
                }
                const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
                // console.log(res)
                this.arrStatic = res.data.data
            }
        },
        // 级联选择器选择事件
        handleChange() {

        },
        // 获取三级分类信息
        async getGoodsCate() {
            const res = await this.$http.get(`categories?type=3`)
            // console.log(res)
            this.options = res.data.data
        }
    },
    data() {
        return {
            active: "1",
            form: {
                // goods_name 商品名称
                // goods_cat 以为','分割的分类列表
                // goods_price 价格
                // goods_number 数量
                // goods_weight 重量
                // goods_introduce  介绍
                // pics  上传的图片临时路径（对象）
                // attrs 商品的参数（数组）
                goods_name: "",
                goods_cat: "",
                goods_price: "",
                goods_number: "",
                goods_weight: "",
                goods_introduce: "",
                pics: [],
                attrs: []
            },
            // 级联选择器数据
            options: [],
            selectedOptions: [1, 3, 6],
            defaultProp: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            // 动态数据参数
            arrattributes: [],
            // 静态数据参数
            arrStatic: [],
            //图片上传炫耀设置头部的数据
            headers: {
                Authorization: localStorage.getItem('token')
            }

        }
    },
    components: {
    quillEditor
  }
}
</script>

<style>
.alert1 {
    margin-top: 10px;
}

.box-card {
    height: 100%;
    border: none;
}
.ql-editor{
    min-height:250px;
}
</style>
