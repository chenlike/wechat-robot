import * as api from "@common/wechat/wechat-api"
import { Contact, SendRichTextReq, WechatMsg } from "@common/wechat";
import { WxChatRoomPlugins, WxChatRoomPlugin, WxPlugin, WxPlugins } from "@common/schema";



import vm from "vm";
import logger from "@common/logger";
import { EventEmitter } from "events"
import { PluginService } from "./services/base";




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
     * 全局事件
     */
    event: EventEmitter,

    /**
     * 发送消息
     * @param msg 
     * @param aters 
     */
    sendText(msg: string, aters: string ): Promise<boolean>;
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

/**
 * 插件
 */
export interface PluginScope {


    onMessage: (msg: WechatMsg) => Promise<any>


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
    vmScope: PluginScope,


}




const event = new EventEmitter()


const services: Map<string, PluginService> = new Map();

/**
 * 添加基础service  (需要在组件加载前就完成)
 * @param name 
 * @param ServiceClass 对应的class 
 */
export async function addService(name: string, ServiceClass: any) {
    try{
        let service = new ServiceClass(event);
        await service.init()
        console.log(`[service] add ${name}  `)
        services.set(name, service)
    }catch(err){
        logger.error(err)
        logger.error(`add service ${name} 失败 `)
    }
}



function buildPluginContext(roomPlugin: WxChatRoomPlugin): PluginContext {
    const ctx: PluginContext = {
        roomId: roomPlugin.chatroomId,
        pluginId: roomPlugin.pluginId,
        config: roomPlugin.config,
        service: {
            wechat: api,
        },
        event: event,
        sendText: async (msg: string, aters: string = "") => {
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

    // 注入service
    for (let [key, value] of services) {
        ctx.service[key] = value
    }
    return ctx;
}

const plugins: Map<string, PluginInstace> = new Map();








/**
 * 移除插件
 * @param pluginId 
 * @param roomId 
 */
export async function removePlugin(pluginId: string, roomId: string) {
    const key = `${pluginId}-${roomId}`;
    if (plugins.has(key)) {
        // 从 plugins 中删除实例
        plugins.delete(key);
        // 删除实例时 通知service处理后续工作
        event.emit("plugin/remove", {
            pluginId,
        });
    }
}



/**
 * 加载插件
 * @param pluginId  插件id
 * @param roomId  群聊id
 */
export async function loadPlugin(pluginId: string, roomId: string) {

    // todo:分离数据库部分代码

    // 从数据库获得配置
    let record = await WxChatRoomPlugins.findOne({
        pluginId: pluginId,
        chatroomId: roomId
    })
    console.log(`加载插件${pluginId}到群聊${roomId}`,record)
    let plugin = await WxPlugins.findOne({
        pluginId: pluginId
    });

    if (plugin == null || record == null || record.enable == false) {
        // 处理移除
        await removePlugin(pluginId, roomId)
        console.log(`插件${pluginId}未启用或不存在`)
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
    let scope: PluginScope | null = null;
    try {

        let setupFunc = vm.runInNewContext(plugin.codeContent, vmContext);
     
        scope = setupFunc(ctx)
        if (scope == null) {
            logger.error("plugin setup return null")
            return;
        }
    } catch (err) {
        logger.error(JSON.stringify(err));
        return;
    }



    const instance: PluginInstace = {
        pluginId: pluginId,
        roomId: roomId,
        context: ctx,
        vmContext: vmContext,
        vmScope: scope!
    }


    plugins.set(key, instance)

}


/**
 * 接收到消息
 * @param msg 
 */
export async function receiveMessage(msg: WechatMsg) {

    for(let plugin of plugins.values()){
        // 判断是否属于该群聊的消息
        if(plugin.roomId == msg.roomid){
            plugin.vmScope.onMessage(msg)
        }
    }
}







