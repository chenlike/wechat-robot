import dotenv from "dotenv";
dotenv.config();


import logger from "@/common/logger";
import { initDatabase } from "@/common/database";
import { initWeb } from "@/web";
import { initWechat } from "@/wechat"


async function main() {
    logger.info("[初始化数据库服务]")
    initDatabase()

    logger.info("[启动web服务]")
    initWeb()

    logger.info("[初始化微信Control]")
    initWechat()

}


main()




