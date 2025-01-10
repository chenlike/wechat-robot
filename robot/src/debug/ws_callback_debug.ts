
import logger from "@/common/logger";
import WebSocket from "ws";








function useWebsocketCallback(){
    const ws = new WebSocket(process.env.DEBUG_WS_CALLBACK ?? "");

    ws.on("open", () => {
        logger.info("Connected to websocket server at " + process.env.DEBUG_WS_CALLBACK);
    });
    
    ws.on("close", () => {
        logger.info("Disconnected from websocket server at " + process.env.DEBUG_WS_CALLBACK);
    });

    // ws.on("message", (data) => {
        
    //     console.log(data.toString("utf-8"));
    // })
    
    return ws
}
    




export default {
    useWebsocketCallback
}





