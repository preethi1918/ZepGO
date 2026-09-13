import React, { useState } from 'react';

interface SessionItem {
  id: string;
  station: string;
  date: string;
  duration: string;
  energyKwh: string;
  socAdded: string;
  amountPaid: string;
  ratePerKwh: string;
  gstAmount: string;
  txnId: string;
  network: string;
}

export const ActivityScreen: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(null);

  const historyItems: SessionItem[] = [
    {
      id: 'act-1',
      station: 'Zeon Charging Hub, Salem',
      date: 'Today, 2:15 PM',
      duration: '15 min',
      energyKwh: '32.4 kWh',
      socAdded: '+42%',
      amountPaid: '₹186.50',
      ratePerKwh: '₹22.00 / kWh',
      gstAmount: '₹28.45 (18% GST)',
      txnId: 'TXN-ZEON-8849201',
      network: 'Zeon Network',
    },
    {
      id: 'act-2',
      station: 'Tata Power EZ Charge, Hosur',
      date: '18 Aug 2026',
      duration: '22 min',
      energyKwh: '45.1 kWh',
      socAdded: '+58%',
      amountPaid: '₹245.00',
      ratePerKwh: '₹18.50 / kWh',
      gstAmount: '₹37.37 (18% GST)',
      txnId: 'TXN-TATA-3920119',
      network: 'Tata Power',
    },
    {
      id: 'act-3',
      station: 'Jio-BP Pulse, Dharmapuri',
      date: '10 Aug 2026',
      duration: '18 min',
      energyKwh: '28.0 kWh',
      socAdded: '+35%',
      amountPaid: '₹160.00',
      ratePerKwh: '₹16.00 / kWh',
      gstAmount: '₹24.40 (18% GST)',
      txnId: 'TXN-JIOBP-1029482',
      network: 'Jio-BP',
    },
  ];

  return (
    <div className="space-y-5 pb-24 pt-2 px-4 max-w-2xl mx-auto font-[Inter,sans-serif]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Charging Activity & Receipts</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Session history, invoices, and petrol savings report</p>
      </div>

      {/* Summary Impact Cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Sessions</p>
          <p className="text-base font-black text-slate-900 mt-0.5">24</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Saved vs Petrol</p>
          <p className="text-base font-black text-emerald-600 mt-0.5">₹14,280</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">CO2 Offset</p>
          <p className="text-base font-black text-blue-600 mt-0.5">410 kg</p>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Recent Sessions</h2>

        {historyItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedSession(item)}
            className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{item.station}</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {item.duration} • {item.energyKwh} ({item.socAdded})
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.date}</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="text-sm font-black text-slate-900">{item.amountPaid}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSession(item);
                }}
                className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-full transition-all cursor-pointer"
              >
                Receipt 📄
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Itemized Invoice Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Tax Invoice
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">{selectedSession.station}</h3>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Transaction ID</span>
                <span className="font-bold text-slate-900">{selectedSession.txnId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Date & Time</span>
                <span className="font-bold text-slate-900">{selectedSession.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Energy Delivered</span>
                <span className="font-bold text-slate-900">{selectedSession.energyKwh} ({selectedSession.socAdded})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Charging Rate</span>
                <span className="font-bold text-slate-900">{selectedSession.ratePerKwh}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Tax Breakdown</span>
                <span className="font-bold text-slate-700">{selectedSession.gstAmount}</span>
              </div>
              <div className="flex justify-between py-2 bg-emerald-50 p-3 rounded-2xl">
                <span className="font-bold text-emerald-900">Total Paid (UPI)</span>
                <span className="font-black text-emerald-700 text-sm">{selectedSession.amountPaid}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => alert(`Receipt PDF for ${selectedSession.txnId} downloaded successfully.`)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Download PDF Receipt
              </button>
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
