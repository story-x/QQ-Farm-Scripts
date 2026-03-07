/**
 * @fileoverview QQ农场 Code 自动抓取脚本
 */

const url = $request.url;
const body = $request.body;
const storageKey = "QQ_Farm_Code";

// 1. 检查本地是否已经存有 Code
const savedCode = $persistentStore.read(storageKey);

if (savedCode) {
    console.log("检测到本地已有 Code: " + savedCode + "，已自动拦截冗余请求。");
    // 返回模拟响应，中断原始请求
    $done({ 
        response: { 
            status: 200, 
            body: "Already captured", 
            headers: { "Content-Type": "text/plain" } 
        } 
    });
} else {
    // 2. 如果本地没有，则执行抓取逻辑
    let farmCode = "";

    // 尝试从 URL 参数中提取
    if (url.indexOf("code=") != -1) {
        const urlMatch = url.match(/code=([^&]*)/);
        if (urlMatch) farmCode = urlMatch[1];
    } 

    // 尝试从 Body 中提取
    if (!farmCode && body) {
        try {
            const obj = JSON.parse(body);
            farmCode = obj.code || (obj.data && obj.data.code);
        } catch (e) {
            const bodyMatch = body.match(/code["']?\s*[:=]\s*["']?([^"']+)["']?/);
            if (bodyMatch) farmCode = bodyMatch[1];
        }
    }

    if (farmCode) {
        // 存储到本地持久化数据库
        const isSuccess = $persistentStore.write(farmCode, storageKey);
        
        if (isSuccess) {
            $notification.post("QQ农场抓包成功 ✅", "获取到最新 Code 并已启用拦截", "Code值: " + farmCode);
            console.log("成功抓取并保存 Code: " + farmCode);
        }
        
        // 抓到后立即拦截当前请求，防止多次触发
        $done({ 
            response: { 
                status: 200, 
                body: "Capture success", 
                headers: { "Content-Type": "text/plain" } 
            } 
        });
    } else {
        // 没抓到则放行，让游戏继续加载，等待下个包
        $done({});
    }
}