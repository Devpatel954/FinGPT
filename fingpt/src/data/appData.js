// FinGPT App — rich mock data for the full SaaS dashboard

// ── Market Overview ──────────────────────────────────────
export const marketIndices = [
  { name: 'S&P 500',  value: '5,234.18', change: '+0.68%', sentiment: 74, trend: 'up',   sparkline: [68,70,69,72,71,73,74] },
  { name: 'NASDAQ',   value: '16,428.82',change: '+1.12%', sentiment: 79, trend: 'up',   sparkline: [72,74,76,75,77,78,79] },
  { name: 'DOW JONES',value: '38,996.39',change: '-0.14%', sentiment: 61, trend: 'down', sparkline: [65,64,63,62,63,61,61] },
  { name: 'VIX',      value: '14.32',    change: '-3.21%', sentiment: 38, trend: 'down', sparkline: [48,45,44,42,41,39,38] },
];

// ── Sector Sentiment ─────────────────────────────────────
export const sectorData = [
  { sector: 'Technology',  score: 82, change: +4.1, articles: 1240 },
  { sector: 'Healthcare',  score: 67, change: +1.2, articles: 480  },
  { sector: 'Finance',     score: 59, change: -2.3, articles: 630  },
  { sector: 'Energy',      score: 44, change: -5.1, articles: 320  },
  { sector: 'Consumer',    score: 71, change: +2.8, articles: 570  },
  { sector: 'Industrials', score: 63, change: +0.7, articles: 290  },
  { sector: 'Real Estate', score: 51, change: -1.9, articles: 210  },
  { sector: 'Utilities',   score: 56, change: +0.3, articles: 178  },
];

// ── Sentiment Timeline (multi-ticker) ────────────────────
export const sentimentTimeline = [
  { date: 'Mar 11', AAPL: 72, TSLA: 45, MSFT: 68, NVDA: 81, GOOGL: 70 },
  { date: 'Mar 12', AAPL: 68, TSLA: 52, MSFT: 71, NVDA: 76, GOOGL: 73 },
  { date: 'Mar 13', AAPL: 75, TSLA: 38, MSFT: 65, NVDA: 88, GOOGL: 69 },
  { date: 'Mar 14', AAPL: 80, TSLA: 61, MSFT: 74, NVDA: 84, GOOGL: 75 },
  { date: 'Mar 15', AAPL: 77, TSLA: 55, MSFT: 79, NVDA: 91, GOOGL: 78 },
  { date: 'Mar 16', AAPL: 83, TSLA: 49, MSFT: 82, NVDA: 87, GOOGL: 74 },
  { date: 'Mar 17', AAPL: 79, TSLA: 63, MSFT: 77, NVDA: 93, GOOGL: 80 },
];

