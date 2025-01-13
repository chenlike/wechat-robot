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
