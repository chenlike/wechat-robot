import { Service,Context } from "cordis"
import * as api from "./wechat-api"







/**
 * 微信相关服务 包含操作微信相关的东西
 */
export class WechatService extends Service {
    constructor(ctx:Context) {
        super(ctx, 'wechat', true);
    }


    // 把api的function都挂在到service上
    public api:typeof api = api



    


}

