import { RESIDENCES } from '../data/residences'
import { newImage as img } from '../lib/imageStyle'

/**
 * The site's shipped content, grouped by page so the admin sidebar can map
 * one-to-one onto it. The panel edits a copy held in localStorage (or in
 * Supabase once configured); "Réinitialiser" restores these values.
 *
 * Every picture is `{ src, x, y, zoom }` rather than a bare URL: `x`/`y` are
 * the focal point (0–100, what stays centered when a section crops the
 * image tighter than the source) and `zoom` (>= 1) enlarges past the
 * default fit. The admin's crop control writes these; every page that
 * renders the image reads them back — see lib/imageStyle.js.
 */
export const DEFAULT_CONTENT = {
  /* ---------------- Accueil ---------------- */
  home: {
    hero: {
      title: "L'art du savoir vivre",
      description:
        "Des résidences pensées dans le moindre détail, où l'élégance rencontre le confort pour créer un art de vivre unique.",
      primaryCta: 'Découvrir nos résidences',
      secondaryCta: 'Nous contacter',
      images: [
        img('/images/home/hero-1-banniere.jpg'),
        img('/images/home/hero-2-salon.jpg'),
        img('/images/home/hero-3-rooftop.jpg'),
        img('/images/home/hero-4-suite.jpg'),
      ],
    },
    intro: {
      logo: 'Batimedaf',
      // "Chaque <word> / est pensée." — each word shows with its photo.
      before: 'Chaque',
      after: 'est pensée.',
      words: [
        { word: 'ligne', image: img('/images/library/duplex/03-double-hauteur-2.jpg') },
        { word: 'matière', image: img('/images/library/f4-garden/05-cuisine-3.jpg') },
        { word: 'lumière', image: img('/images/library/f4-garden/02-salon-2.jpg') },
      ],
      description:
        "Batimedaf façonne des résidences d'exception où chaque ligne, chaque matière et chaque lumière sont pensées pour révéler un art de vivre intemporel, entre héritage architectural et confort contemporain.",
    },
    // "Notre approche": the client's own presentation and four principles
    // (brochure "Présentation du groupe" / "ADN & valeurs").
    approach: {
      statement:
        'Notre approche repose sur une conception maîtrisée, une exécution rigoureuse et une sélection stratégique des emplacements.',
      text: "Chaque projet est développé comme une entité cohérente, où l'architecture, l'implantation et les finitions participent à une signature identifiable.",
      principles: [
        {
          title: 'Maîtrise',
          text: 'Une architecture étudiée, des volumes équilibrés et une implantation optimisée.',
        },
        {
          title: 'Précision',
          text: 'Un soin particulier accordé aux finitions, aux matériaux et aux détails techniques.',
        },
        {
          title: 'Clarté',
          text: 'Une communication transparente et des engagements respectés à chaque étape.',
        },
        {
          title: 'Exigence',
          text: 'Une sélection rigoureuse des partenaires, des équipements et des standards constructifs.',
        },
      ],
    },
    /* The apartments the home page presents, as `slug/id`: the cards read
       everything else from the residence, so an edit there shows here too. */
    apartments: {
      eyebrow: 'Nos appartements',
      title: 'Du F4 au Duplex, de 130 à 333 m².',
      list: ['le-bosquet/f4-garden', 'le-bosquet/duplex', 'le-bosquet/d-41'],
    },
    reel: {
      eyebrow: 'Galerie',
      title: 'Une visite en images.',
      images: [
        {
          image: img('/images/library/duplex/02-double-hauteur-1.jpg'),
          alt: 'Séjour en double hauteur du Duplex',
          caption: 'Duplex — Séjour en double hauteur',
        },
        {
          image: img('/images/library/f4-garden/07-jardin-1.jpg'),
          alt: 'Jardin privatif et piscine du F4-Garden, vue aérienne',
          caption: 'F4-Garden — Jardin et piscine',
        },
        {
          image: { src: '/images/library/f4-garden/10-chambre-1.jpg', x: 45, y: 50, zoom: 1 },
          alt: 'Chambre du F4-Garden, tête de lit en arche',
          caption: 'F4-Garden — Chambre',
        },
        {
          image: img('/images/library/sejour/f4-salon-2.jpg'),
          alt: 'Salon du F4',
          caption: 'F4 — Salon',
        },
        {
          image: { src: '/images/library/f4-garden/01-salon-1.jpg', x: 22, y: 50, zoom: 1 },
          alt: 'Salon du F4-Garden ouvert sur le patio',
          caption: 'F4-Garden — Salon',
        },
        {
          image: img('/images/library/duplex/10-cuisine-2.jpg'),
          alt: 'Cuisine équipée du Duplex',
          caption: 'Duplex — Cuisine',
        },
        {
          image: img('/images/library/duplex/07-patios.jpg'),
          alt: 'Patios du Duplex, vue aérienne',
          caption: 'Duplex — Patios',
        },
        {
          image: img('/images/library/chambre/f4-suite-2.jpg'),
          alt: 'Suite parentale du F4',
          caption: 'F4 — Suite parentale',
        },
        {
          image: img('/images/library/duplex/05-salon-2.jpg'),
          alt: 'Bibliothèque éclairée du Duplex',
          caption: 'Duplex — Bibliothèque',
        },
        {
          image: img('/images/library/f4-garden/03-cuisine-1.jpg'),
          alt: 'Cuisine ouverte du F4-Garden',
          caption: 'F4-Garden — Cuisine',
        },
        {
          image: img('/images/library/duplex/15-chambre-1.jpg'),
          alt: 'Chambre du Duplex',
          caption: 'Duplex — Chambre',
        },
        {
          image: { src: '/images/library/duplex/23-salle-de-bain-1.jpg', x: 35, y: 50, zoom: 1 },
          alt: 'Salle de bain en marbre du Duplex',
          caption: 'Duplex — Salle de bain',
        },
      ],
    },
  },

  /* ---------------- À propos ---------------- */
  about: {
    kicker: 'À propos',
    heading: 'Batimedaf, promoteur immobilier à Alger.',
    summary:
      'Nous concevons et réalisons des résidences à Alger, de la sélection du terrain à la remise des clés.',
    cover: img('/images/library/exterieur/exterieur-rooftop-sunset.jpg'),
    approachLabel: 'Notre démarche',
    residencesLabel: 'Nos résidences',
    visitTitle: 'Venir découvrir une résidence.',
  },

  /* ---------------- Collaboration ---------------- */
  collaboration: {
    kicker: 'Collaboration',
    title: 'Vous êtes…',
    profiles: [
      {
        id: 'architectes',
        label: 'Architecte',
        headline: "Vous dessinez, nous construisons — jusqu'au dernier détail.",
        text: "Nous associons un architecte dès l'esquisse et le gardons jusqu'à la réception. Deux à trois opérations par an, dessinées depuis l'intérieur : lumière, circulation, rangements.",
        criteria: [
          'Références bâties en logement collectif',
          'Île-de-France ou grandes métropoles',
          'Disponibilité sur 24 à 30 mois',
        ],
        figureValue: '100 %',
        figureLabel: 'des projets suivis par leur architecte',
        image: img('/images/library/collaboration/architectes.jpg'),
      },
      {
        id: 'artisans',
        label: 'Artisan d’art',
        headline: 'Vos ateliers font la différence que l’on remarque en dernier.',
        text: 'Ébénisterie, ferronnerie, staff, pierre, terrazzo. Nos finitions reposent sur des ateliers indépendants avec lesquels nous travaillons chantier après chantier, pas au coup par coup.',
        criteria: [
          'Savoir-faire spécialisé et démontrable',
          'Capacité à produire en série limitée',
          'Assurance décennale à jour',
        ],
        figureValue: '10 ans',
        figureLabel: 'd’ancienneté moyenne de nos partenaires',
        image: img('/images/library/collaboration/artisans.jpg'),
      },
      {
        id: 'fonciers',
        label: 'Propriétaire foncier',
        headline: 'Un terrain, un immeuble, une friche : réponse sous 15 jours.',
        text: 'Nous étudions chaque opportunité en interne et nous engageons sur une offre ferme, sans clause suspensive de commercialisation. Vous savez rapidement où vous allez.',
        criteria: [
          '300 m² de surface constructible minimum',
          'Alger et ses environs',
          'Réponse ferme sous 15 jours',
        ],
        figureValue: '15 j',
        figureLabel: 'pour une offre ferme',
        image: img('/images/library/exterieur/exterieur-bosquet-card.jpg'),
      },
      {
        id: 'bureaux',
        label: 'Bureau d’études',
        headline: 'Nos exigences environnementales dépassent la réglementation.',
        text: "Structure, thermique, acoustique, fluides. Nous cherchons des équipes capables de tenir le réemploi et les performances visées, et de rester mobilisées jusqu'à la livraison.",
        criteria: [
          'RE2020 et réemploi structurel',
          'Équipe dédiée par opération',
          'Suivi jusqu’à la réception',
        ],
        figureValue: '-40 %',
        figureLabel: 'd’empreinte carbone visée',
        image: img('/images/library/exterieur/exterieur-facade.jpg'),
      },
    ],
    commitmentsTitle: 'Ce que nous garantissons à nos partenaires.',
    commitments: [
      {
        title: 'Lots séparés',
        text: 'Chaque entreprise est contractualisée directement. Jamais de sous-traitance en cascade ni de responsabilité diluée.',
      },
      {
        title: 'Paiement à 30 jours',
        text: 'Situations validées sous une semaine, réglées à trente jours, sans retenue au-delà du cadre légal.',
      },
      {
        title: 'Un interlocuteur unique',
        text: 'Un responsable technique suit votre lot du démarrage à la réception. Pas de changement en cours de route.',
      },
      {
        title: 'Des relations qui durent',
        text: 'Nous cherchons des collaborations récurrentes, pas des consultations ponctuelles au moins-disant.',
      },
    ],
    stepsTitle: 'Comment postuler',
    steps: [
      { title: 'Écrivez-nous', text: 'Présentez votre structure et joignez un lien vers vos références.' },
      { title: 'Premier échange', text: 'Nous revenons vers vous sous une semaine, par appel ou en agence.' },
      { title: 'Consultation', text: 'Vous êtes consulté dès l’opération suivante correspondant à votre profil.' },
    ],
  },

  /* ---------------- Contact ---------------- */
  contact: {
    kicker: 'Contact',
    title: 'Parlons de votre projet.',
    sub: 'Écrivez-nous : nous répondons personnellement sous 48 heures ouvrées.',
    subjects: [
      'Une résidence',
      'Organiser une visite',
      'Une collaboration',
      'Presse',
      'Autre',
    ],
    phone: '+33 1 00 00 00 00',
    email: 'contact@batimedaf.com',
    address: 'Hussein Dey\nAlger',
    hours: 'Lun — Ven, 9 h — 19 h\nSam, 10 h — 17 h',
    faqTitle: 'Questions fréquentes',
    faq: [
      {
        title: 'Comment se déroule une visite ?',
        text: 'Les visites se font sur rendez-vous, du lundi au samedi. Pour les programmes en cours de construction, nous recevons en bureau de vente avec plans, échantillons de matériaux et vues 3D, puis sur site dès que le gros œuvre le permet.',
      },
      {
        title: 'Peut-on personnaliser son appartement ?',
        text: "Oui, tant que le chantier n'a pas dépassé le stade des cloisons. Cuisines, revêtements, agencement des pièces et fusion de lots sont arbitrés avec notre architecte lors d'un rendez-vous de personnalisation dédié.",
      },
      {
        title: 'Quels sont les délais de livraison ?',
        text: 'Nos programmes sont livrés entre dix-huit et trente mois après le démarrage des travaux. La date prévisionnelle est contractualisée dans le contrat de réservation et actualisée à chaque étape.',
      },
      {
        title: 'Proposez-vous un accompagnement au financement ?',
        text: 'Nous ne sommes pas courtiers, mais nous travaillons avec plusieurs partenaires bancaires et pouvons vous mettre en relation. Nous fournissons l’ensemble des pièces nécessaires au montage de votre dossier.',
      },
      {
        title: 'Quelles garanties après la livraison ?',
        text: 'Garantie de parfait achèvement la première année, garantie biennale sur les équipements, et garantie décennale sur la structure. Le suivi est assuré en interne, sans passer par un prestataire externe.',
      },
      {
        title: 'Travaillez-vous avec des architectes extérieurs ?',
        text: 'Régulièrement. Nous étudions les candidatures d’agences et d’artisans d’art pour nos futurs programmes — écrivez-nous en sélectionnant « Une collaboration ».',
      },
    ],
  },

  /* ---------------- Résidences ---------------- */
  residences: RESIDENCES,
}
