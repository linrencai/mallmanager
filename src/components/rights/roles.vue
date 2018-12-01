<template>
<el-card class="box-card">
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row>
        <el-col>
            <el-button type="info" class="addRole">添加角色</el-button>
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
                            <el-col :span="20" >
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
                <el-button @click="showRoleUserMsgBox(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
            </template>
        </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
      created(){
        this.getRoleList()
    },
    methods:{
        async deleteRight(role,rightId){
            // roles/:roleId/rights/:rightId
            const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            console.log(res);
            role.children = res.data.data
        },
        async getRoleList(){
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
            rolelist: []
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
