
import { useWebsocketCallback } from "@web/debug/ws_callback_debug"
import { WechatMsg } from "./types"
import { WxMessages } from "@common/schema"
import dayjs from "dayjs"
import logger from "@common/logger"
import path from "path"
import { initApiHost } from "./wechat-api"

import EventEmitter from "events"
import TypedEmitter from "typed-emitter"


export * from "./types"

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

            // 如果时间超过60秒，就不再发送
            if (Date.now() - msg.ts * 1000 > 60000) {
                console.log("消息超过60秒，不再发送 消息时间,", msg.time )
                return
            }
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
    console.log("init wechat", process.env.WECHATFERRY_HOST)
    initApiHost(process.env.WECHATFERRY_HOST ?? "")

    state.wechat = new WechatControl()

    return state
}

export {
    initWechat,
    getWechatControl,
    getWechatEmitter
}




























