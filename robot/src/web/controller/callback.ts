import { WechatMsg } from "@/wechat";
import { Express } from "express";
import { getWechatControl } from "@/wechat"

export default function (app: Express) {

  // 发送文本消息
  app.post("/api/callback",async (req,res)=>{

    const body = req.body as WechatMsg
 
    getWechatControl().receive(JSON.stringify(body))

    return res.status(200).json({
        success:true
    })

  })



}


