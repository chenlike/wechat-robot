import { getWechatControl } from "@common/wechat";
import { Express } from "express";


export default function (app: Express) {

  // 发送文本消息
  app.post("/api/callback",async (req,res)=>{

    const body = req.body 
 
    getWechatControl().receive(JSON.stringify(body))
    // message
    return res.status(200).json({
        success:true
    })

  })



}


