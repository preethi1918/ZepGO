# ⚡ ZepGO — Premium EV Intelligent Journey Planning & Smart Stop System

> **Predictive Charger Availability Upon Arrival • Integrated Driver Rest & Cafe Intelligence • Built for Indian Highways & EVs**

---

## 🌟 Overview

**ZepGO** is a next-generation intelligent journey planning platform designed specifically for electric vehicle (EV) drivers. Unlike conventional mapping applications that only locate static charger pins, **ZepGO predicts charger reliability and plug occupancy at your exact arrival time** (+30 min / +60 min forecasts). 

ZepGO features an integrated **Smart Stop & Cafe Recommendation engine** that harmonizes driver comfort with EV charging needs—pairing rest breaks, cafes, and amenities to the vehicle's exact charging duration.

---

## ✨ Key Differentiators & Features

### 🔮 1. Predictive Charger Reliability (The Core Brain)
* **Arrival Occupancy Forecasts**: Calculates predicted plug availability (+30m / +60m ahead) using machine learning telemetry, historic queue data, and real-time highway flow.
* **LOW RISK Confidence Badges**: Displays green **LOW RISK** badges when arrival confidence exceeds 90%.
* **Automated Backup Rerouting**: Detects high-risk charger congestion ahead and proactively offers 1-tap reroutes to verified backup chargers (e.g. Relux 2.4 km away).

### ☕ 2. Contextual Smart Stop & Cafe Recommendations
* **Synchronized Rest & Charge**: Matches cafe recommendations to the EV's exact charging window (e.g. 24-minute charge at Salem = Saravana Bhavan Cafe + Restroom).
* **Driver Break Interval Alignment**: Prompts timely rest recommendations based on continuous driving duration and battery SOC.
* **Unified Stop Gauges**: Visualizes driver break time and battery charging time side-by-side on a synchronized progress ring.

### 🇮🇳 3. Tailored for Indian EVs & Highway Routes
* **Indian EV Specs**: Pre-configured battery telemetry for **Tata Nexon EV Max (40.5 kWh)**, **MG ZS EV (50.3 kWh)**, **Mahindra XUV400**, and **Hyundai Ioniq 5**.
* **Realistic Indian Corridors**: Real-world route simulation along the **NH544 highway corridor (Chennai → Vellore → Salem → Coimbatore)**.
* **Network Integration**: Integrated data for Zeon Charging, Relux Electric, Tata Power EZ Charge, and ChargeZone.

---

## 📱 34-Screen Master Interactive Prototype

ZepGO includes a complete 34-screen interactive mobile prototype rendered in an **iPhone 390x844px presentation frame**, featuring 4 interactive viewing modes:

1. 📱 **Interactive Phone View**: 100% clickable prototype inside an iPhone mockup frame with live status bar & battery telemetry.
2. 📊 **Figma-Style 34-Screen Flow Board**: Side-by-side presentation board displaying all 34 screens simultaneously.
3. ☕ **Smart Stop Suite**: Dedicated 10-screen breakdown of the Smart Stop & Cafe feature.
4. 🎨 **Design System Specs**: Live interactive documentation of design tokens, color scales, typography hierarchy, and UI component standards.

---

## 🎨 Visual Design System

| Element | Specification | Hex / Value |
|---|---|---|
| **Primary Color** | Deep Black (Text & CTAs) | `#0B0F0D` |
| **Action & Intelligence** | EV Green (Status & Available) | `#22C55E` |
| **Light Backgrounds** | Soft Light Green | `#EAF8EF` |
| **Card Surface** | Pure White | `#FFFFFF` |
| **Secondary Text** | Slate Grey | `#6B7280` |
| **Warning / Alerts** | Amber & Crimson (Strictly Warnings) | `#F59E0B` / `#EF4444` |
| **Border Radius** | Smooth Curved Cards | `16px` – `24px` |
| **Typography** | Sans-Serif Grid | Inter / System Sans |

---

## 📑 Complete 34-Screen Catalog

