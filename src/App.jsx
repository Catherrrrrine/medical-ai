import { useState } from "react";

const S = { "轻度": { color: "#059669", bg: "#d1fae5", border: "#6ee7b7", icon: "🟢" }, "中度": { color: "#d97706", bg: "#fef3c7", border: "#fcd34d", icon: "🟡" }, "重度": { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5", icon: "🔴" }, "紧急": { color: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd", icon: "🚨" } };
const U = { "可择期就诊": { color: "#059669" }, "建议本周内就诊": { color: "#d97706" }, "建议今日就诊": { color: "#ea580c" }, "立即拨打120": { color: "#dc2626" } };
const CASES = [
  { label: "头痛发烧", text: "我今天下午开始头痛，体温38.5度，有点流鼻涕，咽喉有些疼痛，全身无力，已经持续3个小时了" },
  { label: "腹部疼痛", text: "右下腹突然出现剧烈疼痛，按压时更痛，有恶心感，昨天开始轻微不适，今天加剧，还有低烧37.8度" },
  { label: "皮肤过敏", text: "手臂和颈部出现红色皮疹，很痒，昨天换了新的洗衣液，皮疹慢慢扩散，没有其他症状" },
];

export default function App() {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("未说明");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [history, setHistory] = useState([]);

  async function analyze() {
    if (!symptoms.trim()) return;
    if (!agreed) { setError("请先同意免责声明"); return; }
    setLoading(true); setError(""); setResult(null);
    const msg = `患者信息：${age ? `年龄${age}岁，` : ""}性别${gender}${duration ? `，症状持续${duration}` : ""}\n症状描述：${symptoms}`;
    try {
      const r = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await r.json();
      if (data.error) { setError(data.error); return; }
      setResult(data);
      setHistory(prev => [{ symptoms: symptoms.slice(0, 30) + "...", result: data, time: new Date().toLocaleTimeString("zh-CN") }, ...prev.slice(0, 2)]);
    } catch (e) {
      setError("分析失败：" + e.message);
    } finally {
      setLoading(false);
    }
  }

  const sev = result ? (S[result.severity] || S["中度"]) : null;

  return (
    <div style={{ fontFamily: "'PingFang SC','Microsoft YaHei',sans-serif", maxWidth: 720, margin: "0 auto", padding: "0 0 2rem" }}>
      <div style={{ background: "linear-gradient(135deg,#0f4c81,#1a6baf,#0e7490)", borderRadius: "0 0 20px 20px", padding: "24px 28px", color: "white", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>🏥</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>AI 医疗症状评估</h1>
            <p style={{ margin: 0, fontSize: 13, opacity: .85 }}>基于 Claude AI · 仅供参考 · 不替代专业诊断</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          {CASES.map(c => (
            <button key={c.label} onClick={() => setSymptoms(c.text)}
              style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)", color: "white", borderRadius: 20, padding: "4px 14px", fontSize: 12, cursor: "pointer" }}>
              示例：{c.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ background: "#fefce8", border: "1px solid #fde047", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div style={{ fontSize: 13, color: "#713f12", lineHeight: 1.6 }}>
              <strong>免责声明：</strong>本工具由AI提供症状参考分析，<strong>不能替代</strong>执业医师专业诊断。如遇紧急情况请立即拨打120。
              <div style={{ marginTop: 10 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                  <span>我已了解并同意以上免责条款</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>年龄（可选）</label>
            <input value={age} onChange={e => setAge(e.target.value)} placeholder="如：25" type="number"
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>性别</label>
            <select value={gender} onChange={e => setGender(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}>
              <option>未说明</option><option>男</option><option>女</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>症状持续时间</label>
            <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="如：2天"
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: "#374151", fontWeight: 500, display: "block", marginBottom: 6 }}>症状描述</label>
          <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
            placeholder="请详细描述症状，包括：疼痛位置、程度、何时开始、伴随症状等……"
            rows={4} style={{ width: "100%", padding: "12px", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, lineHeight: 1.6, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
          <div style={{ textAlign: "right", fontSize: 11, color: "#9ca3af" }}>{symptoms.length} 字</div>
        </div>

        <button onClick={analyze} disabled={loading || !symptoms.trim()}
          style={{ width: "100%", padding: "14px", background: loading || !symptoms.trim() ? "#9ca3af" : "#0f4c81", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading || !symptoms.trim() ? "not-allowed" : "pointer" }}>
          {loading ? "🔍 AI 正在分析中…" : "🔍 开始 AI 分析"}
        </button>

        {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 12, marginTop: 14, color: "#991b1b", fontSize: 13 }}>❌ {error}</div>}

        {result && (
          <div style={{ marginTop: 24 }}>
            <div style={{ background: sev.bg, border: `1px solid ${sev.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13, color: sev.color, fontWeight: 500 }}>症状严重程度</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: sev.color }}>{sev.icon} {result.severity}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#6b7280" }}>就医紧急度</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: U[result.urgency]?.color || "#374151" }}>{result.urgency}</div>
              </div>
            </div>

            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 15, color: "#1f2937" }}>🔬 可能的病症</h3>
              {result.possibleConditions?.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#f9fafb", borderRadius: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{["1️⃣","2️⃣","3️⃣"][i]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{c.description}</div>
                  </div>
                  <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 12, background: c.probability === "高" ? "#fee2e2" : c.probability === "中" ? "#fef3c7" : "#f0fdf4", color: c.probability === "高" ? "#dc2626" : c.probability === "中" ? "#d97706" : "#059669", fontWeight: 600 }}>{c.probability}概率</span>
                </div>
              ))}
            </div>

            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 15, color: "#1f2937" }}>🏥 推荐就诊科室</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {result.recommendedDepartment?.map((d, i) => (
                  <span key={i} style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 500 }}>{d}</span>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 14 }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 13, color: "#166534" }}>✅ 应立即做</h4>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {result.immediateActions?.map((a, i) => <li key={i} style={{ fontSize: 12, color: "#166534", marginBottom: 4, lineHeight: 1.5 }}>{a}</li>)}
                </ul>
              </div>
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 14 }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 13, color: "#991b1b" }}>❌ 需要避免</h4>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {result.avoidActions?.map((a, i) => <li key={i} style={{ fontSize: 12, color: "#991b1b", marginBottom: 4, lineHeight: 1.5 }}>{a}</li>)}
                </ul>
              </div>
            </div>

            {result.lifestyleAdvice?.length > 0 && (
              <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, marginBottom: 14 }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 13, color: "#374151" }}>💡 生活建议</h4>
                {result.lifestyleAdvice.map((a, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#4b5563", paddingLeft: 12, borderLeft: "3px solid #93c5fd", lineHeight: 1.6, marginBottom: 4 }}>{a}</div>
                ))}
              </div>
            )}

            <div style={{ background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
              📋 <strong>免责：</strong>{result.disclaimer}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: 24, borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
            <h4 style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 10px", fontWeight: 500 }}>历史查询</h4>
            {history.map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#f9fafb", borderRadius: 8, fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: "#374151" }}>{h.symptoms}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ color: S[h.result.severity]?.color || "#374151", fontWeight: 600 }}>{h.result.severity}</span>
                  <span style={{ color: "#9ca3af" }}>{h.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