// ── Trending Stocks ──────────────────────────────────────
export const trendingStocks = [
  { ticker:'NVDA', name:'NVIDIA Corp',       score:93, change:+5.1, sentiment:'bullish',  sparkline:[75,80,82,85,88,90,93], color:'#6366f1' },
  { ticker:'AMD',  name:'Advanced Micro',    score:85, change:+4.0, sentiment:'bullish',  sparkline:[72,74,76,78,80,83,85], color:'#6366f1' },
  { ticker:'AAPL', name:'Apple Inc',         score:79, change:+2.3, sentiment:'bullish',  sparkline:[70,72,73,75,76,78,79], color:'#3b82f6' },
  { ticker:'MSFT', name:'Microsoft Corp',    score:82, change:+1.8, sentiment:'bullish',  sparkline:[74,76,77,79,80,81,82], color:'#3b82f6' },
  { ticker:'META', name:'Meta Platforms',    score:74, change:+3.2, sentiment:'bullish',  sparkline:[65,67,69,70,71,73,74], color:'#8b5cf6' },
  { ticker:'GOOGL',name:'Alphabet Inc',      score:76, change:+1.5, sentiment:'bullish',  sparkline:[70,71,72,73,74,75,76], color:'#3b82f6' },
  { ticker:'TSLA', name:'Tesla Inc',         score:47, change:-4.7, sentiment:'bearish',  sparkline:[68,62,58,54,51,49,47], color:'#ef4444' },
  { ticker:'NFLX', name:'Netflix Inc',       score:61, change:-1.2, sentiment:'neutral',  sparkline:[66,65,64,63,62,62,61], color:'#f97316' },
  { ticker:'JPM',  name:'JPMorgan Chase',    score:58, change:+0.5, sentiment:'neutral',  sparkline:[55,56,57,57,58,58,58], color:'#f97316' },
  { ticker:'BA',   name:'Boeing Co',         score:38, change:-3.1, sentiment:'bearish',  sparkline:[48,45,43,41,40,39,38], color:'#ef4444' },
  { ticker:'GS',   name:'Goldman Sachs',     score:52, change:-0.8, sentiment:'neutral',  sparkline:[56,55,54,53,53,52,52], color:'#f97316' },
  { ticker:'AMZN', name:'Amazon.com',        score:68, change:+0.9, sentiment:'bullish',  sparkline:[62,63,64,65,65,67,68], color:'#6366f1' },
];

// ── AI Insights ──────────────────────────────────────────
export const aiInsights = [
  {
    id: 1,
    title: 'NVDA Earnings Momentum',
    body: 'Sentiment for NVIDIA has reached a 90-day high following record data center revenue. Institutional buying pressure detected across 3 major filings.',
    ticker: 'NVDA', score: 93, type: 'bullish', time: '12 min ago',
  },
  {
    id: 2,
    title: 'Tech Sector Rotation Signal',
    body: 'Broad-based positive sentiment shift in semiconductor sub-sector. AMD, NVDA, and INTC all trending above 80-point threshold simultaneously — rare confluence.',
    ticker: 'SECTOR', score: 84, type: 'bullish', time: '38 min ago',
  },
  {
    id: 3,
    title: 'TSLA Delivery Risk Elevated',
    body: 'Negative sentiment accelerating after missed delivery targets. Supply chain mentions spiked 3.2x vs 30-day average. Risk of further downside revision.',
    ticker: 'TSLA', score: 47, type: 'bearish', time: '1h ago',
  },
  {
    id: 4,
    title: 'Fed Policy Language Shift',
    body: 'Hawkish language frequency in Fed minutes has declined. Bond markets pricing in 2 cuts by year-end. Moderate positive signal for growth equities.',
    ticker: 'MACRO', score: 62, type: 'neutral', time: '2h ago',
  },
];

