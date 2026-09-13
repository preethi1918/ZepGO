export const ZEPO_COLORS = {
  // Primary Core Palette
  primaryDark: '#0B0F0D',     // Deep black for headers, primary CTAs, text
  primaryGreen: '#22C55E',    // EV Green for success, charger availability, LOW RISK badges
  backgroundGreen: '#EAF8EF', // Light green for cards, active states, chip highlights
  white: '#FFFFFF',           // Backgrounds and card surfaces
  greyText: '#6B7280',        // Secondary text & captions
  greyLight: '#F3F4F6',       // Light grey borders and card backgrounds
  greyBorder: '#E5E7EB',      // Border color for cards and inputs

  // Warning & Alert Palette (Reserved strictly for warnings)
  warningAmber: '#F59E0B',    // Moderate risk, battery warnings
  warningBg: '#FFFBEB',
  alertRed: '#EF4444',        // High risk, charger congestion alerts
  alertBg: '#FEF2F2',

  // EV Station Operators Brand Accents
  zeonBlue: '#0284C7',
  tataGreen: '#15803D',
  reluxPurple: '#7E22CE',
} as const;

export const ZEPO_STYLES = {
  cardRadius: 'rounded-[18px]',
  buttonRadius: 'rounded-[14px]',
  cardShadow: 'shadow-[0_4px_20px_-4px_rgba(11,15,13,0.06)]',
  cardBorder: 'border border-[#E5E7EB]',
  headingText: 'font-semibold tracking-tight text-[#0B0F0D]',
  bodyText: 'text-[#6B7280] text-sm leading-relaxed',
  greenBadge: 'bg-[#EAF8EF] text-[#22C55E] font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5',
  blackButton: 'bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-bold text-sm py-3.5 px-6 rounded-[14px] shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 w-full',
  greenButton: 'bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm py-3.5 px-6 rounded-[14px] shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 w-full',
};
