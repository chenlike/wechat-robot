import logger from "@/common/logger";
import { Context, Service, ForkScope } from 'cordis'
import { emitter } from "./emitter";



export interface WxPlugin {
    pluginId: string; // 插件id 唯一
    filePath: string; // 插件文件路径

    scope?: ForkScope; // 插件实例

}




export const pluginContext = new Context();


const plugins = new Map<string, WxPlugin>()


function loadPlugin(filePath: string) {
    // 清除缓存
    delete require.cache[filePath];
    return import(`${filePath}`); // 添加时间戳避免缓存
}


export async function loadNewPlugin(plugin: WxPlugin) {


    // 是否已经存在
    if (plugins.has(plugin.pluginId)) {
        logger.error(`插件${plugin.pluginId}已经存在`);
        // 先移除
        let delRes = await delPlugin(plugin.pluginId);
        if (!delRes) {
            return false;
        }

    }

    const { filePath } = plugin;

    let module = await loadPlugin(filePath)
    const pluginClass = module.default;
    const scope = pluginContext.plugin(pluginClass, {
        pluginId: plugin.pluginId
    });
    plugin.scope = scope;

    plugins.set(plugin.pluginId, plugin);
    return true;
}

/**
 * 移除插件
 * @param pluginId 
 * @returns 
 */
export async function delPlugin(pluginId: string) {

    const plugin = plugins.get(pluginId);
    if (!plugin) {
        logger.error(`插件${pluginId}不存在`);
        return false;
    }

    plugin.scope?.dispose();

    plugins.delete(pluginId);
    return true
}


/**
 * 获取插件实例
 * @param pluginId 
 * @returns 
 */
export async function getPluginScope(pluginId: string) {
    const plugin = plugins.get(pluginId);
    if (!plugin) {
        logger.error(`插件${pluginId}不存在`);
        return null;
    }

    return plugin.scope;
}






emitter.on("reloadPlugin", (data) => {
    loadNewPlugin({
        pluginId: data.pluginId,
        filePath: data.filePath,
    })
})