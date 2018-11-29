<template>
<el-card class="box-card">
    <!-- 1.面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- 面包屑全局组件的使用 -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>
    <!-- 2.搜索 -->
    <el-row class="searchRow">
        <el-col>
            <el-input placeholder="请输入内容" v-model="query" class="inputSelect" clearable @clear="reloadUserList()">
                <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" plain @click="showUserAddDia()">添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 3.表格 -->
    <el-table :data="userlist" style="width: 100%" height="200px">
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
                <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeUserStatus(scope.row)"></el-switch>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
                <el-button @click="showEditUserMsgBox(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                <el-button @click="showDeleUserMsgBox(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                <el-button @click="showRoleUserMsgBox(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 4.分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
            <el-form-item label="用户名" label-width="100px">
                <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密 码" label-width="100px">
                <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮 箱" label-width="100px">
                <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电 话" label-width="100px">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 编辑用户弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="form">
            <el-form-item label="用户名" label-width="100px">
                <el-input v-model="form.username" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮 箱" label-width="100px">
                <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电 话" label-width="100px">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 权限管理弹出框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
        <el-form :model="form">
            <el-form-item label="用户名" label-width="100px">
               {{currUserName}}
            </el-form-item>
            <el-form-item label="角色" label-width="100px">
                {{currRoleId}}
                <el-select v-model="currRoleId">
                    <el-option label="请选择" :value="-1"></el-option>
                    <el-option 
                    :label="item.roleName" 
                    :value="item.id"
                    v-for="(item,i) in roles" 
                    :key="i"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
            <el-button type="primary" @click="setRole()">确 定</el-button>
        </div>
    </el-dialog>
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
            total: -1,
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            dialogFormVisibleRol: false,
            form: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 分配角色
            currRoleId:-1,
            currUserId:-1,
            currUserName:'',
            roles:[]
        }
    },
    created() {
        this.getUsersList()
    },
    methods: {
        // 设置用户权限
        async setRole(){
            const res = await this.$http.put(`users/${this.currUserId}/role`,{rid:this.currRoleId})
            // console.log(res)
            this.dialogFormVisibleRol = false
        },
        // 更改用户权限 -- 对话框
        async showRoleUserMsgBox(user){
            this.currUserId = user.id
            this.currUserName = user.username
            this.dialogFormVisibleRol=true
            // 获取当前所有的角色
            const res1 = await this.$http.get(`roles`)
            this.roles = res1.data.data
            // console.log(res1)


            // 获取当前用户的id --rid
            const res = await this.$http.get(`users/${user.id}`)
            this.currRoleId = res.data.data.rid
            // console.log(res)
        },
        // 改变用户状态
        async changeUserStatus(user) {
            const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
            // console.log(res)
        },
        // 编辑用户信息 -- 提交表单修改数据
        async editUser() {
            const res = await this.$http.put(`users/${this.form.id}`, this.form)
            // console.log(res)
            if (res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                this.dialogFormVisibleEdit = false
            } else {
                this.$message.warning(res.data.meta.msg)
            }
        },
        // 编辑用户信息 -- 显示对话框
        showEditUserMsgBox(users) {
            this.form = users
            this.dialogFormVisibleEdit = true
            // const res = await this.$http.put(`users/${id}`)
        },
        // 删除用户
        showDeleUserMsgBox(id) {
            this.$confirm('确定要删除该用户吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                //发送删除的请求
                const res = await this.$http.delete(`users/${id}`)
                // console.log(res)
                if (res.data.meta.status === 200) {
                    // 回到第一页
                    this.pagenum = 1
                    // 更新视图
                    this.getUsersList()
                    // 提示删除成功
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        // 发送添加用户请求
        async addUser() {
            const res = await this.$http.post(`users`, this.form)
            const {
                meta: {
                    status,
                    msg
                },
                data
            } = res.data
            if (status === 201) {
                this.$message.success(msg)
                this.pagenum = 1
                this.getUsersList()
                this.form = {}
                this.dialogFormVisibleAdd = false
            } else {
                this.$message.warning(msg)
            }
            // console.log(res)

        },
        //添加用户界面展示
        showUserAddDia() {
            this.form = {}
            this.dialogFormVisibleAdd = true
        },
        //清空input，重新加载数据
        reloadUserList() {
            this.getUsersList()
        },
        // 搜索用户
        searchUser() {
            this.getUsersList()
        },
        // 分页
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`)
            this.pagesize = val
            this.pagenum = 1
            this.getUsersList()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`)
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
            // console.log(res)
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
    border: none;
}

.inputSelect {
    width: 400px;
}

.searchRow {
    margin-top: 20px;
    margin-left: 0;
}
</style>
