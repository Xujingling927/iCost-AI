/*
 * Surge脚本：iCost AI服务商监控 - 请求脚本 (v5)
 * 作者：Surge脚本专家
 *
 * 功能：
 * 1. 在HTTP请求发出时触发。
 * 2. 解析请求体JSON，提取'model'名称。
 * 3. 将模型名称和当前时间戳打包成一个JSON对象。
 * 4. 使用请求ID作为键，将此JSON对象存入持久化存储，供response脚本使用。
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
    
    log.info("=== iCost Monitor 请求脚本开始执行 ===");
    log.info(`日志等级: ${LOG_LEVEL.toUpperCase()}`);
    log.debug(`Request URL: ${$request.url}`);
    log.debug(`Request ID: ${$request.id}`);
    log.debug(`Request Method: ${$request.method}`);
    log.debug(`Request Body 存在: ${$request.body ? '是' : '否'}`);
    
    let modelName = "Unknown Model";
    try {
        // 检查并解析请求体
        if ($request.body) {
            log.debug(`Request Body 长度: ${$request.body.length} 字节`);
            const bodyJson = JSON.parse($request.body);
            log.debug("请求体 JSON 解析成功");
            
            if (bodyJson.model) {
                modelName = bodyJson.model;
                log.info(`提取到模型名称: ${modelName}`);
            } else {
                log.debug("请求体中未找到 model 字段");
            }
        } else {
            log.debug("请求体为空");
        }
    } catch (error) {
        log.info(`解析请求体失败 - ${error}`);
        log.debug(`错误堆栈: ${error.stack}`);
        // 解析失败不影响计时，仅模型名称未知
    }

    // 将需要传递给response脚本的数据打包成对象
    const currentTime = new Date().getTime();
    const dataToStore = {
        startTime: currentTime,
        model: modelName
    };

    log.debug(`准备存储数据: ${JSON.stringify(dataToStore)}`);

    // 将对象转换为JSON字符串后存入持久化存储
    const jsonString = JSON.stringify(dataToStore);
    $persistentStore.write(jsonString, $request.id);
    
    // 验证存储是否成功
    const verifyRead = $persistentStore.read($request.id);
    if (verifyRead) {
        log.debug(`数据存储成功，验证读取: ${verifyRead}`);
    } else {
        log.info("警告: 数据存储后立即读取失败");
    }

    log.info("=== iCost Monitor 请求脚本执行完成 ===");

    // 结束脚本，让请求继续
    $done({});
})();