const groups = [
  { name: "基本核心情緒", description: "最基礎、最容易辨認的情緒警示與回應。" },
  { name: "焦慮、受挫與孤立", description: "當進展受阻、結果未知或連結不足時出現。" },
  { name: "評價、美感與社交反應", description: "我們如何觀看他人、事物與自己在社交中的位置。" },
  { name: "內在狀態與需要訊號", description: "提醒自己需要刺激、理解、距離或關懷。" },
  { name: "高強度情緒與行動能量", description: "身體能量大幅提高，需要先辨認安全與方向。" },
  { name: "探索、親密與成就", description: "朝向未知、關係、滿足與完成目標的動力。" },
  { name: "道德、自我肯定與結果反應", description: "對行為、價值、成果與責任的內在評估。" },
  { name: "溫暖與連結", description: "安全地靠近他人、世界與未來的可能。" },
  { name: "失去與低潮", description: "面對失去、無力、意義中斷與長期消耗。" },
  { name: "人際與自我評價", description: "在人際互動中感受到的價值、尊嚴與位置。" },
  { name: "壓力與高張力", description: "刺激、等待、預演與要求超出當前負荷。" },
  { name: "柔和的正向情緒", description: "低張力、安穩而細緻的靠近與接納。" }
];

const emotions = [
  ["高興",1,3.5,2.5],["生氣",1,-3.7,3.4],["難過",1,-3.6,-2.2],["害怕",1,-3.8,3.0],["羞愧",1,-3.3,-0.4],["驚訝",1,0.2,3.6],
  ["急躁",2,-2.5,2.8],["焦慮",2,-3.5,3.1],["委屈",2,-3.0,0.4],["挫折",2,-3.0,1.4],["嫉妒",2,-2.0,1.5],["孤單",2,-3.5,-2.4],
  ["欽佩",3,2.5,1.5],["崇拜",3,2.3,2.6],["欣賞",3,3.0,0.5],["娛樂",3,3.6,2.2],["敬畏",3,0.8,2.8],["尷尬",3,-2.4,2.0],
  ["無聊",4,-2.0,-3.4],["冷靜",4,2.2,-3.5],["困惑",4,-1.3,1.2],["渴望",4,1.3,1.8],["厭惡",4,-3.9,2.1],["同情",4,1.2,0.4],
  ["痛苦",5,-4.5,1.0],["狂喜",5,4.6,4.5],["興奮",5,4.0,4.0],["畏懼",5,-3.5,3.6],["恐怖",5,-4.8,4.6],["興致",5,2.7,2.5],
  ["好奇",6,2.0,2.1],["懷舊",6,0.8,-0.7],["浪漫",6,3.0,1.5],["滿足",6,4.0,-1.8],["性慾",6,2.4,3.1],["勝利",6,4.3,3.5],
  ["鄙視",7,-2.5,1.8],["憤怒",7,-4.3,4.0],["罪惡感",7,-3.2,-0.7],["自豪",7,3.8,2.1],["寬慰",7,3.2,-2.1],["失望",7,-3.5,-1.6],
  ["愛",8,4.3,1.4],["感激",8,3.8,0.9],["信任",8,3.2,-1.0],["安心",8,4.2,-3.2],["希望",8,3.2,1.7],["歸屬感",8,4.0,-0.1],
  ["哀傷",9,-4.2,-3.2],["後悔",9,-3.0,-1.3],["悔恨",9,-4.0,-1.0],["無助",9,-4.2,-2.6],["絕望",9,-4.9,-4.6],["空虛",9,-3.6,-4.1],
  ["屈辱",10,-4.1,2.2],["自卑",10,-3.1,-2.1],["不安全感",10,-3.4,1.0],["被拒絕感",10,-4.0,-1.2],["疏離",10,-3.1,-2.9],["怨恨",10,-4.0,2.7],
  ["煩躁",11,-2.8,2.5],["緊張",11,-1.5,3.1],["擔憂",11,-2.8,2.2],["不安",11,-2.4,1.3],["不耐煩",11,-2.0,2.0],["不知所措",11,-4.1,3.8],
  ["平靜",12,3.0,-4.1],["感動",12,3.1,0.8],["溫柔",12,3.6,-0.5],["喜愛",12,3.3,0.1],["期待",12,3.1,2.2],["釋然",12,3.2,-2.9]
].map(([name, group, valence, arousal]) => ({ name, group, valence, arousal }));

const colors = ["#d77a68", "#b87869", "#8f7aa4", "#80a094", "#c55b4f", "#d39b45", "#6f8eae", "#70a59a", "#6e86a3", "#8c7187", "#c07a5d", "#8f92b4"];
const svg = document.querySelector("#emotion-chart");
const search = document.querySelector("#search");
const groupFilter = document.querySelector("#group-filter");
const reset = document.querySelector("#reset");
const resultCount = document.querySelector("#result-count");
const detail = document.querySelector("#emotion-detail");
const groupCards = document.querySelector("#group-cards");
const NS = "http://www.w3.org/2000/svg";
const plot = { left: 72, top: 58, right: 770, bottom: 700 };

const x = value => plot.left + ((value + 5) / 10) * (plot.right - plot.left);
const y = value => plot.bottom - ((value + 5) / 10) * (plot.bottom - plot.top);
const make = (tag, attrs = {}) => {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
};

