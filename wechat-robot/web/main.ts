import dotenv from "dotenv";
dotenv.config();

import logger from "@common/logger";

import { initDatabase } from "@common/database";
import { initHttp } from "./http";



import { useWebsocketCallback } from "./debug/ws_callback_debug";
import { getWechatControl } from "@common/wechat";
import { initDispatch } from "./dispatch";


async function initDebug() {
    // DEBUG ONLY
    // 启用ws回调测试
    logger.info("[DEBUG:启用ws回调测试]")
    const ws = useWebsocketCallback()
    ws.on("message", async (data) => {
        let rawData = data.toString("utf-8")
        getWechatControl().receive(rawData)

    })
}



async function main() {
    logger.info("[初始化数据库database]")
    initDatabase()

    logger.info("[初始化http]")
    initHttp()

    
    logger.info("[初始化Ws分发dispatch]")
    initDispatch()

    // DEBUG
    if (process.env.DEBUG_ENABLE_WS_CALLBACK == "true") {
        initDebug()
    }

}

main()