# iCost-AI

<div align="center">

**智能记账助手 · AI驱动的账单分析工具**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Surge](https://img.shields.io/badge/Surge-Module-orange.svg)](script/iCost_AI_Monitor.sgmodule)
[![iOS](https://img.shields.io/badge/iOS-Shortcuts-green.svg)](https://www.icloud.com/shortcuts/)

</div>

## 📖 项目简介

iCost-AI 是一个基于 AI 大模型的智能记账解决方案，提供以下核心功能：

- 🤖 **智能账单识别**：通过 AI 自动分析账单截图，提取交易信息
- 📊 **自动分类**：智能匹配商家和交易类型，自动归类收支
- 💳 **账户管理**：支持多账户、多币种管理
- 🔄 **转账处理**：专门的转账和还款记录处理
- 📱 **iOS 快捷指令集成**：无缝集成到 iOS 工作流
- 📈 **API 监控**：实时监控 AI 服务商性能和成本

## 🚀 快速开始

### 1. iOS 快捷指令使用

#### 安装快捷指令
1. 在 iOS 设备上打开快捷指令 App
2. 导入 iCost-AI 快捷指令
3. 配置 AI 服务 API 密钥和提示词模板

#### 配置提示词
项目提供两个核心提示词模板：

- **default.md** - 通用账单识别（支出/收入）
- **transfer.md** - 转账/还款记录专用

将提示词内容复制到快捷指令的相应参数中，并替换以下变量：
- `{当前日期}` - 当前交易日期
- `[账户列表]` - 你的账户名称列表
- `[一级支出分类]` - 支出一级分类
- `[二级支出分类]` - 支出二级分类
- `[收入分类]` - 收入分类列表
- `[labelString]` - 标签列表

### 2. Surge 监控模块（可选）

如果你使用 Surge 网络工具，可以安装 AI 服务监控模块，实时追踪 API 调用性能。

详见 [script/README.md](script/README.md)

## 📁 项目结构

```
iCost-AI/
├── prompt/                      # AI 提示词模板
│   ├── default.md              # 通用账单识别提示词
│   └── transfer.md             # 转账还款识别提示词
├── script/                      # Surge 监控脚本
│   ├── iCost_AI_Monitor.sgmodule
│   ├── iCost_request_timer.js
│   ├── iCost_response_monitor.js
│   └── README.md
├── LICENSE
└── README.md
```

## ✨ 核心功能

### 智能账单识别（default.md）

- ✅ 自动识别商家和交易类型
- ✅ 智能匹配分类（优先二级分类）
- ✅ 提取交易金额、优惠金额
- ✅ 多币种支持（CNY、USD 等）
- ✅ 生成交易备注和描述
- ✅ 标签自动关联
- ✅ 账户智能匹配（支持尾号匹配）

### 转账还款处理（transfer.md）

- ✅ 转账双向账户识别
- ✅ 手续费单独记录
- ✅ 信用卡还款识别
- ✅ 账户间资金流转追踪

### API 性能监控（script/）

- ✅ 支持主流 AI 服务商（DeepSeek、SiliconFlow、Gemini 等）
- ✅ 实时监控请求耗时
- ✅ 记录模型使用情况
- ✅ 生成性能通知
- ✅ 分级日志系统（INFO/DEBUG）

## 🎯 支持的 AI 服务商

- DeepSeek
- SiliconFlow
- Volcano Engine（火山引擎）
- Moonshot（月之暗面）
- OpenRouter
- Google Gemini

## 📝 JSON 输出格式

### 通用账单
```json
{
  "results": [
    {
      "category": "餐饮美食",
      "amount": "50.00",
      "time": "12:30",
      "date": "2025-11-05",
      "account": "微信零钱",
      "discount": "5.00",
      "label": "午餐",
      "currency": "CNY",
      "remark": "美团外卖",
      "remarks": ["外卖", "在美团点了外卖", "用微信支付在美团购买午餐"],
      "type": "expense",
      "emoji": "🍱"
    }
  ]
}
```

### 转账记录
```json
{
  "results": [
    {
      "category": "转账交易",
      "type": "transfer",
      "amount": "1000.00",
      "output_account": "招商银行-1234",
      "input_account": "信用卡-5678",
      "account": "招商银行-1234➡️信用卡-5678",
      "discount": "0",
      "fee": "0",
      "currency": "CNY",
      "remark": "信用卡还款",
      "remarks": ["信用卡还款"],
      "date": "2025-11-05",
      "time": "14:30"
    }
  ]
}
```

## 🔧 配置说明

### 账户匹配规则

系统按以下优先级匹配账户：

1. **完整匹配** - 精确匹配账户名称（含符号）
2. **尾号匹配** - 通过卡号后四位匹配
3. **简称匹配** - 通过银行简称匹配（如"招行"→"招商银行"）

⚠️ 如无法匹配，将返回 `❎请选择账户`

### 分类匹配规则

- 优先选择二级分类
- 二级分类无匹配时选择一级分类
- 均无匹配返回 `❎请选择分类`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

[MIT License](LICENSE)

## 🔗 相关链接

- [Surge 官网](https://nssurge.com/)
- [iOS 快捷指令文档](https://support.apple.com/zh-cn/guide/shortcuts/welcome/ios)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！**

</div>
