/**
 * @fileoverview QQ农场 Code 自动抓取脚本 (增加点击跳转查看)
 * @author Gemini_Assistant
 */

const url = $request.url;
const body = $request.body;
const storageKey = "QQ_Farm_Code";

const savedCode = $persistentStore.read(storageKey);

if (savedCode) {
    console.log("检测到本地已有 Code，已自动拦截。");
    $done({ response: { status: 200, body: "Already captured", headers: { "Content-Type": "text/plain" } } });
} else {
    let farmCode = "";
    if (url.indexOf("code=") != -1) {
        const urlMatch = url.match(/code=([^&]*)/);
        if (urlMatch) farmCode = urlMatch[1];
    } 

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
        const isSuccess = $persistentStore.write(farmCode, storageKey);
        if (isSuccess) {
            // 【关键改动】：增加 open-url，点击通知直接跳转到查看页面
            $notification.post("QQ农场抓包成功 ✅", "点击此通知即可一键复制 Code", "Code值: " + farmCode, {"open-url": "http://farm.code"});
            console.log("成功抓取并保存 Code: " + farmCode);
        }
        $done({ response: { status: 200, body: "Capture success", headers: { "Content-Type": "text/plain" } } });
    } else {
        $done({});
    }
}