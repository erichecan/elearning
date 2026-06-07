# AAC 沟通软件循证设计研究报告

> 生成日期：2026-06-06
> 方法：多源联网检索 → 抓取 26 个来源 → 提取 117 条可证伪结论 → 对其中 25 条做 3 票对抗性验证（2/3 反驳才否决）→ 合成。另对原始问题中未被首轮覆盖的缺口做了定向补充检索（标注为"补充检索，未对抗验证"）。
> 适用对象：本项目（Audrey 2.0，面向自闭症儿童的 AAC + flashcard + 日程 + 奖励）。

## 可信度分档说明

| 档位 | 含义 |
|------|------|
| 🟢 **强证据** | 多个同行评议系统综述/meta 分析，一致裁定（首轮 3 票对抗验证通过） |
| 🟡 **有限证据** | 单一/小样本研究，或受试为典型发育儿童需外推，或结果混合 |
| 🔵 **专家/机构共识** | 权威机构指南或开发者实施指南，非 RCT |
| ⚪ **商业实践** | 产品官网/评测数据，弱设计研究，仅供方向参考 |
| ⚠️ **补充检索** | 本轮单次搜索/抓取得到，未经对抗验证，引用前建议复核原文 |

---

## 0. 一句话结论

**循证支持为自闭症儿童尽早提供"始终可见的健壮词汇 + 固定位置"的 AAC；最大的产品风险是你们当前规划里的"AI 自动重排 / 动态推荐改变词汇位置"——它与运动规划证据直接冲突，应改为"位置永远固定、AI 只做高亮不挪位"。**

---

## 1. 总体科学结论（问题 8）

