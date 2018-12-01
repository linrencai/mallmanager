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
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="users">
                        <i class="el-icon-circle-check"></i>
                        <span>用户列表</span>
                    </el-menu-item>
                </el-submenu>
                <!-- 2 -->
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>权限管理</span>
                    </template>
                    <el-menu-item index="roles">
                        <i class="el-icon-location"></i>
                        <span>角色列表</span>
                    </el-menu-item>
                    <el-menu-item index="rights">
                        <i class="el-icon-location"></i>
                        <span>权限列表</span>
                    </el-menu-item>
                </el-submenu>
                <!-- 3 -->
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>商品管理</span>
                    </template>
                    <el-menu-item index="1-1">
                        <i class="el-icon-location"></i>
                        <span>商品列表</span>
                    </el-menu-item>
                    <el-menu-item index="1-1">
                        <i class="el-icon-location"></i>
                        <span>分类参数</span>
                    </el-menu-item>
                    <el-menu-item index="1-1">
                        <i class="el-icon-location"></i>
                        <span>商品分类</span>
                    </el-menu-item>
                </el-submenu>
                <!-- 4 -->
                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>订单管理</span>
                    </template>
                    <el-menu-item index="1-1">
                        <i class="el-icon-location"></i>
                        <span>订单列表</span>
                    </el-menu-item>
                </el-submenu>
                <!-- 5 -->
                <el-submenu index="5">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>数据统计</span>
                    </template>
                    <el-menu-item index="1-1">
                        <i class="el-icon-location"></i>
                        <span>数据报表</span>
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
    beforeCreate() {
        const token = localStorage.getItem('token')
        // 没有token 值就跳转登录页面
        if(!token){
            this.$router.push( {name: 'login'})
        }
    },
    methods: {
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
