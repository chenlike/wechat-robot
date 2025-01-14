import { Service, Context } from "cordis"
import { getPluginScope } from "@/plugin"
import schedule from "node-schedule"



/**
 * 微信相关服务 包含操作微信相关的东西
 */
export class CronService extends Service {



    constructor(ctx: Context) {
        super(ctx, 'cron', true);
        console.log("Cron服务初始化")

        // 清空所有的定时任务
        for (let job in schedule.scheduledJobs) {
            schedule.cancelJob(schedule.scheduledJobs[job])
        }

        // 等待重新注册
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



            // 查找插件进行触发
            let scope = await getPluginScope(pluginId)

            // 触发插件
            scope?.ctx.emit("cron/trigger", {
                pluginId,
                key,
                room_wxid,
                rule
            } as any)


        });
    }



}

