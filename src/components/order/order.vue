<template>
<el-card>
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <el-table :data="list" style="width: 100%">
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="80">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.order_pay==='0'">已付款</el-tag>
                <el-tag type="danger" v-if="scope.row.order_pay==='1'">未付款</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
        <el-table-column label="下单时间" width="90">
            <template slot-scope="scope">{{scope.row.create_time|fmtdata}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 点击修改订单的弹窗 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区" label-width="120px">
          <el-cascader
            expand-trigger="hover"
            clearable
            :options="catlist"
            v-model="selectedOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="120px">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
</el-card>
</template>

<script>
import catlist from '@/assets/city_data2017_element.js'
export default {

data(){
    return{
        list:[],
        //弹窗de数据
        dialogFormVisible:false,
        form:{
            address:""
        },
        //级联选择器的数据
        catlist:[],
        selectedOptions:[]
    }
},
methods:{
    // 弹窗
    showEditdia(){
        this.catlist = catlist
        this.dialogFormVisible = true
    },
    //获取列表shuju
    async getOrderList(){
        const res = await this.$http.get(`orders?pagenum=1&pagesize=10`)
        console.log(res)
        this.list = res.data.data.goods
    }
},
created(){
    this.getOrderList()
}
}
</script>

<style>

</style>
