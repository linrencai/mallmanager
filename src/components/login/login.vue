<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" class="login-btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
    data (){
        return {
            formdata:{
                username: '',
                password: ''
            }
        }
    },
    methods: {
        async handleLogin () {
            const res = await this.$http.post('login', this.formdata)
                // console.log(res)
                const {
                    data,
                    meta: {msg,status}
                } = res.data
                // 登陆成功
                // 1.跳转home
                if(status === 200){
                    // 保存token值
                    localStorage.setItem('token',data.token)
                    // 2.提示成功
                    this.$message.success(msg)
                    // 跳转页面
                    this.$router.push({name:'home'})  
                  
                }else{
                    //登陆不成功
                    // 1.提示消息
                    this.$message.warning(msg)
                }
          }
    }
};
</script>

<style>
.login-wrap {
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-wrap .login-form {
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    padding: 30px;
}
.login-wrap .login-btn {
    width: 100%;
}
</style>