// ── Full News Feed ────────────────────────────────────────
export const newsFeed = [
  { id:1,  ticker:'NVDA', headline:'NVIDIA Reports Record Data Center Revenue, Beats Q4 Estimates by Wide Margin', source:'Reuters',   time:'2h ago',  sentiment:'positive', score:94, summary:'NVIDIA posted $22.1B in data center revenue, up 409% YoY, crushing analyst expectations of $17.2B. CEO Jensen Huang cited "insatiable demand" for AI infrastructure.' },
  { id:2,  ticker:'AAPL', headline:'Apple Vision Pro Sales Exceed Analyst Projections in Q1, Eyeing Enterprise Push', source:'Bloomberg', time:'4h ago',  sentiment:'positive', score:81, summary:'Apple confirmed Vision Pro unit sales surpassed internal targets in Q1. Enterprise adoption is accelerating with partnerships across healthcare and media sectors.' },
  { id:3,  ticker:'MSFT', headline:'Microsoft Azure AI Services Expand to 12 New Markets Across EMEA and APAC', source:'WSJ',       time:'5h ago',  sentiment:'positive', score:77, summary:'Microsoft announced geographical expansion of its Azure OpenAI Service to 12 new markets, adding an estimated $2.4B in addressable revenue.' },
  { id:4,  ticker:'TSLA', headline:'Tesla Misses Q1 Delivery Targets Amid Global Production Slowdown, Guidance Cut', source:'CNBC',      time:'6h ago',  sentiment:'negative', score:68, summary:'Tesla delivered 386,810 vehicles in Q1, falling short of the 457,000 analyst consensus. Management cited factory retooling and logistics disruptions.' },
  { id:5,  ticker:'BA',   headline:'Boeing Faces Expanded FAA Scrutiny Over 737 MAX Quality Control Procedures', source:'FT',        time:'8h ago',  sentiment:'negative', score:74, summary:'FAA has opened three new investigations into Boeing\'s manufacturing documentation practices following a series of reported defects on 737 MAX assembly lines.' },
  { id:6,  ticker:'META', headline:'Meta AI Assistant Reaches 400M Monthly Active Users, Monetization Path Clearer', source:'TechCrunch',time:'9h ago',  sentiment:'positive', score:79, summary:'Meta\'s AI assistant crossed 400M MAUs across WhatsApp, Instagram, and Messenger. Analysts project $3B incremental revenue from AI features by 2025.' },
  { id:7,  ticker:'AMZN', headline:'Amazon AWS Revenue Accelerates to 17% Growth, Cloud Demand Recovery On Track', source:'Reuters',   time:'10h ago', sentiment:'positive', score:83, summary:'AWS posted $25B in quarterly revenue, accelerating from 13% growth last year. AI workload migrations are cited as the primary demand driver.' },
  { id:8,  ticker:'JPM',  headline:'JPMorgan Q1 Profits Beat Estimates But Credit Card Delinquencies Rise Sharply', source:'Bloomberg', time:'12h ago', sentiment:'neutral',  score:55, summary:'JPMorgan reported EPS of $4.44 vs $4.17 expected, but net charge-offs in the consumer lending unit rose 28% YoY, raising concerns about credit quality.' },
  { id:9,  ticker:'GOOGL',headline:'Google DeepMind Releases Gemini Ultra 2.0, Claims SOTA on 18 Benchmarks', source:'The Verge',  time:'14h ago', sentiment:'positive', score:86, summary:'DeepMind\'s Gemini Ultra 2.0 surpasses GPT-4 on 18 out of 24 standard benchmarks. Enterprise pricing announced with aggressive tiering vs OpenAI.' },
  { id:10, ticker:'GS',   headline:'Goldman Sachs Cuts Equity Outlook, Sees 8% Correction Risk in H2 2024', source:'WSJ',       time:'16h ago', sentiment:'negative', score:61, summary:'Goldman\'s strategy team lowered the S&P 500 year-end target to 5,100 and warned of elevated valuation risk given sticky inflation in services sector.' },
  { id:11, ticker:'AMD',  headline:'AMD MI300X Demand Surpasses Supply as AI Hyperscalers Diversify Away From NVDA', source:'Reuters',   time:'18h ago', sentiment:'positive', score:88, summary:'AMD\'s MI300X GPU has an order backlog extending into Q3 2024. Microsoft, Google, and Meta are all qualifying AMD as secondary AI chip suppliers.' },
  { id:12, ticker:'NFLX', headline:'Netflix Ad-Supported Tier Grows 65% YoY, Advertising Revenue On Pace for $2B', source:'Variety',    time:'20h ago', sentiment:'positive', score:72, summary:'Netflix\'s ad tier now has 23M monthly active users, growing 65% year-over-year. The company is on pace to generate over $2B in advertising revenue in 2024.' },
];

