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
      primaryCta: 'Start Exploring',
      secondaryCta: 'Contact team',
      images: [
        img('/images/home/hero-1-banniere.jpg'),
        img('/images/home/hero-2-salon.jpg'),
        img('/images/home/hero-3-rooftop.jpg'),
        img('/images/home/hero-4-suite.jpg'),
      ],
    },
    intro: {
      logo: 'Batimedaf',
      description:
        "Batimedaf façonne des résidences d'exception où chaque ligne, chaque matière et chaque lumière sont pensées pour révéler un art de vivre intemporel, entre héritage architectural et confort contemporain.",
    },
    story: {
      slides: [
        {
          title: 'Nos réalisations',
          description:
            "Chaque projet Batimedaf raconte une histoire d'exigence et d'élégance, façonnée pour ceux qui recherchent un cadre de vie d'exception.",
          image: img('/images/home/story-1-realisations.jpg'),
        },
        {
          title: 'Une signature architecturale',
          description:
            'Des volumes sculptés, des matières nobles et une lumière travaillée pour révéler le caractère unique de chaque résidence.',
          image: img('/images/home/story-2-architecture.jpg'),
        },
        {
          title: 'Un art de vivre durable',
          description:
            'Des matériaux responsables et des performances énergétiques pensées pour préserver le confort autant que la planète.',
          image: img('/images/home/story-3-durable.jpg'),
        },
        {
          title: 'Un accompagnement sur-mesure',
          description:
            'De la conception à la livraison, notre équipe vous accompagne à chaque étape pour donner vie à votre projet.',
          image: img('/images/home/story-4-accompagnement.jpg'),
        },
      ],
    },
    gallery: {
      eyebrow: 'Galerie',
      title: 'Nos appartements',
      images: [
        {
          image: img('/images/home/gallery-1-sejour.jpg'),
          alt: "Séjour lumineux d'un appartement Batimedaf",
          caption: 'Séjour — Le Bosquet',
        },
        {
          image: img('/images/home/gallery-2-salon.jpg'),
          alt: 'Salon contemporain aux tons naturels',
          caption: 'Salon — Les Ateliers',
        },
        {
          image: img('/images/home/gallery-3-cuisine.jpg'),
          alt: 'Cuisine ouverte sur la pièce de vie',
          caption: 'Cuisine — Le Bosquet',
        },
        {
          image: img('/images/home/gallery-4-chambre.jpg'),
          alt: 'Chambre principale aux finitions soignées',
          caption: 'Suite parentale — Le Bosquet',
        },
        {
          image: img('/images/home/gallery-5-salledebain.jpg'),
          alt: 'Salle de bain en pierre naturelle',
          caption: 'Salle de bain — Le Bosquet',
        },
        {
          image: img('/images/home/gallery-6-terrasse.jpg'),
          alt: 'Jardin privatif avec vue dégagée',
          caption: 'Jardin privatif — Le Bosquet',
        },
      ],
    },
  },

  /* ---------------- À propos ---------------- */
  about: {
    kicker: 'À propos',
    titleLines: ['Bâtir ce qui traverse', 'le temps.'],
    intro:
      "Batimedaf conçoit et construit des résidences d'exception depuis quinze ans. Une maison familiale devenue promoteur, sans jamais changer de méthode.",
    image: img('/images/library/about/atelier.jpg'),
    figures: [
      { value: 15, label: "Ans d'expertise" },
      { value: 42, label: 'Résidences livrées' },
      { value: 1200, label: 'Logements' },
      { value: 5, label: 'Villes' },
    ],
    timelineTitle: 'Quinze ans, cinq étapes.',
    milestones: [
      {
        year: '2010',
        image: img('/images/library/about/atelier.jpg'),
        title: 'Deux associés, un atelier',
        text: "Un maître d'œuvre et une architecte fondent Batimedaf autour d'une conviction : la qualité se joue sur des arbitrages invisibles une fois les murs finis.",
      },
      {
        year: '2014',
        image: img('/images/library/exterieur/exterieur-bosquet-card.jpg'),
        title: 'Première résidence livrée',
        text: 'Douze logements dans le 11ᵉ arrondissement, livrés avec trois semaines d’avance. Les entreprises de ce premier chantier travaillent encore avec nous.',
      },
      {
        year: '2018',
        image: img('/images/library/exterieur/exterieur-ateliers-card.jpg'),
        title: 'Ouverture régionale',
        text: 'Le modèle s’étend à quatre métropoles, sans grossir la structure : toujours deux à trois opérations par an, suivies par les mêmes équipes.',
      },
      {
        year: '2022',
        image: img('/images/library/salle-de-bain/sdb-2.jpg'),
        title: 'Le tournant matière',
        text: 'Réemploi structurel, matériaux biosourcés et performances au-delà de la RE2020 deviennent la norme sur l’ensemble de nos programmes.',
      },
      {
        year: '2026',
        image: img('/images/library/exterieur/exterieur-balcon.jpg'),
        title: 'Le Bosquet',
        text: 'Vingt-quatre appartements autour d’un parc privatif de 2 000 m² dans le 16ᵉ : notre opération la plus ambitieuse à ce jour.',
      },
    ],
    principles: [
      {
        title: 'Nous construisons peu.',
        text: 'Deux à trois opérations par an. Assez pour maîtriser chaque décision, trop peu pour en déléguer une seule.',
      },
      {
        title: 'Nous ne sous-traitons pas la qualité.',
        text: 'Lots séparés, entreprises contractualisées directement, suivi hebdomadaire sur site du terrassement à la remise des clés.',
      },
      {
        title: 'Nous dessinons depuis l’intérieur.',
        text: 'Lumière, circulation, rangements : les plans partent de la façon dont on habite, pas de la surface constructible.',
      },
      {
        title: 'Nous restons après la livraison.',
        text: 'Garantie décennale suivie en interne et service dédié pendant dix ans. La relation ne s’arrête pas à la remise des clés.',
      },
    ],
    ctaTitle: 'Découvrir nos résidences ?',
    ctaLabel: 'Voir les résidences',
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
          'Paris et première couronne',
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
    address: '12 avenue des Bâtisseurs\n75008 Paris',
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
