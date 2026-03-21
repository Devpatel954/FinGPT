// FinGPT — extended mock data for feature pages

// ── Live Sentiment Feed ───────────────────────────────────
export const liveFeedItems = [
  { id: 1,  ticker: 'NVDA', headline: 'NVIDIA H200 chips sold out through Q3 as hyperscalers race to build AI infrastructure', source: 'Reuters',    time: '0:12', sentiment: 'positive', confidence: 96, category: 'Supply/Demand', detail: { bullish: 96, neutral: 3, bearish: 1, keyPhrases: ['sold out', 'race to build', 'AI infrastructure'], tone: 'Strongly Bullish' } },
  { id: 2,  ticker: 'TSLA', headline: 'Tesla cuts Model Y price for third time this quarter amid demand slowdown', source: 'Bloomberg',  time: '1:04', sentiment: 'negative', confidence: 88, category: 'Pricing Pressure', detail: { bullish: 8, neutral: 15, bearish: 77, keyPhrases: ['price cut', 'demand slowdown', 'third time'], tone: 'Bearish' } },
  { id: 3,  ticker: 'AAPL', headline: 'Apple Vision Pro enterprise adoption accelerating across healthcare and architecture sectors', source: 'WSJ',        time: '2:17', sentiment: 'positive', confidence: 79, category: 'Adoption', detail: { bullish: 79, neutral: 17, bearish: 4, keyPhrases: ['enterprise adoption', 'accelerating', 'healthcare'], tone: 'Bullish' } },
  { id: 4,  ticker: 'META', headline: 'Meta AI assistant reaches 450M users, surpassing ChatGPT in consumer reach', source: 'TechCrunch', time: '3:41', sentiment: 'positive', confidence: 91, category: 'Growth', detail: { bullish: 91, neutral: 7, bearish: 2, keyPhrases: ['450M users', 'surpassing ChatGPT', 'consumer reach'], tone: 'Strongly Bullish' } },
  { id: 5,  ticker: 'BA',   headline: 'Boeing faces additional FAA production halt after new defects found in 737 MAX fuselage', source: 'FT',        time: '4:55', sentiment: 'negative', confidence: 94, category: 'Regulatory', detail: { bullish: 3, neutral: 8, bearish: 89, keyPhrases: ['production halt', 'new defects', 'FAA'], tone: 'Strongly Bearish' } },
  { id: 6,  ticker: 'MSFT', headline: 'Microsoft Copilot enterprise seats cross 5M in Q1, ahead of management forecast', source: 'Reuters',    time: '5:22', sentiment: 'positive', confidence: 84, category: 'Growth', detail: { bullish: 84, neutral: 13, bearish: 3, keyPhrases: ['enterprise seats', 'ahead of forecast', '5M'], tone: 'Bullish' } },
  { id: 7,  ticker: 'GS',   headline: 'Goldman Sachs warns recession probability rises to 35% on persistent services inflation', source: 'Bloomberg',  time: '6:18', sentiment: 'negative', confidence: 76, category: 'Macro Risk', detail: { bullish: 12, neutral: 22, bearish: 66, keyPhrases: ['recession probability', '35%', 'persistent inflation'], tone: 'Bearish' } },
  { id: 8,  ticker: 'AMD',  headline: 'AMD MI300X production capacity doubled as Microsoft and Google scale AI training workloads', source: 'WSJ',        time: '7:33', sentiment: 'positive', confidence: 89, category: 'Supply/Demand', detail: { bullish: 89, neutral: 9, bearish: 2, keyPhrases: ['capacity doubled', 'scale AI', 'training workloads'], tone: 'Bullish' } },
  { id: 9,  ticker: 'JPM',  headline: 'JPMorgan raises credit loss provisions by $2.1B as consumer delinquencies climb', source: 'CNBC',       time: '8:44', sentiment: 'negative', confidence: 82, category: 'Credit Risk', detail: { bullish: 7, neutral: 21, bearish: 72, keyPhrases: ['credit loss provisions', '$2.1B', 'delinquencies climb'], tone: 'Bearish' } },
  { id: 10, ticker: 'AMZN', headline: 'Amazon AWS announces $8B new data center investment across four US states', source: 'Reuters',    time: '9:51', sentiment: 'positive', confidence: 87, category: 'Investment', detail: { bullish: 87, neutral: 11, bearish: 2, keyPhrases: ['$8B investment', 'data center', 'four US states'], tone: 'Bullish' } },
  { id: 11, ticker: 'NFLX', headline: 'Netflix ad-supported tier conversion rate hits record 42% among new subscribers', source: 'Variety',    time: '10:06', sentiment: 'positive', confidence: 81, category: 'Monetization', detail: { bullish: 81, neutral: 15, bearish: 4, keyPhrases: ['conversion rate', 'record 42%', 'new subscribers'], tone: 'Bullish' } },
  { id: 12, ticker: 'GOOGL',headline: 'Alphabet faces EU antitrust fine of up to €4B over search advertising practices', source: 'FT',        time: '11:29', sentiment: 'negative', confidence: 73, category: 'Regulatory', detail: { bullish: 14, neutral: 26, bearish: 60, keyPhrases: ['antitrust fine', '€4B', 'EU'], tone: 'Moderately Bearish' } },
];

