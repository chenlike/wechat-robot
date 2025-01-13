import dotenv from "dotenv";
dotenv.config();


import logger from "@/common/logger";
import { initDatabase } from "@/common/database";
import { initWeb } from "@/web";
import { initWechat } from "@/wechat"
import { initPlugin } from "@/plugin"


async function main() {
    logger.info("[初始化数据库database]")
    initDatabase()

    logger.info("[初始化web]")
    initWeb()


    logger.info("[初始化微信Control]")
    initWechat()


    logger.info("[初始化插件Plugin]")
    await initPlugin()



}


main()




