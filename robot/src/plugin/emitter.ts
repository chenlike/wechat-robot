
import EventEmitter from "events"
import TypedEmitter from "typed-emitter"
import { WxPlugin } from "./plugin"




export interface PluginEvents {
    reloadPlugin: (plugin:WxPlugin) => void
}

export const emitter = new EventEmitter() as TypedEmitter<PluginEvents>






export interface RoomEvent {

}