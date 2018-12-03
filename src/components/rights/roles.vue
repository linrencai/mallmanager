<template>
<el-card class="box-card">
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row>
        <el-col>
            <el-button type="primary" class="addRole" @click="showAddRole()" plain>添加角色</el-button>
        </el-col>
    </el-row>
    <el-table :data="rolelist" style="width: 100%" height="450">
        <el-table-column type="expand">
            <template slot-scope="props">
                <!-- 第一行 -->
                <el-row v-for="(items,i) in props.row.children" :key="i">
                    <!-- 第一列 -->
                    <el-col :span="4">
                        <el-tag @close="deleteRight(props.row,items.id)" closable> {{items.authName}} </el-tag>
                        <span class="el-icon-arrow-right"></span>
                    </el-col>
                    <el-col :span="20">
                        <el-row v-for="(items1,i1) in items.children" :key="i1">
                            <el-col :span="4" class="col3">
                                <el-tag @close="deleteRight(props.row,items1.id)" class="tag2" type="success" closable> {{items1.authName}} </el-tag>
                                <span class="el-icon-arrow-right"></span>
                            </el-col>
                            <el-col :span="20">
                                <el-tag @close="deleteRight(props.row,items2.id)" type="warning" closable class="tag3" v-for="(items2,i2) in items1.children" :key="i2"> {{items2.authName}} </el-tag>
                            </el-col>
                        </el-row>

                    </el-col>
                </el-row>
                <span v-if="props.row.children.length===0">未分配权限</span>
            </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="200">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc">
        </el-table-column>
        <el-table-column label="操作" prop="desc">
            <template slot-scope="scope">
                <el-button @click="showEditUserMsgBox(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                <el-button @click="showDeleUserMsgBox(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                <el-button @click="showEditRightDia(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
            </template>
        </el-table-column>

    </el-table>
    <!-- 修改权限对话框 -->
    <el-dialog title="权限修改" :visible.sync="dialogVisibleRight" width="50%">
        <!-- 树形结构 -->
        <el-tree ref="tree" :data="treelist" show-checkbox default-expand-all :default-checked-keys="arrchecked" node-key="id" :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleRight = false">取 消</el-button>
                <el-button type="primary" @click="setRight()">确 定</el-button>
            </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd" width="50%">
        <el-form :model="form">
            <el-form-item label="角色名称" width="300">
                <el-input v-model="form.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" width="300">
                <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="addRole()">确 定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
export default {
    created() {
        this.getRoleList()
    },
    methods: {
        // 添加角色 ---发送请求
        async addRole(){

            const res = await this.$http.post(`roles`,this.form)
            console.log(res)
            this.getRoleList()
            this.dialogFormVisibleAdd = false
        },
        // 添加角色  --- 显示对话框
        showAddRole() {
            this.dialogFormVisibleAdd = true
        },
        // 设置角色权限
        async setRight() {

            // 获取全选id的数组arr1   getCheckedKeys
            let arr1 = this.$refs.tree.getCheckedKeys()

            // 获取半选id的数组arr2   getHalfCheckedKeys
            let arr2 = this.$refs.tree.getHalfCheckedKeys()

            // 获取所有的权限选项arr= arr1 + arr2
            const arr = [...arr1, ...arr2]
            // console.log(arr)

            //发送授权请求
            const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
                rids: arr.join(',')
            })
            console.log(res)

            //关闭对话框
            this.dialogVisibleRight = false

            // 更新视图
            this.getRoleList()
        },
        // 修改权限 --显示对话框
        async showEditRightDia(r) {
            this.currRoleId = r.id
            // 获取树形结构数据
            const res = await this.$http.get(`rights/tree`)
            // console.log(res)
            this.treelist = res.data.data
            // var arrtemp1 =[]
            // this.treelist.forEach(items1 => {
            //     arrtemp1.push(items1.id)
            //     items1.children.forEach(items2 => {
            //         arrtemp1.push(items2.id)
            //         items2.children.forEach(items3 => {
            //             arrtemp1.push(items3.id)
            //         });
            //     });
            // });
            // this.arrExpand = arrtemp1
            // 获取弹出框的勾选项
            let arrtemp1 = []
            r.children.forEach(items1 => {
                // arrtemp1.push(items1.id)
                items1.children.forEach(items2 => {
                    // arrtemp1.push(items2.id)
                    items2.children.forEach(items3 => {
                        arrtemp1.push(items3.id)
                    });
                });
            });
            this.arrchecked = arrtemp1
            this.dialogVisibleRight = true
        },
        //删除角色列表权限
        async deleteRight(role, rightId) {
            // roles/:roleId/rights/:rightId
            const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            // console.log(res)
            role.children = res.data.data
        },
        async getRoleList() {
            // // 获取token
            // const AUTH_TOKEN = localStorage.getItem('token')
            // //token令牌
            // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
            // 发送获取列标请求
            const res = await this.$http.get(`roles`)
            // console.log(res)
            this.rolelist = res.data.data
            // console.log(this.rolelist)
        }
    },
    data() {
        return {
            rolelist: [],
            dialogVisibleRight: false,
            dialogFormVisibleAdd:false,
            // 属性结构的数据
            treelist: [],
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            arrchecked: [],
            currRoleId: '',
            form:{
                roleName:'',
                roleDesc:''
            }
            // arrExpand:[]
        }
    }

}
</script>

<style>
.box-card {
    height: 100%;
    border: none;
}

.addRole {
    margin-top: 5px;
}
</style>
