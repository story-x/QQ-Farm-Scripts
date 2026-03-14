/**
 * @fileoverview QQ农场 Code 自动抓取脚本
 * @author Gemini_Assistant
 */

const url = $request.url;
const body = $request.body;

// 定义匹配 Code 的变量
let farmCode = "";

// 1. 尝试从 URL 参数中提取 (常见于 GET 请求)
if (url.indexOf("code=") !== -1) {
    const urlMatch = url.match(/code=([^&]*)/);
    if (urlMatch) farmCode = urlMatch[1];
}

// 2. 尝试从 Body 中提取 (常见于 POST 请求的 JSON 或 Form 数据)
if (!farmCode && body) {
    try {
        // 如果是 JSON 格式
        const obj = JSON.parse(body);
        farmCode = obj.code || (obj.data && obj.data.code);
    } catch (e) {
        // 如果是普通字符串
        const bodyMatch = body.match(/code["']?\s*[:=]\s*["']?([^"']+)["']?/);
        if (bodyMatch) farmCode = bodyMatch[1];
    }
}

if (farmCode) {
    // 存储到本地，新 Code 会直接覆盖旧 Code
    $persistentStore.write(farmCode, "QQ_Farm_Code");

    // 【新增】Loon 剪贴板配置：定义通知的附加属性
    const attach = {
        "clipboard": farmCode // 点击通知后进入 Loon，会自动将 farmCode 复制到剪贴板
    };

    // 发送系统通知 (传入 attach 参数)
    $notification.post(
        "QQ农场抓包成功 ✅",
        "获取到最新 Code",
        "Code值: " + farmCode + "\n已自动保存至本地，👉【点击此通知即可复制到剪贴板】",
        attach
    );

    console.log("成功抓取 QQ 农场 Code: " + farmCode);
} else {
    console.log("未在当前请求中发现 Code...");
}

// 始终放行请求，确保游戏正常加载
$done({});
