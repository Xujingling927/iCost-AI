# iCost AI 监控脚本

<div align="center">

**AI 服务性能监控 · Surge 脚本模块**

[![Surge](https://img.shields.io/badge/Surge-5.0+-orange.svg)](https://nssurge.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/)

</div>

## 📖 简介

iCost AI 监控脚本是一套专为 Surge 网络工具设计的监控模块，用于实时追踪 AI 大模型服务商的 API 性能、请求耗时和使用情况。

### 核心功能

- 📊 **实时性能监控** - 精确测量每次 API 请求的响应时间
- 🤖 **模型识别** - 自动提取并记录使用的 AI 模型
- 🏢 **多服务商支持** - 覆盖主流 AI 服务提供商
- 📱 **通知推送** - 通过 Surge 通知展示监控结果
- 🔍 **分级日志** - 支持 INFO/DEBUG 两级日志输出
- ⚡ **性能分析** - 计算平均处理时间和效率指标

## 🎯 支持的服务商

| 服务商 | 域名 | 说明 |
|--------|------|------|
| **DeepSeek** | `api.deepseek.com` | DeepSeek AI |
| **SiliconFlow** | `api.siliconflow.cn` | 硅基流动 |
| **Volcano Engine** | `ark.cn-beijing.volces.com` | 火山引擎 |
| **Moonshot** | `api.moonshot.cn` | 月之暗面 Kimi |
| **OpenRouter** | `openrouter.ai` | OpenRouter |
| **Google Gemini** | `generativelanguage.googleapis.com` | Google Gemini |

## 🚀 快速开始

### 安装方式

#### 方法一：直接安装模块（推荐）

1. 打开 Surge App
2. 进入"模块"页面
3. 点击"安装新模块"
4. 从 URL 安装：
```
https://raw.githubusercontent.com/Xujingling927/iCost-AI/refs/heads/main/script/iCost_AI_Monitor.sgmodule
```

#### 方法二：手动配置

在 Surge 配置文件中添加：

```ini
[Script]
# 请求脚本
iCost_Request_Timer = type=http-request, pattern=^https?://(api\.deepseek\.com/chat/completions|api\.siliconflow\.cn/v1/chat/completions|ark\.cn-beijing\.volces\.com/api/v3/chat/completions|openrouter\.ai/api/v1/chat/completions|api\.moonshot\.cn/v1/chat/completions|generativelanguage\.googleapis\.com/v1beta/openai/chat/completions), requires-body=true, max-size=3145728, script-path=https://raw.githubusercontent.com/Xujingling927/iCost-AI/refs/heads/main/script/iCost_request_timer.js, timeout=30, argument=log_level=info

# 响应脚本
iCost_Response_Monitor = type=http-response, pattern=^https?://(api\.deepseek\.com/chat/completions|api\.siliconflow\.cn/v1/chat/completions|ark\.cn-beijing\.volces\.com/api/v3/chat/completions|openrouter\.ai/api/v1/chat/completions|api\.moonshot\.cn/v1/chat/completions|generativelanguage\.googleapis\.com/v1beta/openai/chat/completions), requires-body=true, max-size=3145728, script-path=https://raw.githubusercontent.com/Xujingling927/iCost-AI/refs/heads/main/script/iCost_response_monitor.js, timeout=30, argument=log_level=info
```

### MITM 配置

确保在 Surge 的 MITM 设置中添加以下域名：

```ini
[MITM]
hostname = %APPEND% api.deepseek.com, api.siliconflow.cn, ark.cn-beijing.volces.com, openrouter.ai, api.moonshot.cn, generativelanguage.googleapis.com
```

## 📁 文件说明

### iCost_AI_Monitor.sgmodule
Surge 模块配置文件，包含完整的脚本引用和 MITM 配置。

### iCost_request_timer.js (v5)
**请求拦截脚本** - 在 HTTP 请求发出时触发

**功能：**
- 解析请求体，提取模型名称
- 记录请求开始时间戳
- 将数据存入持久化存储
- 输出请求相关日志

### iCost_response_monitor.js (v5)
**响应监控脚本** - 在 HTTP 响应返回时触发

**功能：**
- 读取请求时存储的数据
- 识别 AI 服务商
- 解析响应内容（支持 Markdown 格式 JSON）
- 计算总耗时和平均耗时
- 发送监控通知
- 输出分析日志

## 🔧 配置选项

### 日志等级

脚本支持两个日志等级，通过 `argument` 参数配置：

#### INFO 模式（默认）
```ini
argument=log_level=info
```

**输出内容：**
- ✅ 脚本执行状态
- ✅ 模型名称
- ✅ 服务商识别
- ✅ 请求耗时
- ✅ 生成记录数量
- ✅ 错误和警告

**示例日志：**
```
[INFO] === iCost Monitor 请求脚本开始执行 ===
[INFO] 日志等级: INFO
[INFO] 提取到模型名称: deepseek-chat
[INFO] === iCost Monitor 请求脚本执行完成 ===
```

#### DEBUG 模式
```ini
argument=log_level=debug
```

**额外输出：**
- 🔍 请求 URL 和 ID
- 🔍 请求方法和 Body 长度
- 🔍 JSON 解析过程
- 🔍 数据存储验证
- 🔍 响应体详细信息
- 🔍 错误堆栈信息

**示例日志：**
```
[INFO] === iCost Monitor 请求脚本开始执行 ===
[INFO] 日志等级: DEBUG
[DEBUG] Request URL: https://api.deepseek.com/chat/completions
[DEBUG] Request ID: ABC123XYZ
[DEBUG] Request Method: POST
[DEBUG] Request Body 存在: 是
[DEBUG] Request Body 长度: 1024 字节
[DEBUG] 请求体 JSON 解析成功
[INFO] 提取到模型名称: deepseek-chat
[DEBUG] 准备存储数据: {"startTime":1730793600000,"model":"deepseek-chat"}
[DEBUG] 数据存储成功，验证读取: {"startTime":1730793600000,"model":"deepseek-chat"}
[INFO] === iCost Monitor 请求脚本执行完成 ===
```

### 切换日志等级

编辑模块文件 `iCost_AI_Monitor.sgmodule`，修改 `argument` 参数：

```ini
# 简洁模式（生产环境推荐）
argument=log_level=info

# 详细模式（调试和排查问题时使用）
argument=log_level=debug
```

## 📊 监控通知格式

监控结果会通过 Surge 通知展示：

```
标题：🤖 iCost AI 服务监控
副标题：DeepSeek | deepseek-chat
内容：请求耗时: 1234 ms
     生成记录: 10 条, 平均: 123.40 ms/条
```

### 通知字段说明

| 字段 | 说明 |
|------|------|
| **服务商** | 识别的 AI 服务提供商名称 |
| **模型** | 本次请求使用的 AI 模型 |
| **请求耗时** | 从请求发出到响应返回的总时间（毫秒） |
| **生成记录** | 本次请求生成的结果数量 |
| **平均耗时** | 单条记录的平均处理时间 |

## 🔍 工作原理

### 执行流程

```
┌─────────────────┐
│  发起 API 请求  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ iCost_request_timer.js  │
│ - 提取模型名称          │
│ - 记录开始时间          │
│ - 存入持久化存储        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────┐
│  请求发送到服务器 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  服务器响应返回  │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ iCost_response_monitor.js│
│ - 读取存储的数据         │
│ - 识别服务商             │
│ - 解析响应内容           │
│ - 计算耗时               │
│ - 发送通知               │
└──────────────────────────┘
```

### 数据存储格式

**Request 阶段存储：**
```json
{
  "startTime": 1730793600000,
  "model": "deepseek-chat"
}
```

**Response 阶段读取并清理**

## ⚙️ 技术细节

### 兼容性

- **Surge 版本**：5.0+
- **脚本类型**：HTTP Request / HTTP Response
- **最大请求体**：3145728 字节（3MB）
- **超时时间**：30 秒

### 特性支持

#### Markdown 格式 JSON 解析
脚本自动识别并解析 Markdown 代码块中的 JSON：

```markdown
```json
{
  "results": [...]
}
```
```

#### 服务商自动识别
通过 URL 模式匹配自动识别服务商：

```javascript
const providerMap = {
    deepseek: "DeepSeek",
    siliconflow: "SiliconFlow", 
    volces: "Volcano Engine",
    openrouter: "OpenRouter",
    moonshot: "Moonshot",
    google: "Gemini"
};
```

## 📝 版本历史

### v5 (2025-11-05)
- ✨ 新增日志等级支持（INFO/DEBUG）
- ✨ 优化日志输出格式
- 🐛 改进错误处理和日志信息

### v4
- ✨ 支持多家 AI 服务商
- ✨ 从请求脚本获取模型名称
- ✨ 自动识别服务商
- ✨ Markdown 格式 JSON 兼容

## 🐛 故障排查

### 问题：没有收到监控通知

**检查项：**
1. ✅ MITM 是否正确配置对应域名
2. ✅ 脚本是否正确安装和启用
3. ✅ Surge 通知权限是否开启
4. ✅ 查看日志输出是否有错误信息

### 问题：日志输出过多

**解决方案：**
- 将日志等级改为 `info`
- 或关闭 Surge 控制台的详细日志

### 问题：模型名称显示为 Unknown Model

**可能原因：**
- 请求体格式不标准
- 请求体中缺少 `model` 字段
- 请求体解析失败

**排查方法：**
- 开启 `debug` 日志查看详细信息
- 检查请求体 JSON 格式

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

[MIT License](../LICENSE)

## 🔗 相关链接

- [主项目 README](../README.md)
- [Surge 官方文档](https://manual.nssurge.com/)
- [Surge 脚本开发指南](https://manual.nssurge.com/scripting/common.html)

---

<div align="center">

**让 AI 成本清晰可见 · 让性能尽在掌握**

</div>
