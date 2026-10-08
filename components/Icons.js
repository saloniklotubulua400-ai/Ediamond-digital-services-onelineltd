import {
  Globe, Smartphone, Boxes, Bot, MessagesSquare, Plug, CreditCard, ShoppingCart, Code2,
  Wrench, Cloud, ShieldCheck, BarChart3, BrainCircuit, GraduationCap, IdCard, Workflow,
  RefreshCw, Handshake, Lightbulb, Rocket, Headset, Users, BadgeDollarSign, Timer, LifeBuoy,
} from 'lucide-react';

const SERVICE_ICONS = {
  'web-development': Globe,
  'mobile-app-development': Smartphone,
  'business-management-systems': Boxes,
  'ai-services': Bot,
  'whatsapp-automation': MessagesSquare,
  'api-integration': Plug,
  'payment-solutions': CreditCard,
  'ecommerce-services': ShoppingCart,
  'software-development': Code2,
  'website-software-fixing': Wrench,
  'hosting-deployment': Cloud,
  cybersecurity: ShieldCheck,
  'data-analytics': BarChart3,
  'machine-learning': BrainCircuit,
  'developer-training': GraduationCap,
  'professional-digital-services': IdCard,
  'automation-services': Workflow,
  'monthly-maintenance': RefreshCw,
  'software-reselling': Handshake,
};

const MISC = { Lightbulb, ShieldCheck, Rocket, Headset, Users, BadgeDollarSign, Timer, LifeBuoy };

export function ServiceIcon({ slug, size = 22 }) {
  const Icon = SERVICE_ICONS[slug] || Code2;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}

export function MiscIcon({ name, size = 22 }) {
  const Icon = MISC[name] || Lightbulb;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}

export function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.43 15.1L2 22l5.04-1.58A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.2 15.02l-.3-.18-2.99.94.97-2.9-.2-.31A8.1 8.1 0 0 1 12.04 3.8Zm-3.2 3.9c-.17 0-.45.06-.69.32-.24.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.78 2.83 4.4 3.85 2.18.86 2.62.69 3.09.65.47-.04 1.52-.62 1.73-1.22.21-.6.21-1.11.15-1.22-.06-.11-.23-.17-.49-.3-.26-.13-1.52-.75-1.76-.84-.23-.09-.4-.13-.58.13-.17.26-.66.84-.81 1.01-.15.17-.3.2-.56.07-.26-.13-1.09-.4-2.07-1.28-.77-.68-1.28-1.52-1.43-1.78-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.92-.21-.5-.42-.43-.58-.44h-.5Z" />
    </svg>
  );
}