// ── Prediction / Price + Sentiment dual-axis ──────────────
export const predictionData = {
  AAPL: {
    direction: 'Bullish', confidence: 74, explanation: 'Sustained positive media velocity and institutional accumulation signal short-term upside. Sentiment-price correlation at 0.68 over 30 days.',
    correlation: 0.68,
    series: [
      { date:'Mar 1', price:170.2, sentiment:68 }, { date:'Mar 3', price:172.1, sentiment:71 }, { date:'Mar 5', price:169.8, sentiment:67 },
      { date:'Mar 7', price:174.5, sentiment:74 }, { date:'Mar 9', price:176.0, sentiment:77 }, { date:'Mar 11', price:178.4, sentiment:79 },
      { date:'Mar 13', price:177.9, sentiment:76 }, { date:'Mar 15', price:180.2, sentiment:80 }, { date:'Mar 17', price:182.6, sentiment:83 },
      { date:'Mar 19', price:183.1, sentiment:79 }, { date:'Mar 20', price:184.8, sentiment:81 },
    ]
  },
  TSLA: {
    direction: 'Bearish', confidence: 81, explanation: 'Accelerating negative sentiment driven by delivery miss and margin compression concerns. Correlation at -0.71 suggests continued downside pressure.',
    correlation: -0.71,
    series: [
      { date:'Mar 1', price:195.0, sentiment:58 }, { date:'Mar 3', price:190.2, sentiment:54 }, { date:'Mar 5', price:188.4, sentiment:51 },
      { date:'Mar 7', price:185.6, sentiment:48 }, { date:'Mar 9', price:183.1, sentiment:46 }, { date:'Mar 11', price:180.8, sentiment:45 },
      { date:'Mar 13', price:178.2, sentiment:43 }, { date:'Mar 15', price:175.9, sentiment:45 }, { date:'Mar 17', price:173.4, sentiment:47 },
      { date:'Mar 19', price:170.0, sentiment:44 }, { date:'Mar 20', price:168.5, sentiment:47 },
    ]
  },
  NVDA: {
    direction: 'Strongly Bullish', confidence: 91, explanation: 'Record-high sentiment driven by AI infrastructure demand surge. Correlation at 0.84 — one of the strongest in current market.',
    correlation: 0.84,
    series: [
      { date:'Mar 1', price:780.0, sentiment:81 }, { date:'Mar 3', price:820.5, sentiment:84 }, { date:'Mar 5', price:810.2, sentiment:82 },
      { date:'Mar 7', price:850.4, sentiment:86 }, { date:'Mar 9', price:870.1, sentiment:88 }, { date:'Mar 11', price:900.8, sentiment:91 },
      { date:'Mar 13', price:920.0, sentiment:89 }, { date:'Mar 15', price:950.3, sentiment:92 }, { date:'Mar 17', price:970.6, sentiment:93 },
      { date:'Mar 19', price:980.2, sentiment:91 }, { date:'Mar 20', price:995.0, sentiment:93 },
    ]
  },
  MSFT: {
    direction: 'Bullish', confidence: 77, explanation: 'Copilot enterprise adoption driving re-rating. Sentiment-price correlation at 0.72, supported by consistent institutional buying over 14-day period.',
    correlation: 0.72,
    series: [
      { date:'Mar 1', price:405.0, sentiment:74 }, { date:'Mar 3', price:410.2, sentiment:76 }, { date:'Mar 5', price:408.8, sentiment:73 },
      { date:'Mar 7', price:415.0, sentiment:77 }, { date:'Mar 9', price:418.6, sentiment:79 }, { date:'Mar 11', price:422.1, sentiment:80 },
      { date:'Mar 13', price:420.4, sentiment:78 }, { date:'Mar 15', price:425.3, sentiment:81 }, { date:'Mar 17', price:428.9, sentiment:82 },
      { date:'Mar 19', price:430.2, sentiment:80 }, { date:'Mar 20', price:432.1, sentiment:82 },
    ]
  },
  META: {
    direction: 'Bullish', confidence: 69, explanation: 'AI assistant growth narrative dominant across media. Sentiment-price correlation at 0.61. Positive momentum likely to sustain through earnings.',
    correlation: 0.61,
    series: [
      { date:'Mar 1', price:495.0, sentiment:65 }, { date:'Mar 3', price:502.1, sentiment:68 }, { date:'Mar 5', price:498.4, sentiment:66 },
      { date:'Mar 7', price:508.2, sentiment:70 }, { date:'Mar 9', price:512.6, sentiment:72 }, { date:'Mar 11', price:516.1, sentiment:74 },
      { date:'Mar 13', price:514.0, sentiment:71 }, { date:'Mar 15', price:520.4, sentiment:74 }, { date:'Mar 17', price:524.8, sentiment:75 },
      { date:'Mar 19', price:526.1, sentiment:73 }, { date:'Mar 20', price:528.3, sentiment:74 },
    ]
  },
};

