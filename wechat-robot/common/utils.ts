export function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0; // 生成一个 0~15 的随机数
        const v = c === 'x' ? r : (r & 0x3) | 0x8; // 'x' 使用随机数，'y' 使用特定格式
        return v.toString(16); // 转为十六进制
    });
}