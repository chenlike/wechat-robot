

export interface WCFResult<T = any> {
    status: number,
    error: string,
    data: T
}
export interface AcceptNewFriendReq {
    /**
     * 申请方式 (好友申请消息里的 scene); 为了兼容旧接口，默认为扫码添加 (30)
     */
    scene?: string

    /**
     * 加密用户名 (好友申请消息里 v3 开头的字符串)
     */
    v3: string | undefined
    /**
     * Ticket (好友申请消息里 v4 开头的字符串)
     */
    v4: string | undefined
}

export interface GetContactsRes{
    contacts:Contact[]
}

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



export interface GetMsgTypesRes {

/*
    "types": {
      "0": "朋友圈消息",
      "1": "文字",
      "3": "图片",
      "34": "语音",
      "37": "好友确认",
      "40": "POSSIBLEFRIEND_MSG",
      "42": "名片",
      "43": "视频",
      "47": "石头剪刀布 | 表情图片",
      "48": "位置",
      "49": "共享实时位置、文件、转账、链接",
      "50": "VOIPMSG",
      "51": "微信初始化",
      "52": "VOIPNOTIFY",
      "53": "VOIPINVITE",
      "62": "小视频",
      "66": "微信红包",
      "9999": "SYSNOTICE",
      "10000": "红包、系统消息",
      "10002": "撤回消息",
      "1048625": "搜狗表情",
      "16777265": "链接",
      "436207665": "微信红包",
      "536936497": "红包封面",
      "754974769": "视频号视频",
      "771751985": "视频号名片",
      "822083633": "引用消息",
      "922746929": "拍一拍",
      "973078577": "视频号直播",
      "974127153": "商品链接",
      "975175729": "视频号直播",
      "1040187441": "音乐链接",
      "1090519089": "文件"
    }
*/

    types:{
        [key:string]:string
    }
}



export interface RoomMemberInfo{
    /**
     * 微信号
     */
    wxid:string
    /**
     * 昵称
     */
    name:string
    /**
     * unknow?
     */
    state:number
    
}


export interface SendRichTextReq{
    /**
     * 填公众号 id 可以显示对应的头像（gh_ 开头的）
     */
    account:string
    /**
     * 摘要
     */
    digest:string

    /**
     * 接收人, wxid 或者 roomid
     */
    receiver:string

    /**
     * 缩略图的链接
     */
    thumburl:string

    /**
     * 标题
     */
    title:string

    /**
     * 点击后跳转的链接
     */
    url:string

}


export interface SaveFileReq{
    dir:string,
    /**
     * 消息中的 extra
     */
    extra:string,
    id:string,
    timeout:number
}


/**
 * 微信接收消息
 */
export interface WechatMsg{
    /**
     * 是否是来自自己的
     */
    is_self:boolean

    /**
     * 是否是来自群聊的
     */
    is_group:boolean,

    /**
     * 消息id
     */
    id:string,

    /**
     * timestamp 1736497896
     */
    ts:string,

    /**
     * 来源 群聊id
     */
    roomid:string,

    /**
     * 内容
     */
    content:string,

    /**
     * 发送人 wxid
     */
    sender:string,


    /**
     * 签名
     */
    sign:string,

    /**
     * 视频或图片消息的缩略图路径
     */
    thumb:string,

    /**
     * 视频或图片消息的路径
     */
    extra:string,

    /**
     * 原始xml内容
     */
    xml:string,


}