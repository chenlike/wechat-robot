
import logger from "@common/logger";
import WebSocket from "ws";





function useWebsocketCallback(){
    const ws = new WebSocket(process.env.DEBUG_WS_CALLBACK ?? "");

    ws.on("open", () => {
        logger.info("已连接WS 服务器  " + process.env.DEBUG_WS_CALLBACK);
    });
    
    ws.on("close", () => {
        logger.info("断开连接 " + process.env.DEBUG_WS_CALLBACK);
    });


    return ws
}
    




export {
    useWebsocketCallback
}





