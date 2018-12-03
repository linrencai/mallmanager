<template>
<el-container class="container">
    <el-header class="header">
        <el-row>
            <el-col :span="4">
                
            </el-col>
            <el-col :span="18" class="middle">
                <h2>电商后台管理系统</h2>
            </el-col>
            <el-col :span="2">
                <div class="grid-content bg-purple">
                    <a href="#" class="loginout" @click.prevent="handleSignout()">退出登录</a>
                </div>
            </el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside width="200px" class="aside">
            <!-- el-menu侧边栏导航 -->
            <!-- 开启路由 -->
            <el-menu
            :router = "true"
            :unique-opened = "true"
            >
            <!-- 遍历出侧边栏菜单 -->
                <el-submenu :index=" ''+item1.order" v-for="(item1,i) in menuList" :key="i">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span> {{item1.authName}} </span>
                    </template>
                    <el-menu-item :index=" ''+item2.path" v-for="(item2,i2) in item1.children" :key="i2">
                        <i class="el-icon-circle-check"></i>
                        <span> {{item2.authName}} </span>
                    </el-menu-item>
                </el-submenu>
                
            </el-menu>
        </el-aside>
        <el-main class="main">
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    // 组件渲染之前检测是否有token值
    // beforeCreate() {
        // const token = localStorage.getItem('token')
        // // 没有token 值就跳转登录页面
        // if(!token){
        //     this.$router.push( {name: 'login'})
        // }
    // },
    data(){
        return{
            menuList:[]
        }
    },
    created(){
        this.getMenus()
    },
    methods: {
        // 设置动态创建侧边栏
        async getMenus(){
            const res = await this.$http.get(`menus`)
            // console.log(res)
            this.menuList = res.data.data
        },
        // 退出登录功能
        handleSignout(){
            // 清除token
            localStorage.clear()
            // 提示信息
            this.$message.success('退出成功')
            //跳转到login组件
            this.$router.push({name: 'login'})
        }
    }
}
</script>

<style>
.container {
    height: 100%;
}

.aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
}

.main {
    background-color: #E9EEF3;
    color: #333;
}

.header {
    background-color: #b3c0d1;
}

.middle {
    text-align: center;
    line-height: 100%;
}

.loginout {
    line-height: 60px;
    text-decoration: none;
    color: #000;
}

.loginout:hover {
    color: red;
}
</style>
