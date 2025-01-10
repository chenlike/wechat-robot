

import type { WechatMsg } from "./types"

import dayjs from "dayjs"



export class WechatControl{


    constructor(){

    }



    receive(content:string){

        let msg = JSON.parse(content) as WechatMsg
        
        


    }




}































