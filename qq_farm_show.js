/**
 * @fileoverview QQ农场 Code 在线查看脚本
 */

const key = "QQ_Farm_Code";
const savedValue = $persistentStore.read(key);

let htmlTitle = "";
let htmlContent = "";

if (savedValue) {
    htmlTitle = "您的 QQ 农场 Code";
    htmlContent = `
        <div class="code-box">${savedValue}</div>
        <p class="hint">已成功从 Loon 持久化存储中提取</p>
        <button onclick="copyToClipboard('${savedValue}')">点击复制 Code</button>
    `;
} else {
    htmlTitle = "未检测到 Code";
    htmlContent = `
        <div class="code-box" style="color: #ff4d4f;">暂无数据</div>
        <p class="hint">请先进入 QQ 农场游戏进行抓取</p>
    `;
}

// 构造一个简单的 HTML 页面
const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QQ农场 Code 查看器</title>
    <style>
        body { font-family: -apple-system, sans-serif; background: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center; width: 80%; max-width: 400px; }
        h2 { color: #333; margin-bottom: 1.5rem; }
        .code-box { background: #f0f2f5; padding: 15px; border-radius: 10px; word-break: break-all; font-family: monospace; font-size: 1.2rem; border: 1px dashed #adc6ff; margin-bottom: 1rem; }
        .hint { color: #8c8c8c; font-size: 0.9rem; }
        button { background: #1890ff; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 1rem; margin-top: 10px; }
        button:active { background: #096dd9; }
    </style>
    <script>
        function copyToClipboard(text) {
            const el = document.createElement('textarea');
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            alert('Code 已复制到剪贴板！');
        }
    </script>
</head>
<body>
    <div class="card">
        <h2>${htmlTitle}</h2>
        ${htmlContent}
    </div>
</body>
</html>
`;

$done({ 
    response: { 
        status: 200, 
        body: html, 
        headers: { "Content-Type": "text/html; charset=utf-8" } 
    } 
});