// ── Active Alerts ─────────────────────────────────────────
export const activeAlerts = [
  { id:1, ticker:'TSLA', condition:'Sentiment drops below',  threshold:40, current:47, status:'active',   triggered:false, created:'Mar 15, 2026' },
  { id:2, ticker:'NVDA', condition:'Sentiment rises above',  threshold:95, current:93, status:'active',   triggered:false, created:'Mar 14, 2026' },
  { id:3, ticker:'AAPL', condition:'Sentiment drops below',  threshold:70, current:79, status:'active',   triggered:false, created:'Mar 13, 2026' },
  { id:4, ticker:'BA',   condition:'Sentiment drops below',  threshold:35, current:38, status:'triggered',triggered:true,  created:'Mar 10, 2026', triggeredAt:'Mar 17, 10:42 AM' },
  { id:5, ticker:'META', condition:'Sentiment rises above',  threshold:75, current:74, status:'active',   triggered:false, created:'Mar 12, 2026' },
  { id:6, ticker:'GS',   condition:'Sentiment drops below',  threshold:50, current:52, status:'active',   triggered:false, created:'Mar 11, 2026' },
];

// ── Saved Insights ────────────────────────────────────────
export const savedInsights = [
  { id:1, ticker:'NVDA', title:'NVDA AI Supercycle Analysis',    saved:'Mar 16, 2026', score:93, type:'bullish', note:'Key long thesis — track weekly' },
  { id:2, ticker:'TSLA', title:'TSLA Delivery Miss Deep-Dive',   saved:'Mar 15, 2026', score:47, type:'bearish', note:'Review after Q2 guidance' },
  { id:3, ticker:'META', title:'Meta AI Monetization Roadmap',   saved:'Mar 14, 2026', score:79, type:'bullish', note:'Strong MAU growth trend' },
  { id:4, ticker:'AMD',  title:'AMD MI300X Supply Constraint',   saved:'Mar 13, 2026', score:85, type:'bullish', note:'Watch hyperscaler order flow' },
  { id:5, ticker:'MACRO',title:'Fed Policy Pivot Signal March',  saved:'Mar 12, 2026', score:62, type:'neutral', note:'Macro context for rate-sensitive plays' },
];

export const savedStocks = [
  { ticker:'NVDA', name:'NVIDIA Corp',    score:93, change:+5.1, watchedSince:'Feb 2026' },
  { ticker:'AAPL', name:'Apple Inc',      score:79, change:+2.3, watchedSince:'Jan 2026' },
  { ticker:'MSFT', name:'Microsoft Corp', score:82, change:+1.8, watchedSince:'Jan 2026' },
  { ticker:'AMD',  name:'Advanced Micro', score:85, change:+4.0, watchedSince:'Mar 2026' },
  { ticker:'META', name:'Meta Platforms', score:74, change:+3.2, watchedSince:'Feb 2026' },
];

// ── Stock detail (for Analyze page) ──────────────────────
export const stockDetails = {
  AAPL: { name:'Apple Inc', score:79, positive:62, neutral:24, negative:14, articles:340, change:+2.3 },
  TSLA: { name:'Tesla Inc',  score:47, positive:31, neutral:22, negative:47, articles:512, change:-4.7 },
  NVDA: { name:'NVIDIA Corp',score:93, positive:84, neutral:11, negative:5,  articles:628, change:+5.1 },
  MSFT: { name:'Microsoft',  score:82, positive:71, neutral:20, negative:9,  articles:290, change:+1.8 },
  GOOGL:{ name:'Alphabet',   score:76, positive:65, neutral:22, negative:13, articles:221, change:+1.5 },
  META: { name:'Meta',       score:74, positive:60, neutral:25, negative:15, articles:275, change:+3.2 },
  AMD:  { name:'AMD',        score:85, positive:74, neutral:18, negative:8,  articles:184, change:+4.0 },
  AMZN: { name:'Amazon',     score:68, positive:55, neutral:28, negative:17, articles:310, change:+0.9 },
  NFLX: { name:'Netflix',    score:61, positive:48, neutral:31, negative:21, articles:142, change:-1.2 },
  JPM:  { name:'JPMorgan',   score:58, positive:44, neutral:32, negative:24, articles:198, change:+0.5 },
  BA:   { name:'Boeing',     score:38, positive:25, neutral:23, negative:52, articles:263, change:-3.1 },
  GS:   { name:'Goldman',    score:52, positive:40, neutral:32, negative:28, articles:155, change:-0.8 },
};

