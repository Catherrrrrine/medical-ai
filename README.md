# 🏥 AI 医疗症状评估系统 MVP

> 输入症状 → AI 分析可能病情 → 就医建议

---

## 项目概述

| 项目属性 | 内容 |
|---------|------|
| **目标用户** | 生病用户 |
| **核心场景** | 感觉不舒服，不知道是什么病，不知道该挂哪个科 |
| **痛点** | 自己上网查容易被吓到、信息杂乱；AI分析不一定准确（已通过免责声明和紧急度提示缓解） |
| **产品形态** | Web 应用（React） |

---

## 技术架构

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

## 启动方式

### 本地运行（当前可用，无需 API Key）

需要同时启动前端和后端两个服务。

**第一步：启动后端（新开一个终端）**

```bash
cd server
npm install
node index.js
# 看到 ✅ 后端启动：http://localhost:3001 即成功
```

**第二步：启动前端（再开一个终端）**

```bash
npm install
npm start
# 浏览器自动打开 http://localhost:3000
```

当前版本使用 Mock 数据，无需 API Key，启动即可使用。

---

### 关于 Claude Artifact 运行

直接在Claude中粘贴代码运行会报 `Failed to fetch` 错误，原因是浏览器安全限制不允许前端直接调用外部 API，需要本地后端服务器中转才能正常运行。

---

### 接入真实 AI（可选）

在 `server/index.js` 里替换 Mock 逻辑为真实 API 调用，支持：
- **Anthropic Claude API**：在 [console.anthropic.com](https://console.anthropic.com) 获取 Key

---

## AI 输出结构

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

## 测试样例

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

## 运行录屏

https://drive.google.com/file/d/1HbeaVOmxbsEx1ktZlnpxWI_gjiqN7pkx/view?usp=sharing

---

## 排错记录

**问题1**: 前端报 Failed to fetch

- **原因**: 浏览器不允许直接调用 Anthropic API（跨域限制）

- **解决方案**: 增加 Node.js 后端服务器做中转，前端改为调用 localhost:3001


**问题2**: 后端返回 Unexpected end of JSON input  

- **原因**: API 返回内容为空或格式不符

- **解决方案**: 改用 Mock 数据保证链路跑通，README 说明替代方案


---

## 下一步验证方式

1. **用户测试**：招募 10 名目标用户（有过"不知道挂什么科"经历），收集准确度评分
2. **准确率验证**：与执业医师对比 AI 分析结果，记录误差率
3. **挂号功能**：对接微信挂号小程序 API / 医院官网链接
4. **监管合规**：研究《互联网诊疗管理办法》，确认产品边界

---

## 关键文件说明

| 文件 | 说明 |
|------|------|
| `MedicalAI_MVP.jsx` | 核心 React 组件，包含完整 UI + API 调用逻辑 |
| `README.md` | 本文档，项目说明和启动指南 |

---

## AI 协作说明

本项目全程使用 Claude AI 辅助完成，以下是实际协作过程：

### 需求拆解
提出"医疗评估系统"的模糊想法后，明确目标用户，核心痛点和 MVP 边界，
claude帮助确定产品不做真实诊断、只做症状参考分析的定位，并以免责声明作为解决
"准确性"痛点的方案。

### 代码生成
由 Claude 生成初始 React 组件和 Node.js 后端代码，
自己判断哪些部分需要保留（UI 结构、免责声明逻辑），
哪些需要根据实际情况修改（API 调用方式、结果解析逻辑）。

### 调试与排错
遇到以下问题时向 Claude 描述报错信息，判断方案是否可行再执行：
- `Failed to fetch`：Claude 指出是浏览器跨域限制，
  采纳了增加后端服务器中转的方案
- `Unexpected end of JSON input`：Claude 指出是 JSON 解析失败，
  采纳了清理 markdown 代码块的解决方案
- API 付费问题：尝试了 Dify、Groq等多个免费方案，
  最终判断 Mock 数据是当前阶段最稳定的方案

### 工程判断
AI 给出方案后自己做了以下判断：
- Dify 因免费额度限流放弃
- 最终选择 Mock 数据跑通核心链路，README 说明替代方案，
  符合作业"先跑通核心链路"的要求

### README 整理
由 Claude 生成 README 框架，自己根据实际运行情况修改启动方式、
补充真实排错记录，删除无法实际运行的方式。

---

## 运行说明与限制

本项目需要 AI API 才能运行完整功能。由于 Anthropic API 需要付费账号，
当前版本使用 Mock 数据模拟 AI 返回结果，用于演示核心交互链路。

替代方案：
- Mock 模式：当前默认模式，无需 API Key，直接运行
- 付费模式：在 .env 文件配置 ANTHROPIC_API_KEY 即可接入真实 Claude API

