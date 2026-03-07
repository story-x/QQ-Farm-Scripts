/**
 * @fileoverview QQ农场 Code 一键重置脚本
 */

const key = "QQ_Farm_Code";
const savedValue = $persistentStore.read(key);

if (savedValue) {
    // 清除本地存储
    const success = $persistentStore.write("", key);
    if (success) {
        $notification.post("QQ农场重置成功 🧹", "已清空本地 Code", "您可以重新进入游戏抓取新 Code 了");
        console.log("已成功清除旧 Code: " + savedValue);
    } else {
        $notification.post("QQ农场重置失败 ⚠️", "", "无法写入持久化数据，请检查 Loon 权限");
    }
} else {
    $notification.post("QQ农场提示", "", "本地目前没有已保存的 Code，无需重置");
}

// 结束后给浏览器返回一个结果页面，防止网页一直转圈
$done({ 
    response: { 
        status: 200, 
        body: "<h1>Reset Success</h1><p>The QQ Farm Code has been cleared.</p>", 
        headers: { "Content-Type": "text/html" } 
    } 
});