### 🟢 AAC 不会阻碍口语发展，多数研究显示口语有"适度"提升
- Millar/Light/Schlosser（2006）综述：23 项研究/67 人，6 项达最高方法学严格度共 27 个案；**在 27 个严格分析个案中 89% 言语提升、11% 无变化、0% 下降**。
- Schlosser & Wendt（2008，自闭症专项）：AAC 不阻碍言语产出，多数研究显示提升，但增益**"适度"**（应对家长/临床设定现实预期）。
- Yuan 等（2024）18 项语音生成设备（SGD）研究/108 人：**87%（95 人）发声/言语改善，无一研究报告下降**。
- 限制：增益多为适度、多基于单受试设计而非 RCT，无证据表明 AAC 会"加速"口语。
- 来源：[Millar 2006 (JSLHR)](https://pubs.asha.org/doi/abs/10.1044/1092-4388(2006/021))、[Schlosser & Wendt 2008 (AJSLP)](https://pubs.asha.org/doi/abs/10.1044/1058-0360(2008/021))、[ASHA 早期干预](https://www.asha.org/practice/early-intervention-provider-support/augmentative-and-alternative-communication-in-early-intervention/)
- ⚠️ 引用更正：27 个案 89%/11%/0% 这组数据，DOI 归属需在正式引用时核对（Millar 2006 与 Schlosser & Wendt 2008 是两篇不同论文，勿混用同一 DOI）。

### 🔵 没有"年龄太小"，也没有"先决技能"门槛（ASHA 立场）
- ASHA 逐字：*"There is no too young of an age for AAC. ... There are no prerequisites for considering or introducing AAC, including ... young children."*
- 这取代了已被否定的 1970-80 年代"候选资格/先决技能"模型。
- **对产品的硬约束**：不应设置能力门槛或"解锁先决条件"才给词汇。
- 来源：[ASHA 早期干预](https://www.asha.org/practice/early-intervention-provider-support/augmentative-and-alternative-communication-in-early-intervention/)

---

## 2. 交互设计（问题 1）

### 🟢 固定符号位置支持运动规划 —— 本报告对产品最重要的结论
- Thistle 等（2018, AJSLP）：学龄前儿童，一致布局 vs 每次变位，第 1 次训练无差异，但**到第 5 次一致布局组定位显著更快**。
- LAMP（Language Acquisition through Motor Planning）整套方法即建立在"一致运动模式/运动自动化支持语言习得"之上。
- **设计含义**：核心词必须固定位置、**不要自动重排、不要让 AI 改变词的位置**——变动会破坏正在形成的运动规划。
- 注意：Thistle 受试为典型发育学龄前儿童，外推到自闭症人群需谨慎（作者亦呼吁在 AAC 使用者中重复验证）。
- 来源：[Thistle 2018 (AJSLP)](https://pubs.asha.org/doi/abs/10.1044/2018_AJSLP-17-0129)、[LAMP 原理](https://www.tandfonline.com/doi/full/10.1080/2331186X.2015.1045807)

### ⚠️ 网格密度（grid size）：不按"认知能力"分级，而按"能看见+能点到"分级（补充检索）
- AssistiveWare 立场（与 LAMP/Proloquo 理念一致）：*"基于 AAC 用户能看到和能触碰的，而非基于认知能力、接受性语言或我们认为他能做什么"* 来选网格大小。
- 主张**优先用大网格**（一屏更多语言、减少翻页）；对运动/视觉障碍者，建议先尝试 7 种适配（更大屏 12.9″、支架、触控笔、调间距/对比度、扫描、按住时长）**再考虑缩小网格**。
- 提到的具体网格：5×9（45 格）、7×11（77 格）等。
- 与你们 PRD"2×2 至 10×10 按能力分级"略有张力：循证主流是**不要因为"觉得孩子能力不够"就给小网格**，而是默认给健壮词汇、用适配手段保住大网格。
- 来源：[AssistiveWare: Choosing a grid size](https://www.assistiveware.com/learn-aac/choosing-a-grid-size)

### ⚠️ Fitzgerald Key 配色：是惯例，不是疗效证据（补充检索）
- Modified Fitzgerald Key 用颜色编码词性（常见：**动词=绿、代词=黄、名词=橙**，但各家有差异）。
- 关键发现：**没有研究证据证明配色提升沟通效果**；来源明确说"对某些用户有益、对另一些没差别"，强调"选定一套后保持一致"比选哪套更重要。
- 设计含义：可以用 Fitzgerald 配色（行业惯例、利于一致性），但别把它当成循证卖点；**一致性 > 具体配色方案**。
- 来源：[Communication Community: Fitzgerald Key](https://www.communicationcommunity.com/fitzgerald-key-for-aac/)

### 点击到发声延迟 / 按住防误触阈值
- **本轮未找到可靠的循证量化阈值**（PRD 里的"<200ms 发声""按住 0.5 秒"是合理工程默认值，但目前查不到专门的循证出处）。列入"开放问题"，需检索 AAC 访问/运动控制专项文献。

---

## 3. 词汇量（问题 2）

### 🔵 / ⚪ 主流系统词汇规模对照（补充检索）
| 系统 | 规模 | 性质 |
|------|------|------|
| **Universal Core / Project Core** | **36 词**（可单独或组合使用） | 🟢 联邦资助、循证"通用核心"标准参考 |
| Banajee 2003 toddler 核心词 | **9 个普遍词**（所有 50 名幼儿跨场景都用） | 🟡 toddler 实证 |
| DLM First 40 | 40 词（常引，本轮未独立核验） | ⚪ |
| **LAMP Words for Life** | 1-hit = **84 核心词**；Full = **数千词**（含 +s/+er/+est） | ⚪ 84 键单击布局 |
| **Proloquo2Go / Proloquo** | 大词汇量（常引 ~7000+），Crescendo 系统，多数词 1 击可达 | ⚪ |
| TouchChat with WordPower | 多版本：20/42/48/60/80/108/140 键 | ⚪ |
| TD Snap | Motor Plan 66（MP30/40/66 共享词汇）等 | ⚪ |
| Avaz | 60 / 117 网格等 | ⚪ |
| CoughDrop | Quick Core 60 / 112 等 | ⚪ |
| PODD | 60 Complex Syntax 等多种 | ⚪ |
- 来源：[Project Core](https://project-core.com/communication-systems/)、[LAMP/Proloquo 对比 (TherapyWorks/AssistiveWare)](https://www.assistiveware.com/blog/how-is-proloquo-efficient)、[AbleNet App 对比指南](https://support.ablenetinc.com/speech-apps/app-comparison-guide/)、[Banajee 2003 (AAC 19:2)](https://www.tandfonline.com/doi/abs/10.1080/0743461031000112034)

### ⚠️ "核心词占日常用语 80%"的真正出处（补充检索）
- 该说法最常追溯到 **Vanderheiden & Kelso（1987）**："with a few hundred words, a person can say over 80% of what is needed"。
- 后续变体：约 **200 词**占日常约 80%，或 **400-500 词**占约 80%。
- **注意**：你们 `CORE_WORDS_BRIEF.md` 把 80% 归到 ASHA Practice Portal，那是**二手转引**；原始出处是 Vanderheiden & Kelso 1987（建议在文档里更正归因）。
- 来源：[Vanderheiden & Kelso 1987 (经 AAC 文献转引)](https://aacinstitute.org/core-vocabulary-and-the-aac-performance-report/)、[British National Corpus 核心词研究 (JSLHR 2021)](https://pubs.asha.org/doi/abs/10.1044/2021_JSLHR-21-00211)

### 🔵 全量 vs 逐步解锁：默认应给"始终可见的健壮词汇"
- Project Core 在**符号网格路径**推荐学生**全天可访问全部 36 词**；只有在 3D/触觉（盲/视障）路径才逐步引入符号。
- **设计含义**：健壮词汇应默认始终可见；"逐步解锁页面集"缺乏强证据，仅在特定低视觉学习者中作为教学排序。这是开发者实施指南（非 RCT）。
- 来源：[Project Core](https://project-core.com/communication-systems/)

### 🟡 但"核心词专门干预"本身证据较弱 → 选词要个体化
- Carnett, Devine 等（2023 系统综述）：仅找到 **10 项**核心词 AAC 干预研究，**60% 结果混合、仅 40% 阳性**，"缺乏强证据"。
- 明确建议：**个体化选择沟通目标 + 教多种词类**，而非套用一套固定核心集（固定集无法兼顾个体先决技能、偏好、当前需求）。
- **设计含义**：给核心词的同时，必须给**可个体化配置的边缘词（fringe）**——这正好对应你们的 `context | custom` 词汇类型，方向对。
- 来源：[Carnett 2023 (Review J. Autism Dev. Disord.)](https://link.springer.com/article/10.1007/s40489-023-00399-x)

---

## 4. 句子 / 短语（问题 3）

### ⚠️ 预存整句 vs 逐词造句：两者都要，但预存句"只能是补充，不能替代"（补充检索）
- 预存短语**提升沟通速度**（AAC 用户造句速度常 < 口语的 10%，预存句缩小差距），适合可预测/社交/紧急场景。
- 但临床共识：预存消息**"总是作为词汇造句的补充，绝不取代"**——因为逐词造句给使用者更多自主控制、更利于语言发展。
- 词预测（word prediction）研究提示：减少按键不一定提升整体速度，因为**额外认知负荷**可能抵消收益，效果取决于预测准确度。
- **设计含义**：句子条（sentence strip）逐词造句应是**主路径**；预存"快捷短语"作为加速补充，数量不必多，聚焦高频社交/紧急（要、不要、帮我、停、你好、谢谢、上厕所等）。
- 来源：[PrAACtical AAC: 预存消息](https://praacticalaac.org/featured-posts/praactical-considerations-prestored-messages-in-aac-part-1/)、[Word prediction & communication rate (Trnka 等 2008)](https://www.eecis.udel.edu/~mccoy/publications/2008/trnka08at.pdf)

---

## 5. 动态 vs 静态（问题 4）—— ⚠️ 产品高风险点

### 🟢（间接）+ ⚠️ 结论：位置要静态，"动态"只能用于不挪位的辅助
- 直接支持固定布局：Thistle 2018（固定位置利于运动规划，见 §2）。
- Drager 2004：**初次接触所有动态显示都很难**（典型发育 3 岁儿童）。
- 词预测研究：自动预测/重排带来**认知负荷**，速度收益不确定。
- **未找到**直接对比"AI 自动重排/预测 vs 固定布局对自闭症儿童运动规划影响"的实验——这是明确的**证据空白**。
- **给本项目的明确建议**：
  - ✅ 可以做：AI **高亮**推荐词（不挪位）、自动朗读、按场景**显示/隐藏**整组 fringe 词。
  - ❌ 不要做：AI 自动**重排核心词位置**、让核心词网格每次"动态变化"、拖动排序后位置漂移。
  - 你们 PRD 的"Core Words 固定位置 + 运动记忆锁定 + AI 推荐只高亮不改位置"方向**正确**；但"Context-Aware 预测"和"网格支持拖动排序"要小心——**排序一旦改，运动记忆就废了**，拖动排序应仅限家长配置阶段、且改后全局固定。
- 来源：[Thistle 2018](https://pubs.asha.org/doi/abs/10.1044/2018_AJSLP-17-0129)、[Drager 2004 (JSLHR)](https://pubs.asha.org/doi/full/10.1044/1092-4388(2004/084))

---

## 6. 场景 / 情境与 VSD（问题 5）

### 🟢 视觉场景显示（VSD）对 3-8 岁自闭症幼儿是循证实践（EBP）
- Patenaude, McNaughton & Liang（2025, JSET）按 CEC 单受试质量标准：14 项研究中 12 项达全部 8 指标，42 名参与者中 **37 名（88%）阳性、0 名负向**，超过 EBP 门槛；NAP 效应量 71%-100%。结论：VSD **"can be considered an EBP"**。
- 注意：基数仍不大（42 人），范围限定于早教社交活动中的沟通。
- 来源：[Patenaude 2025 (JSET)](https://journals.sagepub.com/doi/10.1177/01626434241263061)

### 🟡 VSD 对幼儿初期优于网格
- Drager 2004：典型发育 3 岁儿童，4 次训练累计词汇增益 **情境场景（VSD）7.0 词 > 图式网格 5.5 > 分类网格 3.4**。
- 受试为典型发育儿童、显著效应为交互效应，属有限证据。
- ❌ 被否决的说法（0-3 票，**已剔除**）："在直接对比中 VSD 普遍优于网格 SGD"——证据不支持这个过强表述（多数对比无显著差异）。
- 来源：[Drager 2004](https://pubs.asha.org/doi/full/10.1044/1092-4388(2004/084))、[Light 等 2019 state-of-science](https://pmc.ncbi.nlm.nih.gov/articles/PMC6436972/)

### 🟢 显示范式的标准分类
- 读写前儿童两类主流显示：**VSD** 与 **网格（grid）**；二者可混合（hybrid）。
- **设计含义**：你们的"at home / at school 场景照片 + VSD 热区"对应 VSD 范式，有循证定位；**理想是 hybrid**——幼儿/低能力用 VSD 切入，固定核心词网格始终保留。
- 来源：[Light 等 2019 (AAC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6436972/)

---

## 7. 与 flashcard 结合（问题 6）

### 🟢 AAC + 自然主义干预（NDBI）效果更好
- Pope, Light & Laubscher（2024, JADD）系统综述+meta 分析，29 项研究："把 aided AAC 纳入 NDBI 时，效应量明显大于不含 AAC 的 NDBI"，结论"combining AAC with NDBI ... may lead to better language outcomes"。
- 来源：[Pope 2024 (JADD)](https://pubmed.ncbi.nlm.nih.gov/38848009/)

### 🟡 辅助输入（aided language modeling）：有效但不稳定，且必须打包使用
- O'Neill, Light & McNaughton（2021）系统综述（99 个单受试设计）：辅助输入在 **69.2%** 设计中优于对照——"有效但不稳定"；对**年幼、接受性语言较强**者更有效。
- Chazin 等（2021）：**打包式多组分干预 76.7% 有效 vs 单独技术 44.4%**。
- **设计含义（关键）**：flashcard **不能是孤立的闪卡刷词**。循证做法是把它做成"辅助语言示范"——大人/系统在**真实沟通情境**中边说边点 AAC 符号，flashcard 学的词要能**立刻在句子条里用出来**。即 flashcard ↔ AAC 词库要**打通同一套符号/词条**，学完即用、用中即学。
- 来源：[O'Neill 2021 (AJSLP)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10110354/)

---

## 8. 商业产品对照（问题 7）

| 产品 | 词汇/布局 | 循证基础 | 采用/数据 |
|------|-----------|----------|-----------|
| Proloquo2Go (AssistiveWare) | Crescendo，大词汇量，多数词 1 击 | 设计有研究支撑，官网为主 | 市场份额大 ⚪ |
| LAMP Words for Life | 84 核心键（1-hit）→ Full 数千词 | LAMP 运动规划原理 🟢；n=8 疗效研究为弱设计 ⚪ | 自闭症人群常用 |
| TouchChat + WordPower | 20-140 键多版本 | WordPower 词频设计 | 广泛 |
| TD Snap (Tobii Dynavox) | Motor Plan 66 等 + Core First | 含 VSD/PCS | 广泛 |
| Avaz | 60/117 网格 | 词频/形态学 | — |
| CoughDrop | Quick Core 60/112，开源云端 | 开放 | — |
| PODD (Gayle Porter) | 60 等，纸/电子 | 语用组织成熟临床法 🔵 | 临床广泛 |
- ⚠️ 以上规模/采用为补充检索，未对抗验证；正式引用请核各产品官网。
- LAMP n=8 研究（Cohen 2015）：全部 8 名自闭症儿童自发沟通进步（评论 100%/引起注意 75%/表达感受 75%/问候 87%），但**无对照、自报结局、对商业产品友好，不可当强疗效证据**。来源：[LAMP n=8](https://www.tandfonline.com/doi/full/10.1080/2331186X.2015.1045807)
- 来源补充：[State of AAC 2025](https://www.openaac.org/2025/03/03/state-of-aac-2025.html)、[AbleNet 对比指南](https://support.ablenetinc.com/speech-apps/app-comparison-guide/)

---

## 9. 给 Audrey 2.0 的可执行建议（基于上述证据）

1. **位置永远固定**（🟢 最高优先级）：核心词网格固定布局，AI 推荐**只高亮不挪位**；拖动排序仅限家长配置，改后全局锁定。删除任何"运行时动态重排核心词"的设计。
2. **默认给健壮词汇**（🔵）：不要按"认知能力"锁词/锁网格；起步可用 Universal Core 36，但要让词库可扩到大词汇量，且**始终可见**。
3. **句子条为主、预存短语为辅**（⚠️）：逐词造句是主路径；预存快捷短语只做高频社交/紧急少量几条。
4. **场景用 VSD（hybrid）**（🟢）：at home/at school 场景照片+热区对 3-8 岁幼儿有 EBP 支持；但固定核心词网格要始终保留。
5. **flashcard 打通 AAC 词库**（🟡→🟢）：闪卡词条 = AAC 词条同一套；学完能立刻在句子条用出来；教学嵌入自然情境的辅助语言示范，而非孤立刷卡。
6. **个体化选词**（🟡）：core + 可配置 fringe（你们的 core/context/custom 三类设计方向正确）。
7. **诚实标注证据档位**：产品/PRD 里凡引用研究，按本报告四档标注，别把"商业实践/专家共识"说成"强证据"。
8. **更正现有文档**：`CORE_WORDS_BRIEF.md` 的 80% 应归 Vanderheiden & Kelso 1987（非 ASHA）。

---

## 10. 开放问题（本轮未解决，需进一步检索）

1. 点击→发声 TTS 延迟阈值、按住防误触（dwell/hold）的循证量化设置。
2. DLM First 40、PODD、各产品确切词汇规模与公开采用/疗效数据的一手核实。
3. 应提供多少条预存短语的循证上限。
4. "AI 自动预测/重排 vs 固定布局对自闭症儿童运动规划"的直接对比实验（证据空白，建议默认静态布局）。
5. Fitzgerald 配色按词性的完整标准色表（各家不一，需选定一套）。

---

## 附：本轮验证统计
- 检索角度 5 个；抓取来源 26 个；提取结论 117 条；对抗验证 25 条 → **确认 24 条、否决 1 条**；合成后 12 条核心结论。
- 补充检索 9 次（grid size / Fitzgerald / 产品词汇 / 80% 出处 / 预存句），标注 ⚠️，未对抗验证。
