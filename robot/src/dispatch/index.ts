
import logger from "@/common/logger"
import { getWechatEmitter } from "@/wechat"
import { getPluginScope,getPluginsInChatroom } from "@/plugin"



export async function initDispatch(){
    
    getWechatEmitter().on("message",async (msg)=>{

        console.log(msg)
        if(msg.is_self){
            // 排除掉自己的信息
            return;
        }


        console.log(`[WECHAT] ${msg.sender} -> ${msg.roomid} : ${msg.content}`)

        let plugins = getPluginsInChatroom(msg.roomid)
        for(let plugin of plugins){
            let scope = await getPluginScope(plugin.pluginId)
            if(scope){
                scope.ctx.emit("wechat/allMessages",msg as any)
            }
        }
    })
}