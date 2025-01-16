import { SendRichTextReq } from "@/wechat";
import { MessageInfo, WxPluginContext } from "./types"
import { EventEmitter } from "events"

export class BasePlugin {


    ctx:WxPluginContext;

    constructor(ctx:WxPluginContext) {
        this.ctx = ctx;
    }


    async onMessage(message:MessageInfo){

    }   



}




export class PluginService{
    serviceName:string;
    event:EventEmitter;
    constructor(serviceName:string,event:EventEmitter){
        this.serviceName = serviceName;
        this.event = event;
    }
    
}