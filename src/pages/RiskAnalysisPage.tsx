import React, { useState } from 'react';
import {
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';

export const RiskAnalysisPage: React.FC = () => {
  const [trafficLevel] = useState<'normal' | 'heavy'>('heavy');
  const [weatherState] = useState<'clear' | 'rain' | 'hot'>('hot');
  const [batterySoc] = useState(62);

  // Risk Score Multi-factor calculations
  const batteryRiskScore = batterySoc < 25 ? 'HIGH' : batterySoc < 50 ? 'MEDIUM' : 'LOW';
  const chargerRiskScore = 'LOW'; // Zeon Salem has 4 ports, 3 available
  const trafficRiskScore = trafficLevel === 'heavy' ? 'MEDIUM' : 'LOW';
  const weatherRiskScore = weatherState === 'hot' || weatherState === 'rain' ? 'MEDIUM' : 'LOW';
  const elevationRiskScore = 'LOW'; // Salem to Coimbatore is moderate elevation (+180m)
  const compatibilityRiskScore = 'LOW'; // CCS2 to CCS2 match

  // Overall combined trip risk
  let overallRisk: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK' = 'LOW RISK';
  let overallReason = 'Route conditions and battery capacity provide a strong buffer above your 18% safety reserve.';

  if (trafficLevel === 'heavy' && batterySoc <= 62) {
    overallRisk = 'MEDIUM RISK';
    overallReason = 'Heavy traffic on NH-544 combined with 32°C cabin cooling increases consumption, bringing direct arrival SOC to 6.5%. Inserting a charging stop at Zeon Salem reduces trip risk to LOW.';
  } else if (batterySoc < 30) {
    overallRisk = 'HIGH RISK';
    overallReason = 'Direct arrival will deplete your pack below the critical 10% reserve threshold. Rerouting to nearest DC Fast Hub is mandatory.';
  }

  const riskFactors = [
    {
      title: '1. Battery & Arrival Margin Risk',
      level: batteryRiskScore,
      description: 'Tracks whether predicted arrival SOC remains safely above the 18% reserve margin.',
      recommendation: 'Top up 24 minutes at Salem Hub to secure a +24.1% buffer.'
    },
    {
      title: '2. Charger Availability & Queues',
      level: chargerRiskScore,
      description: 'Historical uptime (99.2%) and live plug forecasting (+30 min / +60 min arrival).',
      recommendation: '3 of 4 CCS2 bays currently free; zero wait anticipated.'
    },
    {
      title: '3. Traffic Congestion Energy Drain',
      level: trafficRiskScore,
      description: 'Stop-and-go highway crawling increases thermal idling and Wh/km draw by +15%.',
      recommendation: 'Accounted for in energy model (+3.4 kWh added).'
    },
    {
      title: '4. Weather & Cabin Thermal Loads',
      level: weatherRiskScore,
      description: 'Ambient 32°C climate requires continuous cabin AC compressor operation.',
      recommendation: 'Auto 22°C setpoint adds +1.8 kWh to route prediction.'
    },
    {
      title: '5. Route & Elevation Gradient',
      level: elevationRiskScore,
      description: '+180m net elevation gain between Salem corridor and Coimbatore plateau.',
      recommendation: 'Gradual incline accounted for in gravitational potential energy calculation.'
    },
    {
      title: '6. Connector Compatibility',
      level: compatibilityRiskScore,
      description: 'Vehicle CCS2 port verified against 120 kW dual-gun DC chargers.',
      recommendation: '100% plug & protocol compatibility confirmed.'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="warning" icon={<ShieldAlert className="w-3.5 h-3.5" />}>
                Multi-Factor Risk Engine
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/risk-analysis</span>
            </div>
            <PageTitle gradient>Journey Risk Analysis & Explainability Engine</PageTitle>
            <PageSubtitle>
              Evaluates battery depletion hazards, charger queues, weather drag, and provides transparent AI explanations.
            </PageSubtitle>
          </div>

          <Badge variant="neutral">Risk Algorithm: v2.4 (Active)</Badge>
        </div>

        {/* Overall Risk Card */}
        <Card variant="solid" className={`p-6 border-2 ${
          overallRisk === 'HIGH RISK' ? 'bg-rose-50 border-rose-300' :
          overallRisk === 'MEDIUM RISK' ? 'bg-amber-50 border-amber-300' :
          'bg-emerald-50 border-emerald-300'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Overall Journey Assessment</span>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-black ${
                  overallRisk === 'HIGH RISK' ? 'text-rose-700' :
                  overallRisk === 'MEDIUM RISK' ? 'text-amber-800' :
                  'text-emerald-800'
                }`}>
                  {overallRisk}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/80 border border-slate-200">
                  Corridor: Salem → Coimbatore (142 km)
                </span>
              </div>
              <p className="text-xs text-slate-700 max-w-2xl leading-relaxed pt-1">
                <strong>Why this rating?</strong> {overallReason}
              </p>
            </div>

            <div className="p-4 bg-white/90 rounded-2xl border border-slate-200 text-center shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Mitigation Applied</span>
              <span className="text-xs font-extrabold text-emerald-700 block">Scheduled Charging Stop</span>
              <span className="text-[11px] text-slate-500">Zeon Salem (24 min)</span>
            </div>
          </div>
        </Card>

        {/* 6 Risk Factors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {riskFactors.map((factor) => (
            <Card key={factor.title} variant="solid" className="p-5 space-y-3 bg-white border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h4 className="text-xs font-bold text-slate-900">{factor.title}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide ${
                  factor.level === 'HIGH' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                  factor.level === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {factor.level} RISK
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {factor.description}
              </p>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">ZepGO Mitigation</span>
                <span className="font-semibold">{factor.recommendation}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Transparent AI Explanation Engine Section */}
        <Card variant="solid" className="p-6 space-y-4 bg-white border-slate-200">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Transparent AI Explanation Engine</span>
            </h3>
            <p className="text-xs text-slate-500">Every algorithmic decision is fully articulated to eliminate black-box recommendations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Why is charging required?
              </span>
              <p className="text-slate-600 leading-relaxed">
                Reaching Coimbatore directly would leave your battery at 6.5% SOC, which breaches your 18% safety reserve.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Why was Zeon Salem chosen?
              </span>
              <p className="text-slate-600 leading-relaxed">
                It features 120 kW dual guns matching your CCS2 port, 99.2% verified uptime, and walkable amenities.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                What if conditions change?
              </span>
              <p className="text-slate-600 leading-relaxed">
                If traffic increases or rain starts, ZepGO dynamically alerts you and triggers seamless automatic rerouting.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};
