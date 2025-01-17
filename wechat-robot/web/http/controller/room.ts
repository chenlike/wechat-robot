import { Express } from "express"
import jwt from 'jsonwebtoken'

import { auth } from "../middleware"
import * as api from "@common/wechat/wechat-api"

import { WxChatrooms } from "@common/schema"

export default function(app:Express){



    // 同步房间信息
    app.post("/api/room/sync",auth,async (req,res)=>{

        console.log("sync room")
        let contacts = await api.getContacts()

        // 过滤wxid不是以@chatroom结尾的
        let rooms = contacts.filter(contact=>contact.wxid.endsWith("@chatroom"))
        console.log(rooms)

        // upsert到数据库  chatroomId 唯一
        for(let room of rooms){
            await WxChatrooms.updateOne({chatroomId:room.wxid},{
                chatroomId:room.wxid,
                chatroomName:room.name
            },{upsert:true})
        }


        res.send(<Result>{success:true,msg:"OK"})
    })

    // 获取群聊列表
    app.get("/api/room/list",auth,async (req,res)=>{

        let rooms = await WxChatrooms.find()
        
        res.send(<Result>{success:true,data:rooms})
    })


    

}