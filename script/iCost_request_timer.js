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
    console.log("=== iCost Monitor 请求脚本开始执行 ===");
    console.log(`Request URL: ${$request.url}`);
    console.log(`Request ID: ${$request.id}`);
    console.log(`Request Method: ${$request.method}`);
    console.log(`Request Body 存在: ${$request.body ? '是' : '否'}`);
    
    let modelName = "Unknown Model";
    try {
        // 检查并解析请求体
        if ($request.body) {
            console.log(`Request Body 长度: ${$request.body.length} 字节`);
            const bodyJson = JSON.parse($request.body);
            console.log("请求体 JSON 解析成功");
            
            if (bodyJson.model) {
                modelName = bodyJson.model;
                console.log(`提取到模型名称: ${modelName}`);
            } else {
                console.log("请求体中未找到 model 字段");
            }
        } else {
            console.log("请求体为空");
        }
    } catch (error) {
        console.log(`iCost Monitor Request Error: 解析请求体失败 - ${error}`);
        console.log(`错误堆栈: ${error.stack}`);
        // 解析失败不影响计时，仅模型名称未知
    }

    // 将需要传递给response脚本的数据打包成对象
    const currentTime = new Date().getTime();
    const dataToStore = {
        startTime: currentTime,
        model: modelName
    };

    console.log(`准备存储数据: ${JSON.stringify(dataToStore)}`);

    // 将对象转换为JSON字符串后存入持久化存储
    const jsonString = JSON.stringify(dataToStore);
    $persistentStore.write(jsonString, $request.id);
    
    // 验证存储是否成功
    const verifyRead = $persistentStore.read($request.id);
    if (verifyRead) {
        console.log(`数据存储成功，验证读取: ${verifyRead}`);
    } else {
        console.log("警告: 数据存储后立即读取失败");
    }

    console.log("=== iCost Monitor 请求脚本执行完成 ===");

    // 结束脚本，让请求继续
    $done({});
})();