import axios from 'axios';

// import * from "./wechat."

const host = process.env.WECHATFERRY_HOST || ""

const http = axios.create({
    baseURL: host,
})




import * as t from "./types"


/**
 * 添加好友
 * @param req 
 * @returns 
 */
async function acceptNewFriend(req:t.AcceptNewFriendReq):Promise<boolean> {
    const res = await http.post<t.WCFResult<boolean>>("/accept-new-friend", req)
    
    return res.data.data
}


/**
 * 添加群成员
 * @param roomId  群聊id
 * @param wxids 要添加人的wxid 逗号分隔
 * @returns 
 */
async function addChatroomMember(roomId:string,wxids:string):Promise<boolean> {
    const res = await http.post<t.WCFResult<boolean>>("/add-chatroom-member", {
        roomId,
        wxids
    })
    
    return res.data.data
}

/**
 * 踢人
 * @param roomId 
 * @param wxid 
 * @returns 
 */
async function deleteChatroomMember(roomId:string,wxid:string):Promise<boolean> {
    const res = await http.post<t.WCFResult<boolean>>("/delete-chatroom-member", {
        roomId,
        wxid
    })
    
    return res.data.data
}


/**
 * 保存语音消息
 * @param dir 目录
 * @param id 语音消息id
 * @returns 
 */
async function saveAudio(dir:string,id:string):Promise<string>{
    const res = await http.post<t.WCFResult<string>>("/save-audio", {
        dir,
        id
    })
    
    return res.data.data

}


/**
 * 获取联系人 包含群聊
 * @returns 
 */
async function getContacts():Promise<t.Contact[]> {
    const res = await http.get<t.WCFResult<t.GetContactsRes>>("/contacts")
    
    return res.data.data.contacts
}

/**
 * 发送文件
 * @param path  文件路径 C:/图片/文件/等路径/必须存在否则失败.jpeg
 * @param receiver 接收人id
 * @returns 
 */
async function sendFile(path:string,receiver:string):Promise<boolean>{
    const res = await http.post<t.WCFResult<boolean>>("/file", {
        path,
        receiver
    })
    
    return res.data.data
}

/**
 * 转发消息。可以转发文本、图片、表情、甚至各种 XML； 语音也行，不过效果嘛，自己验证吧。 
 * @param id 
 * @param receiver 
 * @returns 
 */
async function forwardMsg(id:string,receiver:string):Promise<boolean>{
    const res = await http.post<t.WCFResult<boolean>>("/forward-msg", {
        id,
        receiver
    })
    
    return res.data.data
}


/**
 * 发送图片，非线程安全
 * @param path 
 * @param receiver 
 * @returns 
 */
async function sendImage(path:string,receiver:string):Promise<boolean>{
    const res = await http.post<t.WCFResult<boolean>>("/image", {
        path,
        receiver
    })
    
    return res.data.data
}

/**
 * 邀请群成员
 * @param roomId 
 * @param wxids 
 * @returns 
 */
async function inviteChatroomMembers(roomId:string,wxids:string):Promise<boolean> {
    const res = await http.post<t.WCFResult<boolean>>("/invite-chatroom-members", {
        roomId,
        wxids
    })
    
    return res.data.data
}

/**
 * 是否已登录
 * @returns 
 */
async function isLogin():Promise<boolean> {
    const res = await http.get<t.WCFResult<boolean>>("/is-login")
    
    return res.data.data
}

/**
 * 获得微信消息类型type
 * @returns 
 */
async function getMsgTypes():Promise<t.GetMsgTypesRes> {
    const res = await http.get<t.WCFResult<t.GetMsgTypesRes>>("/msg-types")
    
    return res.data.data
}

/**
 * 拍一拍
 * @param wxid 
 * @param roomid 
 * @returns 
 */
async function pat(wxid:string,roomid:string):Promise<boolean> {
    const res = await http.post<t.WCFResult<boolean>>("/pat", {
        wxid,
        roomid
    })
    
    return res.data.data

}

/**
 * 刷新朋友圈 (在消息回调中看)
 * @param id 开始 id，0 为最新页
 * @returns 
 */
async function refreshPyq(id:number):Promise<boolean> {
    const res = await http.get<t.WCFResult<boolean>>("/pyq")
    
    return res.data.data
}

/**
 * 获得群聊里面的成员
 * @param roomId 
 * @returns 
 */
async function queryRoomMembers(roomId:string):Promise<t.Contact[]> {
    const res = await http.get<t.WCFResult<t.GetContactsRes>>(`/room-members/${roomId}`)
    
    return res.data.data.contacts
}


/**
 * 接受转账
 * @param taid  转账消息里的 transactionid
 * @param tfid 转账消息里的 transferid
 * @param wxid  转账消息里的发送人 wxid
 * @returns 
 */
async function receiveTransfer(taid:string,tfid:string,wxid:string):Promise<boolean> {
    const res = await http.post<t.WCFResult<boolean>>("/transfer", {
        taid,
        tfid,
        wxid
    })
    
    return res.data.data
}

/**
 * 撤回消息
 * @param id 
 * @returns 
 */
async function revokeMsg(id:string):Promise<boolean> {
    const res = await http.post<t.WCFResult<boolean>>("/revoke-msg", {
        id
    })
    
    return res.data.data
}


async function sendRichText(req:t.SendRichTextReq):Promise<boolean> {
    const res = await http.post<t.WCFResult<boolean>>("/rich-text", req)
    
    return res.data.data
}

// save-file 
// save-image 未实现


/**
 * 获得自己的微信id
 * @returns 
 */
async function getSelfWxid():Promise<string>{
    const res = await http.get<t.WCFResult<string>>("/self-wxid")
    
    return res.data.data
}


/**
 * 发送文本消息
 * @param receiver  接收人id
 * @param msg  消息内容 
 * @param aters  要@的人的wxid 逗号分隔
 * @returns 
 */
async function sendText(receiver:string,msg:string,aters:string = ""):Promise<boolean>{
    const res = await http.post<t.WCFResult<boolean>>("/text", {
        receiver,
        msg,
        aters
    })
    
    return res.data.data

}



export {
    acceptNewFriend,
    addChatroomMember,
    deleteChatroomMember,
    saveAudio,
    getContacts,
    sendFile,
    forwardMsg,
    sendImage,
    inviteChatroomMembers,
    isLogin,
    getMsgTypes,
    pat,
    refreshPyq,
    queryRoomMembers,
    receiveTransfer,
    revokeMsg,
    sendRichText,
    getSelfWxid,
    sendText,
}