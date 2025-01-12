
import { useWebsocketCallback } from "@/debug/ws_callback_debug"
import { WechatMsg } from "@/wechat/types"
import { WxMessages } from "@/schema"
import dayjs from "dayjs"
import logger from "@/common/logger"
import * as api from "./wechat-api"

export class WechatControl {

    api: typeof api


    constructor() {
        this.api = api
        
    }


    


    async receive(content: string) {

        let msg = JSON.parse(content) as WechatMsg

        // 转化ts
        msg.time = dayjs.unix(msg.ts).format('YYYY-MM-DD HH:mm:ss');



        try {
            await WxMessages.create(msg)


            
        } catch (e) {
            console.log(e)
        }



    }

}



const state = {
    wechat: <WechatControl | null>null
}

function getWechatControl() {
    if (state.wechat) {
        return state.wechat
    } else {
        throw new Error("wechat not init")
    }
}


function initWechat() {
    state.wechat = new WechatControl()

    if (process.env.DEBUG_ENABLE_WS_CALLBACK == "true") {
        // 启用ws回调测试
        logger.info("[DEBUG:启用ws回调测试]")
        const ws = useWebsocketCallback()
        ws.on("message", async (data) => {

            let rawData = data.toString("utf-8")
            getWechatControl().receive(rawData)

        })
    }

}

export {
    initWechat,
    getWechatControl
}




























