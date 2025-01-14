
import { useWebsocketCallback } from "@/debug/ws_callback_debug"
import { WechatMsg } from "@/wechat/types"
import { WxMessages } from "@/schema"
import dayjs from "dayjs"
import logger from "@/common/logger"
import path from "path"
import { addPlugin, delPlugin, getPluginScope, pluginContext } from "@/plugin"
import { WechatService } from "./wechat-service"
import { initApiHost } from "./wechat-api"

import EventEmitter from "events"
import TypedEmitter from "typed-emitter"


const state = {
    wechat: <WechatControl | null>null,
    emitter: new EventEmitter() as TypedEmitter<WechatControlEvents>
}


export interface WechatControlEvents {
    message: (msg: WechatMsg) => void
}

export class WechatControl {


    constructor() {


    }

    async receive(content: string) {

        let msg = JSON.parse(content) as WechatMsg

        // 转化ts
        msg.time = dayjs.unix(msg.ts).format('YYYY-MM-DD HH:mm:ss');

        try {

            await WxMessages.create(msg)

            state.emitter.emit("message", msg)
    
        } catch (e) {
            logger.error(e)


        }



    }

}




function getWechatControl() {
    if (state.wechat) {
        return state.wechat
    } else {
        throw new Error("wechat not init")
    }
}
function getWechatEmitter() {
    return state.emitter
}

function initWechat() {

    initApiHost(process.env.WECHATFERRY_HOST ?? "")

    state.wechat = new WechatControl()
    pluginContext.plugin(WechatService)




    // DEBUG ONLY
    if (process.env.DEBUG_ENABLE_WS_CALLBACK == "true") {
        // 启用ws回调测试
        logger.info("[DEBUG:启用ws回调测试]")
        const ws = useWebsocketCallback()
        ws.on("message", async (data) => {

            let rawData = data.toString("utf-8")
            getWechatControl().receive(rawData)

        })
    }

    return state
}

export {
    initWechat,
    getWechatControl,
    getWechatEmitter
}




