// ── Keyword Extraction ────────────────────────────────────
export const sampleTranscripts = {
  earnings: `Good morning, and thank you for joining our fourth quarter earnings call. Before we begin, I'd like to reference our forward-looking statements.

Revenue for Q4 came in at $24.2 billion, which exceeded our guidance range of $22.5 to $23.5 billion. This outperformance was primarily driven by stronger-than-expected demand in our data center segment.

However, I want to be candid about the risks we're navigating. Supply chain constraints remain an area of concern, and we're working with our manufacturing partners to address potential bottlenecks. We've also seen increased regulatory scrutiny in the European Union related to our market position in AI inference chips.

On the M&A front, we're actively evaluating acquisition targets in the software stack layer to complement our hardware leadership. There are no announcements today, but this remains a strategic priority.

Looking at guidance for Q1 2026, we expect revenues between $26 and $27 billion. Operating margins should expand 200 basis points year-over-year, though we are monitoring macro headwinds from potential tariff changes that could affect our cost structure.

Capital expenditure plans remain robust at $8 billion for the full year, reflecting our confidence in long-term AI infrastructure demand. We are not revising our long-term growth outlook at this time.`,
  
  riskReport: `Key risks identified in current quarter financial disclosures:

The company faces significant liquidity risk as cash reserves declined 23% quarter-over-quarter due to accelerated share buyback program. Management has indicated plans to raise additional debt capital, which may increase leverage ratio above covenant thresholds.

Regulatory exposure has increased materially following the Department of Justice investigation into pricing practices disclosed in the 10-K filing. Legal counsel estimates potential fines in the range of $500M to $1.2B.

Supply chain disruption risk remains elevated. The company relies on single-source suppliers for three critical components. Any production interruption could materially impact quarterly deliveries.

The company has entered three acquisition discussions simultaneously, raising concerns about management bandwidth and integration risk. The largest potential target carries substantial pension liability exposure.`,

  analystNote: `We maintain our BUY rating on the stock with a 12-month price target of $285, representing 22% upside from current levels.

The bull case centers on continued market share gains in enterprise software, with retention rates improving to 96% from 92% a year ago. Management's guidance revision upward for the third consecutive quarter signals strong execution.

Key near-term catalysts include the product launch expected in late Q2 and the potential partnership announcement with a major cloud hyperscaler that our channel checks suggest is in advanced stages.

We see downside risk if the macro environment deteriorates and enterprise spending budgets are cut. Our bear case scenario assumes 15% revenue miss and margin compression of 300 basis points.`,
};

