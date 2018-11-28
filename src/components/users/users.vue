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
            <el-input placeholder="请输入内容" v-model="query" class="inputSelect" clearable @clear="reloadUserList()">
                <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" plain>添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 3.表格 -->
    <el-table :data="userlist" style="width: 100%">
        <el-table-column type="index" prop="date" label="#" width="50">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="80">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间">
            <template slot-scope="abb">
                {{abb.row.create_time | fmtdata}}
            </template>
        </el-table-column>
        <el-table-column prop="mg_state" label="用户状态">
            <template slot-scope="scope">
                <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
                <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 4.分页 -->
    <el-pagination 
    @size-change="handleSizeChange" 
    @current-change="handleCurrentChange" 
    :current-page="pagenum" 
    :page-sizes="[2, 4, 6, 8]" 
    :page-size="2" 
    layout="total, sizes, prev, pager, next, jumper" 
    :total="total">
    </el-pagination>

</el-card>
</template>

<script>
export default {
    data() {
        return {

            query: '',
            // 表格绑定的数据
            userlist: [],
            // 分页相关的数据
            pagenum: 1,
            pagesize: 2,
            total: -1
        }
    },
    created() {
        this.getUsersList()
    },
    methods: {
        //清空input，重新加载数据
        reloadUserList(){
            this.getUsersList()
        },
        // 搜索用户
        searchUser(){
            this.getUsersList()
        },
        // 分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`)
            this.pagesize = val
            this.pagenum = 1
            this.getUsersList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`)
            this.pagenum = val
            this.getUsersList()
        },

        // 获取用户列表的请求
        async getUsersList() {
            // 获取token
            const AUTH_TOKEN = localStorage.getItem('token')
            //token令牌
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
            // 发送请求
            const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            console.log(res)
            // 对象解构赋值
            const {
                meta: {
                    status,
                    msg
                },
                data: {
                    users,
                    total
                }
            } = res.data
            if (status === 200) {
                this.userlist = users
                this.total = total
                // this.$message.success(msg)
            } else {
                this.$message.warning(msg)
            }
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
