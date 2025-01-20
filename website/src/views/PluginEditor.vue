<template>
    <div>
        <div v-loading="loading" style="margin:10px 0px;">
            <el-button @click="returnBack"> 返回 </el-button>
            <el-button @click="submit" type="primary"> 保存 </el-button>

            <el-form label-width="80px" style="margin-top:20px;">
                <el-form-item label="插件id" required>
                    <el-input :disabled="isEdit" v-model="form.pluginId" placeholder="请输入插件id"></el-input>
                </el-form-item>
                <el-form-item label="插件名称" required>
                    <el-input v-model="form.pluginName" placeholder="请输入插件名称"></el-input>
                </el-form-item>
            </el-form>

            <div class="out-container">
                <div ref="editor" class="editor-container"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import * as monaco from "monaco-editor"
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import * as codes from "./editor"

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

const state = {
    current: null,
}

export default defineComponent({
    data() {
        return {
            loading:false,
            form: {
                pluginId: "",
                pluginName: "",
                codeContent: ""
            },
            isEdit:false
        };
    },

    methods: {
        returnBack(){
            this.$router.replace("/plugin")
        },
        initEditor() {
            this.disposeEditor()

            // compiler options
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ESNext,
                allowJs: true,
                allowNonTsExtensions: true,
                checkJs: true
            });


            // extra libraries
            monaco.languages.typescript.javascriptDefaults.addExtraLib(codes.libString, 'node_modules/moyu.d.ts');


            state.current = monaco.editor.create(this.$refs.editor, {
                value: "",
                language: "javascript",
                theme: "vs-dark",
            })

        },
        disposeEditor() {
            if (state.current) {
                state.current.dispose()
            }
        },

        async initCreateEditor() {
            this.form = {
                pluginId: "",
                pluginName: "",
                codeContent: ""
            }
            this.initEditor()

            // 加载代码
            this.$nextTick(() => {
                state.current.setValue(codes.initSouceCode)
                this.loading = false
            })
        },
        async initEditEditor(pluginId) {
            let res = await this.$http.post("/api/plugin/getInfo",{
                pluginId
            })
        
            this.form = {
                pluginId: pluginId,
                pluginName: res.data.data.pluginName,
                codeContent: res.data.data.codeContent
            }
            this.isEdit = true
            this.initEditor()

            // 加载代码
            this.$nextTick(() => {
                state.current.setValue(this.form.codeContent)
                this.loading = false
            })
        },
        async submit(){
            if(!this.form.pluginId){
                this.$message.error("插件id不能为空")
                return
            }
            if(!this.form.pluginName){
                this.$message.error("插件名称不能为空")
                return
            }
            this.form.codeContent = state.current.getValue()
            if(!this.form.codeContent){
                this.$message.error("代码不能为空")
                return
            }
            this.loading = true

            let url = `/api/plugin/add`
            if(this.isEdit){
                url = `/api/plugin/update`
            }
            let res = await this.$http.post(url,this.form)
            if(res.data.success){
                this.$message.success("保存成功")
                if(!this.isEdit){
                    // 如果创建成功改为编辑状态
                    this.isEdit = true
                }
            }else{
                this.$message.error(res.data.msg)
            }
            this.loading = false
        }
    },

    async mounted() {
        this.loading = true
        if(this.$route.query.pluginId){
            this.initEditEditor(this.$route.query.pluginId)
        }else{
            this.initCreateEditor()
        }

    }
});
</script>
<style scoped lang="less">
.out-container {
    padding: 10px;
}

.editor-container {
    width: 100%;
    height: 800px;
}
</style>