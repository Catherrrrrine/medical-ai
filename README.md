# 🏥 AI 医疗症状评估系统 MVP

> 输入症状 → AI 分析可能病情 → 结构化输出 + 就医建议

---

## 📌 项目概述

| 项目属性 | 内容 |
|---------|------|
| **目标用户** | 普通用户，有症状但不确定是否需要就医 |
| **核心场景** | 感觉不舒服，不知道可能是什么病，不知道该挂哪个科 |
| **痛点** | 自己查百度容易被吓到、信息杂乱；AI分析不一定准确（已通过免责声明和紧急度提示缓解） |
| **产品形态** | Web 应用（React），可部署也可直接在 Claude Artifact 中运行 |

---

## 🏗️ 技术架构

```
用户输入症状
    │
    ▼
React 前端（症状表单 + 患者信息）
    │
    ▼ HTTP POST
Anthropic Claude API (claude-sonnet-4-20250514)
    │
    ▼ 结构化 JSON
结果展示
├── 严重程度（轻度/中度/重度/紧急）
├── 可能病症列表（含概率）
├── 推荐科室
├── 立即应做 / 需要避免
├── 生活建议
└── 免责声明（强制显示）
```

**技术选型：**
- **前端框架**：React 18 + Hooks（useState）
- **AI 模型**：`claude-sonnet-4-20250514`（Anthropic）
- **输出格式**：JSON（结构化），前端直接渲染
- **部署方式**：Claude.ai Artifact（零配置）/ Vercel / 本地 Create React App

---

## 🚀 启动方式

### 方式一：Claude Artifact（推荐，零部署）
1. 打开 [claude.ai](https://claude.ai)
2. 将 `MedicalAI_MVP.jsx` 的全部代码粘贴给 Claude，要求"运行这个 React 组件"
3. Artifact 会直接在右侧渲染，无需部署

### 方式二：本地 Create React App
```bash
npx create-react-app medical-ai
cd medical-ai
# 将 MedicalAI_MVP.jsx 替换 src/App.jsx
npm start
```

### 方式三：Vite + React
```bash
npm create vite@latest medical-ai -- --template react
cd medical-ai
npm install
# 将 MedicalAI_MVP.jsx 替换 src/App.jsx
npm run dev
```

> ⚠️ 注意：Anthropic API 密钥由 Claude.ai 平台自动注入，本地开发需要配置 API Key（见下方说明）

### 本地配置 API Key
```bash
# .env 文件
REACT_APP_ANTHROPIC_API_KEY=your_api_key_here
```

---

## 📊 AI 输出结构

```json
{
  "severity": "中度",
  "possibleConditions": [
    {
      "name": "上呼吸道感染（感冒）",
      "probability": "高",
      "description": "病毒性感染，常见发热头痛咽痛"
    },
    {
      "name": "流行性感冒",
      "probability": "中",
      "description": "流感病毒感染，症状较普通感冒重"
    }
  ],
  "recommendedDepartment": ["内科", "发热门诊"],
  "urgency": "建议本周内就诊",
  "immediateActions": ["多休息多饮水", "监测体温变化", "若体温超过39度立即就医"],
  "avoidActions": ["自行服用抗生素", "剧烈运动", "接触免疫力低下人群"],
  "lifestyleAdvice": ["保持室内通风", "清淡饮食", "充足睡眠"],
  "disclaimer": "本分析仅供参考，不能替代专业医生的诊断..."
}
```

---

## 🧪 测试样例

### 样例 1：感冒发烧
**输入：** `头痛，体温38.5度，流鼻涕，咽喉疼痛，全身无力，持续3小时`
**预期输出：**
- 严重程度：中度
- 可能病症：上呼吸道感染、流感
- 推荐科室：内科、发热门诊
- 紧急度：建议本周内就诊

### 样例 2：腹部剧痛
**输入：** `右下腹剧烈疼痛，按压更痛，恶心，低烧37.8度，昨天开始逐渐加剧`
**预期输出：**
- 严重程度：重度
- 可能病症：阑尾炎（高概率）
- 推荐科室：急诊外科
- 紧急度：建议今日就诊

### 样例 3：皮肤过敏
**输入：** `手臂颈部红色皮疹，很痒，换了新洗衣液后出现，慢慢扩散`
**预期输出：**
- 严重程度：轻度
- 可能病症：接触性皮炎
- 推荐科室：皮肤科
- 紧急度：可择期就诊

---

## 🔧 排错记录

### 问题：JSON 解析失败
**现象：** `SyntaxError: Unexpected token` 错误
**原因：** Claude API 有时会在 JSON 外包裹 markdown 代码块（```json ... ```）
**解决方案：**
```javascript
const clean = text.replace(/```json|```/g, "").trim();
const parsed = JSON.parse(clean);
```
**教训：** 即使系统提示里说"只返回JSON"，也要做 markdown 清理兜底

---

## 📈 下一步验证方式

1. **用户测试**：招募 10 名目标用户（有过"不知道挂什么科"经历），收集 NPS 和准确度评分
2. **准确率验证**：与执业医师对比 AI 分析结果，记录误差率
3. **挂号功能**：对接微信挂号小程序 API / 医院官网链接
4. **监管合规**：研究《互联网诊疗管理办法》，确认产品边界

---

## 📁 关键文件说明

| 文件 | 说明 |
|------|------|
| `MedicalAI_MVP.jsx` | 核心 React 组件，包含完整 UI + API 调用逻辑 |
| `README.md` | 本文档，项目说明和启动指南 |

---

## 🤝 AI 协作说明

本项目使用 Claude AI 辅助完成：
- **需求拆解**：Claude 帮助梳理产品定位、痛点和技术方案
- **系统提示词设计**：Claude 帮助设计医疗场景的 System Prompt，确保输出格式和安全性
- **代码生成**：React 组件由 Claude 生成，包含错误处理和免责声明
- **架构图**：由 Claude 生成 SVG 架构说明图
- **排错**：JSON 解析问题由 Claude 定位并修复

---

*⚕️ 本项目为技术演示 MVP，不提供真实医疗服务。任何健康问题请咨询专业医生。*
