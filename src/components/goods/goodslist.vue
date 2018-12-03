<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 搜索 -->
    <el-row class="searchRow">
        <el-col>
            <el-input placeholder="请输入内容" class="inputSelect" clearable @clear="reloadUserList()">
                <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" plain @click=" $router.push({name:'goodsadd'})">添加商品</el-button>
        </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="goodslist" height="400" border stripe style="width: 100%">
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100">
        </el-table-column>
        <el-table-column label="创建日期" width="120">
            <template slot-scope="scope">
                {{scope.row.add_time | fmtdata}}
            </template>
        </el-table-column>
        <el-table-column label="操作" >
            <template slot-scope="scope">
                <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination 
    @size-change="handleSizeChange" 
    @current-change="handleCurrentChange" 
    :current-page="pagenum" 
    :page-sizes="[10, 20, 30, 40]" 
    :page-size="pagesize" 
    layout="total, sizes, prev, pager, next, jumper" 
    :total="total">
    </el-pagination>
</el-card>
</template>

<script>
export default {
    created() {
        this.getGoodslist()
    },
    methods: {
        async getGoodslist() {
            const {data:res} = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            // console.log(res)
            this.goodslist = res.data.goods
            // console.log(this.goodslist)
            this.total = res.data.total
            // console.log(this.total)
        },
        handleSizeChange(val) {
        // console.log(`每页 ${val} 条`)
        this.pagesize = val
        this.pagenum = 1
        this.getGoodslist()
        },
        handleCurrentChange(val) {
        // console.log(`当前页: ${val}`)
        this.pagenum = val
        this.getGoodslist()
        }
    },
    data() {
        return {
            pagenum: 1,
            pagesize: 10,
            total: 0,
            goodslist: []
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
    margin-bottom: 10px;
    margin-left: 0;
}
</style>