export const keywordCategories = {
  'Risk Factors':       { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   icon: '⚠️' },
  'M&A Signals':        { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: '🤝' },
  'Guidance Changes':   { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  icon: '📈' },
  'Regulatory Flags':   { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  icon: '⚖️' },
  'Positive Signals':   { color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  icon: '✅' },
};

export const keywordPatterns = [
  { phrase: 'supply chain constraints',   category: 'Risk Factors',     weight: 3 },
  { phrase: 'regulatory scrutiny',        category: 'Regulatory Flags',  weight: 3 },
  { phrase: 'acquisition targets',        category: 'M&A Signals',       weight: 3 },
  { phrase: 'M&A',                        category: 'M&A Signals',       weight: 3 },
  { phrase: 'acquisition',               category: 'M&A Signals',       weight: 2 },
  { phrase: 'exceeded our guidance',      category: 'Guidance Changes',  weight: 3 },
  { phrase: 'guidance',                   category: 'Guidance Changes',  weight: 1 },
  { phrase: 'guidance range',             category: 'Guidance Changes',  weight: 2 },
  { phrase: 'outperformance',             category: 'Positive Signals',  weight: 2 },
  { phrase: 'stronger-than-expected',     category: 'Positive Signals',  weight: 3 },
  { phrase: 'risks we\'re navigating',    category: 'Risk Factors',      weight: 2 },
  { phrase: 'risks',                      category: 'Risk Factors',      weight: 1 },
  { phrase: 'macro headwinds',            category: 'Risk Factors',      weight: 3 },
  { phrase: 'tariff',                     category: 'Regulatory Flags',  weight: 2 },
  { phrase: 'long-term AI infrastructure demand', category: 'Positive Signals', weight: 3 },
  { phrase: 'margins should expand',      category: 'Guidance Changes',  weight: 2 },
  { phrase: 'liquidity risk',             category: 'Risk Factors',      weight: 3 },
  { phrase: 'leverage ratio',             category: 'Risk Factors',      weight: 2 },
  { phrase: 'covenant',                   category: 'Risk Factors',      weight: 2 },
  { phrase: 'Department of Justice investigation', category: 'Regulatory Flags', weight: 3 },
  { phrase: 'acquisition discussions',    category: 'M&A Signals',       weight: 3 },
  { phrase: 'integration risk',           category: 'Risk Factors',      weight: 2 },
  { phrase: 'price target',              category: 'Guidance Changes',   weight: 2 },
  { phrase: 'market share gains',        category: 'Positive Signals',   weight: 2 },
  { phrase: 'guidance revision upward',  category: 'Guidance Changes',   weight: 3 },
  { phrase: 'partnership',              category: 'M&A Signals',         weight: 2 },
  { phrase: 'downside risk',            category: 'Risk Factors',        weight: 2 },
  { phrase: 'revenue miss',            category: 'Risk Factors',         weight: 2 },
  { phrase: 'margin compression',      category: 'Risk Factors',         weight: 2 },
  { phrase: 'BUY rating',              category: 'Positive Signals',     weight: 3 },
  { phrase: 'upside',                  category: 'Positive Signals',     weight: 2 },
];

