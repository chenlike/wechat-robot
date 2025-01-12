import mongo from "mongoose";




const WxMessages = mongo.model("WxMessage", new mongo.Schema({
    /**
 * 消息id
 */
    id: String,

    /**
     * 是否是来自自己的
     */
    is_self: Boolean,

    /**
     * 是否是来自群聊的
     */
    is_group: Boolean,
    /**
     * 消息类型
     */
    type: Number,
    /**
     * timestamp 1736497896
     */
    ts: String,
    /**
     * 时间
     */
    time:String,
    /**
     * 来源 群聊id
     */
    roomid: String,

    /**
     * 内容
     */
    content: String,

    /**
     * 发送人 wxid
     */
    sender: String,


    /**
     * 签名
     */
    sign: String,

    /**
     * 视频或图片消息的缩略图路径
     */
    thumb: String,

    /**
     * 视频或图片消息的路径
     */
    extra: String,

    /**
     * 原始xml内容
     */
    xml: String,


}))




export {
    WxMessages
}
