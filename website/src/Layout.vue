<template>
    <div>
        <div class="header">
            <el-menu :default-active="activeIndex" mode="horizontal" @select="selectMenu">
                <el-menu-item index="plugin">插件</el-menu-item>
                <el-menu-item index="chatroom">群聊</el-menu-item>
            </el-menu>
        </div>
        <div class="layout-content" v-if="loaded">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
        <el-dialog v-model="loginDialog.visiable" title="登录" width="500" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            
            <div><el-input v-model="loginDialog.password" type="password" @keydown.enter.native="login" placeholder="密码" /></div>

            <div style="text-align: center;margin-top: 10px;">
                <el-button type="primary"  @click="login">登录</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>



import { defineComponent } from 'vue';
import { state } from "./http"
export default defineComponent({
    data() {
        return {
            activeIndex: "chatroom",
            loaded: false,
            loginDialog: {
                visiable: false,
                password:'',

            }
        };
    },

    methods: {
        async checkAuth() {
            try {
                await this.$http.get("/api/auth")
                this.loaded = true
            } catch {
                this.load = false;
                this.loginDialog.visiable = true
            }
        },
        async login(){
            let pwd = this.loginDialog.password
            if(pwd == ""){
                this.$message.error('请输入密码')
                return
            }
            const loading = this.$loading({
                lock: true,
                text: '登录中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            let res = await this.$http.post("/api/auth/login", {password: pwd})
            if(res.data.success){
                state.jwt = res.data.data
                // 存到localStorage
                localStorage.setItem('jwt', state.jwt)
                this.loginDialog.visiable = false
                this.loaded = true
                this.$message.success('登录成功')
            }else{
                this.$message.error(res.data.msg)
            }

            loading.close()

        },
        selectMenu(index) {
            this.activeIndex = index;
            this.$router.push({ path: "/" + index });
        }
    },

    async mounted() {
        this.checkAuth()
    }
});
</script>
<style scoped lang="less">
.header {}

.menu-tabs {}
</style>