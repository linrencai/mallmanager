<template>
<el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <!-- 按钮 -->
    <el-row class="btn">
        <el-col :span="24" class="searchArea">
            <el-button type="success" @click="addGoodsCate()">添加分类</el-button>
        </el-col>
    </el-row>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
            <el-form-item label="分类名称" label-width="120px">
                <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 级联选择器 (表单元素) -->
            <el-form-item label="分类" label-width="120px">
                {{selectedOptions}}
                <el-cascader expand-trigger="hover" change-on-select clearable :options="caslist" v-model="selectedOptions" :props="defaultProp"></el-cascader>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="addCate()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table height="450" :data="list" style="width: 100%">
        <!-- <el-table-column label="分类名称" prop="cat_name"></el-table-column> -->
        <!--
        treeKey -> nodekey -> 节点唯一标识 id
        parentKey -> 父节点的id
        levelKey -> 当前节点的级别
        childKey -> 子节点
      -->
        <el-tree-grid prop="cat_name" label="分类名称" treeKey="cat_id" parentKey="cat_pid" levelKey="cat_level" childKey="children"></el-tree-grid>
        <el-table-column label="级别">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_level===0">一级</span>
                <span v-else-if="scope.row.cat_level===1">二级</span>
                <span v-else-if="scope.row.cat_level===2">三级</span>
            </template>
        </el-table-column>

        <el-table-column label="是否有效">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_deleted===false">有效</span>
                <span v-else-if="scope.row.cat_deleted===true">无效</span>
            </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDelefirm(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页-->
</el-card>
</template>

<script>
var ElTreeGrid = require('element-tree-grid')
export default {
    //引入tree-grid

    components: {
        ElTreeGrid
    },
    data() {
        return {
            list: [],
            pagenum: 1,
            pagesize: 50,
            total: 1,
            dialogFormVisibleAdd: false,
            form: {
                cat_pid: -1,
                cat_name: "",
                cat_level: -1
            },
            //  级联选择器要用的数据
            caslist: [],
            //  级联选择器选中的数据
            selectedOptions: [],
            defaultProp: {
                value: "cat_id",
                label: "cat_name",
                children: "children"
            }
        }
    },
    methods: {
        // 添加分类 - 发送请求
        async addCate() {
            // cat_pid	分类父 ID	不能为空
            // cat_name	分类名称	不能为空
            // cat_level	分类层级	不能为空

            // 三种情况
            // 1. 一级分类 selectedOptions.length==0 cat_pid=0 cat_level=0
            // 2. 二级分类 selectedOptions.length==1 cat_pid=selectedOptions[0] cat_level=1
            // 3. 三级分类 selectedOptions.length==2 cat_pid=selectedOptions[1] cat_level=2
            if (this.selectedOptions.length === 0) {
                this.form.cat_pid = 0;
                this.form.cat_level = 0;
            } else if (this.selectedOptions.length === 1) {
                this.form.cat_pid = this.selectedOptions[0];
                this.form.cat_level = 1;
            } else if (this.selectedOptions.length === 2) {
                this.form.cat_pid = this.selectedOptions[1];
                this.form.cat_level = 2;
            }
            const res = await this.$http.post(`categories`, this.form);
            // console.log(res);
            // 更新视图
            this.getGoodsCate();
            // 关闭对话框
            this.dialogFormVisibleAdd = false;
            // 清空form
            this.form = {};
        },
        // 添加分类- 显示对话框
        async addGoodsCate() {
            // 获取二级分类的数据
            const res = await this.$http.get(`categories?type=2`);
            this.caslist = res.data.data;

            this.dialogFormVisibleAdd = true;
        },
        // 获取所有分类
        async getGoodsCate() {
            const res = await this.$http.get(
                `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
            );
            // console.log(res)
            this.list = res.data.data.result;
            console.log(this.list);

            this.total = res.data.data.total;
        },
        // 分页的相关方法
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`)
            this.pagesize = val;
            this.pagenum = 1;
            this.getGoodsCate();
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`)
            // this.pagenum = 2 = val
            this.pagenum = val;
            this.getGoodsCate();
        }
    },
    created() {
        this.getGoodsCate();
    },
}
</script>

<style>
.btn {
    margin-top: 10px;
    margin-bottom: 10px;
}

.box-card {
    height: 100%;
    border: none;
}
</style>
