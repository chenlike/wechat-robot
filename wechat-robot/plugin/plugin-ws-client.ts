import WebSocket from "ws";


const state = {
    ws: null as WebSocket | null
}




export function initWebsocket(){
    let port = parseInt(process.env.WS_PORT ?? "6001");



    let ws = new WebSocket("127.0.0.1",{port:port});
    state.ws = ws;
    ws.on("open",()=>{
        console.log("ws connected");
    });
    return ws;
}