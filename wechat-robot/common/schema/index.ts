import mongoose, { Document, Schema } from "mongoose";

/**
 * 微信消息接口
 */
export interface WxMessage extends Document {
  /**
   * 消息id
   */
  id: string;

  /**
   * 是否是来自自己的
   */
  is_self: boolean;

  /**
   * 是否是来自群聊的
   */
  is_group: boolean;

  /**
   * 消息类型
   */
  type: number;

  /**
   * 时间戳
   */
  ts: string;

  /**
   * 时间
   */
  time: string;

  /**
   * 来源群聊id
   */
  roomid: string;

  /**
   * 消息内容
   */
  content: string;

  /**
   * 发送人wxid
   */
  sender: string;

  /**
   * 签名
   */
  sign: string;

  /**
   * 视频或图片消息的缩略图路径
   */
  thumb: string;

  /**
   * 视频或图片消息的路径
   */
  extra: string;

  /**
   * 原始xml内容
   */
  xml: string;
}

// 定义微信消息模型
export const WxMessages = mongoose.model<WxMessage>(
    "WxMessage",
    new Schema<WxMessage>({
      id: String,
      is_self: Boolean,
      is_group: Boolean,
      type: Number,
      ts: String,
      time: String,
      roomid: String,
      content: String,
      sender: String,
      sign: String,
      thumb: String,
      extra: String,
      xml: String,
    })
  );

  

/**
 * 微信插件接口
 */
export interface WxPlugin extends Document {
  /**
   * 插件id 唯一
   */
  pluginId: string;

  /**
   * 插件名称
   */
  pluginName: string;


  /**
   * 代码内容
   */
  codeContent: string;
}

// 定义微信插件模型
export const WxPlugins = mongoose.model<WxPlugin>(
    "WxPlugin",
    new Schema<WxPlugin>({
      pluginId: String,
      pluginName: String,
      codeContent: String,
    })
  );

  
/**
 * 群聊使用插件的配置接口
 */
export interface WxChatRoomPlugin extends Document {
  /**
   * 插件id
   */
  pluginId: string;

  /**
   * 群聊id
   */
  chatroomId: string;

  /**
   * 是否启用
   */
  enable: boolean;

  /**
   * 配置内容，JSON字符串
   */
  config: string;
}



// 定义群聊插件模型
export const WxChatRoomPlugins = mongoose.model<WxChatRoomPlugin>(
  "WxChatRoomPlugin",
  new Schema<WxChatRoomPlugin>({
    pluginId: String,
    chatroomId: String,
    enable: Boolean,
    config: String,
  })
);


export interface WxChatroom extends Document {
  /**
   * 群聊id
   */
  chatroomId: string;

  /**
   * 群聊名称
   */
  chatroomName: string;

}

// 定义群聊模型
export const WxChatrooms = mongoose.model<WxChatroom>(
  "WxChatroom",
  new Schema<WxChatroom>({
    chatroomId: String,
    chatroomName: String,
  })
);