import express from "express"

import logger from "@/common/logger";
import session from "express-session"
import bodyParser from "body-parser"

const app = express()


function initRoutes() {





    app.use(express.static("wwwroot"))
    app.use('/assets', express.static(__dirname + '/wwwroot/assets'));
    //发送index.html页面到域名,使得输入服务器地址后就是这个页面
    app.get('/', (req, res) => {
        res.sendFile(__dirname + "/wwwroot/" + "index.html")        //设置/ 下访问文件位置
    });
    app.use(bodyParser.json())



}


export function initWeb() {

    let port = parseInt(process.env.PORT ?? "") ?? 6000;
    let hostname = process.env.HOST ?? "0.0.0.0"


    // 初始化路由
    initRoutes()

    app.listen(port, hostname, () => {
        logger.info(`web listening at http://${hostname}:${port}`)
    })
}
