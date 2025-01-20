export const libString = `





declare module 'moyu' {

/**
 * 联系人
 */
/**
 * 表示微信应用中的联系人。
 */
export interface Contact {
    /**
     * 联系人的唯一标识符  如果是群聊会包含 'chatroom'
     */
    wxid: string;

    /**
     * 微信号 可能为空
     */
    code: string;

    /**
     * 与联系人相关的备注或注释。
     */
    remark: string;

    /**
     * 联系人的姓名。
     */
    name: string;

    /**
     * 联系人所在的国家。
     */
    country: string;

    /**
     * 联系人所在的省份。
     */
    province: string;

    /**
     * 联系人所在的城市。
     */
    city: string;
}



export interface SendRichTextReq {
    /**
     * 填公众号 id 可以显示对应的头像（gh_ 开头的）
     */
    account: string
    /**
     * 摘要
     */
    digest: string

    /**
     * 接收人, wxid 或者 roomid
     */
    receiver: string

    /**
     * 缩略图的链接
     */
    thumburl: string

    /**
     * 标题
     */
    title: string

    /**
     * 点击后跳转的链接
     */
    url: string

}

/**
* 微信接收消息
*/
export interface WechatMsg {
    /**
     * 是否是来自自己的
     */
    is_self: boolean

    /**
     * 是否是来自群聊的
     */
    is_group: boolean,

    /**
     * 消息id
     */
    id: string,

    /**
     * timestamp 1736497896
     */
    ts: number,

    /**
     * 消息类型
     */
    type: number,


    /**
     * 发送时间 yyyy-MM-dd HH:mm:ss
     */
    time: string,


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
        wechat: any,
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


export interface PluginInstance {

    /**
     * 获得消息
     * @param msg 
     */
    onMessage: (msg: WechatMsg) => Promise<any>


}




export type CreatePluginInstanceFunc = (props: CreateProps) => PluginInstance


}





`

export const initSouceCode = `

// 储存数据 MongoDB 
// const mongo = require("mongoose")
// const 你的Model = mongo.model("schema名", new mongo.Schema({
//   name: String, // 对应字段
//   aaa:String
// }))

const axios = require("axios")


/**
 * 入口
 * @param {import('moyu').PluginContext} ctx
 * @returns {import('moyu').PluginInstance} instance
 */
function pluginEntry(ctx){
    
    return {
        async onMessage(msg){
            // 收到消息时
        }
    }
}
module.exports = pluginEntry
        
        
`