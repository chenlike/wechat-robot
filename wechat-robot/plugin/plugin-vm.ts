import * as api from "@common/wechat/wechat-api"
import { Contact, SendRichTextReq } from "@common/wechat";
import { WxChatRoomPlugins, WxChatRoomPlugin, WxPlugin, WxPlugins } from "@common/schema";
import vm from "vm";
import logger from "@common/logger";




export interface PluginContext {

    /**
     * 微信id
     */
    roomId: string

    /**
     * 插件id
     */
    pluginId: string


    /**
     * config json str
     */
    config: string,



    // 被注入的服务
    service: {
        wechat: typeof api,
        [key: string]: any
    }


    /**
     * 发送消息
     * @param msg 
     * @param aters 
     */
    sendText(msg: string, aters: string): Promise<boolean>;
    /**
     * 发送卡片消息
     * @param req 
     */
    sendRichText(req: SendRichTextReq): Promise<boolean>;
    /**
     * 获得成员信息
     */
    getRoomMembers(): Promise<Contact[]>;
    /**
     * 拍一拍
     * @param wxid 
     */
    sendPat(wxid: string): Promise<boolean>;
    /**
     * 发图片
     * @param path 
     */
    sendImage(path: string): Promise<boolean>;
    /**
     * 发文件
     * @param path 
     */
    sendFile(path: string): Promise<boolean>;


}



export interface PluginInstace {
    /**
     * 插件id
     */
    pluginId: string
    /**
     * 群聊id
     */
    roomId: string

    /**
     * 插件上下文
     */
    context: PluginContext,

    /**
     * 用于注入到vm的环境
     */
    vmContext: any,
    /**
     * vm实例
     */
    vmScope: any


}

function buildPluginContext(roomPlugin: WxChatRoomPlugin): PluginContext {
    const ctx: PluginContext = {
        roomId: roomPlugin.chatroomId,
        pluginId: roomPlugin.pluginId,
        config: roomPlugin.config,
        service: {
            wechat: api
        },
        sendText: async (msg: string, aters: string) => {
            return await api.sendText(roomPlugin.chatroomId, msg, aters)
        },
        sendRichText: async (req: SendRichTextReq) => {
            req.receiver = roomPlugin.chatroomId
            return await api.sendRichText(req)
        },
        getRoomMembers: async () => {
            return await api.queryRoomMembers(roomPlugin.chatroomId)
        },
        sendPat: async (wxid: string) => {
            return await api.pat(wxid, roomPlugin.chatroomId)
        },
        sendImage: async (path: string) => {
            return await api.sendImage(path, roomPlugin.chatroomId)
        },
        sendFile: async (path: string) => {
            return await api.sendFile(path, roomPlugin.chatroomId)
        },

    }
    return ctx;
}

const plugins: Map<string, PluginInstace> = new Map();










async function removePlugin(pluginId: string, roomId: string) {

}


/**
 * 加载插件
 * @param pluginId  插件id
 * @param roomId  群聊id
 */
export async function loadPlugin(pluginId: string, roomId: string) {

    // 从数据库获得配置
    let record = await WxChatRoomPlugins.findOne({
        where: {
            pluginId: pluginId,
            chatroomId: roomId
        }
    })
    let plugin = await WxPlugins.findOne({
        where: {
            pluginId: pluginId
        }
    });

    if (plugin == null || record == null || record.enable == false) {
        // 处理移除
        await removePlugin(pluginId, roomId)
        return;
    }


    let pluginRoomConfig: WxChatRoomPlugin = record.toObject()


    let ctx = buildPluginContext(pluginRoomConfig)


    let key = `${pluginId}-${roomId}`

    // 检查是否已经加载
    if (plugins.has(key)) {
        await removePlugin(pluginId, roomId)
    }



    const vmContext = {
        module: {
            exports: null,
        },
        require,
        console,
        Buffer,
        setTimeout,
        setInterval,
        FormData
    }

    try {

        let scope = vm.runInNewContext(plugin.codeContent, vmContext);

    } catch (err) {
        logger.error(err);
    }

    
    
    const instance:PluginInstace = {
        pluginId: pluginId,
        roomId: roomId,
        context: ctx,
        vmContext: vmContext
    }
    plugins.set(key, instance)








}



export function initPluginVM() {









}