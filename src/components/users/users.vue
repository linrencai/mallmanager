<template>
<el-card class="box-card">
    <!-- 1.面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.搜索 -->
    <el-row class="searchRow">
        <el-col>
            <el-input placeholder="请输入内容" v-model="query" class="inputSelect">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" plain>添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 3.表格 -->
    <el-table :data="tableData" style="width: 100%">
        <el-table-column 
        type="index"
        prop="date" label="#" width="50">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="80">
        </el-table-column>
        <el-table-column prop="address" label="邮箱">
        </el-table-column>
        <el-table-column prop="address" label="电话">
        </el-table-column>
        <el-table-column prop="address" label="创建时间">
        </el-table-column>
        <el-table-column prop="address" label="用户状态">
        </el-table-column>
        <el-table-column prop="address" label="操作">
        </el-table-column>
    </el-table>
    <!-- 4.分页 -->
       <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
        </el-pagination> -->
</el-card>
</template>

<script>
export default {
    data() {
        return {
            pagenum:1,
            pagesize:2,
            query: '',
            // 表格绑定的数据
            tableData: [{
            date: '1',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '3',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '4',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
        }
    },
    created(){
        this.getUsersList()
    },
    methods: {
        
        // 获取用户列表的请求
        async getUsersList(){
            // 获取token
            const AUTH_TOKEN = localStorage.getItem('token')
            //token令牌
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
            // 发送请求
            const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            console.log(res)
        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}

.inputSelect {
    width: 400px;
}

.searchRow {
    margin-top: 20px;
    margin-left: 0;
}
</style>
