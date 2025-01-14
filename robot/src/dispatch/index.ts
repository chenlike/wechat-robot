
import logger from "@/common/logger"
import { getWechatEmitter } from "@/wechat"
import { getPluginScope,getPluginsInChatroom,pluginContext } from "@/plugin"



export async function initDispatch(){
    
    getWechatEmitter().on("message",async (msg)=>{

        if(msg.is_self){
            // 排除掉自己的信息
            return;
        }

        console.log(`[WECHAT] ${msg.sender} -> ${msg.roomid} : ${msg.content}`)

        pluginContext.emit("wechat/allMessages",msg as any)

        let plugins = getPluginsInChatroom(msg.roomid)
        for(let plugin of plugins){

            let scope = await getPluginScope(plugin.pluginId)
            if(scope){
                pluginContext.emit(`wechat/${plugin.pluginId}/message`,msg as any)
            }
        }

    })
}