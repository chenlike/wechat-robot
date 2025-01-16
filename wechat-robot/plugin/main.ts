import dotenv from "dotenv";
dotenv.config();

import logger from "@common/logger";
import { initPluginVM } from "./plugin-vm";
import { initWebsocket } from "./plugin-ws-client";
import { initService } from "./services";











async function main(){
    logger.info("plugin main start")
    

    // 初始化基础服务
    initService()
    // 初始化插件
    initPluginVM()

    // 链接websocket
    initWebsocket()

}
main()


