import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  ctaText: string;
  badge?: string;
  variant?: "starter" | "premium" | "gold" | "diamond";
  delay?: number;
}

export default function PricingCard({ 
  title, 
  price, 
  description, 
  features, 
  ctaText, 
  badge, 
  variant = "starter",
  delay = 0 
}: PricingCardProps) {
  
  const styles = {
    starter: {
      card: "bg-surface border-border-subtle hover:border-border-strong",
      badge: "",
      title: "text-content",
      price: "text-content",
      button: "bg-surface hover:bg-surface-hover border border-border-strong text-content",
      check: "text-primary/70",
      text: "text-content-muted"
    },
    premium: {
      card: "bg-surface-glass backdrop-blur-md border-blue-500/20 hover:border-blue-500/50 shadow-sm",
      badge: "",
      title: "text-blue-500",
      price: "text-content",
      button: "bg-primary hover:bg-primary-hover text-content-inverse shadow-sm",
      check: "text-blue-500",
      text: "text-content-muted"
    },
    gold: {
      card: "bg-surface border-primary ring-1 ring-primary shadow-[0_0_30px_rgba(26,122,76,0.15)] scale-100 lg:scale-105 z-10",
      badge: "bg-primary text-content-inverse",
      title: "text-primary",
      price: "text-content",
      button: "bg-primary hover:bg-primary-hover text-content-inverse shadow-md",
      check: "text-primary",
      text: "text-content-muted"
    },
    diamond: {
      card: "bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700 shadow-xl",
      badge: "bg-slate-700 text-white border border-slate-600",
      title: "text-slate-300",
      price: "text-white",
      button: "bg-white hover:bg-slate-200 text-slate-900 font-bold",
      check: "text-slate-400",
      text: "text-slate-300"
    }
  };

  const currentStyle = styles[variant];

  return (
    <div 
      className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${currentStyle.card} animate-in fade-in slide-in-from-bottom-8`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {badge && (
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest font-label shadow-sm whitespace-nowrap ${currentStyle.badge}`}>
          {badge}
        </div>
      )}

      <div className="mb-8">
        <h3 className={`text-lg font-bold font-headline uppercase tracking-widest mb-4 ${currentStyle.title}`}>
          {title}
        </h3>
        <div className="flex items-baseline gap-1 mb-3">
          <span className={`text-4xl font-extrabold font-headline ${currentStyle.price}`}>
            {price.split(' ')[0]}
          </span>
          <span className={`text-sm font-semibold ${currentStyle.text}`}>
            {price.substring(price.indexOf(' '))}
          </span>
        </div>
        <p className={`text-sm leading-relaxed ${currentStyle.text} h-10`}>
          {description}
        </p>
      </div>

      <div className="flex-1">
        <ul className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check size={18} className={`shrink-0 mt-0.5 ${currentStyle.check}`} />
              <span className={`text-sm font-medium ${currentStyle.text}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button className={`w-full py-4 rounded-xl font-bold transition-all duration-200 font-headline ${currentStyle.button}`}>
        {ctaText}
      </button>
    </div>
  );
}