function drawFrame() {
  const quadrants = [
    [plot.left, plot.top, x(0)-plot.left, y(0)-plot.top, "rgba(215,122,104,.10)"],
    [x(0), plot.top, plot.right-x(0), y(0)-plot.top, "rgba(211,166,75,.10)"],
    [plot.left, y(0), x(0)-plot.left, plot.bottom-y(0), "rgba(113,153,168,.10)"],
    [x(0), y(0), plot.right-x(0), plot.bottom-y(0), "rgba(127,154,119,.10)"]
  ];
  quadrants.forEach(([rx,ry,w,h,fill]) => svg.append(make("rect", { x:rx, y:ry, width:w, height:h, fill, class:"quadrant-bg", rx: w > 0 ? 18 : 0 })));
  [-2.5, 2.5].forEach(value => {
    svg.append(make("line", { x1:x(value), y1:plot.top, x2:x(value), y2:plot.bottom, class:"grid-line" }));
    svg.append(make("line", { x1:plot.left, y1:y(value), x2:plot.right, y2:y(value), class:"grid-line" }));
  });
  svg.append(make("line", { x1:plot.left, y1:y(0), x2:plot.right, y2:y(0), class:"axis-line" }));
  svg.append(make("line", { x1:x(0), y1:plot.top, x2:x(0), y2:plot.bottom, class:"axis-line" }));
}

function populateControls() {
  groupFilter.innerHTML = '<option value="all">全部 12 組分類</option>' + groups.map((group, index) => `<option value="${index + 1}">第 ${index + 1} 組｜${group.name}</option>`).join("");
  groupCards.innerHTML = groups.map((group, index) => {
    const names = emotions.filter(e => e.group === index + 1).map(e => e.name).join("、");
    return `<article class="group-card"><small>GROUP ${String(index + 1).padStart(2,"0")}</small><h3>${group.name}</h3><p>${group.description}</p><p>${names}</p></article>`;
  }).join("");
}

function labelsFor(items) {
  const labels = items.map((emotion, index) => {
    const px = x(emotion.valence), py = y(emotion.arousal);
    const angle = index * 137.5 * Math.PI / 180;
    return { emotion, px, py, lx:px + Math.cos(angle)*20, ly:py + Math.sin(angle)*20, w:emotion.name.length*14 + 12, h:19 };
  });
  for (let step = 0; step < 190; step += 1) {
    labels.forEach((a, i) => {
      for (let j=i+1; j<labels.length; j+=1) {
        const b=labels[j], dx=b.lx-a.lx || .1, dy=b.ly-a.ly || .1;
        const ox=(a.w+b.w)/2+5-Math.abs(dx), oy=(a.h+b.h)/2+3-Math.abs(dy);
        if (ox>0 && oy>0) { const sx=Math.sign(dx)*ox*.13, sy=Math.sign(dy)*oy*.18; a.lx-=sx; b.lx+=sx; a.ly-=sy; b.ly+=sy; }
      }
      a.lx += (a.px-a.lx)*.008; a.ly += (a.py-a.ly)*.008;
      a.lx = Math.max(plot.left+a.w/2, Math.min(plot.right-a.w/2, a.lx));
      a.ly = Math.max(plot.top+18, Math.min(plot.bottom-16, a.ly));
    });
  }
  return labels;
}

function render() {
  svg.querySelector("#marks")?.remove();
  const marks = make("g", { id:"marks" });
  svg.append(marks);
  const query = search.value.trim();
  const group = groupFilter.value;
  const shown = emotions.filter(e => (group === "all" || e.group === Number(group)) && (!query || e.name.includes(query)));
  resultCount.textContent = `顯示 ${shown.length} / 72`;

  labelsFor(shown).forEach(({ emotion, px, py, lx, ly }) => {
    if (Math.hypot(lx-px, ly-py) > 22) marks.append(make("line", { x1:px, y1:py, x2:lx, y2:ly-4, class:"grid-line" }));
    const dot = make("circle", { cx:px, cy:py, r:9, fill:colors[emotion.group-1], class:"emotion-dot", tabindex:"0", role:"button", "aria-label":emotion.name });
    dot.addEventListener("click", () => selectEmotion(emotion, dot));
    dot.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectEmotion(emotion, dot); } });
    marks.append(dot);
    const label = make("text", { x:lx, y:ly+4, "text-anchor":"middle", class:"emotion-label" });
    label.textContent = emotion.name;
    marks.append(label);
  });
}

function selectEmotion(emotion, dot) {
  svg.querySelectorAll(".emotion-dot.active").forEach(node => node.classList.remove("active"));
  dot.classList.add("active");
  const pleasant = emotion.valence > 1 ? "偏愉快" : emotion.valence < -1 ? "偏不愉快" : "混合／中性";
  const energy = emotion.arousal > 1 ? "高能量" : emotion.arousal < -1 ? "低能量" : "中等能量";
  const level = Math.max(1, Math.min(5, Math.round((emotion.arousal + 5) / 2) + 1));
  detail.style.setProperty("--detail-color", colors[emotion.group-1]);
  detail.innerHTML = `<span class="detail-kicker">GROUP ${String(emotion.group).padStart(2,"0")}</span><h3>${emotion.name}</h3><p>${groups[emotion.group-1].description}</p><div class="detail-meta"><div><span>分類</span><strong>${groups[emotion.group-1].name}</strong></div><div><span>感受方向</span><strong>${pleasant}</strong></div><div><span>身體狀態</span><strong>${energy}</strong></div></div><div class="detail-scale" aria-label="能量程度 ${level} / 5">${[1,2,3,4,5].map(i=>`<span class="${i<=level?'active':''}"></span>`).join("")}</div>`;
}

search.addEventListener("input", render);
groupFilter.addEventListener("change", render);
reset.addEventListener("click", () => { search.value=""; groupFilter.value="all"; render(); search.focus(); });

drawFrame();
populateControls();
render();
