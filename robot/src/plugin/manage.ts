import type { WxPlugin, WxChatRoomPlugin } from "@/schema"
import { WxPlugins, WxChatRoomPlugins } from "@/schema"
import { emitter } from "./emitter";
import path from "path"
import { MD5 } from "@/common/utils";
import fs from "fs"

const state = {
    wxPlugins: [] as WxPlugin[],
    wxChatRoomPlugins: [] as WxChatRoomPlugin[]
}


/**
 * 根据插件id生成md5 存入到./plugins/下
 * @param plugin 
 */
function genPluginFile(plugin: WxPlugin) {
    let genFileName = MD5(plugin.pluginId) + ".js"
    let fullPath = path.resolve(__dirname,`./plugins/${genFileName}`)
    fs.writeFileSync(fullPath, plugin.codeContent)
    return fullPath
}





/**
 * 初始化数据 
 */
async function initLoadPlugins() {
    state.wxPlugins = await WxPlugins.find({});

    state.wxChatRoomPlugins = await WxChatRoomPlugins.find({})

    // 加载插件
    state.wxPlugins.forEach(plugin => {
        
        reloadPluginInCache(plugin)

    })
}

/**
 * 重新加载插件
 * @param pluginId 
 * @returns 
 */
async function reloadPlugins(pluginId: string) {

    let plugin = state.wxPlugins.find(plugin => plugin.pluginId === pluginId);
    if (plugin) {
        // 数组中移除
        state.wxPlugins = state.wxPlugins.filter(plugin => plugin.pluginId !== pluginId)
    }

    let pluginInDB = await WxPlugins.findOne({ pluginId })
    if (!pluginInDB) {
        return false;
    }

    
    reloadPluginInCache(pluginInDB)

    state.wxPlugins.push(pluginInDB)

    return true;
}



function reloadPluginInCache(plugin: WxPlugin) {
    let fullPath = genPluginFile(plugin)
    emitter.emit("reloadPlugin", {
        pluginId: plugin.pluginId,
        filePath: fullPath
    })
}




async function getPluginFromDb(pluginId: string) {
    return await WxPlugins.findOne({ pluginId })
}



async function addPlugin(plugin: WxPlugin):Promise<Result> {
    let pluginInDB = await WxPlugins.findOne({ pluginId: plugin.pluginId })
    if (pluginInDB) {
        return {
            success: false,
            msg: "插件id已存在"
        }
    }

    await WxPlugins.create(plugin)

    reloadPluginInCache(plugin)

    state.wxPlugins.push(plugin)
    return {
        success: true,
        msg: "插件添加成功"
    };
}

async function updatePlugin(plugin: WxPlugin):Promise<Result> {
    let pluginInDB = await WxPlugins.findOne({ pluginId: plugin.pluginId })
    if (!pluginInDB) {
        return {
            success: false,
            msg: "插件id不存在"
        }
    }

    await WxPlugins.updateOne({ pluginId: plugin.pluginId }, plugin)
    reloadPluginInCache(plugin)

    return {
        success: true,
        msg: "插件更新成功"
    }
}






export async function initPlugins() {
    await initLoadPlugins()
}





