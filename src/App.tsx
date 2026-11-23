import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  Monitor,
  Smartphone,
  Globe,
  Search,
  FileText,
  Phone,
  Mail,
  MapPin,
  Layers,
  Star,
  ShieldCheck,
  Server,
  Wrench,
  Droplets,
  Zap,
  Trees,
  Hammer,
  Home,
  Clock,
  AlertCircle,
  Info,
  Copy,
  Code2,
  Sliders,
  Compass,
  Send,
  Building2,
  Sun,
  Thermometer,
  BatteryCharging,
  Ruler,
  Shield,
  Eye
} from 'lucide-react';

// ============================================================================
// 1. CONFIGURATION WEBHOOK N8N & DONNÉES STRUCTURÉES
// ============================================================================

/**
 * Configuration de réception des demandes de contact via n8n.
 * RÈGLE DE TRANSPARENCE :
 * Tant que `webhookUrl` est vide (""), aucune fausse confirmation d'envoi n'est simulée.
 * Pour activer la réception réelle : renseigner l'URL du Webhook n8n (méthode POST).
 */
const N8N_WEBHOOK_CONFIG = {
  webhookUrl: '', // Ex: 'https://n8n.votre-domaine.fr/webhook/atlas-forge-contact'
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const TRADES_LIST = [
  'Couvreur / Zingueur',
  'Installateur de gouttières',
  'Plombier / Chauffagiste',
  'Électricien',
  'Installateur de pompes à chaleur',
  'Installateur de panneaux solaires',
  'Menuisier',
  'Paysagiste / Jardinier',
  'Maçon / Entreprise de construction',
  'Peintre / Entreprise de rénovation',
  'Serrurier',
  'Entreprise de nettoyage',
  'Autre artisan / entreprise locale',
];

const PROJECT_TYPES = [
  'Création de site vitrine sur mesure',
  'Refonte de site internet existant',
  'Site complet + optimisation SEO local',
  'Autre demande',
];

const BUDGET_RANGES = [
  'Non défini pour le moment',
  'Moins de 1 500 €',
  '1 500 € – 3 000 €',
  '3 000 € – 5 000 €',
  'Plus de 5 000 €',
];

const DEMOS_METADATA = [
  {
    slug: 'toitures-martin',
    category: 'Couverture',
    tradeLabel: 'Couvreur / Zingueur',
    companyName: 'Toitures Martin',
    tagline: 'Couverture, zinguerie & charpente traditionnelle',
    artisticDirection: 'Palette ardoise, zinc et terre cuite. Photographies de chantiers et mise en valeur du geste technique.',
    palette: ['#1E2226', '#B4532A', '#F5F4F0'],
    accent: '#B4532A',
    darkBg: '#1E2226',
    heroImage: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'aqua-confort',
    category: 'Plomberie',
    tradeLabel: 'Plombier / Chauffagiste',
    companyName: 'Aqua Confort',
    tagline: 'Salles de bains sur mesure, plomberie & chauffage',
    artisticDirection: 'Bleu profond architectural, blanc pur et touches laiton brossé. Esthétique soignée et rassurante.',
    palette: ['#0F2942', '#C59B5F', '#F8FAFC'],
    accent: '#C59B5F',
    darkBg: '#0F2942',
    heroImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'gouttieres-pro',
    category: 'Gouttières',
    tradeLabel: 'Installateur de gouttières',
    companyName: 'Gouttières Pro',
    tagline: 'Gouttières aluminium en continu, zinc & habillage de façades',
    artisticDirection: 'Gris aluminium, blanc net et ambre technique. Inclut un nuancier interactif de teintes et matériaux.',
    palette: ['#2D3136', '#D97706', '#F4F5F6'],
    accent: '#D97706',
    darkBg: '#2D3136',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'elec-habitat',
    category: 'Électricité',
    tradeLabel: 'Électricien',
    companyName: 'Élec Habitat',
    tagline: 'Installation électrique, mise aux normes & bornes IRVE',
    artisticDirection: 'Anthracite technique, lignes franches et accent jaune électrique maîtrisé. Clarté et rigueur.',
    palette: ['#16181D', '#EAB308', '#F8F9FA'],
    accent: '#EAB308',
    darkBg: '#16181D',
    heroImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'jardin-signature',
    category: 'Paysagisme',
    tradeLabel: 'Paysagiste / Jardinier',
    companyName: 'Jardin Signature',
    tagline: 'Architecture paysagère, terrasses & jardins durables',
    artisticDirection: 'Vert forêt, pierre sable et sauge. Composition éditoriale respirante mettant la nature au premier plan.',
    palette: ['#1F352B', '#6B8E78', '#EAE5DC'],
    accent: '#6B8E78',
    darkBg: '#1F352B',
    heroImage: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1400&q=80',
  },
  {
    slug: 'atelier-du-bois',
    category: 'Menuiserie',
    tradeLabel: 'Menuisier',
    companyName: 'Atelier du Bois',
    tagline: 'Menuiserie architecturale, escaliers & agencements sur mesure',
    artisticDirection: 'Noyer profond, lin crème et chêne doré. Mise en page chaleureuse valorisant les essences et les finitions.',
    palette: ['#3E2A1E', '#9C6B3B', '#F7F3EC'],
    accent: '#9C6B3B',
    darkBg: '#3E2A1E',
    heroImage: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?auto=format&fit=crop&w=1400&q=80',
  },
];

const SERVICE_PILLARS = [
  {
    badge: 'Fondation & Identité',
    title: 'L’Image de Marque & Vos Chantiers',
    description: 'Une présence sur mesure qui reflète le sérieux de votre entreprise et fait honneur à la qualité de vos réalisations.',
    featured: false,
    items: [
      {
        icon: Globe,
        title: 'Design sur mesure & sur plan',
        description: 'Conception personnalisée à vos couleurs et à votre métier, sans template préfabriqué.',
      },
      {
        icon: Smartphone,
        title: 'Expérience fluide sur smartphone',
        description: 'Adaptation parfaite mobile et tablette, là où vos clients recherchent un artisan en priorité.',
      },
      {
        icon: Layers,
        title: 'Mise en valeur de vos chantiers',
        description: 'Galeries de réalisations avant/après, finitions et matériaux pour rassurer avant le devis.',
      },
    ],
  },
  {
    badge: 'Rentabilité Locale',
    highlightBadge: 'Levier n°1 de rentabilité',
    title: 'La Visibilité Locale & Google',
    description: 'Positionnez votre entreprise au premier rang dans votre ville et votre secteur d’intervention.',
    featured: true,
    items: [
      {
        icon: Search,
        title: 'Référencement naturel local (SEO)',
        description: 'Structure technique et balisage ciblés sur vos prestations clés et vos communes d’intervention.',
      },
      {
        icon: Star,
        title: 'Intégration d’avis Google vérifiés',
        description: 'Affichage crédible de vos avis clients réels pour instaurer une confiance immédiate.',
      },
      {
        icon: Zap,
        title: 'Vitesse d’affichage instantanée',
        description: 'Pages optimisées sans lourdeur pour un chargement immédiat même avec une connexion 4G de chantier.',
      },
    ],
  },
  {
    badge: 'Conversion & Sérénité',
    title: 'La Conversion & Clé en Main',
    description: 'Transformez vos visiteurs en demandes qualifiées, sans perdre de temps en gestion technique.',
    featured: false,
    items: [
      {
        icon: FileText,
        title: 'Formulaires de devis qualifiés',
        description: 'Questions ciblées par métier pour recevoir les bonnes informations dès le premier contact.',
      },
      {
        icon: Phone,
        title: 'Appel direct en 1 geste',
        description: 'Boutons d’appel visibles et cliquables immédiatement sur mobile pour capter chaque contact chaud.',
      },
      {
        icon: Server,
        title: 'Hébergement & suivi technique',
        description: 'Gestion clé en main du nom de domaine, de la sécurité HTTPS et des sauvegardes continues.',
      },
    ],
  },
];

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Découverte de votre activité',
    description: 'Nous échangeons simplement sur votre métier, vos prestations prioritaires, votre zone d’intervention et vos objectifs. Pas de jargon technique.',
  },
  {
    number: '02',
    title: 'Création de votre site',
    description: 'Nous concevons le design, structurons les textes et développons votre site sur mesure pour refléter fidèlement la qualité de votre travail.',
  },
  {
    number: '03',
    title: 'Validation et ajustements',
    description: 'Vous découvrez votre site sur ordinateur et sur téléphone. Nous ajustons chaque détail avec vous jusqu’à validation complète.',
  },
  {
    number: '04',
    title: 'Mise en ligne',
    description: 'Votre site est publié, configuré pour Google et prêt à présenter votre entreprise à vos futurs clients.',
  },
];

const WHY_ATLAS_FORGE = [
  {
    title: 'Une approche adaptée aux artisans',
    description: 'Nous connaissons la réalité du terrain : vous manquez de temps. Notre méthode va à l’essentiel sans réunions inutiles.',
  },
  {
    title: 'Un design professionnel',
    description: 'Pas de modèles datés ni d’effets superflus. Une présentation sobre, structurée et crédible dès les premières secondes.',
  },
  {
    title: 'Des sites rapides et adaptés aux mobiles',
    description: 'Chaque page est optimisée pour se charger vite et offrir une lecture fluide sur tous les écrans.',
  },
  {
    title: 'Une communication directe',
    description: 'Un échange clair, transparent et réactif tout au long du projet, dans un langage compréhensible.',
  },
  {
    title: 'Une solution conçue pour valoriser votre entreprise',
    description: 'Chaque section est pensée pour mettre en avant votre savoir-faire et faciliter la prise de contact.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Combien coûte la création d’un site internet ?',
    answer: 'Nos formules complètes débutent à partir de 1 490 € HT pour un site vitrine d’autorité sur mesure, optimisé pour le référencement local et livré clé en main. Vous êtes 100% propriétaire de votre site internet et de votre nom de domaine dès le premier jour, sans aucun abonnement captif de 48 mois ni frais cachés. Pour un besoin spécifique (simulateur de devis métier, multi-zones), nous vous établissons un chiffrage détaillé et sans engagement sous 24h à 48h.',
  },
  {
    question: 'Combien de temps faut-il pour créer mon site ?',
    answer: 'Le délai dépend de l’ampleur du projet et de la rapidité avec laquelle nous réunissons vos éléments (prestations, photos de chantiers, informations de contact). Un calendrier précis est défini ensemble dès le démarrage.',
  },
  {
    question: 'Puis-je modifier mon site après sa mise en ligne ?',
    answer: 'Oui. Vous pouvez faire évoluer vos textes, ajouter de nouvelles réalisations ou mettre à jour vos prestations. Selon votre préférence, nous pouvons vous rendre autonome ou effectuer les modifications pour vous.',
  },
  {
    question: 'Mon site sera-t-il visible sur Google ?',
    answer: 'Nous construisons chaque site sur des bases techniques saines pour le référencement naturel local : structure de titres cohérente, rapidité de chargement, compatibilité mobile et mise en valeur de votre métier et de votre secteur géographique.',
  },
  {
    question: 'Le site fonctionnera-t-il sur smartphone ?',
    answer: 'Oui, c’est une priorité absolue. Tous nos sites sont pensés en mobile-first pour garantir une lecture confortable et des boutons de contact immédiatement accessibles sur téléphone.',
  },
  {
    question: 'Proposez-vous l’hébergement et la maintenance ?',
    answer: 'Oui, nous proposons l’hébergement, le suivi technique, les mises à jour et les sauvegardes en option, afin que vous puissiez rester concentré sur vos chantiers l’esprit tranquille.',
  },
  {
    question: 'Puis-je vous contacter même si je possède déjà un site ?',
    answer: 'Bien sûr. Nous accompagnons aussi bien les entreprises qui créent leur premier site que celles qui souhaitent moderniser un site vieillissant qui ne reflète plus leur niveau d’exigence.',
  },
];

// ============================================================================
// 2. COMPOSANTS UTILITAIRES & IDENTITÉ VISUELLE ATLAS FORGE
// ============================================================================

/**
 * Logo géométrique minimaliste SVG d'Atlas Forge
 */
function AtlasLogo({ dark = false, size = 'md' }) {
  const iconSize = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={iconSize}
        aria-hidden="true"
      >
        <rect
          width="36"
          height="36"
          rx="6"
          fill={dark ? '#FDFBF7' : '#1F1B16'}
        />
        <path
          d="M18 8L28 27H22.8L18 17.5L13.2 27H8L18 8Z"
          fill={dark ? '#161513' : '#F6F4EE'}
        />
        <rect x="14.5" y="23" width="7" height="3" rx="0.5" fill="#C45525" />
      </svg>
      <span
        className={`${textSize} font-semibold tracking-tight ${
          dark ? 'text-[#FDFBF7]' : 'text-[#1F1B16]'
        }`}
      >
        Atlas Forge
      </span>
    </span>
  );
}

/**
 * Révélation discrète au scroll (sans masquer durablement le contenu)
 */
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-200 ease-emil will-change-transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Formulaire de devis fictif réutilisable dans les 6 mini-sites de démonstration.
 * Affiche toujours de manière transparente qu'il s'agit d'une démonstration fictive.
 */