// ── Earnings Transcripts ──────────────────────────────────
export const earningsData = {
  NVDA: {
    company: 'NVIDIA Corporation', quarter: 'Q4 2025', date: 'Feb 26, 2026',
    prevQuarter: 'Q3 2025',
    overallSentiment: 91, prevSentiment: 84,
    insights: [
      { type: 'positive', text: 'Management tone is exceptionally confident — CEO used "unprecedented demand" 6 times, a 3x increase from Q3.' },
      { type: 'positive', text: 'Guidance language shifted from cautious to assertive. Phrase "we are confident" appeared 8 times vs 3 in Q3.' },
      { type: 'warning',  text: 'Increased hedging language around supply chain: "working to address" signals potential constraint risk.' },
      { type: 'positive', text: 'R&D investment language intensified. "Generational opportunity" framing appeared for first time.' },
    ],
    segments: [
      { label: 'Opening Remarks',    start: 0,   end: 15,  sentiment: 88, tone: 'Confident',  summary: 'CEO opens with record revenue announcement, data center growth' },
      { label: 'Financial Overview', start: 15,  end: 30,  sentiment: 92, tone: 'Very Positive', summary: 'CFO highlights $22.1B revenue beat, 78% data center mix' },
      { label: 'Product Roadmap',    start: 30,  end: 50,  sentiment: 94, tone: 'Very Positive', summary: 'Blackwell GPU pipeline details, Quantum computing mention' },
      { label: 'Risk Factors',       start: 50,  end: 65,  sentiment: 71, tone: 'Cautious',   summary: 'Supply chain discussion, export control acknowledgment' },
      { label: 'Guidance',           start: 65,  end: 80,  sentiment: 90, tone: 'Positive',   summary: '$26-27B Q1 guidance, 20% sequential growth' },
      { label: 'Q&A Session',        start: 80,  end: 100, sentiment: 89, tone: 'Positive',   summary: 'Analyst questions on hyperscaler demand, data confirmed strong' },
    ],
    transcript: [
      { id: 0,  speaker: 'CEO Jensen Huang',  text: 'Good morning. Before I begin, I want to say this is the most defining moment in NVIDIA\'s 30-year history. The demand for accelerated computing and AI is extraordinary — truly unprecedented in scale and urgency.', sentiment: 92 },
      { id: 1,  speaker: 'CEO Jensen Huang',  text: 'Data center revenue reached $22.1 billion in Q4, growing 409% year-over-year. Every major cloud provider — Amazon, Google, Microsoft, Oracle — is in a race to build AI infrastructure, and NVIDIA is at the center of that race.', sentiment: 95 },
      { id: 2,  speaker: 'CFO Colette Kress', text: 'Total revenue for Q4 was $24.2 billion, up 122% year-over-year and exceeding our guidance range of $22.5 to $23.5 billion. GAAP gross margins expanded to 76.7%, up from 66% a year ago.', sentiment: 94 },
      { id: 3,  speaker: 'CFO Colette Kress', text: 'We are guiding Q1 2026 revenues to $26 to $27 billion, plus or minus 2%. This represents approximately 20% sequential growth and reflects continued strong demand across all customer segments.', sentiment: 91 },
      { id: 4,  speaker: 'CEO Jensen Huang',  text: 'On the supply side, we are working closely with our manufacturing partners to address demand. We continue to see constraints in certain components, and we are actively working to resolve these bottlenecks.', sentiment: 72 },
      { id: 5,  speaker: 'Analyst Morgan Stanley', text: 'Jensen, can you give us any color on the H200 backlog and whether demand from Chinese customers has been fully replaced by US hyperscalers?', sentiment: 60 },
      { id: 6,  speaker: 'CEO Jensen Huang',  text: 'Demand from US hyperscalers has more than compensated for any export-restricted business. We are comfortable with our pipeline and visibility going into the next two quarters.', sentiment: 88 },
      { id: 7,  speaker: 'Analyst Goldman Sachs', text: 'Colette, on margins — how should we think about gross margins for Q1 given the Blackwell ramp costs?', sentiment: 65 },
      { id: 8,  speaker: 'CFO Colette Kress', text: 'We expect Q1 gross margins to remain in the 76-77% range as Blackwell margins are comparable to Hopper at full production scale. No material impact expected from the ramp.', sentiment: 90 },
    ],
  },
  TSLA: {
    company: 'Tesla, Inc.', quarter: 'Q1 2026', date: 'Apr 23, 2026',
    prevQuarter: 'Q4 2025',
    overallSentiment: 44, prevSentiment: 58,
    insights: [
      { type: 'warning',  text: 'Management tone significantly more defensive vs. Q4. Defensive phrases increased 4x.' },
      { type: 'negative', text: '"Challenging" used 7 times in opening 15 minutes vs 2 in Q4. Signals internal concern.' },
      { type: 'warning',  text: 'First time CEO avoided specific delivery guidance. Uncertainty language dominant.' },
      { type: 'positive', text: 'Energy storage segment language remained positive — potential offset to automotive weakness.' },
    ],
    segments: [
      { label: 'Opening Remarks',    start: 0,   end: 15,  sentiment: 42, tone: 'Defensive', summary: 'CEO acknowledges difficult quarter, cites macro headwinds' },
      { label: 'Financial Overview', start: 15,  end: 30,  sentiment: 38, tone: 'Cautious',  summary: 'CFO: Revenue miss, margin compression, higher provisions' },
      { label: 'Product Updates',    start: 30,  end: 50,  sentiment: 55, tone: 'Neutral',   summary: 'Model 2 update, Cybertruck production ramp milestone' },
      { label: 'Risk Factors',       start: 50,  end: 65,  sentiment: 33, tone: 'Bearish',   summary: 'China competition, delivery logistics, FSD timelines' },
      { label: 'Guidance',           start: 65,  end: 80,  sentiment: 36, tone: 'Cautious',  summary: 'No specific delivery guidance provided — unusual' },
      { label: 'Q&A Session',        start: 80,  end: 100, sentiment: 46, tone: 'Mixed',     summary: 'Tense Q&A on delivery miss, analysts pressed for clarity' },
    ],
    transcript: [
      { id: 0, speaker: 'CEO Elon Musk',      text: 'Q1 was a challenging quarter. We faced headwinds on multiple fronts — softening demand in Europe, intensifying competition in China, and factory retooling at Fremont that affected delivery cadence.', sentiment: 35 },
      { id: 1, speaker: 'CEO Elon Musk',      text: 'Deliveries came in at 386,810 vehicles. I want to be honest with investors — this was below our internal targets, and we are taking steps to address the underlying factors.', sentiment: 30 },
      { id: 2, speaker: 'CFO Zachary Kirkhorn',text: 'Revenue was $21.3 billion, down 9% year-over-year. Automotive gross margins declined to 16.4%, below our 18% target, primarily due to pricing actions and higher warranty reserves.', sentiment: 28 },
      { id: 3, speaker: 'CEO Elon Musk',      text: 'On a more positive note, our energy storage business delivered a record quarter with 9.4 GWh deployed. Megapack demand continues to accelerate globally, and this segment is becoming a meaningful part of our business.', sentiment: 68 },
      { id: 4, speaker: 'CEO Elon Musk',      text: 'We expect Q2 to be challenging as we continue the Model Y restyling production ramp. We are not providing specific delivery guidance for Q2 — there are too many variables we are still working through.', sentiment: 30 },
    ],
  },
};

