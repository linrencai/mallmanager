<template>
<el-container class="container">
    <el-header class="header">
        <el-row>
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <img src="../../assets/logo.png" alt="无法显示图片">
                </div>
            </el-col>
            <el-col :span="18" class="middle">
                    <h2>电商后台管理系统</h2>
            </el-col>
            <el-col :span="2">
                <div class="grid-content bg-purple">
                    <a href="#" class="loginout">退出登录</a>
                </div>
            </el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside width="200px" class="aside">Aside</el-aside>
        <el-main class="main">Main</el-main>
    </el-container>
</el-container>
</template>

<script>
export default {

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
    text-align: center;
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