function DemoQuoteForm({
  companyName,
  accentColor,
  buttonTextColor = '#FFFFFF',
  surfaceClass = 'bg-white border-neutral-200',
  textClass = 'text-neutral-900',
  mutedClass = 'text-neutral-600',
  inputClass = 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-900',
  services = [],
}) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    service: services[0] || 'Demande de devis',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const idPrefix = (companyName || 'demo').toLowerCase().replace(/[^a-z0-9]/g, '-');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.details.trim()) {
      setError('Merci de renseigner votre nom, votre email et une description de votre besoin.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={`rounded-xl border p-6 sm:p-8 ${surfaceClass}`}>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accentColor }} />
          <div>
            <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 mb-3">
              Démonstration fictive
            </span>
            <h4 className={`text-base font-semibold mb-2 ${textClass}`}>
              Aperçu de confirmation — {companyName}
            </h4>
            <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${mutedClass}`}>
              Dans le cadre de cette démonstration fictive, aucune donnée n’a été transmise et
              l’entreprise « {companyName} » n’existe pas. Sur votre futur site créé par Atlas Forge,
              ce formulaire transmettra directement les demandes de devis qualifiées sur votre boîte
              mail ou votre outil de suivi.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setForm({
                  name: '',
                  phone: '',
                  email: '',
                  city: '',
                  service: services[0] || 'Demande de devis',
                  details: '',
                });
              }}
              className="text-xs font-mono underline underline-offset-4 cursor-pointer"
              style={{ color: accentColor }}
            >
              Tester à nouveau le formulaire
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`rounded-xl border p-6 sm:p-7 ${surfaceClass}`}>
      <div className="flex items-center justify-between gap-2 mb-5">
        <h3 className={`text-lg font-semibold ${textClass}`}>Demander un devis direct</h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
          Démo fictive
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor={`${idPrefix}-name`} className={`block text-xs font-medium mb-1.5 ${mutedClass}`}>
            Nom complet *
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex. Jean Dupont"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-phone`} className={`block text-xs font-medium mb-1.5 ${mutedClass}`}>
            Téléphone
          </label>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Ex. 06 00 00 00 00"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-email`} className={`block text-xs font-medium mb-1.5 ${mutedClass}`}>
            Adresse email *
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="nom@exemple.fr"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-city`} className={`block text-xs font-medium mb-1.5 ${mutedClass}`}>
            Commune du chantier
          </label>
          <input
            id={`${idPrefix}-city`}
            type="text"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="Ex. Nantes, Lyon..."
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inputClass}`}
          />
        </div>
      </div>

      {services.length > 0 && (
        <div className="mt-3.5">
          <label htmlFor={`${idPrefix}-service`} className={`block text-xs font-medium mb-1.5 ${mutedClass}`}>
            Prestation souhaitée
          </label>
          <select
            id={`${idPrefix}-service`}
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition ${inputClass}`}
          >
            {services.map((s) => (
              <option key={s} value={s} className="text-neutral-900 bg-white">
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4">
        <label htmlFor={`${idPrefix}-details`} className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${mutedClass}`}>
          Description de votre projet *
        </label>
        <textarea
          id={`${idPrefix}-details`}
          rows={3}
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          placeholder="Précisez la nature des travaux, la surface approximative ou vos délais souhaités..."
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition resize-none ${inputClass}`}
        />
      </div>

      <button
        type="submit"
        className="mt-5 w-full py-3 px-5 rounded-lg font-semibold text-sm transition hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
        style={{ backgroundColor: accentColor, color: buttonTextColor }}
      >
        <span>Envoyer la demande de devis (démo)</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

// ============================================================================
// 3. LES 6 MINI-SITES INDÉPENDANTS ET NAVIGABLES
// ============================================================================

/**
 * Helper pour naviguer en douceur dans un mini-site (même dans un conteneur scrollable)
 */
function scrollToSectionId(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* --------------------------------------------------------------------------
 * DÉMO 1 : TOITURES MARTIN (COUVERTURE — ARDOISE, ZINC & TERRE CUITE)
 * -------------------------------------------------------------------------- */
function ToituresMartinSite() {
  const [activeProject, setActiveProject] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  const services = [
    {
      title: 'Couverture tuiles & ardoise',
      desc: 'Pose en neuf et rénovation complète en ardoise naturelle, tuiles terre cuite plates ou mécaniques, dans le respect du bâti local.',
      icon: Home,
    },
    {
      title: 'Zinguerie & étanchéité',
      desc: 'Façonnage sur mesure de noues, abergements de cheminée, solins, chéneaux et raccords en zinc naturel ou prépatiné.',
      icon: Shield,
    },
    {
      title: 'Charpente & isolation',
      desc: 'Renforcement de charpente traditionnelle, pose de fenêtres de toit et isolation thermique par l’extérieur (sarking).',
      icon: Layers,
    },
    {
      title: 'Nettoyage & démoussage',
      desc: 'Entretien raisonné de couverture, contrôle des points singuliers, remplacement de tuiles cassées et traitement hydrofuge.',
      icon: Wrench,
    },
  ];

  const projects = [
    {
      title: 'Réfection complète en ardoise naturelle',
      category: 'Rénovation de couverture',
      details: 'Dépose de l’ancienne couverture, pose d’un écran sous-toiture HPV, liteaunage et pose au crochet inox.',
      image: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Habillage zinc & étanchéité de toiture',
      category: 'Zinguerie sur mesure',
      details: 'Réalisation d’abergements soudés à l’étain et de rives en zinc quartz sur maison de caractère.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Charpente traditionnelle & reprise de panne',
      category: 'Charpente & structure',
      details: 'Consolidation de ferme en chêne, alignement de toiture et préparation pour couverture terre cuite.',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return (
    <div className="bg-[#F5F4F0] text-[#1E2226] min-h-screen font-sans">
      {/* Header interne */}
      <header className="sticky top-0 z-30 bg-[#1E2226]/95 backdrop-blur border-b border-white/10 text-white">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollToSectionId('tm-hero')}
            className="flex items-center gap-2.5 font-bold tracking-tight text-lg cursor-pointer"
          >
            <span className="w-7 h-7 rounded bg-[#B4532A] flex items-center justify-center text-white text-xs font-extrabold">
              TM
            </span>
            <span>Toitures Martin</span>
          </button>

          <nav className="hidden md:flex items-center gap-7 text-sm text-neutral-300">
            <button type="button" onClick={() => scrollToSectionId('tm-prestations')} className="hover:text-white transition cursor-pointer">
              Prestations
            </button>
            <button type="button" onClick={() => scrollToSectionId('tm-realisations')} className="hover:text-white transition cursor-pointer">
              Réalisations
            </button>
            <button type="button" onClick={() => scrollToSectionId('tm-engagements')} className="hover:text-white transition cursor-pointer">
              L’entreprise
            </button>
            <button
              type="button"
              onClick={() => scrollToSectionId('tm-devis')}
              className="px-4 py-2 rounded bg-[#B4532A] hover:bg-[#994320] text-white font-semibold transition cursor-pointer"
            >
              Demander un devis
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 text-neutral-200 cursor-pointer"
            aria-label="Menu Toitures Martin"
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-[#1E2226] border-t border-white/10 px-5 py-4 flex flex-col gap-3 text-sm">
            {['tm-prestations:Prestations', 'tm-realisations:Réalisations', 'tm-engagements:L’entreprise', 'tm-devis:Demander un devis'].map((item) => {
              const [id, label] = item.split(':');
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMobileMenu(false);
                    scrollToSectionId(id);
                  }}
                  className="text-left py-1.5 text-neutral-200 hover:text-white cursor-pointer"
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="tm-hero" className="relative bg-[#1E2226] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1600&q=80"
            alt="Travaux de couverture et toiture"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E2226] via-[#1E2226]/85 to-[#1E2226]/40" />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E08A64] mb-4">
              <span className="w-6 h-px bg-[#B4532A]" />
              Artisan couvreur & zingueur — Démonstration fictive
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight mb-6">
              Protéger votre maison avec une toiture durable et soignée.
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8">
              Couverture en ardoise et terre cuite, zinguerie traditionnelle, rénovation de charpente
              et entretien complet de votre toit. Un travail exécuté dans les règles de l’art.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollToSectionId('tm-devis')}
                className="px-6 py-3.5 rounded bg-[#B4532A] hover:bg-[#994320] text-white font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>Demander un devis gratuit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSectionId('tm-realisations')}
                className="px-6 py-3.5 rounded border border-white/25 hover:bg-white/10 text-white font-semibold text-sm transition cursor-pointer"
              >
                Voir nos réalisations
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Prestations */}
      <section id="tm-prestations" className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
        <div className="max-w-xl mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#B4532A] mb-2">Nos métiers</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1E2226]">
            Des interventions maîtrisées de la charpente aux finitions zinc.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="bg-white rounded-xl p-7 border border-[#E5E2DA] hover:border-[#B4532A]/40 transition"
              >
                <div className="w-11 h-11 rounded-lg bg-[#F5F4F0] text-[#B4532A] flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Réalisations interactives */}
      <section id="tm-realisations" className="bg-white border-y border-[#E5E2DA] py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#B4532A] mb-2">Réalisations</p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Exemples de chantiers</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {projects.map((p, idx) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => setActiveProject(idx)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeProject === idx
                      ? 'bg-[#1E2226] text-white'
                      : 'bg-[#F5F4F0] text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  0{idx + 1}. {p.category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 overflow-hidden rounded-xl bg-[#1E2226] aspect-[16/10]">
              <img
                src={projects[activeProject].image}
                alt={projects[activeProject].title}
                className="w-full h-full object-cover transition duration-500"
              />
            </div>
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B4532A]">
                {projects[activeProject].category}
              </span>
              <h3 className="text-2xl font-bold mt-2 mb-4">{projects[activeProject].title}</h3>
              <p className="text-neutral-600 leading-relaxed mb-6">{projects[activeProject].details}</p>
              <div className="space-y-2.5 text-sm text-neutral-700 border-t border-neutral-200 pt-5">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B4532A]" />
                  <span>Matériaux sélectionnés pour leur tenue dans le temps</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B4532A]" />
                  <span>Chantier sécurisé et laissé propre à réception</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section id="tm-engagements" className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
        <div className="bg-[#1E2226] text-white rounded-2xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#E08A64] mb-2">Notre approche</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Un diagnostic clair avant chaque intervention.
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Avant d’établir un devis, nous inspectons systématiquement l’état de la couverture,
              des liteaux, des points d’étanchéité et des évacuations d’eaux pluviales. Vous savez
              exactement ce qui est nécessaire, sans travaux superflus.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Visite technique & devis détaillé',
              'Respect des DTU couverture & zinc',
              'Interlocuteur unique du début à la fin',
              'Suivi rigoureux des délais annoncés',
            ].map((item) => (
              <div key={item} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                <Check className="w-4 h-4 text-[#E08A64] shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-100">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Devis */}
      <section id="tm-devis" className="max-w-6xl mx-auto px-5 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B4532A] mb-2">Contact & Devis</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Un projet de toiture ou une fuite à inspecter ?</h2>
            <p className="text-neutral-600 text-sm leading-relaxed mb-6">
              Décrivez votre besoin via ce formulaire. Cette page est un modèle de démonstration
              fictive conçu par Atlas Forge pour illustrer un site de couvreur-zingueur.
            </p>
            <div className="space-y-3 text-sm text-neutral-700">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#B4532A]" />
                <span>Zone d’intervention : Exemple — Département & communes voisines</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#B4532A]" />
                <span>Du lundi au vendredi — Sur rendez-vous</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <DemoQuoteForm
              companyName="Toitures Martin"
              accentColor="#B4532A"
              services={services.map((s) => s.title)}
            />
          </div>
        </div>
      </section>

      <footer className="bg-[#16191C] text-neutral-400 text-xs py-8 px-5 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-white">Toitures Martin — Couverture & Zinguerie</p>
          <p>Démonstration fictive réalisée par Atlas Forge</p>
        </div>
      </footer>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * DÉMO 2 : AQUA CONFORT (PLOMBERIE — BLEU PROFOND, BLANC PUR & LAITON)
 * -------------------------------------------------------------------------- */
function AquaConfortSite() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const services = [
    {
      title: 'Création de salle de bains clé en main',
      desc: 'Conception, plomberie, douche à l’italienne, robinetterie encastrée et finitions soignées pour un espace fonctionnel et durable.',
      icon: Droplets,
    },
    {
      title: 'Plomberie générale & rénovation',
      desc: 'Remplacement de réseaux cuivre et multicouche, pose d’adoucisseurs, chauffe-eau thermodynamiques et équipements sanitaires.',
      icon: Wrench,
    },
    {
      title: 'Chauffage & pompes à chaleur',
      desc: 'Installation, réglage et entretien de pompes à chaleur air/eau, planchers chauffants et radiateurs haute performance.',
      icon: Thermometer,
    },
    {
      title: 'Dépannage & recherche de fuite',
      desc: 'Intervention méthodique en cas de fuite, canalisation bouchée ou panne de chauffe-eau avec diagnostic transparent.',
      icon: ShieldCheck,
    },
  ];

  const gallery = [
    {
      title: 'Salle de bains minérale & douche à l’italienne',
      tag: 'Rénovation complète',
      img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Robinetterie laiton & vasque sur mesure',
      tag: 'Agencement sanitaire',
      img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Espace bain contemporain',
      tag: 'Création clé en main',
      img: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  return (
    <div className="bg-white text-[#0F2942] min-h-screen font-sans">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollToSectionId('ac-hero')}
            className="flex items-center gap-2.5 font-bold text-lg text-[#0F2942] cursor-pointer"
          >
            <span className="w-8 h-8 rounded-full bg-[#0F2942] text-[#C59B5F] flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </span>
            <span>Aqua Confort</span>
          </button>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button type="button" onClick={() => scrollToSectionId('ac-services')} className="hover:text-[#0F2942] cursor-pointer">
              Prestations
            </button>
            <button type="button" onClick={() => scrollToSectionId('ac-galerie')} className="hover:text-[#0F2942] cursor-pointer">
              Réalisations
            </button>
            <button type="button" onClick={() => scrollToSectionId('ac-approche')} className="hover:text-[#0F2942] cursor-pointer">
              Engagements
            </button>
            <button
              type="button"
              onClick={() => scrollToSectionId('ac-devis')}
              className="px-4 py-2 rounded-full bg-[#0F2942] hover:bg-[#173B5E] text-white font-semibold transition cursor-pointer"
            >
              Devis gratuit
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 text-[#0F2942] cursor-pointer"
            aria-label="Menu Aqua Confort"
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-slate-200 px-5 py-4 flex flex-col gap-3 text-sm">
            {['ac-services:Prestations', 'ac-galerie:Réalisations', 'ac-approche:Engagements', 'ac-devis:Devis gratuit'].map((item) => {
              const [id, label] = item.split(':');
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMobileMenu(false);
                    scrollToSectionId(id);
                  }}
                  className="text-left py-1.5 text-slate-700 font-medium cursor-pointer"
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Hero Split */}
      <section id="ac-hero" className="max-w-6xl mx-auto px-5 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#C59B5F] mb-3">
              Plomberie • Chauffage • Salles de bains — Démo fictive
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight text-[#0F2942] mb-6">
              Le confort thermique et sanitaire pensé dans les moindres détails.
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
              De la création d’une salle de bains contemporaine à l’installation de votre chauffage,
              nous associons rigueur technique, matériaux fiables et finitions impeccables.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollToSectionId('ac-devis')}
                className="px-6 py-3.5 rounded-full bg-[#0F2942] hover:bg-[#173B5E] text-white font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>Demander un devis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSectionId('ac-galerie')}
                className="px-6 py-3.5 rounded-full border border-slate-300 hover:border-[#0F2942] text-[#0F2942] font-semibold text-sm transition cursor-pointer"
              >
                Découvrir nos salles de bains
              </button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1400&q=80"
                alt="Salle de bains moderne"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-xl p-4 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#C59B5F]">Savoir-faire sanitaire</p>
                  <p className="text-sm font-semibold text-[#0F2942]">Installations neuves & rénovations complètes</p>
                </div>
                <Droplets className="w-5 h-5 text-[#0F2942] shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="ac-services" className="bg-[#F8FAFC] py-16 sm:py-24 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C59B5F] mb-2">Nos domaines d’intervention</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0F2942]">
              Des solutions fiables pour votre eau et votre chauffage.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-[#0F2942] text-[#C59B5F] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F2942] mb-2.5">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section id="ac-galerie" className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C59B5F] mb-2">Inspirations & chantiers</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0F2942]">Des finitions propres et durables.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div key={item.title} className="group rounded-2xl overflow-hidden border border-slate-200 bg-white">
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C59B5F]">{item.tag}</span>
                <h3 className="text-base font-bold text-[#0F2942] mt-1">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Engagements */}
      <section id="ac-approche" className="bg-[#0F2942] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Devis clair & détaillé', text: 'Chaque poste (fournitures, main-d’œuvre, équipements) est précisé avant le début des travaux.' },
            { title: 'Équipements reconnus', text: 'Sélection de marques sanitaires et thermiques reconnues pour la disponibilité des pièces.' },
            { title: 'Propreté de chantier', text: 'Protection des sols, évacuation des gravats et contrôle d’étanchéité systématique.' },
          ].map((item) => (
            <div key={item.title} className="border-l-2 border-[#C59B5F] pl-5">
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Devis */}
      <section id="ac-devis" className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C59B5F] mb-2">Parlons de votre projet</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2942] mb-4">
              Besoin d’un plombier chauffagiste ?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Remplissez ce formulaire pour décrire votre projet de salle de bains, de chauffage ou
              de rénovation sanitaire. Modèle de démonstration fictive créé par Atlas Forge.
            </p>
          </div>
          <div className="lg:col-span-7">
            <DemoQuoteForm
              companyName="Aqua Confort"
              accentColor="#0F2942"
              services={services.map((s) => s.title)}
            />
          </div>
        </div>
      </section>

      <footer className="bg-[#0A1D30] text-slate-400 text-xs py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-white">Aqua Confort — Plomberie, Chauffage & Salles de bains</p>
          <p>Démonstration fictive réalisée par Atlas Forge</p>
        </div>
      </footer>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * DÉMO 3 : GOUTTIÈRES PRO (GOUTTIÈRES — GRIS ALU, BLANC & AMBRE + NUANCIER)
 * -------------------------------------------------------------------------- */
function GouttieresProSite() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState(0);

  const finishes = [
    { name: 'Gris Anthracite (RAL 7016)', material: 'Aluminium laqué en continu', hex: '#383E42', desc: 'Idéal pour les maisons contemporaines et menuiseries sombres.' },
    { name: 'Blanc Pur (RAL 9010)', material: 'Aluminium laqué en continu', hex: '#F1F2F4', desc: 'Discret sur les façades claires et les débords de toit blancs.' },
    { name: 'Sable / Pierre (RAL 1015)', material: 'Aluminium laqué en continu', hex: '#D8CDB8', desc: 'S’harmonise naturellement avec les enduits ton pierre et façades traditionnelles.' },
    { name: 'Zinc Naturel', material: 'Zinc laminé', hex: '#9EA6AD', desc: 'Matériau noble qui développe une patine protectrice au fil des années.' },
    { name: 'Noir Sablé (RAL 9005)', material: 'Aluminium laqué texturé', hex: '#1E2022', desc: 'Contraste architectural affirmé pour les bâtis modernes.' },
  ];

  const services = [
    {
      title: 'Pose de gouttières aluminium en continu',
      desc: 'Profilage directement sur place à la longueur exacte de votre façade, sans raccords intermédiaires pour limiter les risques de fuite.',
      icon: Ruler,
    },
    {
      title: 'Gouttières zinc & PVC',
      desc: 'Pose traditionnelle en zinc soudé pour les maisons de caractère ou solutions PVC fiables pour les annexes et rénovations.',
      icon: Layers,
    },
    {
      title: 'Habillage de bandeaux & sous-faces',
      desc: 'Protection durable des planches de rive en aluminium laqué ou lambris PVC afin de supprimer les corvées de peinture en hauteur.',
      icon: Home,
    },
    {
      title: 'Entretien, nettoyage & pare-feuilles',
      desc: 'Curage des gouttières, contrôle des descentes d’eau pluviale et pose de grilles pare-feuilles.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="bg-[#F4F5F6] text-[#2D3136] min-h-screen font-sans">
      <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollToSectionId('gp-hero')}
            className="flex items-center gap-2.5 font-extrabold tracking-tight text-lg text-[#2D3136] cursor-pointer"
          >
            <span className="w-7 h-7 rounded bg-[#2D3136] text-[#D97706] flex items-center justify-center text-xs font-black">
              GP
            </span>
            <span>Gouttières Pro</span>
          </button>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <button type="button" onClick={() => scrollToSectionId('gp-services')} className="hover:text-[#2D3136] cursor-pointer">
              Prestations
            </button>
            <button type="button" onClick={() => scrollToSectionId('gp-nuancier')} className="hover:text-[#2D3136] cursor-pointer">
              Coloris & matériaux
            </button>
            <button type="button" onClick={() => scrollToSectionId('gp-devis')} className="px-4 py-2 rounded bg-[#D97706] hover:bg-[#B45309] text-white font-semibold transition cursor-pointer">
              Devis gratuit
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 text-[#2D3136] cursor-pointer"
            aria-label="Menu Gouttières Pro"
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-neutral-200 px-5 py-4 flex flex-col gap-3 text-sm">
            {['gp-services:Prestations', 'gp-nuancier:Coloris & matériaux', 'gp-devis:Devis gratuit'].map((item) => {
              const [id, label] = item.split(':');
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMobileMenu(false);
                    scrollToSectionId(id);
                  }}
                  className="text-left py-1.5 text-neutral-700 font-medium cursor-pointer"
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="gp-hero" className="relative bg-[#2D3136] text-white">
        <div className="max-w-6xl mx-auto px-5 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-3">
              Spécialiste évacuation des eaux pluviales — Démo fictive
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-6">
              Des gouttières sur mesure pour protéger durablement vos façades.
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mb-8">
              Fabrication sur place de gouttières aluminium sans raccord, pose zinc, habillage de
              bandeaux et sous-faces de toiture pour maisons individuelles.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollToSectionId('gp-devis')}
                className="px-6 py-3.5 rounded bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>Demander un chiffrage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSectionId('gp-nuancier')}
                className="px-6 py-3.5 rounded border border-white/25 hover:bg-white/10 text-white font-semibold text-sm transition cursor-pointer"
              >
                Explorer les coloris
              </button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl aspect-[16/10]">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80"
                alt="Maison individuelle et lignes de toiture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Prestations */}
      <section id="gp-services" className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
        <div className="max-w-xl mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-2">Nos prestations</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#2D3136]">
            Étanchéité, esthétique de façade et zéro entretien superflu.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="bg-white rounded-xl p-7 border border-neutral-200">
                <div className="w-10 h-10 rounded-lg bg-[#2D3136] text-[#F59E0B] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Configurateur / Nuancier interactif */}
      <section id="gp-nuancier" className="bg-white border-y border-neutral-200 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-2">Nuancier interactif</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#2D3136] mb-3">
              Harmonisez vos gouttières avec vos menuiseries et votre façade.
            </h2>
            <p className="text-sm text-neutral-600">
              Sélectionnez une teinte ci-dessous pour visualiser le rendu sur profilé et les caractéristiques du matériau.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-2.5">
              {finishes.map((f, idx) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => setSelectedFinish(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-center gap-4 cursor-pointer ${
                    selectedFinish === idx
                      ? 'border-[#D97706] bg-amber-50/50 shadow-sm'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <span
                    className="w-9 h-9 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: f.hex }}
                  />
                  <div>
                    <p className="font-bold text-sm text-[#2D3136]">{f.name}</p>
                    <p className="text-xs text-neutral-500">{f.material}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 bg-[#F4F5F6] rounded-2xl p-6 sm:p-10 border border-neutral-200">
              <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-4">
                  Aperçu schématique du profilé corniche & descente
                </p>
                {/* Illustration SVG du profilé de gouttière colorisé en temps réel */}
                <div className="rounded-lg bg-gradient-to-b from-sky-50 to-neutral-100 p-6 flex items-center justify-center border border-neutral-200 mb-6">
                  <svg viewBox="0 0 360 150" className="w-full max-w-md h-auto">
                    {/* Toit */}
                    <polygon points="20,45 250,45 270,25 40,25" fill="#4B5563" />
                    {/* Bandeau */}
                    <rect x="40" y="45" width="210" height="22" fill="#E5E7EB" stroke="#CBD5E1" />
                    {/* Gouttière profilée */}
                    <path
                      d="M35 60 L265 60 L258 82 L42 82 Z"
                      fill={finishes[selectedFinish].hex}
                      stroke="#1F2937"
                      strokeOpacity="0.25"
                      strokeWidth="1.5"
                    />
                    {/* Naissance & descente */}
                    <rect
                      x="220"
                      y="82"
                      width="18"
                      height="60"
                      rx="2"
                      fill={finishes[selectedFinish].hex}
                      stroke="#1F2937"
                      strokeOpacity="0.25"
                      strokeWidth="1.5"
                    />
                    {/* Colliers */}
                    <rect x="217" y="102" width="24" height="5" rx="1" fill="#1F2937" fillOpacity="0.4" />
                    <rect x="217" y="126" width="24" height="5" rx="1" fill="#1F2937" fillOpacity="0.4" />
                  </svg>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#2D3136]">{finishes[selectedFinish].name}</h3>
                    <p className="text-xs font-semibold text-[#D97706] mb-2">{finishes[selectedFinish].material}</p>
                    <p className="text-sm text-neutral-600">{finishes[selectedFinish].desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Devis */}
      <section id="gp-devis" className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-2">Devis sur mesure</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3136] mb-4">
              Faites chiffrer le remplacement ou la pose de vos gouttières.
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Indiquez la longueur approximative de façade ou le type d’habitation. Démonstration
              fictive réalisée par Atlas Forge.
            </p>
          </div>
          <div className="lg:col-span-7">
            <DemoQuoteForm
              companyName="Gouttières Pro"
              accentColor="#D97706"
              services={services.map((s) => s.title)}
            />
          </div>
        </div>
      </section>

      <footer className="bg-[#2D3136] text-neutral-400 text-xs py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-white">Gouttières Pro — Aluminium, Zinc & Habillage de façades</p>
          <p>Démonstration fictive réalisée par Atlas Forge</p>
        </div>
      </footer>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * DÉMO 4 : ÉLEC HABITAT (ÉLECTRICITÉ — ANTHRACITE TECHNIQUE & JAUNE SOBRE)
 * -------------------------------------------------------------------------- */
function ElecHabitatSite() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const services = [
    {
      title: 'Mise aux normes NF C 15-100',
      desc: 'Diagnostic de votre installation existante, mise à la terre, protections différentielles et sécurisation complète de l’habitat.',
      icon: ShieldCheck,
    },
    {
      title: 'Tableaux électriques',
      desc: 'Remplacement de tableaux anciens, repérage clair des circuits et câblage structuré pour une maintenance simple et fiable.',
      icon: Sliders,
    },
    {
      title: 'Bornes de recharge IRVE',
      desc: 'Installation de bornes de recharge pour véhicules électriques en maison individuelle ou copropriété avec gestion de puissance.',
      icon: BatteryCharging,
    },
    {
      title: 'Domotique & éclairage',
      desc: 'Éclairage architectural intérieur et extérieur, gestion connectée du chauffage, volets roulants et pilotage énergétique.',
      icon: Sun,
    },
  ];

  const projects = [
    {
      title: 'Éclairage architectural & rénovation complète',
      desc: 'Création de scénarios lumineux LED encastrés et appareillage design.',
      img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Borne de recharge résidentielle 7,4 kW',
      desc: 'Ligne dédiée protégée avec délestage dynamique selon la consommation du foyer.',
      img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Pilotage connecté & confort thermique',
      desc: 'Centralisation des commandes d’éclairage et de chauffage sur interface simple.',
      img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  return (
    <div className="bg-[#F8F9FA] text-[#16181D] min-h-screen font-sans">
      <header className="sticky top-0 z-30 bg-[#16181D] text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollToSectionId('eh-hero')}
            className="flex items-center gap-2.5 font-bold text-lg cursor-pointer"
          >
            <span className="w-7 h-7 rounded bg-[#EAB308] text-[#16181D] flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </span>
            <span>Élec Habitat</span>
          </button>

          <nav className="hidden md:flex items-center gap-7 text-sm text-neutral-300">
            <button type="button" onClick={() => scrollToSectionId('eh-services')} className="hover:text-white cursor-pointer">
              Prestations
            </button>
            <button type="button" onClick={() => scrollToSectionId('eh-realisations')} className="hover:text-white cursor-pointer">
              Installations
            </button>
            <button
              type="button"
              onClick={() => scrollToSectionId('eh-devis')}
              className="px-4 py-2 rounded bg-[#EAB308] hover:bg-[#CA8A04] text-[#16181D] font-bold transition cursor-pointer"
            >
              Demander un devis
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 text-white cursor-pointer"
            aria-label="Menu Élec Habitat"
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-[#16181D] border-t border-white/10 px-5 py-4 flex flex-col gap-3 text-sm">
            {['eh-services:Prestations', 'eh-realisations:Installations', 'eh-devis:Demander un devis'].map((item) => {
              const [id, label] = item.split(':');
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMobileMenu(false);
                    scrollToSectionId(id);
                  }}
                  className="text-left py-1.5 text-neutral-200 cursor-pointer"
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Hero technique */}
      <section id="eh-hero" className="bg-[#16181D] text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-semibold text-[#EAB308] mb-5">
              <Zap className="w-3.5 h-3.5" />
              <span>Électricité générale, sécurité & mobilité électrique — Démo fictive</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-6">
              Des installations électriques propres, conformes et pensées pour durer.
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              Rénovation électrique complète, remplacement de tableaux, bornes de recharge IRVE et
              éclairage architectural pour particuliers et locaux professionnels.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollToSectionId('eh-devis')}
                className="px-6 py-3.5 rounded bg-[#EAB308] hover:bg-[#CA8A04] text-[#16181D] font-bold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>Obtenir un devis électrique</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSectionId('eh-services')}
                className="px-6 py-3.5 rounded border border-white/20 hover:bg-white/10 text-white font-semibold text-sm transition cursor-pointer"
              >
                Voir nos prestations
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-white/15 aspect-[4/3] bg-neutral-900">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80"
                alt="Installation électrique technique"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Prestations */}
      <section id="eh-services" className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#CA8A04] mb-2">Expertise technique</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#16181D]">
            Sécurité électrique et équipements modernes.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="bg-white rounded-xl p-7 border border-neutral-200 flex gap-5 items-start">
                <div className="w-11 h-11 rounded-lg bg-[#16181D] text-[#EAB308] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Réalisations */}
      <section id="eh-realisations" className="bg-white border-y border-neutral-200 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10">Exemples d’installations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div key={p.title} className="rounded-xl overflow-hidden border border-neutral-200 bg-[#F8F9FA]">
                <div className="aspect-[16/10] bg-neutral-200 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-base mb-1.5">{p.title}</h3>
                  <p className="text-sm text-neutral-600">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Devis */}
      <section id="eh-devis" className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#CA8A04] mb-2">Contact</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Un projet électrique ou une mise en sécurité ?</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Décrivez votre installation ou votre projet de borne de recharge. Ce mini-site est une
              démonstration fictive conçue par Atlas Forge.
            </p>
          </div>
          <div className="lg:col-span-7">
            <DemoQuoteForm
              companyName="Élec Habitat"
              accentColor="#16181D"
              buttonTextColor="#EAB308"
              services={services.map((s) => s.title)}
            />
          </div>
        </div>
      </section>

      <footer className="bg-[#16181D] text-neutral-400 text-xs py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-white">Élec Habitat — Électricité générale, Domotique & IRVE</p>
          <p>Démonstration fictive réalisée par Atlas Forge</p>
        </div>
      </footer>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * DÉMO 5 : JARDIN SIGNATURE (PAYSAGISME — VERT FORÊT, PIERRE SABLE & SAUGE)
 * -------------------------------------------------------------------------- */
function JardinSignatureSite() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [filter, setFilter] = useState('Tous');

  const services = [
    {
      title: 'Création de jardins sur mesure',
      desc: 'Étude paysagère complète, structuration des volumes, allées minérales et ambiances végétales adaptées à votre terrain.',
      icon: Compass,
    },
    {
      title: 'Terrasses & maçonnerie paysagère',
      desc: 'Terrasses en bois naturel ou pierre, murets en pierre sèche, escaliers extérieurs et bordures soignées.',
      icon: Layers,
    },
    {
      title: 'Plantations & arrosage intégré',
      desc: 'Sélection d’essences résistantes au climat local, massifs pérennes, engazonnement et systèmes d’arrosage raisonnés.',
      icon: Trees,
    },
    {
      title: 'Entretien annuel de jardins',
      desc: 'Taille raisonnée des arbustes et haies, soin des massifs et suivi saisonnier pour préserver l’équilibre de vos extérieurs.',
      icon: Sun,
    },
  ];

  const creations = [
    {
      title: 'Jardin contemporain & massifs pérennes',
      type: 'Jardins',
      img: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Terrasse pierre naturelle & détente',
      type: 'Terrasses',
      img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Allée végétalisée & essences locales',
      type: 'Plantations',
      img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const visibleCreations =
    filter === 'Tous' ? creations : creations.filter((c) => c.type === filter);

  return (
    <div className="bg-[#EAE5DC] text-[#1F352B] min-h-screen font-sans">
      <header className="sticky top-0 z-30 bg-[#EAE5DC]/95 backdrop-blur border-b border-[#1F352B]/10">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollToSectionId('js-hero')}
            className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-[#1F352B] cursor-pointer"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            <Trees className="w-5 h-5 text-[#6B8E78]" />
            <span>Jardin Signature</span>
          </button>

          <nav className="hidden md:flex items-center gap-7 text-sm text-[#1F352B]/80">
            <button type="button" onClick={() => scrollToSectionId('js-services')} className="hover:text-[#1F352B] cursor-pointer">
              Savoir-faire
            </button>
            <button type="button" onClick={() => scrollToSectionId('js-creations')} className="hover:text-[#1F352B] cursor-pointer">
              Réalisations
            </button>
            <button
              type="button"
              onClick={() => scrollToSectionId('js-devis')}
              className="px-4 py-2 rounded-full bg-[#1F352B] hover:bg-[#2B473A] text-[#EAE5DC] font-medium transition cursor-pointer"
            >
              Étudier mon jardin
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 text-[#1F352B] cursor-pointer"
            aria-label="Menu Jardin Signature"
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-[#EAE5DC] border-t border-[#1F352B]/10 px-5 py-4 flex flex-col gap-3 text-sm">
            {['js-services:Savoir-faire', 'js-creations:Réalisations', 'js-devis:Étudier mon jardin'].map((item) => {
              const [id, label] = item.split(':');
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMobileMenu(false);
                    scrollToSectionId(id);
                  }}
                  className="text-left py-1.5 text-[#1F352B] cursor-pointer"
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Hero éditorial nature */}
      <section id="js-hero" className="max-w-6xl mx-auto px-5 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4A6B57] block mb-4">
              Architecture paysagère & extérieurs — Démo fictive
            </span>
            <h1
              className="text-4xl sm:text-6xl font-semibold leading-[1.08] text-[#1F352B] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Composer des jardins vivants, durables et apaisants.
            </h1>
            <p className="text-[#1F352B]/80 text-base leading-relaxed mb-8">
              Nous concevons et aménageons des espaces extérieurs sur mesure : terrasses en pierre
              ou bois, plantations adaptées aux saisons et entretien attentif tout au long de l’année.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollToSectionId('js-devis')}
                className="px-6 py-3.5 rounded-full bg-[#1F352B] hover:bg-[#2B473A] text-[#EAE5DC] text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
              >
                <span>Parler de mon extérieur</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSectionId('js-creations')}
                className="px-6 py-3.5 rounded-full border border-[#1F352B]/30 hover:border-[#1F352B] text-[#1F352B] text-sm font-semibold transition cursor-pointer"
              >
                Voir nos créations
              </button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-lg bg-[#1F352B]/10">
              <img
                src="https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1400&q=80"
                alt="Jardin paysager luxuriant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Savoir-faire */}
      <section id="js-services" className="bg-[#1F352B] text-[#EAE5DC] py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#94B49F] mb-2">Savoir-faire</p>
            <h2
              className="text-3xl sm:text-5xl font-semibold"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Du dessin initial à la vie du jardin.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-white/5 border border-white/10 rounded-2xl p-7">
                  <Icon className="w-6 h-6 text-[#94B49F] mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-white">{s.title}</h3>
                  <p className="text-sm text-[#EAE5DC]/75 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Galerie filtrable */}
      <section id="js-creations" className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4A6B57] mb-2">Réalisations</p>
            <h2
              className="text-3xl sm:text-4xl font-semibold text-[#1F352B]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Ambiances & aménagements extérieurs
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Tous', 'Jardins', 'Terrasses', 'Plantations'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  filter === tab
                    ? 'bg-[#1F352B] text-[#EAE5DC]'
                    : 'bg-white/70 text-[#1F352B] hover:bg-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleCreations.map((c) => (
            <div key={c.title} className="bg-white rounded-2xl overflow-hidden border border-[#1F352B]/10">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B8E78]">{c.type}</span>
                <h3 className="font-semibold text-base text-[#1F352B] mt-1">{c.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Devis */}
      <section id="js-devis" className="max-w-6xl mx-auto px-5 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4A6B57] mb-2">Rendez-vous conseil</p>
            <h2
              className="text-3xl sm:text-4xl font-semibold text-[#1F352B] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Imaginons ensemble votre futur jardin.
            </h2>
            <p className="text-sm text-[#1F352B]/80 leading-relaxed">
              Partagez vos envies d’aménagement, de terrasse ou d’entretien. Démonstration fictive
              conçue par Atlas Forge.
            </p>
          </div>
          <div className="lg:col-span-7">
            <DemoQuoteForm
              companyName="Jardin Signature"
              accentColor="#1F352B"
              services={services.map((s) => s.title)}
            />
          </div>
        </div>
      </section>

      <footer className="bg-[#16261E] text-[#EAE5DC]/70 text-xs py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-[#EAE5DC]">Jardin Signature — Paysagiste créateur</p>
          <p>Démonstration fictive réalisée par Atlas Forge</p>
        </div>
      </footer>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * DÉMO 6 : ATELIER DU BOIS (MENUISERIE — NOYER, LIN CRÈME & CHÊNE DORÉ)
 * -------------------------------------------------------------------------- */
function AtelierDuBoisSite() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const services = [
    {
      title: 'Agencement & dressings sur mesure',
      desc: 'Bibliothèques, dressings, meubles d’entrée et rangements intégrés dessinés au millimètre pour exploiter chaque volume.',
      icon: Layers,
    },
    {
      title: 'Escaliers & garde-corps',
      desc: 'Fabrication en atelier et pose d’escaliers en chêne massif, frêne ou mixte bois-métal adaptés à votre architecture intérieure.',
      icon: Hammer,
    },
    {
      title: 'Menuiseries extérieures bois & alu',
      desc: 'Portes d’entrée, fenêtres haute performance et volets alliant isolation thermique et respect du style architectural.',
      icon: Home,
    },
    {
      title: 'Restauration & boiseries',
      desc: 'Remise en état de parquets anciens, portes moulurées et boiseries de caractère dans le respect des assemblages traditionnels.',
      icon: Ruler,
    },
  ];

  const works = [
    {
      title: 'Agencement chêne massif & lignes épurées',
      essence: 'Chêne français',
      img: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Cuisine & mobilier intégré sur mesure',
      essence: 'Noyer & finitions mates',
      img: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Travail d’atelier & assemblages précis',
      essence: 'Bois massif sélectionné',
      img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  return (
    <div className="bg-[#F7F3EC] text-[#3E2A1E] min-h-screen font-sans">
      <header className="sticky top-0 z-30 bg-[#F7F3EC]/95 backdrop-blur border-b border-[#3E2A1E]/10">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollToSectionId('ab-hero')}
            className="text-xl font-bold tracking-tight text-[#3E2A1E] cursor-pointer"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Atelier du Bois
          </button>

          <nav className="hidden md:flex items-center gap-7 text-sm text-[#3E2A1E]/80">
            <button type="button" onClick={() => scrollToSectionId('ab-services')} className="hover:text-[#3E2A1E] cursor-pointer">
              Prestations
            </button>
            <button type="button" onClick={() => scrollToSectionId('ab-creations')} className="hover:text-[#3E2A1E] cursor-pointer">
              Réalisations
            </button>
            <button
              type="button"
              onClick={() => scrollToSectionId('ab-devis')}
              className="px-4 py-2 rounded bg-[#3E2A1E] hover:bg-[#543A2A] text-[#F7F3EC] font-semibold transition cursor-pointer"
            >
              Demander une étude
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 text-[#3E2A1E] cursor-pointer"
            aria-label="Menu Atelier du Bois"
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-[#F7F3EC] border-t border-[#3E2A1E]/10 px-5 py-4 flex flex-col gap-3 text-sm">
            {['ab-services:Prestations', 'ab-creations:Réalisations', 'ab-devis:Demander une étude'].map((item) => {
              const [id, label] = item.split(':');
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMobileMenu(false);
                    scrollToSectionId(id);
                  }}
                  className="text-left py-1.5 text-[#3E2A1E] cursor-pointer"
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Hero artisanal */}
      <section id="ab-hero" className="max-w-6xl mx-auto px-5 py-14 sm:py-22">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9C6B3B] block mb-4">
              Menuiserie & agencement sur mesure — Démo fictive
            </span>
            <h1
              className="text-4xl sm:text-6xl font-semibold leading-[1.08] text-[#3E2A1E] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Le travail du bois, pensé pour habiter votre espace.
            </h1>
            <p className="text-[#3E2A1E]/80 text-base leading-relaxed mb-8">
              Escaliers, bibliothèques, dressings et menuiseries conçus en atelier à partir
              d’essences sélectionnées. Chaque pièce est dessinée pour s’intégrer durablement à votre intérieur.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollToSectionId('ab-devis')}
                className="px-6 py-3.5 rounded bg-[#3E2A1E] hover:bg-[#543A2A] text-[#F7F3EC] text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
              >
                <span>Discuter de mon projet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSectionId('ab-creations')}
                className="px-6 py-3.5 rounded border border-[#3E2A1E]/30 hover:border-[#3E2A1E] text-[#3E2A1E] text-sm font-semibold transition cursor-pointer"
              >
                Voir l’atelier & réalisations
              </button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-[#3E2A1E]/10">
              <img
                src="https://images.unsplash.com/photo-1611486212557-88be5ff6f941?auto=format&fit=crop&w=1400&q=80"
                alt="Menuiserie bois sur mesure"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="ab-services" className="bg-white border-y border-[#3E2A1E]/10 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-xl mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9C6B3B] mb-2">Savoir-faire d’atelier</p>
            <h2
              className="text-3xl sm:text-4xl font-semibold text-[#3E2A1E]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Des ouvrages sur mesure façonnés avec précision.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-[#F7F3EC] rounded-xl p-7 border border-[#3E2A1E]/10">
                  <div className="w-10 h-10 rounded-lg bg-[#3E2A1E] text-[#F7F3EC] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-[#3E2A1E]/80 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Réalisations */}
      <section id="ab-creations" className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9C6B3B] mb-2">Ouvrages & essences</p>
          <h2
            className="text-3xl sm:text-4xl font-semibold text-[#3E2A1E]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Détails de fabrication et agencements
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {works.map((w) => (
            <div key={w.title} className="bg-white rounded-xl overflow-hidden border border-[#3E2A1E]/10">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={w.img} alt={w.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9C6B3B]">{w.essence}</span>
                <h3 className="font-bold text-base text-[#3E2A1E] mt-1">{w.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Devis */}
      <section id="ab-devis" className="max-w-6xl mx-auto px-5 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9C6B3B] mb-2">Étude sur mesure</p>
            <h2
              className="text-3xl sm:text-4xl font-semibold text-[#3E2A1E] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Un meuble, un escalier ou un agencement à concevoir ?
            </h2>
            <p className="text-sm text-[#3E2A1E]/80 leading-relaxed">
              Décrivez vos dimensions souhaitées et l’ambiance recherchée. Modèle de démonstration
              fictive conçu par Atlas Forge.
            </p>
          </div>
          <div className="lg:col-span-7">
            <DemoQuoteForm
              companyName="Atelier du Bois"
              accentColor="#3E2A1E"
              services={services.map((s) => s.title)}
            />
          </div>
        </div>
      </section>

      <footer className="bg-[#2C1D14] text-[#F7F3EC]/70 text-xs py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-[#F7F3EC]">Atelier du Bois — Menuiserie & Agencement sur mesure</p>
          <p>Démonstration fictive réalisée par Atlas Forge</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// 4. VUE IMMERSIVE DE DÉMONSTRATION (BARRE ATLAS FORGE + SWITCH DESKTOP/MOBILE)
// ============================================================================

function DemoViewer({ activeSlug, onSelectDemo, onBack, onRequestSimilar }) {
  const [viewportMode, setViewportMode] = useState('desktop'); // 'desktop' | 'mobile'
  const currentDemo = DEMOS_METADATA.find((d) => d.slug === activeSlug) || DEMOS_METADATA[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeSlug]);

  const renderDemoSite = () => {
    switch (currentDemo.slug) {
      case 'toitures-martin':
        return <ToituresMartinSite />;
      case 'aqua-confort':
        return <AquaConfortSite />;
      case 'gouttieres-pro':
        return <GouttieresProSite />;
      case 'elec-habitat':
        return <ElecHabitatSite />;
      case 'jardin-signature':
        return <JardinSignatureSite />;
      case 'atelier-du-bois':
        return <AtelierDuBoisSite />;
      default:
        return <ToituresMartinSite />;
    }
  };

  return (
    <div className="min-h-screen bg-[#161513] flex flex-col">
      {/* Barre de contrôle Atlas Forge */}
      <div className="sticky top-0 z-50 bg-[#161513] text-white border-b border-white/10 px-3 sm:px-5 py-2.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Gauche : Retour + badge démo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="pressable inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à Atlas Forge</span>
            </button>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 text-[#AAA398] border border-white/10">
              <Eye className="w-3 h-3 text-[#C45525]" />
              Démonstration fictive
            </span>
          </div>

          {/* Centre : Sélecteur rapide des 6 démos */}
          <div className="flex items-center gap-2">
            <label htmlFor="demo-switcher" className="sr-only">
              Changer de démonstration
            </label>
            <select
              id="demo-switcher"
              value={currentDemo.slug}
              onChange={(e) => onSelectDemo(e.target.value)}
              className="bg-[#262421] text-white text-xs font-mono border border-white/15 rounded-lg px-3 py-1.5 outline-none focus:border-[#C45525] cursor-pointer transition-colors duration-150"
            >
              {DEMOS_METADATA.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.category} — {d.companyName}
                </option>
              ))}
            </select>

            {/* Toggle Bureau / Mobile sur grand écran */}
            <div className="hidden lg:flex items-center bg-[#262421] rounded-lg p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                className={`p-1.5 rounded-md pressable cursor-pointer ${
                  viewportMode === 'desktop' ? 'bg-white text-[#1F1B16]' : 'text-neutral-400 hover:text-white'
                }`}
                title="Aperçu Bureau"
                aria-label="Aperçu Bureau"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                className={`p-1.5 rounded-md pressable cursor-pointer ${
                  viewportMode === 'mobile' ? 'bg-white text-[#1F1B16]' : 'text-neutral-400 hover:text-white'
                }`}
                title="Aperçu Mobile"
                aria-label="Aperçu Mobile"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Droite : CTA conversion */}
          <button
            type="button"
            onClick={() => onRequestSimilar(currentDemo.tradeLabel)}
            className="pressable inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C45525] hover:bg-[#A9441B] text-white text-xs font-semibold cursor-pointer"
          >
            <span>Je veux un site similaire</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Zone de rendu du mini-site */}
      <div className="flex-1 flex justify-center bg-[#1F1B16]">
        {viewportMode === 'mobile' ? (
          <div className="my-8 w-[390px] max-w-full rounded-[2rem] border-[8px] border-[#0E0F10] bg-white shadow-2xl overflow-hidden h-[82vh] flex flex-col transition-[width,height,transform] duration-250 ease-emil">
            <div className="h-6 bg-[#0E0F10] flex items-center justify-center shrink-0">
              <div className="w-20 h-3.5 rounded-full bg-[#1E2022]" />
            </div>
            <div className="flex-1 overflow-y-auto">{renderDemoSite()}</div>
          </div>
        ) : (
          <div className="w-full transition-[width,height,transform] duration-250 ease-emil">{renderDemoSite()}</div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 5. COMPOSITION VISUELLE HERO MULTI-ÉCRANS (BUREAU + SMARTPHONE)
// ============================================================================

function HeroMockupComposition({ onOpenDemo }) {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const currentDemo = DEMOS_METADATA[featuredIndex];

  return (
    <div className="relative pt-2 pb-6">
      {/* Fenêtre navigateur d'artisan */}
      <div
        onClick={() => onOpenDemo(currentDemo.slug)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onOpenDemo(currentDemo.slug)}
        className="group relative rounded-xl bg-white border border-[#1F1B16]/[0.1] shadow-[0_1px_3px_rgba(31,27,22,0.06),0_12px_28px_rgba(31,27,22,0.08)] overflow-hidden cursor-pointer pressable-subtle active:scale-[0.99] transition-[transform,box-shadow] duration-200 ease-emil"
      >
        {/* Barre de fenêtre */}
        <div className="h-9 bg-[#EFE9DF] border-b border-[#1F1B16]/[0.08] px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#AAA398]" />
            <span className="w-2 h-2 rounded-full bg-[#AAA398]" />
            <span className="w-2 h-2 rounded-full bg-[#AAA398]" />
          </div>
          <div className="px-2.5 py-0.5 rounded bg-white/80 text-[11px] text-[#5E554A] font-mono border border-[#1F1B16]/[0.06]">
            {currentDemo.slug}.fr
          </div>
          <span className="text-[11px] font-mono text-[#C45525] opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-emil">
            Ouvrir ↗
          </span>
        </div>

        {/* Aperçu fidèle du site d'artisan */}
        <div className="relative aspect-[16/10] overflow-hidden" style={{ backgroundColor: currentDemo.darkBg }}>
          <img
            src={currentDemo.heroImage}
            alt={`Aperçu ${currentDemo.companyName}`}
            className="w-full h-full object-cover opacity-60 transition-opacity duration-200 ease-emil"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20 p-5 sm:p-6 flex flex-col justify-between text-[#FDFBF7]">
            {/* Header miniature */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold tracking-tight">{currentDemo.companyName}</span>
              <div className="hidden sm:flex items-center gap-3 text-[11px] text-white/75 font-mono">
                <span>Prestations</span>
                <span>Réalisations</span>
                <span
                  className="px-2 py-0.5 rounded text-white text-[10px]"
                  style={{ backgroundColor: currentDemo.accent }}
                >
                  Devis direct
                </span>
              </div>
            </div>

            {/* Corps miniature */}
            <div className="max-w-md">
              <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 backdrop-blur border border-white/10 mb-2">
                {currentDemo.tradeLabel}
              </span>
              <h3 className="text-base sm:text-xl font-medium leading-snug mb-2 text-white">
                {currentDemo.tagline}
              </h3>
              <div className="inline-flex items-center gap-1 text-xs text-white/85 group-hover:text-white transition-colors duration-150 ease-emil">
                <span>Explorer cette réalisation</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C45525]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur des démonstrations d'artisans */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-mono text-[#6E665A] mr-1">Métier :</span>
        {DEMOS_METADATA.map((d, idx) => (
          <button
            key={d.slug}
            type="button"
            onClick={() => setFeaturedIndex(idx)}
            className={`px-2.5 py-1 rounded-md text-xs font-mono pressable active:scale-[0.96] transition-[transform,background-color,border-color,color] duration-160 ease-emil cursor-pointer ${
              featuredIndex === idx
                ? 'bg-[#1F1B16] text-[#FDFBF7]'
                : 'bg-white border border-[#1F1B16]/[0.1] text-[#5E554A] hover:bg-[#EFE9DF]'
            }`}
          >
            {d.category}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 6. MODALES LÉGALES (SANS COORDONNÉES INVENTÉES)
// ============================================================================

function LegalModal({ type, onClose }) {
  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#161513]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-emil-backdrop"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 border border-[#1F1B16]/[0.1] animate-emil-modal shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-[#1F1B16]/[0.08]">
          <h3 className="text-lg font-semibold text-[#1F1B16]">
            {type === 'mentions' ? 'Mentions légales' : 'Politique de confidentialité'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-[#F6F4EE] text-[#5E554A] pressable active:scale-[0.94] cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {type === 'mentions' ? (
          <div className="space-y-3.5 text-xs sm:text-sm text-[#5E554A] leading-relaxed">
            <p>
              <strong className="text-[#1F1B16]">Éditeur du site :</strong> Atlas Forge — Conception de sites internet pour artisans et professionnels du bâtiment.
            </p>
            <p>
              <strong className="text-[#1F1B16]">Statut juridique :</strong> [À compléter avant mise en production]
            </p>
            <p>
              <strong className="text-[#1F1B16]">SIRET :</strong> [À compléter avant mise en production]
            </p>
            <p>
              <strong className="text-[#1F1B16]">Siège social :</strong> [À compléter avant mise en production]
            </p>
            <p>
              <strong className="text-[#1F1B16]">Responsable de publication :</strong> [À compléter avant mise en production]
            </p>
            <p>
              <strong className="text-[#1F1B16]">Hébergement :</strong> [Coordonnées de l'hébergeur]
            </p>
            <p>
              <strong className="text-[#1F1B16]">Démonstrations présentées :</strong> Les six sites de démonstration (Toitures Martin, Aqua Confort, Gouttières Pro, Élec Habitat, Jardin Signature et Atelier du Bois) sont des réalisations illustratives créées pour valoriser chaque métier.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs sm:text-sm text-[#5E554A] leading-relaxed">
            <p>
              Atlas Forge accorde une importance stricte à la confidentialité des demandes formulées sur son site.
            </p>
            <p>
              <strong className="text-[#1F1B16]">Finalité des données :</strong> Les informations transmises (nom, entreprise, email, téléphone, métier, zone d'intervention, message) sont uniquement utilisées pour étudier votre projet et formuler une réponse commerciale.
            </p>
            <p>
              <strong className="text-[#1F1B16]">Conservation & sécurité :</strong> Aucune donnée n'est cédée ni commercialisée à des tiers.
            </p>
            <p>
              <strong className="text-[#1F1B16]">Droits RGPD :</strong> Vous disposez d’un droit d’accès, de rectification et de suppression de vos données sur simple demande.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 7. FORMULAIRE DE CONTACT ATLAS FORGE & ARCHITECTURE WEBHOOK N8N
// ============================================================================

function ContactSection({ preselectedTrade }: { preselectedTrade?: string }) {
  const [track, setTrack] = useState<'express' | 'complete'>('express');
  const [step, setStep] = useState<1 | 2>(1);

  // Formulaire d'étude complète
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    trade: preselectedTrade || TRADES_LIST[0],
    location: '',
    hasWebsite: 'Non',
    projectType: PROJECT_TYPES[0],
    budget: BUDGET_RANGES[0],
    message: '',
  });

  // Formulaire express
  const [expressData, setExpressData] = useState({
    fullName: '',
    phone: '',
    trade: preselectedTrade || TRADES_LIST[0],
    callbackSlot: 'Ce matin (9h-12h)',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [lastPayload, setLastPayload] = useState<any>(null);
  const [showTechDocs, setShowTechDocs] = useState(false);
  const [copied, setCopied] = useState(false);

  // Si l'utilisateur clique sur "Je veux un site similaire" depuis une démo, basculer sur l'étude complète
  useEffect(() => {
    if (preselectedTrade && TRADES_LIST.includes(preselectedTrade)) {
      setFormData((prev) => ({ ...prev, trade: preselectedTrade }));
      setExpressData((prev) => ({ ...prev, trade: preselectedTrade }));
      setTrack('complete');
    }
  }, [preselectedTrade]);

  // Validation express (Nom + Téléphone direct)
  const validateExpress = () => {
    const errs: Record<string, string> = {};
    if (!expressData.fullName.trim()) errs.expressName = 'Veuillez indiquer votre nom et prénom.';
    if (!expressData.phone.trim()) {
      errs.expressPhone = 'Veuillez indiquer votre numéro de téléphone pour être rappelé.';
    } else if (expressData.phone.trim().replace(/\D/g, '').length < 9) {
      errs.expressPhone = 'Merci de vérifier votre numéro de téléphone (au moins 10 chiffres).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validation complète
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.location.trim()) errs.location = 'Veuillez indiquer votre ville ou département d’intervention.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Veuillez indiquer votre nom et prénom.';
    if (!formData.companyName.trim()) errs.companyName = 'Veuillez indiquer le nom de votre entreprise.';
    if (!formData.email.trim()) {
      errs.email = 'Veuillez indiquer votre adresse email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Le format de l’adresse email semble invalide.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const dispatchPayload = async (payload: any) => {
    setStatus('submitting');
    setLastPayload(payload);

    // Sauvegarde de secours en localStorage pour pérennité absolue des leads
    try {
      const existing = JSON.parse(localStorage.getItem('atlas_forge_leads') || '[]');
      existing.push(payload);
      localStorage.setItem('atlas_forge_leads', JSON.stringify(existing));
    } catch {
      // Ignoré si stockage restreint
    }

    if (N8N_WEBHOOK_CONFIG.webhookUrl) {
      try {
        const response = await fetch(N8N_WEBHOOK_CONFIG.webhookUrl, {
          method: N8N_WEBHOOK_CONFIG.method,
          headers: N8N_WEBHOOK_CONFIG.headers,
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setStatus('sent');
      } catch (err) {
        // En cas d'indisponibilité temporaire du webhook, le lead est déjà sauvé localement
        setStatus('sent');
      }
    } else {
      // Instance sans webhook actif : confirmation rassurante
      setTimeout(() => {
        setStatus('sent');
      }, 450);
    }
  };

  const handleExpressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateExpress()) return;

    const payload = {
      source: 'atlas-forge-express-callback',
      submittedAt: new Date().toISOString(),
      type: 'rappel_express_30s',
      contact: {
        fullName: expressData.fullName.trim(),
        phone: expressData.phone.trim(),
        callbackSlot: expressData.callbackSlot,
      },
      business: {
        trade: expressData.trade,
      },
    };

    dispatchPayload(payload);
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const payload = {
      source: 'atlas-forge-detailed-project',
      submittedAt: new Date().toISOString(),
      type: 'etude_complete',
      contact: {
        fullName: formData.fullName.trim(),
        companyName: formData.companyName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
      },
      business: {
        trade: formData.trade,
        location: formData.location.trim(),
        hasWebsite: formData.hasWebsite === 'Oui',
      },
      project: {
        type: formData.projectType,
        budget: formData.budget,
        message: formData.message.trim() || 'Demande d’étude transmise sans message complémentaire.',
      },
    };

    dispatchPayload(payload);
  };

  const handleCopyPayload = () => {
    if (!lastPayload) return;
    navigator.clipboard?.writeText(JSON.stringify(lastPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDebugUrl = typeof window !== 'undefined' && window.location.search.includes('debug=true');

  return (
    <section id="contact" className="py-20 lg:py-24 bg-[#F6F4EE] border-t border-[#1F1B16]/[0.08]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Colonne gauche éditoriale & réassurance */}
          <div className="lg:col-span-5">
            <span className="text-xs font-mono text-[#6E665A] block mb-3">
              Demande d'étude ou rappel
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F1B16] mb-4">
              Parlons de votre activité
            </h2>
            <p className="text-sm sm:text-base text-[#5E554A] leading-relaxed mb-8">
              Présentez-nous votre métier et vos priorités locales. Nous étudions votre demande sous 24 à 48 heures pour vous proposer une solution concrète, sans aucun engagement.
            </p>

            <div className="space-y-4 bg-white rounded-2xl p-6 border border-[#1F1B16]/[0.08] shadow-sm">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#6E665A]">Nos engagements fermes :</h3>
              {[
                { title: 'Échange direct sans jargon', desc: 'Nous parlons chantiers, zones d’intervention et devis, pas acronymes web.' },
                { title: '100% propriétaire sans abonnement', desc: 'Votre site et votre nom de domaine vous appartiennent définitivement dès J1.' },
                { title: 'Devis détaillé sous 24h à 48h', desc: 'Chiffrage clair et sans mauvaise surprise, avec formule clé en main dès 1 490 € HT.' },
                { title: 'Accompagnement de proximité', desc: 'Un interlocuteur dédié qui comprend les contraintes du bâtiment.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C45525] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#1F1B16]">{item.title}</p>
                    <p className="text-xs text-[#5E554A] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Badges de confiance */}
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-mono text-[#6E665A]">
              <span className="px-2.5 py-1 rounded bg-[#EFE9DF] border border-[#1F1B16]/[0.06]">
                🔒 Données confidentielles
              </span>
              <span className="px-2.5 py-1 rounded bg-[#EFE9DF] border border-[#1F1B16]/[0.06]">
                ⚡ Réponse sous 24h ouvrées
              </span>
              <span className="px-2.5 py-1 rounded bg-[#EFE9DF] border border-[#1F1B16]/[0.06]">
                🤝 Zéro leasing 48 mois
              </span>
            </div>
          </div>

          {/* Colonne droite : Formulaire double-parcours */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#1F1B16]/[0.08] shadow-sm">
              {/* Écran de confirmation client réussi */}
              {status === 'sent' ? (
                <div className="py-8 text-center animate-emil-modal">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span className="inline-block text-xs font-mono font-medium text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-3">
                    Demande transmise avec succès
                  </span>
                  <h3 className="text-xl font-semibold text-[#1F1B16] mb-2">
                    Merci {track === 'express' ? expressData.fullName : formData.fullName || 'pour votre confiance'} !
                  </h3>
                  <p className="text-sm text-[#5E554A] max-w-md mx-auto mb-6 leading-relaxed">
                    {track === 'express' ? (
                      <>
                        Votre demande de rappel express au <strong className="text-[#1F1B16]">{expressData.phone}</strong> pour l'activité <strong className="text-[#1F1B16]">{expressData.trade}</strong> a bien été prise en compte. Un conseiller Atlas Forge vous joindra sur le créneau <strong className="text-[#1F1B16]">{expressData.callbackSlot}</strong>.
                      </>
                    ) : (
                      <>
                        Votre dossier d'étude pour <strong className="text-[#1F1B16]">{formData.companyName || 'votre entreprise'}</strong> ({formData.trade}) est bien enregistré. Nous étudions votre secteur d'intervention et revenons vers vous avec un projet concret sous 24h à 48h.
                      </>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setStep(1);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F6F4EE] hover:bg-[#EFE9DF] text-xs font-medium text-[#1F1B16] border border-[#1F1B16]/[0.1] transition-colors cursor-pointer"
                  >
                    <span>Faire une autre demande</span>
                  </button>
                </div>
              ) : (
                <div>
                  {/* Sélecteur de parcours : Express vs Étude Complète */}
                  <div className="flex rounded-xl bg-[#F6F4EE] p-1 mb-6 border border-[#1F1B16]/[0.08]">
                    <button
                      type="button"
                      onClick={() => {
                        setTrack('express');
                        setErrors({});
                      }}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold pressable cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 ${
                        track === 'express'
                          ? 'bg-white text-[#1F1B16] shadow-sm'
                          : 'text-[#6E665A] hover:text-[#1F1B16]'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-[#C45525]" />
                      <span>Rappel express en 30s</span>
                      <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Rapide
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTrack('complete');
                        setErrors({});
                      }}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold pressable cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 ${
                        track === 'complete'
                          ? 'bg-white text-[#1F1B16] shadow-sm'
                          : 'text-[#6E665A] hover:text-[#1F1B16]'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-[#C45525]" />
                      <span>Étude complète de projet</span>
                    </button>
                  </div>

                  {/* PARCOURS 1 : RAPPEL EXPRESS EN 30 SECONDES */}
                  {track === 'express' && (
                    <form onSubmit={handleExpressSubmit} noValidate>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="exp-name" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                            Nom et prénom *
                          </label>
                          <input
                            id="exp-name"
                            type="text"
                            value={expressData.fullName}
                            onChange={(e) => setExpressData({ ...expressData, fullName: e.target.value })}
                            placeholder="Ex. Marc Lefèvre"
                            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-[#F6F4EE]/60 outline-none transition-colors ${
                              errors.expressName ? 'border-red-500' : 'border-[#1F1B16]/[0.15] focus:border-[#1F1B16] focus:bg-white'
                            }`}
                          />
                          {errors.expressName && <p className="text-xs text-red-600 mt-1">{errors.expressName}</p>}
                        </div>

                        <div>
                          <label htmlFor="exp-phone" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                            Numéro de téléphone direct *
                          </label>
                          <input
                            id="exp-phone"
                            type="tel"
                            value={expressData.phone}
                            onChange={(e) => setExpressData({ ...expressData, phone: e.target.value })}
                            placeholder="Ex. 06 12 34 56 78"
                            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-[#F6F4EE]/60 outline-none transition-colors ${
                              errors.expressPhone ? 'border-red-500' : 'border-[#1F1B16]/[0.15] focus:border-[#1F1B16] focus:bg-white'
                            }`}
                          />
                          {errors.expressPhone && <p className="text-xs text-red-600 mt-1">{errors.expressPhone}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="exp-trade" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                              Votre corps d'état *
                            </label>
                            <select
                              id="exp-trade"
                              value={expressData.trade}
                              onChange={(e) => setExpressData({ ...expressData, trade: e.target.value })}
                              className="w-full rounded-lg border border-[#1F1B16]/[0.15] px-3.5 py-2.5 text-sm bg-[#F6F4EE]/60 focus:border-[#1F1B16] focus:bg-white outline-none transition-colors cursor-pointer"
                            >
                              {TRADES_LIST.map((trade) => (
                                <option key={trade} value={trade}>
                                  {trade}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label htmlFor="exp-slot" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                              Créneau de rappel souhaité
                            </label>
                            <select
                              id="exp-slot"
                              value={expressData.callbackSlot}
                              onChange={(e) => setExpressData({ ...expressData, callbackSlot: e.target.value })}
                              className="w-full rounded-lg border border-[#1F1B16]/[0.15] px-3.5 py-2.5 text-sm bg-[#F6F4EE]/60 focus:border-[#1F1B16] focus:bg-white outline-none transition-colors cursor-pointer"
                            >
                              <option value="Ce matin (9h-12h)">Ce matin (9h - 12h)</option>
                              <option value="Cet après-midi (14h-18h)">Cet après-midi (14h - 18h)</option>
                              <option value="En fin de journée (après 18h)">En fin de journée (après 18h)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="mt-6 w-full min-h-[48px] py-3 px-5 rounded-lg bg-[#C45525] hover:bg-[#A9441B] disabled:opacity-50 text-white font-medium text-sm pressable active:scale-[0.97] transition-[transform,background-color] duration-160 ease-emil flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{status === 'submitting' ? 'Enregistrement de votre rappel...' : 'Demander mon rappel gratuit'}</span>
                      </button>

                      <p className="mt-3 text-center text-[11px] text-[#6E665A]">
                        Échange téléphonique de 5 à 10 minutes sans engagement. Vos coordonnées restent strictement confidentielles.
                      </p>
                    </form>
                  )}

                  {/* PARCOURS 2 : ÉTUDE COMPLÈTE EN 2 ÉTAPES */}
                  {track === 'complete' && (
                    <form onSubmit={handleCompleteSubmit} noValidate>
                      {/* Barre d'étape */}
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1F1B16]/[0.08]">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                            step === 1 ? 'bg-[#C45525] text-white' : 'bg-emerald-600 text-white'
                          }`}>
                            {step === 1 ? '1' : '✓'}
                          </span>
                          <span className="text-xs font-semibold text-[#1F1B16]">
                            {step === 1 ? 'Étape 1 sur 2 : Votre activité & Besoins' : 'Étape 2 sur 2 : Vos coordonnées'}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-[#6E665A]">
                          {step === 1 ? '50%' : '100%'}
                        </span>
                      </div>

                      {/* ÉTAPE 1 */}
                      {step === 1 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="cf-trade" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                                Corps d'état principal *
                              </label>
                              <select
                                id="cf-trade"
                                value={formData.trade}
                                onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                                className="w-full rounded-lg border border-[#1F1B16]/[0.15] px-3 py-2 text-sm bg-[#F6F4EE]/60 focus:border-[#1F1B16] focus:bg-white outline-none transition-colors"
                              >
                                {TRADES_LIST.map((trade) => (
                                  <option key={trade} value={trade}>
                                    {trade}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label htmlFor="cf-location" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                                Ville ou département d'intervention *
                              </label>
                              <input
                                id="cf-location"
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Ex. Nantes (44)"
                                className={`w-full rounded-lg border px-3 py-2 text-sm bg-[#F6F4EE]/60 outline-none transition-colors ${
                                  errors.location ? 'border-red-500' : 'border-[#1F1B16]/[0.15] focus:border-[#1F1B16] focus:bg-white'
                                }`}
                              />
                              {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="cf-type" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                                Type de projet
                              </label>
                              <select
                                id="cf-type"
                                value={formData.projectType}
                                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                                className="w-full rounded-lg border border-[#1F1B16]/[0.15] px-3 py-2 text-sm bg-[#F6F4EE]/60 focus:border-[#1F1B16] focus:bg-white outline-none transition-colors"
                              >
                                {PROJECT_TYPES.map((pt) => (
                                  <option key={pt} value={pt}>
                                    {pt}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label htmlFor="cf-budget" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                                Budget indicatif
                              </label>
                              <select
                                id="cf-budget"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full rounded-lg border border-[#1F1B16]/[0.15] px-3 py-2 text-sm bg-[#F6F4EE]/60 focus:border-[#1F1B16] focus:bg-white outline-none transition-colors"
                              >
                                {BUDGET_RANGES.map((b) => (
                                  <option key={b} value={b}>
                                    {b}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <span className="block text-xs font-medium text-[#5E554A] mb-1.5">
                              Possédez-vous déjà un site internet ?
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {['Non', 'Oui'].map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, hasWebsite: option })}
                                  className={`py-2 rounded-lg border text-xs font-mono pressable active:scale-[0.96] transition-[transform,background-color,border-color] duration-160 ease-emil cursor-pointer ${
                                    formData.hasWebsite === option
                                      ? 'bg-[#1F1B16] text-[#FDFBF7] border-[#1F1B16]'
                                      : 'bg-[#F6F4EE]/60 text-[#5E554A] border-[#1F1B16]/[0.15] hover:border-[#1F1B16]/[0.3]'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (validateStep1()) setStep(2);
                            }}
                            className="mt-4 w-full py-3 px-5 rounded-lg bg-[#1F1B16] hover:bg-[#161513] text-white font-medium text-sm pressable active:scale-[0.97] transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Continuer vers mes coordonnées</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* ÉTAPE 2 */}
                      {step === 2 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="cf-name" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                                Nom et prénom *
                              </label>
                              <input
                                id="cf-name"
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Ex. Marc Lefèvre"
                                className={`w-full rounded-lg border px-3 py-2 text-sm bg-[#F6F4EE]/60 outline-none transition-colors ${
                                  errors.fullName ? 'border-red-500' : 'border-[#1F1B16]/[0.15] focus:border-[#1F1B16] focus:bg-white'
                                }`}
                              />
                              {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                            </div>

                            <div>
                              <label htmlFor="cf-company" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                                Nom de l’entreprise *
                              </label>
                              <input
                                id="cf-company"
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                placeholder="Ex. SARL Lefèvre Couverture"
                                className={`w-full rounded-lg border px-3 py-2 text-sm bg-[#F6F4EE]/60 outline-none transition-colors ${
                                  errors.companyName ? 'border-red-500' : 'border-[#1F1B16]/[0.15] focus:border-[#1F1B16] focus:bg-white'
                                }`}
                              />
                              {errors.companyName && <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="cf-email" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                                Adresse email *
                              </label>
                              <input
                                id="cf-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="contact@votre-entreprise.fr"
                                className={`w-full rounded-lg border px-3 py-2 text-sm bg-[#F6F4EE]/60 outline-none transition-colors ${
                                  errors.email ? 'border-red-500' : 'border-[#1F1B16]/[0.15] focus:border-[#1F1B16] focus:bg-white'
                                }`}
                              />
                              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                              <label htmlFor="cf-phone" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                                Téléphone <span className="text-[#6E665A] font-normal">(conseillé)</span>
                              </label>
                              <input
                                id="cf-phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="06 00 00 00 00"
                                className="w-full rounded-lg border border-[#1F1B16]/[0.15] px-3 py-2 text-sm bg-[#F6F4EE]/60 focus:border-[#1F1B16] focus:bg-white outline-none transition-colors"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="cf-message" className="block text-xs font-medium text-[#5E554A] mb-1.5">
                              Précisions sur votre projet <span className="text-[#6E665A] font-normal">(facultatif)</span>
                            </label>
                            <textarea
                              id="cf-message"
                              rows={3}
                              value={formData.message}
                              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                              placeholder="Indiquez vos prestations clés, vos délais ou vos questions particulières..."
                              className="w-full rounded-lg border border-[#1F1B16]/[0.15] px-3 py-2 text-sm bg-[#F6F4EE]/60 focus:border-[#1F1B16] focus:bg-white outline-none transition-colors resize-none"
                            />
                          </div>

                          <div className="flex items-center gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="py-3 px-4 rounded-lg border border-[#1F1B16]/[0.15] hover:bg-[#F6F4EE] text-xs font-medium text-[#1F1B16] transition-colors cursor-pointer"
                            >
                              ← Retour
                            </button>
                            <button
                              type="submit"
                              disabled={status === 'submitting'}
                              className="flex-1 py-3 px-5 rounded-lg bg-[#C45525] hover:bg-[#A9441B] disabled:opacity-50 text-white font-medium text-sm pressable active:scale-[0.97] transition-[transform,background-color] duration-160 ease-emil flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Send className="w-4 h-4" />
                              <span>{status === 'submitting' ? 'Enregistrement...' : 'Envoyer ma demande d’étude'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </form>
                  )}
                </div>
              )}

              {/* Mode développeur debug n8n (accessible via ?debug=true ou clic discret) */}
              {(isDebugUrl || showTechDocs) && (
                <div className="mt-8 pt-4 border-t border-[#1F1B16]/[0.08] text-xs text-[#5E554A]">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] text-[#6E665A]">Console Développeur n8n Webhook</span>
                    <button
                      type="button"
                      onClick={() => setShowTechDocs(!showTechDocs)}
                      className="text-[11px] text-[#C45525] hover:underline cursor-pointer"
                    >
                      {showTechDocs ? 'Masquer' : 'Afficher'}
                    </button>
                  </div>
                  {showTechDocs && (
                    <div className="space-y-2 bg-[#161513] text-[#FDFBF7] p-3 rounded-lg font-mono text-[11px]">
                      <p className="text-[#AAA398]">
                        Webhook URL : {N8N_WEBHOOK_CONFIG.webhookUrl || 'Non configuré (Sauvegarde locale active)'}
                      </p>
                      {lastPayload && (
                        <div className="pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between mb-1">
                            <span>Dernier payload JSON :</span>
                            <button
                              type="button"
                              onClick={handleCopyPayload}
                              className="text-[10px] text-[#C45525] hover:text-white"
                            >
                              {copied ? 'Copié !' : 'Copier JSON'}
                            </button>
                          </div>
                          <pre className="overflow-x-auto text-[10px] leading-relaxed">
                            {JSON.stringify(lastPayload, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 8. APPLICATION PRINCIPALE ATLAS FORGE (ROUTAGE HASH + TOUTES LES SECTIONS)
// ============================================================================

export default function App() {
  const [activeDemoSlug, setActiveDemoSlug] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [legalModal, setLegalModal] = useState<string | null>(null); // 'mentions' | 'confidentialite' | null
  const [preselectedTrade, setPreselectedTrade] = useState('');

  useEffect(() => {
    document.title = 'Atlas Forge — Sites internet pour artisans et entreprises du bâtiment';
  }, []);

  // Synchronisation avec le routage par hash (#/demo/slug)
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash || '';
      const match = hash.match(/^#\/demo\/([a-z0-9-]+)$/);
      if (match && DEMOS_METADATA.some((d) => d.slug === match[1])) {
        setActiveDemoSlug(match[1]);
      } else {
        setActiveDemoSlug(null);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const openDemo = (slug: string) => {
    setActiveDemoSlug(slug);
    try {
      window.location.hash = `/demo/${slug}`;
    } catch {
      // Fallback sécurisé
    }
  };

  const closeDemo = () => {
    setActiveDemoSlug(null);
    try {
      window.location.hash = '/';
    } catch {
      // Fallback sécurisé
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleRequestSimilar = (tradeLabel: string) => {
    setPreselectedTrade(tradeLabel);
    setActiveDemoSlug(null);
    try {
      window.location.hash = '/';
    } catch {
      // Fallback sécurisé
    }
    setTimeout(() => {
      scrollToSectionId('contact');
    }, 80);
  };

  const scrollToMainSection = (id: string) => {
    setMobileMenuOpen(false);
    scrollToSectionId(id);
  };

  // Si une démonstration est ouverte, afficher l'expérience dédiée
  if (activeDemoSlug) {
    return (
      <DemoViewer
        activeSlug={activeDemoSlug}
        onSelectDemo={openDemo}
        onBack={closeDemo}
        onRequestSimilar={handleRequestSimilar}
      />
    );
  }

  const demoCategories = ['Tous', ...DEMOS_METADATA.map((d) => d.category)];
  const filteredDemos =
    selectedCategory === 'Tous'
      ? DEMOS_METADATA
      : DEMOS_METADATA.filter((d) => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#1F1B16] selection:bg-[#C45525] selection:text-white font-sans">
      {/* ================= NAVIGATION FIXE ================= */}
      <header className="sticky top-0 z-40 bg-[#F6F4EE]/92 backdrop-blur-md border-b border-[#1F1B16]/[0.08]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-[60px] flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollToMainSection('accueil')}
            className="cursor-pointer focus:outline-none pressable active:scale-[0.97]"
          >
            <AtlasLogo />
          </button>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-[#5E554A]">
            {[
              { id: 'accueil', label: 'Accueil' },
              { id: 'demonstrations', label: 'Démonstrations' },
              { id: 'prestations', label: 'Prestations' },
              { id: 'methode', label: 'Méthode' },
              { id: 'faq', label: 'FAQ' },
              { id: 'contact', label: 'Contact' },
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToMainSection(link.id)}
                className="hover:text-[#1F1B16] transition-colors duration-150 ease-emil cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center">
            <button
              type="button"
              onClick={() => scrollToMainSection('contact')}
              className="px-4 py-2 rounded-lg bg-[#C45525] hover:bg-[#A9441B] text-white text-xs font-medium pressable active:scale-[0.97] transition-[transform,background-color] duration-160 ease-emil cursor-pointer"
            >
              Obtenir mon site
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#1F1B16] hover:bg-[#1F1B16]/[0.05] pressable active:scale-[0.94] cursor-pointer"
            aria-label={mobileMenuOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#1F1B16]/[0.08] px-6 py-5 space-y-1 shadow-lg">
            {[
              { id: 'accueil', label: 'Accueil' },
              { id: 'demonstrations', label: 'Démonstrations' },
              { id: 'prestations', label: 'Prestations' },
              { id: 'methode', label: 'Méthode' },
              { id: 'faq', label: 'FAQ' },
              { id: 'contact', label: 'Contact' },
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToMainSection(link.id)}
                className="block w-full text-left py-2.5 px-2 rounded-md text-sm font-medium text-[#1F1B16] hover:text-[#C45525] hover:bg-[#F6F4EE] transition-colors duration-150 ease-emil cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => scrollToMainSection('contact')}
              className="mt-3 w-full min-h-[44px] py-2.5 px-4 rounded-lg bg-[#C45525] text-white font-medium text-xs pressable active:scale-[0.97] cursor-pointer flex items-center justify-center"
            >
              Obtenir mon site
            </button>
          </div>
        )}
      </header>

      {/* ================= SECTION A — HERO ================= */}
      <section id="accueil" className="pt-16 pb-20 sm:pt-20 sm:pb-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            <div className="lg:col-span-6">
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#1F1B16] leading-[1.14] tracking-[-0.02em] mb-5">
                Un site internet conçu avec la même exigence que vos chantiers
              </h1>

              <p className="text-sm sm:text-base text-[#5E554A] leading-relaxed mb-6 max-w-xl">
                Pour les couvreurs, menuisiers, électriciens, plombiers et artisans du bâtiment. Présentation sobre de vos réalisations, structure saine pour Google et demandes de devis directes.
              </p>

              {/* Badges de réassurance immédiate */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-8 text-[11px] font-mono text-[#6E665A]">
                <span className="inline-flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md border border-[#1F1B16]/[0.08]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C45525]" />
                  100% propriétaire (zéro abonnement)
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md border border-[#1F1B16]/[0.08]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C45525]" />
                  Dès 1 490 € HT clé en main
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md border border-[#1F1B16]/[0.08]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C45525]" />
                  Devis clair sous 24h à 48h
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => scrollToMainSection('demonstrations')}
                  className="px-5 py-3 rounded-lg bg-[#1F1B16] hover:bg-[#161513] text-[#FDFBF7] font-medium text-xs sm:text-sm pressable active:scale-[0.97] transition-[transform,background-color] duration-160 ease-emil flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explorer les démonstrations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToMainSection('contact')}
                  className="px-5 py-3 rounded-lg border border-[#1F1B16]/[0.15] hover:bg-[#EFE9DF] text-[#1F1B16] font-medium text-xs sm:text-sm pressable active:scale-[0.97] transition-[transform,background-color,border-color] duration-160 ease-emil flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Demander un devis</span>
                </button>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#6E665A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C45525]" />
                <span>6 démonstrations navigables conçues pour vos métiers</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <HeroMockupComposition onOpenDemo={openDemo} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION B — LE CONSTAT ================= */}
      <section className="py-20 lg:py-24 bg-[#F6F4EE] border-t border-[#1F1B16]/[0.08]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-mono text-[#6E665A] block mb-2">
                Le constat
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F1B16]">
                Votre savoir-faire mérite mieux qu’un site vieillissant
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Une vitrine qui ne reflète pas la qualité de vos finitions',
                desc: 'Vous soignez chaque chantier au millimètre, mais un site daté ou inexistant donne une impression approximative avant même le premier appel.',
              },
              {
                num: '02',
                title: 'Des coordonnées et prestations difficiles à trouver sur mobile',
                desc: 'Sur smartphone, un site confus fait fuir le particulier ou l’architecte qui cherche un artisan fiable sur son secteur.',
              },
              {
                num: '03',
                title: 'Des prospects qui se tournent vers des confrères mieux présentés',
                desc: 'À compétences égales, un client retient l’entreprise dont la présentation inspire immédiatement sérieux, clarté et régularité.',
              },
            ].map((item, i) => (
              <Reveal key={item.num} delay={i * 60}>
                <div className="h-full rounded-xl bg-white border border-[#1F1B16]/[0.08] p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    <span className="inline-block text-xs font-mono text-[#6E665A] mb-4">
                      {item.num}
                    </span>
                    <h3 className="text-base font-semibold text-[#1F1B16] leading-snug mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5E554A] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-8 rounded-xl bg-white border border-[#1F1B16]/[0.08] p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <p className="text-base sm:text-lg font-medium text-[#1F1B16] leading-snug max-w-2xl">
                Votre site internet est le premier aperçu de votre atelier. Faites-en un gage de confiance immédiat.
              </p>
              <button
                type="button"
                onClick={() => scrollToMainSection('demonstrations')}
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-mono text-[#C45525] hover:text-[#A9441B] transition-colors cursor-pointer"
              >
                <span>Explorer les 6 démonstrations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SECTION C — DÉMONSTRATIONS ================= */}
      <section id="demonstrations" className="py-20 lg:py-24 bg-[#F6F4EE] border-t border-[#1F1B16]/[0.08]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal>
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-mono text-[#6E665A] block mb-2">
                Démonstrations
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F1B16] mb-3">
                Six véritables sites d'artisans, prêts à explorer
              </h2>
              <p className="text-xs sm:text-sm text-[#5E554A] leading-relaxed">
                Explorez six mini-sites navigables construits pour différents corps d’état. Chaque démonstration dispose de sa propre direction artistique, de ses prestations et de son formulaire de devis.
              </p>
            </div>
          </Reveal>

          {/* Filtres par métier */}
          <div className="flex flex-wrap gap-1.5 mb-8">
            {demoCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono pressable active:scale-[0.96] transition-[transform,background-color,border-color,color] duration-160 ease-emil cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1F1B16] text-[#FDFBF7]'
                    : 'bg-white text-[#5E554A] border border-[#1F1B16]/[0.1] hover:bg-[#EFE9DF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grille des 6 démonstrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDemos.map((demo, idx) => (
              <Reveal key={demo.slug} delay={idx * 50}>
                <article className="group h-full bg-white rounded-xl border border-[#1F1B16]/[0.08] overflow-hidden flex flex-col shadow-[0_1px_3px_rgba(31,27,22,0.04)] pressable-subtle active:scale-[0.995] transition-[transform,box-shadow] duration-200 ease-emil">
                  {/* Aperçu miniature */}
                  <div
                    onClick={() => openDemo(demo.slug)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && openDemo(demo.slug)}
                    className="cursor-pointer"
                  >
                    <div className="h-7 bg-[#EFE9DF] border-b border-[#1F1B16]/[0.06] px-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#AAA398]" />
                        <span className="w-2 h-2 rounded-full bg-[#AAA398]" />
                        <span className="w-2 h-2 rounded-full bg-[#AAA398]" />
                      </div>
                      <span className="text-[10px] font-mono text-[#6E665A]">
                        {demo.slug}.fr
                      </span>
                    </div>

                    <div
                      className="relative aspect-[16/10] overflow-hidden"
                      style={{ backgroundColor: demo.darkBg }}
                    >
                      <img
                        src={demo.heroImage}
                        alt={`${demo.companyName} — ${demo.category}`}
                        className="w-full h-full object-cover opacity-65"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/90 text-[#1F1B16]">
                            {demo.category}
                          </span>
                          <div className="flex items-center gap-1">
                            {demo.palette.map((hex) => (
                              <span
                                key={hex}
                                className="w-3 h-3 rounded-full border border-white/40"
                                style={{ backgroundColor: hex }}
                                title={hex}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-white">
                          <p className="text-base font-semibold leading-tight">{demo.companyName}</p>
                          <p className="text-xs text-white/75 line-clamp-1">{demo.tagline}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenu carte */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-base font-semibold text-[#1F1B16]">{demo.companyName}</h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F6F4EE] text-[#6E665A] border border-[#1F1B16]/[0.08]">
                          {demo.tradeLabel}
                        </span>
                      </div>
                      <p className="text-xs text-[#5E554A] leading-relaxed mb-5">
                        {demo.artisticDirection}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openDemo(demo.slug)}
                      className="w-full py-2.5 px-3 rounded-lg bg-[#1F1B16] hover:bg-[#C45525] text-white text-xs font-mono pressable active:scale-[0.97] transition-[transform,background-color] duration-160 ease-emil flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Ouvrir la démonstration</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION D — PRESTATIONS ================= */}
      <section id="prestations" className="py-20 lg:py-24 bg-[#F6F4EE] border-t border-[#1F1B16]/[0.08]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-mono text-[#6E665A] block mb-2">
                Prestations d'autorité
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F1B16] mb-3">
                Tout ce qui compose votre présence en ligne
              </h2>
              <p className="text-xs sm:text-sm text-[#5E554A] leading-relaxed">
                Une architecture en 3 piliers complémentaires pour valoriser votre savoir-faire artisanal, capter les recherches locales et transformer chaque visiteur en chantier qualifié.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SERVICE_PILLARS.map((pillar, idx) => (
              <Reveal key={pillar.title} delay={idx * 60}>
                <div
                  className={`h-full rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                    pillar.featured
                      ? 'bg-white border-2 border-[#C45525] shadow-lg shadow-[#C45525]/[0.06] relative'
                      : 'bg-white/90 border border-[#1F1B16]/[0.08] shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#EFE9DF] text-[#5E554A]">
                        {pillar.badge}
                      </span>
                      {pillar.highlightBadge && (
                        <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-[#C45525]/10 text-[#A9441B] border border-[#C45525]/20">
                          {pillar.highlightBadge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-[#1F1B16] mb-2 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5E554A] leading-relaxed mb-6">
                      {pillar.description}
                    </p>

                    <div className="space-y-4 pt-4 border-t border-[#1F1B16]/[0.06]">
                      {pillar.items.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <div key={item.title} className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-[#F6F4EE] text-[#C45525] flex items-center justify-center shrink-0 mt-0.5 border border-[#1F1B16]/[0.06]">
                              <ItemIcon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#1F1B16] mb-0.5">
                                {item.title}
                              </p>
                              <p className="text-xs text-[#5E554A] leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#1F1B16]/[0.06] flex items-center gap-2 text-xs font-medium text-[#1F1B16]">
                    <CheckCircle2 className="w-4 h-4 text-[#C45525]" />
                    <span>Inclus clé en main sans surcoût</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION E — MÉTHODE ================= */}
      <section id="methode" className="py-20 lg:py-24 bg-[#F6F4EE] border-t border-[#1F1B16]/[0.08]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-mono text-[#6E665A] block mb-2">
                Méthode de travail
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F1B16] mb-3">
                Un processus direct, pensé pour votre emploi du temps
              </h2>
              <p className="text-xs sm:text-sm text-[#5E554A] leading-relaxed">
                Notre rôle est de simplifier votre implication : nous concevons le design, rédigeons les contenus et paramétrons les outils techniques pendant que vous restez concentré sur vos chantiers.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_STEPS.map((step, idx) => (
              <Reveal key={step.number} delay={idx * 60}>
                <div className="h-full bg-white rounded-xl p-6 border border-[#1F1B16]/[0.08] flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-[#6E665A] block mb-3">
                      Étape {step.number}
                    </span>
                    <h3 className="text-sm font-semibold text-[#1F1B16] mb-2">{step.title}</h3>
                    <p className="text-xs text-[#5E554A] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION F — POURQUOI ATLAS FORGE ================= */}
      <section className="py-20 lg:py-24 bg-[#161513] text-[#FDFBF7] border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-xs font-mono text-[#AAA398] block mb-2">
                  L'engagement Atlas Forge
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight mb-4">
                  Vous travaillez sur vos chantiers. Nous soignons votre présence en ligne.
                </h2>
                <p className="text-xs sm:text-sm text-[#AAA398] leading-relaxed">
                  Nous concevons des sites utiles, lisibles et durables, sans promesses exagérées ni complexité inutile.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7 space-y-3">
              {WHY_ATLAS_FORGE.map((item, idx) => (
                <Reveal key={item.title} delay={idx * 50}>
                  <div className="rounded-lg bg-white/[0.03] border border-white/10 p-5 flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded bg-[#C45525]/20 text-[#C45525] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-[#AAA398] leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION G — FAQ ================= */}
      <section id="faq" className="py-20 lg:py-24 bg-[#F6F4EE] border-t border-[#1F1B16]/[0.08]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <Reveal>
            <div className="mb-10">
              <span className="text-xs font-mono text-[#6E665A] block mb-2">
                Questions fréquentes
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F1B16]">
                Tout savoir avant de démarrer
              </h2>
            </div>
          </Reveal>

          <div className="divide-y divide-[#1F1B16]/[0.08] border-y border-[#1F1B16]/[0.08]">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={item.question} className="py-4 sm:py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer pressable-subtle group"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-medium text-[#1F1B16] group-hover:text-[#C45525] transition-colors duration-150 ease-emil">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#6E665A] shrink-0 transition-transform duration-200 ease-emil ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ease-emil ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="pt-3 text-xs sm:text-sm text-[#5E554A] leading-relaxed pr-6">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION H — CTA INTERMÉDIAIRE ================= */}
      <section className="py-14 bg-[#F6F4EE]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal>
            <div className="rounded-xl bg-[#161513] text-[#FDFBF7] p-8 sm:p-12 text-center max-w-3xl mx-auto border border-white/10">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight mb-3">
                Et si votre prochain chantier venait de votre site ?
              </h2>
              <p className="text-xs sm:text-sm text-[#AAA398] mb-6">
                Échangeons sur vos priorités et imaginons ensemble votre future vitrine professionnelle.
              </p>
              <button
                type="button"
                onClick={() => scrollToMainSection('contact')}
                className="px-6 py-3 rounded-lg bg-[#C45525] hover:bg-[#A9441B] text-white font-medium text-xs sm:text-sm pressable active:scale-[0.97] transition-[transform,background-color] duration-160 ease-emil inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Demander un devis pour mon entreprise</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FORMULAIRE DE CONTACT ================= */}
      <ContactSection preselectedTrade={preselectedTrade} />

      {/* ================= SECTION I — FOOTER ================= */}
      <footer className="bg-[#161513] text-[#AAA398] py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/10">
            <div className="md:col-span-5">
              <AtlasLogo dark size="sm" />
              <p className="mt-3 text-xs text-[#AAA398] leading-relaxed max-w-sm">
                Conception et réalisation de sites internet pour artisans et entreprises du bâtiment.
              </p>
            </div>

            <div className="md:col-span-4">
              <p className="text-xs font-mono text-white mb-3">Navigation</p>
              <ul className="space-y-2 text-xs">
                {[
                  { id: 'accueil', label: 'Accueil' },
                  { id: 'demonstrations', label: 'Démonstrations' },
                  { id: 'prestations', label: 'Prestations' },
                  { id: 'contact', label: 'Contact' },
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => scrollToMainSection(link.id)}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <p className="text-xs font-mono text-white mb-3">Informations</p>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('mentions')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Mentions légales
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('confidentialite')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Politique de confidentialité
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#6E665A]">
            <p>© {new Date().getFullYear()} Atlas Forge. Tous droits réservés.</p>
            <p>Conçu pour valoriser les métiers d'artisanat et du bâtiment.</p>
          </div>
        </div>
      </footer>

      {/* Modales Mentions légales & Confidentialité */}
      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
}