import WebSocket from "ws";
import { loadAllPlugins, reloadPlugin } from "./manage";
import { receiveMessage } from "./plugin-vm";


const state = {
    ws: null as WebSocket | null,
    healthCheckTimer: null as NodeJS.Timeout | null
}


function initHealthCheck(ws:WebSocket){
    state.healthCheckTimer = setInterval(()=>{
        ws.send(JSON.stringify({
            type:"ping"
        }))
    },5000)
}



export function initWebsocket(){
    let port = parseInt(process.env.WS_PORT ?? "6001");



    let ws = new WebSocket(`ws://127.0.0.1:${port}`);
    state.ws = ws;

    ws.on("open",()=>{
        console.log("ws connected");
        initHealthCheck(ws)
    });
    ws.on("close",()=>{
        console.log("ws closed");
        if(state.healthCheckTimer){
            clearTimeout(state.healthCheckTimer)
        }
    });


    ws.on("message",(data)=>{
        let content = data.toString("utf-8")
        
        let msg = JSON.parse(content) as WsMessage
        switch (msg.type) {
            case "plugin/reload":
                // 重新加载某个插件
                reloadPlugin(msg.data.pluginId, msg.data.chatroomId)
                break;
            case "plugin/reloadAll":
                // 重新加载所有插件
                loadAllPlugins()
                break;

            case "wechat/message":
                // 微信推送消息
                receiveMessage(msg.data)
                break;

            default:
                break;
        }




    })


    return ws;
}