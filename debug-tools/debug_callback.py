#! /usr/bin/env python3
# -*- coding: utf-8 -*-

import uvicorn
from fastapi import Body, FastAPI
from pydantic import BaseModel
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import json
import threading
import sys

class WsHandler(WebSocket):

    def handleConnected(self):
        print("[WebSocket]", self.address, '已连接')

    def handleClose(self):
        print("[WebSocket]", self.address, '关闭')



server = SimpleWebSocketServer("0.0.0.0", 8001, WsHandler)


class Msg(BaseModel):
    is_self: bool
    is_group: bool
    id: int
    type: int
    ts: int
    roomid: str
    content: str
    sender: str
    sign: str
    thumb: str
    extra: str
    xml: str


def msg_cb(msg: Msg = Body(description="微信消息")):
    """示例回调方法，简单打印消息"""
    print(f"收到消息：{msg}")
    
    # 将消息对象转为 JSON 字符串
    msg_json = json.dumps(msg.model_dump(), ensure_ascii=False)
    
    # 遍历 WebSocket 客户端并发送消息
    for client in server.connections.values():
        client.sendMessage(msg_json)
    
    return {"status": 0, "message": "成功"}




def start_websocket_server():
    print("websocket服务启动成功")
    server.serveforever()
    


if __name__ == "__main__":
    app = FastAPI()
    app.add_api_route("/callback", msg_cb, methods=["POST"])
    print("callback服务启动成功")

    # 启动 WebSocket 服务器线程
    websocket_thread = threading.Thread(target=start_websocket_server)
    websocket_thread.start()

    # 启动 FastAPI 服务器
    uvicorn.run(app, host="0.0.0.0", port=8000)

    # 强制关闭 所有线程
    server.close()
    