export const stockTimelineData = {
  AAPL:  [{ date:'Mar 11',score:72 },{ date:'Mar 12',score:68 },{ date:'Mar 13',score:75 },{ date:'Mar 14',score:80 },{ date:'Mar 15',score:77 },{ date:'Mar 16',score:83 },{ date:'Mar 17',score:79 }],
  TSLA:  [{ date:'Mar 11',score:55 },{ date:'Mar 12',score:52 },{ date:'Mar 13',score:48 },{ date:'Mar 14',score:51 },{ date:'Mar 15',score:45 },{ date:'Mar 16',score:49 },{ date:'Mar 17',score:47 }],
  NVDA:  [{ date:'Mar 11',score:81 },{ date:'Mar 12',score:76 },{ date:'Mar 13',score:88 },{ date:'Mar 14',score:84 },{ date:'Mar 15',score:91 },{ date:'Mar 16',score:87 },{ date:'Mar 17',score:93 }],
  MSFT:  [{ date:'Mar 11',score:68 },{ date:'Mar 12',score:71 },{ date:'Mar 13',score:65 },{ date:'Mar 14',score:74 },{ date:'Mar 15',score:79 },{ date:'Mar 16',score:82 },{ date:'Mar 17',score:77 }],
  GOOGL: [{ date:'Mar 11',score:70 },{ date:'Mar 12',score:73 },{ date:'Mar 13',score:69 },{ date:'Mar 14',score:75 },{ date:'Mar 15',score:78 },{ date:'Mar 16',score:74 },{ date:'Mar 17',score:76 }],
  META:  [{ date:'Mar 11',score:65 },{ date:'Mar 12',score:68 },{ date:'Mar 13',score:70 },{ date:'Mar 14',score:72 },{ date:'Mar 15',score:71 },{ date:'Mar 16',score:73 },{ date:'Mar 17',score:74 }],
  AMD:   [{ date:'Mar 11',score:72 },{ date:'Mar 12',score:75 },{ date:'Mar 13',score:78 },{ date:'Mar 14',score:80 },{ date:'Mar 15',score:82 },{ date:'Mar 16',score:83 },{ date:'Mar 17',score:85 }],
  AMZN:  [{ date:'Mar 11',score:62 },{ date:'Mar 12',score:64 },{ date:'Mar 13',score:63 },{ date:'Mar 14',score:65 },{ date:'Mar 15',score:65 },{ date:'Mar 16',score:67 },{ date:'Mar 17',score:68 }],
  NFLX:  [{ date:'Mar 11',score:66 },{ date:'Mar 12',score:65 },{ date:'Mar 13',score:64 },{ date:'Mar 14',score:63 },{ date:'Mar 15',score:62 },{ date:'Mar 16',score:62 },{ date:'Mar 17',score:61 }],
  JPM:   [{ date:'Mar 11',score:55 },{ date:'Mar 12',score:56 },{ date:'Mar 13',score:57 },{ date:'Mar 14',score:57 },{ date:'Mar 15',score:58 },{ date:'Mar 16',score:58 },{ date:'Mar 17',score:58 }],
  BA:    [{ date:'Mar 11',score:48 },{ date:'Mar 12',score:45 },{ date:'Mar 13',score:43 },{ date:'Mar 14',score:41 },{ date:'Mar 15',score:40 },{ date:'Mar 16',score:39 },{ date:'Mar 17',score:38 }],
  GS:    [{ date:'Mar 11',score:56 },{ date:'Mar 12',score:55 },{ date:'Mar 13',score:54 },{ date:'Mar 14',score:53 },{ date:'Mar 15',score:53 },{ date:'Mar 16',score:52 },{ date:'Mar 17',score:52 }],
};
