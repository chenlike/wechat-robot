import { EventEmitter } from "events"

import * as api from "@common/wechat/wechat-api"

export abstract class PluginService{
    
    event:EventEmitter


    api: typeof api = api

    constructor(event:EventEmitter){
        this.event = event
    }


    abstract init():Promise<any>


}