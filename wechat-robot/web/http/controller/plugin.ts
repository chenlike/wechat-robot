import { Express } from "express"

import { auth } from "../middleware"
import * as api from "@common/wechat/wechat-api"

import { WxChatRoomPlugins,WxChatRoomPlugin, WxPlugin,WxPlugins } from "@common/schema"
import { reloadPlugin } from "@web/dispatch"

export default function(app:Express){


    // 新增插件
    app.post("/api/plugin/add",auth,async (req,res)=>{
        let plugin = req.body as WxPlugin


        // 插件id不能重复
        let exist = await WxPlugins.findOne({pluginId:plugin.pluginId})
        if(exist){
            return res.send(<Result>{ success:false,msg:"插件id已存在" })
        }


        let newPlugin = new WxPlugins(plugin)
        await newPlugin.save()

        res.send(<Result>{success:true,msg:"OK"})
    })

    // 更新插件
    app.post("/api/plugin/update",auth,async (req,res)=>{
        let plugin = req.body as WxPlugin

        // 检查id是否存在
        let exist = await WxPlugins.findOne({pluginId:plugin.pluginId})
        if(!exist){
            return res.send(<Result>{ success:false,msg:"插件id不存在" })
        }

        await WxPlugins.updateOne({pluginId:plugin.pluginId},plugin)

        // 查询所有启用了该插件的群聊
        let rooms = await WxChatRoomPlugins.find({pluginId:plugin.pluginId})
        for(let room of rooms){
            reloadPlugin(plugin.pluginId,room.chatroomId)
        }

        res.send(<Result>{success:true,msg:"OK"})
    })

    // 删除
    app.post("/api/plugin/delete",auth,async (req,res)=>{
        let pluginId = req.body.pluginId

        // 删除插件
        await WxPlugins.deleteOne({pluginId})

        // 查询所有启用了该插件的群聊
        let rooms = await WxChatRoomPlugins.find({pluginId:pluginId})

        // 删除群聊插件关联
        await WxChatRoomPlugins.deleteMany({pluginId})

        // 重新加载插件
        for(let room of rooms){
            reloadPlugin(pluginId,room.chatroomId)
        }

        res.send(<Result>{success:true,msg:"OK"})
    })
    // 获得插件列表
    app.get("/api/plugin/list",auth,async (req,res)=>{
        let plugins = await WxPlugins.find()

        res.send(<Result>{success:true,data:plugins})
    })


    // 获得群聊下的插件列表
    app.get("/api/plugin/list/:chatroomId",auth,async (req,res)=>{
        let chatroomId = req.params.chatroomId

        let plugins = await WxChatRoomPlugins.find({chatroomId})
        
        res.send(<Result>{success:true,data:plugins})
    })

    // 给群聊添加插件
    app.post("/api/plugin/addToRoom",auth,async (req,res)=>{
        let plugin = req.body as WxChatRoomPlugin

        let exist = await WxChatRoomPlugins.findOne({chatroomId:plugin.chatroomId,pluginId:plugin.pluginId})
        if(exist){
            // 如果已经存在则进行更新
            await WxChatRoomPlugins.updateOne({
                chatroomId:plugin.chatroomId,
                pluginId:plugin.pluginId
            },plugin)
        }else{
            let newPlugin = new WxChatRoomPlugins(plugin)
            await newPlugin.save()
        }

        reloadPlugin(plugin.pluginId,plugin.chatroomId)

        res.send(<Result>{success:true,msg:"OK"})
    })

    // 从群聊中删除插件
    app.post("/api/plugin/deleteFromRoom",auth,async (req,res)=>{
        let plugin = req.body as WxChatRoomPlugin

        await WxChatRoomPlugins.deleteOne({chatroomId:plugin.chatroomId,pluginId:plugin.pluginId})

        reloadPlugin(plugin.pluginId,plugin.chatroomId)

        res.send(<Result>{success:true,msg:"OK"})
    })

    // 获得插件信息
    app.post("/api/plugin/getInfo",auth,async (req,res)=>{
        let pluginId = req.body.pluginId

        let plugin = await WxPlugins.findOne({pluginId})
        res.send(<Result>{success:true,data:plugin})
    })
    

}