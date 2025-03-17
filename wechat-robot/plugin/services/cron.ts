import schedule from "node-schedule"
import { PluginService } from "./base";

import { EventEmitter } from "events"

/**
 * 微信相关服务 包含操作微信相关的东西
 */
export class CronService extends PluginService {


    constructor(event: EventEmitter) {
        super(event)
        
    }

    async init(){
        this.event.on("plugin/remove", ({ pluginId }) => {
            // 移除pluginId开头的定时任务
            for (let jobName in schedule.scheduledJobs) {
                if (jobName.startsWith(pluginId)) {
                    schedule.cancelJob(jobName)
                    console.log("移除定时任务", jobName)
                }
            }
        })
    }

    /**
     * 注册定时任务
     * @param pluginId 插件id
     * @param key  key
     * @param room_wxid  房间id
     * @param rule 
     */
    public registerSchedule(pluginId: string, key: string, room_wxid: string, rule: string) {


        const jobName = `${pluginId}:${key}:${room_wxid}`
        console.log("注册定时任务", jobName, rule)
        if (schedule.scheduledJobs[jobName] != undefined) {
            schedule.cancelJob(jobName)
        }

        schedule.scheduleJob(jobName, rule, async () => {
            
            this.event.emit("cron/trigger/" + key, {
                pluginId,
                key,
                room_wxid,
                rule
            })

        });
    }



}

