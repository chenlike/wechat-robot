import dotenv from "dotenv";
dotenv.config();

import logger from "@common/logger";
import { initWebsocket } from "./plugin-ws-client";
import { initService } from "./services";
import { loadAllPlugins } from "./manage";
import { initDatabase } from "@common/database";
import { initApiHost } from "@common/wechat/wechat-api";






async function main(){
    logger.info("plugin start")
    
    initApiHost(process.env.WECHATFERRY_HOST ?? "")


    // 初始化数据库
    await initDatabase()

    // 初始化基础服务
    await initService()

    // 加载所有插件
    await loadAllPlugins()
    
    // 链接websocket
    initWebsocket()

}
main()


