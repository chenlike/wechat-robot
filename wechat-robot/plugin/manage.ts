
import { WxChatRoomPlugins,WxChatRoomPlugin,WxPlugins,WxPlugin } from "@common/schema";
import { loadPlugin } from "./plugin-vm";



/**
 * 重载插件
 * @param pluginId 
 * @param chatroomId 
 */
export async function reloadPlugin(pluginId:string,chatroomId:string){
    console.log(`reload加载插件${pluginId}到群聊${chatroomId}`)

    await loadPlugin(pluginId,chatroomId)

}

/**
 * 加载所有插件
 */
export async function loadAllPlugins(){
    
    // 获得所有已启用的插件
    let pluginRooms = await WxChatRoomPlugins.find({ });
    pluginRooms = pluginRooms.filter((pluginRoom)=>{
        return pluginRoom.enable
    })
    for(let pluginRoom of pluginRooms){
        await loadPlugin(pluginRoom.pluginId,pluginRoom.chatroomId)
    }

}
