import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export function CookieBanner({ onOpenPrivacy }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('atlas_cookie_consent');
      if (!consent) {
        // Délais court pour une apparition douce
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('atlas_cookie_consent', 'accepted');
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('atlas_cookie_consent', 'declined');
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      role="region"
      aria-label="Consentement aux cookies"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-[#161513] text-[#FDFBF7] p-5 sm:p-6 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C45525]/20 text-[#C45525] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold tracking-tight text-white mb-1.5">
              Respect de votre vie privée
            </h3>
            <p className="text-xs text-[#AAA398] leading-relaxed mb-4">
              Nous utilisons uniquement des cookies techniques essentiels au bon fonctionnement du site et des mesures d'audience anonymes pour améliorer nos services pour les artisans.{' '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="underline hover:text-white transition-colors cursor-pointer text-[#E5E0D8]"
              >
                En savoir plus
              </button>
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-2 rounded-lg bg-[#C45525] hover:bg-[#A9441B] text-white text-xs font-medium cursor-pointer transition-colors shadow-sm"
              >
                Tout accepter
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#AAA398] hover:text-white text-xs font-medium border border-white/10 cursor-pointer transition-colors"
              >
                Continuer sans accepter
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDecline}
            aria-label="Fermer le bandeau de cookies"
            className="text-[#6E665A] hover:text-white transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
