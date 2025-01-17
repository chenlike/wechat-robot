


import { addService } from "../plugin-vm"
import { CronService } from "./cron"


export async function initService(){
    await addService("cron", CronService)


}