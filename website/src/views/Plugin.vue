<template>
    <div>
        <div style="margin:10px 0px">
            <el-button type="primary">创建插件</el-button>

        </div>
        <el-table :data="data" border stripe>
            <el-table-column prop="pluginName" label="插件名称"></el-table-column>
            <el-table-column prop="pluginId" label="插件Id"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="text" size="small">编辑</el-button>
                    <el-button @click="deletePlugin(row)" style="color:#F56C6C" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

    </div>
</template>
<script>



import { defineComponent } from 'vue';
import { ElMessageBox } from "element-plus"
export default defineComponent({
    data() {
        return {
            data: []
        };
    },

    methods: {
        async getList() {
            let res = await this.$http.get("/api/plugin/list")
            this.data = res.data.data
        },
        async deletePlugin(row) {
            await ElMessageBox.confirm(
                '确定删除插件?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            let res = await this.$http.delete(`/api/plugin/delete`, {
                pluginId: row.pluginId
            })
            if (res.data.code == 0) {
                this.$message.success("删除成功")
                this.getList()
            }
        }
    },

    async mounted() {
        this.getList()
    }
});
</script>
<style scoped lang="less"></style>