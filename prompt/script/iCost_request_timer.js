/*
 * Surge脚本：iCost AI服务商监控 - 请求脚本 (v4)
 * 作者：Surge脚本专家
 *
 * 功能：
 * 1. 在HTTP请求发出时触发。
 * 2. 解析请求体JSON，提取'model'名称。
 * 3. 将模型名称和当前时间戳打包成一个JSON对象。
 * 4. 使用请求ID作为键，将此JSON对象存入持久化存储，供response脚本使用。
 */

(function() {
    let modelName = "Unknown Model";
    try {
        // 检查并解析请求体
        if ($request.body) {
            const bodyJson = JSON.parse($request.body);
            if (bodyJson.model) {
                modelName = bodyJson.model;
            }
        }
    } catch (error) {
        console.log(`iCost Monitor Request Error: 解析请求体失败 - ${error}`);
        // 解析失败不影响计时，仅模型名称未知
    }

    // 将需要传递给response脚本的数据打包成对象
    const dataToStore = {
        startTime: new Date().getTime(),
        model: modelName
    };

    // 将对象转换为JSON字符串后存入持久化存储
    $persistentStore.write(JSON.stringify(dataToStore), $request.id);

    // 结束脚本，让请求继续
    $done({});
})();