// ── Semantic Search Index ─────────────────────────────────
export const searchIndex = [
  { id:1,  ticker:'TSLA', headline:'Tesla supply chain disruption threatens Q2 deliveries as supplier strikes continue', source:'Reuters',    date:'Mar 18, 2026', sentiment:'negative', score:82, relevance:0, context:'supply chain disruption threatens Q2 deliveries' },
  { id:2,  ticker:'TSLA', headline:'Tesla Shanghai factory faces new production constraints amid component shortages', source:'Bloomberg',  date:'Mar 16, 2026', sentiment:'negative', score:79, relevance:0, context:'production constraints amid component shortages' },
  { id:3,  ticker:'TSLA', headline:'Analyst downgrades Tesla citing supply chain and demand double headwind', source:'Morgan Stanley',date:'Mar 15, 2026', sentiment:'negative', score:84, relevance:0, context:'supply chain and demand double headwind' },
  { id:4,  ticker:'TSLA', headline:'Tesla faces loss of key battery supplier as CATL pivots to BYD partnership', source:'FT',        date:'Mar 14, 2026', sentiment:'negative', score:77, relevance:0, context:'loss of key battery supplier' },
  { id:5,  ticker:'NVDA', headline:'NVIDIA accelerates AI chip production as data center orders backlogged through Q3', source:'WSJ',        date:'Mar 19, 2026', sentiment:'positive', score:92, relevance:0, context:'AI chip production orders backlogged' },
  { id:6,  ticker:'AAPL', headline:'Apple supplier Foxconn reports record orders driven by Vision Pro component demand', source:'Reuters',    date:'Mar 17, 2026', sentiment:'positive', score:81, relevance:0, context:'record orders Vision Pro component demand' },
  { id:7,  ticker:'AMD',  headline:'AMD expands Taiwan manufacturing capacity by 40% to meet AI training chip demand', source:'Bloomberg',  date:'Mar 16, 2026', sentiment:'positive', score:86, relevance:0, context:'expand manufacturing capacity AI chip demand' },
  { id:8,  ticker:'BA',   headline:'Boeing supply chain failures traced to subcontractor quality control breakdown', source:'FT',        date:'Mar 15, 2026', sentiment:'negative', score:88, relevance:0, context:'supply chain failures quality control breakdown' },
  { id:9,  ticker:'META', headline:'Meta\'s AI infrastructure buildout faces GPU supply constraints, insiders say', source:'TechCrunch', date:'Mar 14, 2026', sentiment:'negative', score:71, relevance:0, context:'GPU supply constraints infrastructure' },
  { id:10, ticker:'AMZN', headline:'Amazon AWS supply chain for custom AI chips shows signs of bottleneck easing', source:'CNBC',       date:'Mar 13, 2026', sentiment:'positive', score:74, relevance:0, context:'supply chain bottleneck easing custom AI chips' },
  { id:11, ticker:'MSFT', headline:'Microsoft earnings beat analyst expectations by 12% driven by cloud AI services', source:'Reuters',    date:'Mar 12, 2026', sentiment:'positive', score:88, relevance:0, context:'earnings beat expectations cloud AI' },
  { id:12, ticker:'GOOGL',headline:'Google DeepMind announces breakthrough in protein structure prediction accuracy', source:'Nature',      date:'Mar 11, 2026', sentiment:'positive', score:85, relevance:0, context:'breakthrough protein structure prediction' },
  { id:13, ticker:'TSLA', headline:'Tesla Cybertruck recall expanded to 90,000 units over accelerator pedal defect', source:'NHTSA',       date:'Mar 10, 2026', sentiment:'negative', score:91, relevance:0, context:'recall 90000 units accelerator pedal defect' },
  { id:14, ticker:'JPM',  headline:'JPMorgan profit rises 8% but credit loss reserves signal macro uncertainty ahead', source:'Bloomberg',  date:'Mar 9, 2026',  sentiment:'neutral',  score:58, relevance:0, context:'profit rises credit loss reserves macro uncertainty' },
  { id:15, ticker:'NFLX', headline:'Netflix expands into live sports streaming with $5B NFL deal announcement', source:'Variety',    date:'Mar 8, 2026',  sentiment:'positive', score:83, relevance:0, context:'live sports streaming NFL deal' },
  { id:16, ticker:'GS',   headline:'Goldman Sachs issues rare double downgrade on tech sector valuation concerns', source:'WSJ',        date:'Mar 7, 2026',  sentiment:'negative', score:72, relevance:0, context:'double downgrade tech sector valuation' },
  { id:17, ticker:'TSLA', headline:'Tesla Model 2 mass market EV faces negative sentiment from early price leak', source:'Electrek',    date:'Mar 6, 2026',  sentiment:'negative', score:65, relevance:0, context:'mass market EV negative sentiment price' },
  { id:18, ticker:'AMD',  headline:'AMD stock reaches 52-week high as institutional investors pile into AI trade', source:'Reuters',    date:'Mar 5, 2026',  sentiment:'positive', score:89, relevance:0, context:'52-week high institutional investors AI' },
];

export const searchSuggestions = [
  'Find negative news about Tesla supply chain',
  'Show bullish signals for semiconductor stocks',
  'Recent regulatory risk for big tech',
  'Earnings beats in Q1 2026',
  'AI infrastructure investment announcements',
  'Goldman Sachs macro warnings',
];
