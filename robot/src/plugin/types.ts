import { Contact, SendRichTextReq } from "@/wechat";


/**
 * 传入给Plugin的信息
 */
export interface MessageInfo {

    /**
     * 消息id
     */
    id: string,

    /**
     * timestamp 1736497896
     */
    ts: number,

    /**
     * 发送时间 yyyy-MM-dd HH:mm:ss
     */
    time: string,

    /**
     * 消息类型
     */
    type: number,



    /**
     * 来源 群聊id
     */
    roomid: string,

    /**
     * 内容
     */
    content: string,

    /**
     * 发送人 wxid
     */
    sender: string,


    /**
     * 签名
     */
    sign: string,

    /**
     * 视频或图片消息的缩略图路径
     */
    thumb: string,

    /**
     * 视频或图片消息的路径
     */
    extra: string,

    /**
     * 原始xml内容
     */
    xml: string,



    
}




import * as api from "@/wechat/wechat-api"
import EventEmitter from "events"

/**
 * 插件上下文
 */
export interface WxPluginContext{

    /**
     * 当前群聊id
     */
    roomid: string,

    /**
     * 插件id
     */
    pluginId: string,


    /**
     * config json解析为的对象
     */
    config: any,



    // 被注入的服务
    service: {
        wechat: typeof api,
        [key:string]:any
    }

    /**
     * 全局事件
     */
    event:EventEmitter





    /**
     * 发送消息
     * @param msg 
     * @param aters 
     */
    sendText(msg:string,aters:string):Promise<boolean>;
    /**
     * 发送卡片消息
     * @param req 
     */
    sendRichText(req:SendRichTextReq):Promise<boolean>;
    /**
     * 获得成员信息
     */
    getRoomMembers():Promise<Contact[]>;
    /**
     * 拍一拍
     * @param wxid 
     */
    sendPat(wxid:string):Promise<boolean>;
    /**
     * 发图片
     * @param path 
     */
    sendImage(path:string):Promise<boolean>;
    /**
     * 发文件
     * @param path 
     */
    sendFile(path:string):Promise<boolean>;
    





}

export class BasePlugin {
    ctx:WxPluginContext;
    constructor(ctx:WxPluginContext) {
        this.ctx = ctx;
    }
    async onMessage(message:MessageInfo){
    }
}