import express from "express"

import logger from "@common/logger";
import session from "express-session"
import bodyParser from "body-parser"


import callbackRoutes from "./controller/callback";
import authRoutes from "./controller/auth";
import roomRoutes from "./controller/room";
import pluginRoutes from "./controller/plugin";


const app = express()

function initRoutes() {





    app.use(express.static("wwwroot"))
    app.use('/assets', express.static(__dirname + '/wwwroot/assets'));
    app.get('/', (req, res) => {
        res.sendFile(__dirname + "/wwwroot/" + "index.html")
    });
    app.use(bodyParser.json())


    // controllers 

    app.get("/api/healthcheck",async (req,res)=>{
        return res.send({success:true})
    })
    callbackRoutes(app)
    authRoutes(app)
    roomRoutes(app)
    pluginRoutes(app)
    
}


export async function initHttp() {

    try{
        let port = parseInt(process.env.PORT ?? "") ?? 6000;
        let hostname = process.env.HOST ?? "0.0.0.0"
        // 初始化路由
        initRoutes()
        app.listen(port,hostname, () => {
            logger.info(`web 监听: http://${hostname}:${port}`)
        })
    }catch(e){
        logger.error(e)
    }

}