### 🚀 Core User Journey (Screens 1–24)
1. **Splash Screen**: Minimalist EV bolt logo with pulse animation.
2. **Three Onboarding Screens**: Smart Route, Smart Charging, & Intelligent Journey onboarding carousel.
3. **Login / Sign-up**: Mobile OTP (`+91`), Google SSO, and Guest Mode.
4. **Home Screen**: Location inputs, 72% battery status card, Tata Nexon context, quick routes, bottom navigation.
5. **Select Your EV**: Vehicle cards for Tata Nexon EV Max, MG ZS EV, Mahindra XUV400, Ioniq 5.
6. **Battery SOC Input**: Interactive SOC slider (0–100%), real range calculation, quick presets.
7. **Journey Preferences**: AC usage, charging network preferences, payload settings.
8. **AI Route Analysis**: Animated progress steps checking battery, elevation, weather & charger forecasts.
9. **Route Results (Hero)**: Chennai → Coimbatore (342 km, 1 stop at Salem), **LOW RISK** green status badge.
10. **Route Comparison**: 3 options (Optimal, Fastest, Minimal Stops).
11. **Smart Stop Detection Card**: Contextual break suggestion card during route planning.
12. **Recommended Stop Screen**: Combined driver rest + EV charging stop at Salem (Zeon 150 kW DC).
13. **Cafe Recommendation During Charging**: Cafes matched to the exact 24-minute charge duration.
14. **Charging + Cafe Combined Screen**: Unified stop card with synchronized driver break & charge time gauge.
15. **Add Stop Selection Menu**: Category selector modal (Cafes, Restaurants, Restrooms, Parks).
16. **Smart Stop Preferences**: Cuisine selection, dietary preferences, and rest break intervals.
17. **Route Updated Screen**: Recalculated route timeline, arrival SOC, and total trip duration.
18. **Alternative Stop Comparison**: Side-by-side comparison of 3 rest stop options along NH544.
19. **Stop Details Deep-Dive**: In-depth breakdown of Salem Saravana Bhavan & Zeon Fast Charger Hub.
20. **Live Navigation Map**: Turn-by-turn guidance banner, clean map layer, floating next charger card.
21. **Smart Stop Live Nav Card**: Floating notification card during live navigation for upcoming recommended stops.
22. **Charging Station Details**: Key differentiator screen — **+30m / +60m predictive plug availability graphs**.
23. **Charger Risk Alert Screen**: High congestion prediction warning with 1-tap backup charger reroute button.
24. **Backup Charger Selection**: Verified backup chargers (Relux Fast Charger 2.4 km away).

### ⚡ Utility & Profile Views (Screens 25–34)
25. **Charging Progress Screen**: 120 kW Fast charge gauge, live battery curve, nearby cafe amenities.
26. **Trip Completed Celebration**: Confetti celebration, total energy delivered, cost & Co2 savings.
27. **Trip Summary Analytics**: Analytics cards with 98.4% prediction accuracy score & petrol savings.
28. **Interactive Map Screen**: Search bar & quick filter chips (Fast / Available / Reliable).
29. **Charging Stations List**: List view sorted by predicted plug availability upon arrival.
30. **ZepGO AI Assistant**: Clean conversational Q&A interface for EV trip queries.
31. **Notifications Center**: Real-time alerts on charger status, congestion, and weather changes.
32. **Saved Places & Hubs**: Saved home/work destinations and favorite charger hubs.
33. **My EV Garage**: Connected vehicle specs, SOH (98%), and efficiency curves.
34. **Profile & App Settings**: User account management, preferences, and membership details.

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework**: React 18 with TypeScript
* **Build Tooling**: Vite 8
* **Styling & Design System**: Tailwind CSS, Lucide Icons, Custom Design Tokens (`src/theme/colors.ts`)
* **Mapping**: Leaflet / React-Leaflet
* **State & Data Services**: Modular TypeScript service layer (`src/services/`)

---

## 💻 Getting Started Locally

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Installation & Local Run

```bash
# Clone repository
git clone https://github.com/preethi1918/ZepGO.git

# Navigate to directory
cd ZepGO

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser to interact with the application.

### Building for Production

```bash
# Type check & build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
