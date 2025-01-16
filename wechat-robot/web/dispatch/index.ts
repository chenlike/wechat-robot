import logger from "@common/logger";
import { getWechatEmitter } from "@common/wechat";
import WebSocket from "ws";
import { listenHealthCheck } from "./healthcheck";



const state = {
    server:null as WebSocket.Server | null
}
export function getWsServer(){
    return state.server
}



export async function initDispatch(){
    

    let port = parseInt(process.env.WS_PORT ?? "6001")
    state.server = new WebSocket.Server({
        port:port
    })



    listenHealthCheck(state.server)



    logger.info(`websocket server 监听: ws://0.0.0.0:${port}`)


    getWechatEmitter().on("message",async (msg)=>{

        if(msg.is_self){
            // 排除掉自己的信息
            return;
        }

        console.log(`[WECHAT] ${msg.sender} -> ${msg.roomid} : ${msg.content}`)

        if(state.server){
            // 推送给每个客户端
            let content = JSON.stringify({
                type:"wechat/message",
                data:msg
            })
            state.server.clients.forEach(client=>{
                client.send(content)
            })
        }

    })
}




