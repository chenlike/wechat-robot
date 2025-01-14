
import { pluginContext } from "@/plugin"
import { CronService } from "./cron-service";

export function initBasicService() {


    pluginContext.plugin(CronService);

    
}

