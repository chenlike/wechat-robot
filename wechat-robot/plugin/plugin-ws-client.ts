import WebSocket from "ws";
import { loadAllPlugins, reloadPlugin } from "./manage";
import { receiveMessage } from "./plugin-vm";

const state = {
    ws: null as WebSocket | null,
    healthCheckTimer: null as NodeJS.Timeout | null,
    reconnectTimer: null as NodeJS.Timeout | null,
    reconnectInterval: 5000 // 重连间隔时间
};

function initHealthCheck(ws: WebSocket) {
    state.healthCheckTimer = setInterval(() => {
        ws.send(JSON.stringify({
            type: "ping"
        }));
    }, 5000);
}

function connectWebSocket() {
    let port = parseInt(process.env.WS_PORT ?? "6001");

    let ws = new WebSocket(`ws://127.0.0.1:${port}`);
    state.ws = ws;

    ws.on("open", () => {
        console.log("ws connected");
        initHealthCheck(ws);
        if (state.reconnectTimer) {
            clearTimeout(state.reconnectTimer);
            state.reconnectTimer = null;
        }
    });

    ws.on("close", () => {
        console.log("ws closed");
        if (state.healthCheckTimer) {
            clearTimeout(state.healthCheckTimer);
            state.healthCheckTimer = null;
        }
        // 尝试重连
        state.reconnectTimer = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connectWebSocket();
        }, state.reconnectInterval);
    });

    ws.on("message", (data) => {
        let content = data.toString("utf-8");
        let msg = JSON.parse(content) as WsMessage;
        console.log("ws message:", msg);
        switch (msg.type) {
            case "plugin/reload":
                // 重新加载某个插件
                reloadPlugin(msg.data.pluginId, msg.data.roomId);
                break;
            case "plugin/reloadAll":
                // 重新加载所有插件
                loadAllPlugins();
                break;
            case "wechat/message":
                // 微信推送消息
                receiveMessage(msg.data);
                break;
            default:
                break;
        }
    });

    ws.on("error", (err) => {
        console.error("WebSocket error:", err.message);
        ws.close();
    });

    return ws;
}

export function initWebsocket() {
    return connectWebSocket();
}