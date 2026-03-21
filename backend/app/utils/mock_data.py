"""
Mock financial news corpus used across all endpoints.
In production this would be replaced by a real news API (e.g. NewsAPI, Bloomberg).
"""

from datetime import datetime, timedelta
import random

def _ago(hours: int) -> str:
    dt = datetime.utcnow() - timedelta(hours=hours)
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


ARTICLES = [
    {
        "id": "art001",
        "ticker": "NVDA",
        "headline": "NVIDIA Reports Record Q4 Revenue Driven by AI Chip Demand",
        "source": "Reuters",
        "timestamp": _ago(1),
        "content": (
            "NVIDIA Corporation posted record quarterly revenue of $22.1 billion, "
            "beating analyst expectations by a wide margin. CEO Jensen Huang attributed "
            "the surge to explosive demand for H100 GPUs from hyperscalers and enterprise "
            "AI deployments. Data center revenue rose 427% year-over-year. The company "
            "raised full-year guidance amid supply constraints, signalling continued strong "
            "momentum. Shares jumped 10% in after-hours trading."
        ),
    },
    {
        "id": "art002",
        "ticker": "TSLA",
        "headline": "Tesla Faces Supply Chain Disruptions in Shanghai Gigafactory",
        "source": "Bloomberg",
        "timestamp": _ago(3),
        "content": (
            "Tesla's Shanghai factory is experiencing significant supply chain disruptions "
            "affecting production targets for Q1. Logistics bottlenecks and a shortage of "
            "lithium carbonate have forced temporary line shutdowns. Analysts downgraded "
            "delivery estimates by 15%. CEO Elon Musk acknowledged challenges on social "
            "media but said the situation would normalise by mid-quarter. The stock fell 6% "
            "on the news."
        ),
    },
    {
        "id": "art003",
        "ticker": "AAPL",
        "headline": "Apple Expands AI Features in iOS 19, Partners with OpenAI",
        "source": "WSJ",
        "timestamp": _ago(5),
        "content": (
            "Apple announced a sweeping expansion of on-device AI capabilities in iOS 19, "
            "including deep integration with OpenAI's GPT-5 model for Siri. The company "
            "also unveiled new privacy-preserving inference techniques that keep user data "
            "on-device. Analysts expect the update to drive a significant iPhone upgrade "
            "cycle, improving long-term revenue visibility. Services revenue projections "
            "were revised upward by multiple sell-side firms."
        ),
    },
    {
        "id": "art004",
        "ticker": "MSFT",
        "headline": "Microsoft Azure Revenue Growth Slows Amid Capacity Constraints",
        "source": "FT",
        "timestamp": _ago(8),
        "content": (
            "Microsoft reported Azure cloud revenue growth of 28% year-over-year, below "
            "the 31% analyst consensus. Management cited data centre capacity constraints "
            "and elongated customer procurement cycles as the primary headwinds. CFO Amy "
            "Hood said on the earnings call that new capacity additions in 2026 should "
            "re-accelerate growth in the second half. Shares slipped 3% in after-hours "
            "trading before stabilising."
        ),
    },
    {
        "id": "art005",
        "ticker": "META",
        "headline": "Meta's Llama 4 Achieves State-of-the-Art Benchmarks, Boosting Ad Revenue Outlook",
        "source": "TechCrunch",
        "timestamp": _ago(12),
        "content": (
            "Meta Platforms released Llama 4, which outperformed competing models on "
            "standard NLP benchmarks. The open-source release is expected to accelerate "
            "developer adoption and improve Meta's advertising recommendation systems. "
            "The company raised its Q2 revenue guidance to $38-40 billion, up from prior "
            "estimates of $36-38 billion. Analysts called it a strong execution quarter "
            "and upgraded price targets across the board."
        ),
    },
    {
        "id": "art006",
        "ticker": "GOOGL",
        "headline": "Alphabet Faces Antitrust Ruling That Could Reshape Search Business",
        "source": "Reuters",
        "timestamp": _ago(15),
        "content": (
            "A federal judge ruled that Alphabet's Google illegally maintained a monopoly "
            "in the online search market, setting the stage for potential structural remedies "
            "including forced divestiture of Chrome. Attorneys general from 38 states joined "
            "the case. Alphabet shares fell 8% — the steepest single-day decline in three "
            "years. The company said it would appeal the decision and that any remedies would "
            "harm consumer privacy and security."
        ),
    },
    {
        "id": "art007",
        "ticker": "AMD",
        "headline": "AMD MI300X Gains Market Share as Hyperscalers Diversify AI Suppliers",
        "source": "CNBC",
        "timestamp": _ago(18),
        "content": (
            "Advanced Micro Devices is rapidly gaining AI accelerator market share as "
            "Amazon Web Services, Google Cloud, and Microsoft Azure diversify away from "
            "sole reliance on NVIDIA. The MI300X GPU has shown competitive performance "
            "in transformer inference workloads at lower cost-per-token. AMD raised its "
            "AI accelerator revenue forecast to $5 billion for the full year, up from "
            "$3.5 billion. Analysts see a credible path to 20% market share by 2027."
        ),
    },
    {
        "id": "art008",
        "ticker": "JPM",
        "headline": "JPMorgan Warns of Commercial Real Estate Losses Weighing on Regional Banks",
        "source": "Bloomberg",
        "timestamp": _ago(22),
        "content": (
            "JPMorgan Chase's chief economist warned that commercial real estate exposure "
            "remains the primary systemic risk for mid-size regional banks in 2026. Office "
            "vacancy rates in major metropolitan areas remain at historic highs of 22%, "
            "forcing refinancing at significantly higher rates. JPMorgan set aside an "
            "additional $2 billion in loan loss reserves. Several regional banks saw credit "
            "rating downgrades following the report."
        ),
    },
    {
        "id": "art009",
        "ticker": "NVDA",
        "headline": "NVIDIA Unveils Blackwell Ultra Architecture — 3x Performance Gain",
        "source": "The Verge",
        "timestamp": _ago(26),
        "content": (
            "NVIDIA's Blackwell Ultra GPU architecture delivers a 3x improvement in AI "
            "inference performance over the previous H200 generation. The new chips feature "
            "288GB of HBM4 memory and a new NVLink 5.0 interconnect for improved "
            "multi-GPU scaling. Volume production is targeted for Q3 2026. Microsoft, "
            "Google, and Amazon have already placed multi-billion dollar advance orders. "
            "The announcement solidifies NVIDIA's lead in the AI infrastructure market."
        ),
    },
    {
        "id": "art010",
        "ticker": "TSLA",
        "headline": "Tesla Cybertruck Recall Expanded to 200,000 Units Over Safety Defect",
        "source": "Reuters",
        "timestamp": _ago(30),
        "content": (
            "Tesla has expanded its Cybertruck recall to approximately 200,000 vehicles "
            "after the National Highway Traffic Safety Administration identified an "
            "accelerator pedal defect that could cause unintended acceleration in wet "
            "conditions. The company said a free over-the-air software update would be "
            "deployed, with physical repairs available at service centres. Consumer "
            "advocacy groups called for an independent safety audit, putting additional "
            "regulatory pressure on the company."
        ),
    },
    {
        "id": "art011",
        "ticker": "AAPL",
        "headline": "Apple's India Manufacturing Ramp Reduces China Supply Chain Risk",
        "source": "FT",
        "timestamp": _ago(36),
        "content": (
            "Apple now manufactures approximately 18% of its iPhones in India, up from "
            "7% two years ago, as the company aggressively diversifies its supply chain "
            "away from China-based Foxconn facilities. Tata Electronics has become a "
            "strategic manufacturing partner, investing $2.5 billion in new factory "
            "capacity in Tamil Nadu and Karnataka. Supply chain analysts view this as "
            "a significant risk reduction ahead of potential US-China trade escalation."
        ),
    },
    {
        "id": "art012",
        "ticker": "MSFT",
        "headline": "Microsoft Copilot Reaches 100 Million Enterprise Users",
        "source": "WSJ",
        "timestamp": _ago(40),
        "content": (
            "Microsoft announced that its AI-powered Copilot assistant has reached "
            "100 million monthly active users across enterprise Microsoft 365 subscriptions. "
            "The milestone was achieved 18 months ahead of the company's original target. "
            "Chief Commercial Officer Judson Althoff said productivity measurements show "
            "a 22% reduction in time spent on routine tasks for Copilot users. "
            "The milestone validates Microsoft's $10 billion OpenAI partnership and "
            "supports premium pricing for M365 E5 licences."
        ),
    },
    {
        "id": "art013",
        "ticker": "META",
        "headline": "EU Regulators Fine Meta €1.2 Billion for GDPR Data Transfer Violations",
        "source": "Reuters",
        "timestamp": _ago(48),
        "content": (
            "The Irish Data Protection Commission, acting as lead EU regulator, issued "
            "a record €1.2 billion fine against Meta Platforms for transferring European "
            "user data to US servers without adequate legal protections under GDPR. Meta "
            "has five months to bring its data practices into compliance or face additional "
            "operating restrictions in the EU. The company said it would appeal and that "
            "compliance costs were already factored into guidance."
        ),
    },
    {
        "id": "art014",
        "ticker": "AMZN",
        "headline": "Amazon AWS Launches GenAI Development Platform Bedrock 2.0",
        "source": "CNBC",
        "timestamp": _ago(52),
        "content": (
            "Amazon Web Services launched Bedrock 2.0, a significantly upgraded generative "
            "AI application development platform that now supports custom model fine-tuning, "
            "multi-agent orchestration, and built-in safety evaluation tools. The platform "
            "integrates with 50+ foundation models including Anthropic Claude 4 and "
            "Meta Llama 4. AWS CEO Matt Garman said the launch positions Amazon as the "
            "preferred platform for enterprise AI application builders seeking model choice "
            "and data privacy."
        ),
    },
    {
        "id": "art015",
        "ticker": "BA",
        "headline": "Boeing 737 MAX Production Halted After Quality Inspection Failures",
        "source": "Bloomberg",
        "timestamp": _ago(60),
        "content": (
            "Boeing temporarily halted 737 MAX production at its Renton, Washington "
            "facility after FAA inspectors identified non-conforming fastener installations "
            "on 50 aircraft. The halt is expected to last two to three weeks, affecting "
            "delivery schedules for Southwest Airlines and Ryanair. The setback compounds "
            "Boeing's recovery challenges following the 2024 quality crisis and "
            "machinists' strike. Moody's placed Boeing's debt on review for downgrade, "
            "citing deteriorating cash flow visibility."
        ),
    },
    {
        "id": "art016",
        "ticker": "GS",
        "headline": "Goldman Sachs M&A Advisory Revenue Surges 68% on Dealmaking Revival",
        "source": "FT",
        "timestamp": _ago(70),
        "content": (
            "Goldman Sachs reported a 68% year-over-year increase in M&A advisory revenue "
            "as a revival in corporate dealmaking lifted Wall Street's biggest firms. "
            "Investment banking backlog reached its highest level since 2021, with "
            "particular strength in technology, healthcare, and energy transition sectors. "
            "The firm also noted strong equities trading revenue, driven by increased "
            "volatility and client positioning activity. EPS beat consensus by 18%."
        ),
    },
    {
        "id": "art017",
        "ticker": "NFLX",
        "headline": "Netflix Ad-Supported Tier Crosses 80 Million Monthly Users",
        "source": "WSJ",
        "timestamp": _ago(80),
        "content": (
            "Netflix reported that its ad-supported subscription tier reached 80 million "
            "monthly active users globally, representing the majority of new subscriber "
            "additions in the quarter. Average revenue per user for the ad tier is now "
            "approaching the standard plan ARPU as advertising CPMs improve. The company "
            "is investing $17 billion in content for 2026 and expanding live programming "
            "including NFL games and global sporting events to drive engagement."
        ),
    },
    {
        "id": "art018",
        "ticker": "GOOGL",
        "headline": "Google DeepMind's Gemini Ultra Outperforms GPT-5 on Coding Benchmarks",
        "source": "TechCrunch",
        "timestamp": _ago(90),
        "content": (
            "Google DeepMind released benchmark results showing Gemini Ultra 2.0 "
            "outperforms OpenAI's GPT-5 on HumanEval coding tasks by a 4% margin and "
            "matches GPT-5 on MMLU reasoning benchmarks. The model is now powering "
            "Google's Workspace AI features and is available via Vertex AI for enterprise "
            "developers. Analysts see the results as a stabilisation of Google's position "
            "in the AI capability race after losing ground to OpenAI in 2024."
        ),
    },
]

# In-memory alerts store
_alerts_store: list = []

def get_articles(ticker: str | None = None) -> list:
    if ticker:
        return [a for a in ARTICLES if a["ticker"] == ticker.upper()]
    return ARTICLES

def get_all_articles() -> list:
    return ARTICLES

def get_alerts() -> list:
    return _alerts_store

def add_alert(alert: dict) -> dict:
    _alerts_store.append(alert)
    return alert

def delete_alert(alert_id: str) -> bool:
    global _alerts_store
    before = len(_alerts_store)
    _alerts_store = [a for a in _alerts_store if a["id"] != alert_id]
    return len(_alerts_store) < before
