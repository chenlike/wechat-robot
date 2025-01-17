import WebSocket from "ws";
import { exec } from "child_process"; // 用于执行命令
import { reloadPlugin } from "plugin/manage";

const healthState = {
    lastTick: Date.now(),
    intervalInitialized: false, // 用于标记 interval 是否已经启动
};

export function listenHealthCheck(server: WebSocket.Server) {
    // 定时器只初始化一次，用于心跳检查
    if (!healthState.intervalInitialized) {
        setInterval(() => {
            // 如果超过30秒没有收到 ping 消息，就重启 plugin 进程
            if (Date.now() - healthState.lastTick > 30000) {
                console.warn("Heartbeat timeout. Restarting plugin process...");

                // 执行 pm2 restart 命令重启 plugin
                exec("pm2 restart plugin", (error, stdout, stderr) => {
                    if (error) {
                        console.error("Failed to restart plugin process:", error.message);
                        return;
                    }
                    console.log("Plugin process restarted successfully");
                    console.log(stdout);
                });
                // 如果已经重启了 plugin 进程，更新一下最后心跳时间 防止还没起来又被重启了
                healthState.lastTick = Date.now();
            }
        }, 5000); // 每 5 秒检查一次心跳

        healthState.intervalInitialized = true;
    }

    server.on("connection", (client) => {
        console.log("Client connected");

        // 监听来自客户端的消息
        client.on("message", (rawData) => {
            try {
                const data = JSON.parse(rawData.toString());
                if (data.type === "ping") {
                    client.send(JSON.stringify({ type: "pong" })); // 发送 pong 消息
                    healthState.lastTick = Date.now();
                }
            } catch (error) {
                console.error("Failed to parse message:", error);
            }
        });

        // 监听客户端断开连接事件
        client.on("close", () => {
            console.log("Client disconnected");
        });

        // 监听错误事件
        client.on("error", (error) => {
            console.error("Client error:", error.message);
        });
    });
}
