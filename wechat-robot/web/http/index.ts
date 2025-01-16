import express from "express"

import logger from "@common/logger";
import session from "express-session"
import bodyParser from "body-parser"


import callbackRoutes from "./controller/callback";

const app = express()


function initRoutes() {





    app.use(express.static("wwwroot"))
    app.use('/assets', express.static(__dirname + '/wwwroot/assets'));
    app.get('/', (req, res) => {
        res.sendFile(__dirname + "/wwwroot/" + "index.html")
    });
    app.use(bodyParser.json())


    callbackRoutes(app)

}


export function initHttp() {

    let port = parseInt(process.env.PORT ?? "") ?? 6000;
    let hostname = process.env.HOST ?? "0.0.0.0"

    // 初始化路由
    initRoutes()

    app.listen(port, hostname, () => {
        logger.info(`web 监听: http://${hostname}:${port}`)
    })
}
