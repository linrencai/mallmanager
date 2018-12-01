<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- 表格 -->
    <el-table
    :data="rightlist"
    height="450"
    border
    style="width: 100%"
    class="table_top">
        <el-table-column
        type="index"
        label="#"
        width="100">
        </el-table-column>
        <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
        </el-table-column>
        <el-table-column
        prop="path"
        label="路径">
        </el-table-column>
        <el-table-column
        label="层级">
        <template slot-scope="scope">
            <span v-if="scope.row.level === '0'">一级</span>
            <span v-if="scope.row.level === '1'">二级</span>
            <span v-if="scope.row.level === '2'">三级</span>
        </template>
        </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
    created(){
        this.getRightList()
    },
    methods:{
        async getRightList(){
            // // 获取token
            // const AUTH_TOKEN = localStorage.getItem('token')
            // //token令牌
            // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
            // 发送获取列标请求
            const res = await this.$http.get(`rights/list`)
            // console.log(res)
            this.rightlist = res.data.data
            // console.log(this.rightlist)
        }
    },
    data() {
      return {
        rightlist:[
            
        ]
      }
    }
  }

</script>

<style>
.box-card {
    height: 100%;
}
.table_top {
    margin-top: 20px;
}
</style>
