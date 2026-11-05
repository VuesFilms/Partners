import {
  Building2, Coffee, ConciergeBell, Dumbbell, GraduationCap, Landmark, Megaphone, MapPinned,
  MonitorSmartphone, Ruler, ShoppingBag, Sparkles, Stethoscope, Truck, User, Users, UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import type { InvestorTypeId, ProvisionId, SectorId } from '../i18n/dictionary';

export const sectorIcon: Record<SectorId, LucideIcon> = {
  fnb: UtensilsCrossed,
  coffee: Coffee,
  fitness: Dumbbell,
  education: GraduationCap,
  retail: ShoppingBag,
  beauty: Sparkles,
  healthcare: Stethoscope,
  services: ConciergeBell,
};

export const investorTypeIcon: Record<InvestorTypeId, LucideIcon> = {
  individual: User,
  family: Users,
  firm: Landmark,
  corporate: Building2,
};

export const provisionIcon: Record<ProvisionId, LucideIcon> = {
  training: GraduationCap,
  supply: Truck,
  marketing: Megaphone,
  site: MapPinned,
  tech: MonitorSmartphone,
  fitout: Ruler,
};

/**
 * Gradients taken from the five circles on the palette card
 * (design-references/palette-plum-amber-teal.png).
 */
export const gradients = {
  magentaPlum: 'linear-gradient(160deg, #841E62 0%, #58094F 100%)',
  amberMagenta: 'linear-gradient(160deg, #F3AA20 0%, #841E62 100%)',
  navyAmber: 'linear-gradient(160deg, #2A445E 0%, #F3AA20 100%)',
  tealNavy: 'linear-gradient(160deg, #346B6D 0%, #2A445E 100%)',
  plumTeal: 'linear-gradient(160deg, #58094F 0%, #346B6D 100%)',
  navyTeal: 'linear-gradient(160deg, #2A445E 0%, #346B6D 100%)',
  tealPlum: 'linear-gradient(160deg, #346B6D 0%, #58094F 100%)',
  amberNavy: 'linear-gradient(160deg, #F3AA20 0%, #2A445E 100%)',
} as const;

export const sectorGradient: Record<SectorId, string> = {
  fnb: gradients.magentaPlum,
  coffee: gradients.amberMagenta,
  retail: gradients.navyAmber,
  fitness: gradients.tealNavy,
  beauty: gradients.plumTeal,
  education: gradients.navyTeal,
  healthcare: gradients.tealPlum,
  services: gradients.amberNavy,
};

export const investorGradient: Record<InvestorTypeId, string> = {
  individual: gradients.plumTeal,
  family: gradients.magentaPlum,
  firm: gradients.tealNavy,
  corporate: gradients.navyAmber,
};

/** "Dar Al-Jassim Family Office" → "DJ" */
export function initials(name: string) {
  const words = name
    .replace(/&/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^(Al|Bin)-?/i, ''))
    .filter((w) => /^[A-Za-z]/.test(w));
  return ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')).toUpperCase();
}
