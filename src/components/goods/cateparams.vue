<template>
<el-card>
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert title="只允许为第三级分类设置参数" type="error" class="alert"></el-alert>
    <el-form label-position="left" label-width="80px">
        <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            {{selectedOptions}}
            <el-cascader clearable expand-trigger="hover" :show-all-levels="false" :options="options" :props="defaultProp" v-model="selectedOptions" @change="handleChange">
            </el-cascader>
        </el-form-item>
    </el-form>
    <!-- tabs -->
    <el-tabs v-model="active" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="1">
            <el-button type="danger">设置动态参数</el-button>
            <el-table :data="arrattributes" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-tag :key="tag" v-for="tag in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name,tag)">{{tag}}</el-tag>
                        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name)" @blur="handleInputConfirm(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name)">

                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="#" prop="id">
                </el-table-column>
                <el-table-column label="属性名称" prop="attr_name">
                </el-table-column>
                <el-table-column label="操作" prop="desc">
                    <el-button @click="showEditUserMsgBox(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button @click="showDeleUserMsgBox(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="2">
            <el-button type="danger">设置静态参数</el-button>
            <el-table :data="arrStaticparams" style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                <el-table-column label="属性值" prop="attr_vals"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button 
                        size="mini" 
                        plain type="primary" 
                        icon="el-icon-edit" 
                        circle @click="showEditUserMsgBox(scope.row)"
                        ></el-button>
                        <el-button 
                        size="mini" 
                        plain type="danger" 
                        icon="el-icon-delete" 
                        circle @click="showDeleUserMsgBox(scope.row.id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            options: [],
            selectedOptions: [],
            defaultProp: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            arrattributes: [],
            arrStaticparams: [],
            active: '1',
            inputVisible: false,
            inputValue: ''
        }
    },
    mounted() {
        this.getGoodsCate()
    },
    methods: {
        // tags
        // 点击关闭
        async handleClose(attr_vals, attr_id, attr_name, tag) {
            attr_vals.splice(attr_vals.indexOf(tag), 1);
            // 发送是删除请求
            let putData = {
                attr_name: attr_name,
                attr_sel: "many",
                attr_vals: attr_vals.join(',')
            }
            console.log(attr_vals)
            const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr_id}`, putData)
            console.log(res)
        },
        // 点击tag+
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 按下回车和失焦  添加tag
        async handleInputConfirm(attr_vals, attr_id, attr_name) {
            let inputValue = this.inputValue;
            if (inputValue) {
                attr_vals.push(inputValue);
            }
            // 发送是添加请求
            let putData = {
                attr_name: attr_name,
                attr_sel: "many",
                attr_vals: attr_vals.join(',')
            }
            // console.log(attr_vals)
            const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr_id}`, putData)
            console.log(res)
            this.inputVisible = false;
            this.inputValue = '';
        },

        // tabs切换
       async handleClick() {
            if (this.active === "2") {
                if (this.selectedOptions.length === 3) {
                    const res = await this.$http.get(
                        `categories/${this.selectedOptions[2]}/attributes?sel=only`
                    );
                    // console.log(res)
                    this.arrStaticparams = res.data.data;
                }
            }
        },
        async handleChange() {
            if (this.selectedOptions.length === 3) {
                // 获取动态参数列表
                const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
                // console.log(res)
                this.arrattributes = res.data.data
                this.arrattributes.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
                });
                console.log(this.arrattributes)
            }
        },
        // 获取三级分类信息
        async getGoodsCate() {
            const res = await this.$http.get(`categories?type=3`)
            // console.log(res)
            this.options = res.data.data
        }
    }
}
</script>

<style>
.alert {
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
