/*
 * Surge脚本：iCost AI服务商监控 - 响应脚本 (v5)
 * 作者：Surge脚本专家
 *
 * v4更新：
 * - 支持多家服务商 (DeepSeek, SiliconFlow, Volcano Engine、Moonshot、OpenRouter、Gemini等)
 * - 从request脚本获取模型名称，并在通知中展示。
 * - 自动根据URL判断服务商名称。
 * 
 * v5更新：
 * - 支持日志等级变量log_level (info/debug)
 */

(function() {
    // 日志等级配置: "info" 或 "debug"，默认为 "info"
    // 可通过 $argument 传入，格式: log_level=debug
    const LOG_LEVEL = (() => {
        if ($argument) {
            const match = $argument.match(/log_level=(info|debug)/i);
            if (match) return match[1].toLowerCase();
        }
        return "info";
    })();
    
    // 日志输出函数
    const log = {
        info: (msg) => {
            console.log(`[INFO] ${msg}`);
        },
        debug: (msg) => {
            if (LOG_LEVEL === "debug") {
                console.log(`[DEBUG] ${msg}`);
            }
        }
    };
    
    log.info("=== iCost Monitor 响应脚本开始执行 ===");
    log.info(`日志等级: ${LOG_LEVEL.toUpperCase()}`);
    log.debug(`Request URL: ${$request.url}`);
    log.debug(`Request ID: ${$request.id}`);
    
    // 1. 读取并解析来自request脚本的数据
    const rawData = $persistentStore.read($request.id);
    log.debug(`读取到的原始数据: ${rawData ? '存在' : '不存在'}`);
    
    $persistentStore.write(null, $request.id); // 清理数据

    if (!rawData) {
        log.info("未找到对应的请求开始数据");
        $done({});
        return;
    }

    const storedData = JSON.parse(rawData);
    const startTimeMs = storedData.startTime;
    const modelName = storedData.model;
    log.info(`模型: ${modelName}`);
    log.debug(`开始时间: ${startTimeMs}`);

    // 2. 判断服务商
    const providerMap = {
        deepseek: "DeepSeek",
        siliconflow: "SiliconFlow", 
        volces: "Volcano Engine",
        openrouter: "OpenRouter",
        moonshot: "Moonshot",
        google: "Gemini"
    };
    
    const providerName = Object.entries(providerMap)
        .find(([key]) => $request.url.includes(key))?.[1] || "Unknown Provider";
    
    log.info(`服务商: ${providerName}`);

    // 3. 解析响应体并计算
    if (!$response.body) {
        log.info("响应体为空");
        $done({});
        return;
    }

    log.debug(`响应体长度: ${$response.body.length} 字节`);

    try {
        const responseJson = JSON.parse($response.body);
        log.debug(`响应JSON解析成功, choices数量: ${responseJson.choices?.length || 0}`);
        
        if (!responseJson.choices || responseJson.choices.length === 0) {
            log.info("choices 为空或不存在");
            $done({});
            return;
        }

        const contentStr = responseJson.choices[0].message.content;
        log.debug(`内容字符串长度: ${contentStr?.length || 0}`);
        
        // 增加对Markdown格式JSON的兼容处理
        let jsonString = contentStr;
        const markdownJsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
        const match = contentStr.match(markdownJsonRegex);
        
        // 如果匹配到Markdown代码块,则提取其中的内容作为JSON字符串
        if (match && match[1]) {
            jsonString = match[1];
            log.debug("检测到Markdown格式,已提取JSON内容");
        }
        
        let contentJson;
        try {
            contentJson = JSON.parse(jsonString);
            log.debug("内容JSON解析成功");
        } catch (parseError) {
            log.info(`解析内容字符串失败 - ${parseError}`);
            $notification.post("🤖 iCost AI 服务监控", `${providerName} | ${modelName}`, `内容字符串解析错误: ${parseError}`);
            $done({});
            return;
        }

        let resultCount = 0;
        if (contentJson.results && Array.isArray(contentJson.results)) {
            resultCount = contentJson.results.length;
        }
        log.debug(`结果数量: ${resultCount}`);

        const totalDuration = new Date().getTime() - startTimeMs;
        
        let avgTimePerResult = 0;
        if (resultCount > 0) {
            avgTimePerResult = totalDuration / resultCount;
        }

        // 4. 构建并发送新的通知
        const notificationTitle = "🤖 iCost AI 服务监控";
        const notificationSubtitle = `${providerName} | ${modelName}`;
        const notificationBody = `请求耗时: ${totalDuration} ms \n生成记录: ${resultCount} 条, 平均: ${avgTimePerResult.toFixed(2)} ms/条`;

        $notification.post(notificationTitle, notificationSubtitle, notificationBody);
        log.info(`${notificationSubtitle}, 耗时: ${totalDuration} ms, 记录: ${resultCount} 条`);
        log.info("=== iCost Monitor 响应脚本执行完成 ===");

    } catch (error) {
        log.info(`解析响应体失败 - ${error}`);
        log.debug(`错误堆栈: ${error.stack}`);
        $notification.post("🤖 iCost AI 服务监控", `${providerName} | ${modelName}`, `脚本执行错误: ${error}`);
    } finally {
        $done({});
    }
})();