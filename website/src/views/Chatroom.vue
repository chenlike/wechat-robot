<template>
    <div>
        <div class="btns">
            <el-button :loading="syncLoading" @click="syncChatroom" type="primary">同步群聊</el-button>
            <el-button @click="getChatroom">刷新</el-button>
        </div>
        <div>
            <el-table :data="data" border stripe>
                <el-table-column prop="chatroomName" label="名称"></el-table-column>
                <el-table-column prop="chatroomId" label="id"></el-table-column>
                <el-table-column prop="opt" label="操作">
                    <template #default="{ row }">
                        <el-button @click="openConfigDialog(row.chatroomId)" type="text" size="mini">配置插件</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>



        <el-dialog v-model="dialog.visible" title="配置插件" width="800" top="5vh" :close-on-click-modal="false">
            <div class="flex">
                <div>

                    <el-tabs v-model="dialog.selectPluginId" @tab-click="selectPlugin()" tab-position="left">
                        <el-tab-pane v-for="item in plugins" :name="item.pluginId"
                            :label="item.pluginName"></el-tab-pane>
                    </el-tabs>

                </div>
                <div>



                    <el-form>
                        <el-form-item label="插件名称">
                             {{ dialog.currentPlugin.pluginId }}
                        </el-form-item>
                        <el-form-item label="是否启用">
                            <el-switch v-model="dialog.currentPlugin.enable"></el-switch>
                        </el-form-item>
                        <el-form-item label="配置">
                            <el-input type="textarea" style="width:500px" placeholder="配置JSON"
                                :autosize="{ minRows: 5 }" v-model="dialog.currentPlugin.config"></el-input>
                        </el-form-item>
                    </el-form>

                    <div style="text-align: right;">
                        <el-button @click="saveConfig" :loading="dialog.loading" type="primary">保存</el-button>

                    </div>
               


                </div>
            </div>
        </el-dialog>



    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            data: [],
            syncLoading: false,
            dialog: {
                visible: false,
                chatroomId: "",
                selectPluginId: "",
                currentPlugin: {
                    enable: false,
                    pluginId:"",
                    chatroomId: "",
                    config: ""
                },
                loading: false
            },
            plugins: []
        };
    },

    methods: {
        async getChatroom() {
            const res = await this.$http.get('/api/room/list');
            this.data = res.data.data;
        },
        async syncChatroom() {
            this.syncLoading = true;
            await this.$http.post('/api/room/sync');
            this.syncLoading = false;
            this.getChatroom();
        },

        async openConfigDialog(chatroomId) {
            this.dialog.chatroomId = chatroomId;

            await Promise.all([this.getAllPlugins(), this.loadRoomPluginInfo()])

            if (this.plugins.length === 0) {
                this.$message.error("没有可用的插件")
                return
            }

            this.dialog.selectPluginId = this.plugins[0].pluginId


            this.dialog.visible = true;
            this.$nextTick(() => {
                this.selectPlugin(this.dialog.selectPluginId)
            })

        },
        async getAllPlugins() {
            const res = await this.$http.get('/api/plugin/list');
            this.plugins = res.data.data;
        },
        async loadRoomPluginInfo() {
            const res = await this.$http.get(`/api/plugin/list/${this.dialog.chatroomId}`);

            this.roomPluginInfo = res.data.data;
        },
        selectPlugin(pluginId) {
            if(pluginId === undefined) {
                pluginId = this.dialog.selectPluginId
            }
            this.dialog.selectPluginId = pluginId
            let currentPlugin = {
                enable: false,
                pluginId: pluginId,
                chatroomId: this.dialog.chatroomId,
                config: ""
            }
            const plugin = this.roomPluginInfo.find(item => item.pluginId === pluginId)
            if (plugin) {
                currentPlugin.config = plugin.config
                currentPlugin.enable = plugin.enable
            }
            this.dialog.currentPlugin = currentPlugin
        },

        async saveConfig(){
            this.dialog.loading = true
            let res = await this.$http.post('/api/plugin/addToRoom', this.dialog.currentPlugin)
            if(res.data.success){
                this.$message.success("保存成功")
            }else{
                this.$message.error("保存失败")
            }
            this.dialog.loading = false
            this.loadRoomPluginInfo()
        }







    },

    async mounted() {
        this.getAllPlugins()
        this.getChatroom()
        // this.openConfigDialog("44885917698@chatroom")
    }
});
</script>
<style scoped lang="less">
.btns {
    display: flex;

    align-items: center;


    margin-bottom: 10px;
    margin-top: 10px;
}
</style>