
import WebSocket from "ws"




export function listenHealthCheck(server:WebSocket.Server){
    
    // 监听来自client的ping事件   字符串
    server.on("connection",(client)=>{
  


        client.on("message",(rawData)=>{

            let data = JSON.parse(rawData.toString())
            if(data.type === "ping"){
                client.send(JSON.stringify({
                    type:"pong"
                }))
            }


        })



    })

}