import { RESIDENCES_EN } from './residences.en'
import { newImage as img } from '../lib/imageStyle'

/**
 * Static English mirror of `src/content/defaults.js`. The admin panel only
 * ever edits the French tree — this file is a hand-maintained translation of
 * it, swapped in wholesale when the visitor picks English. Images are the
 * same files as the French version; only text changes.
 */
export const CONTENT_EN = {
  home: {
    hero: {
      title: 'The art of fine living',
      description:
        'Residences designed down to the smallest detail, where elegance meets comfort to create a unique way of living.',
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
        'Batimedaf shapes exceptional residences where every line, every material and every ray of light is considered to reveal a timeless way of living, between architectural heritage and contemporary comfort.',
    },
    story: {
      slides: [
        {
          title: 'Our developments',
          description:
            'Every Batimedaf project tells a story of rigour and elegance, shaped for those seeking an exceptional living environment.',
          image: img('/images/home/story-1-realisations.jpg'),
        },
        {
          title: 'An architectural signature',
          description:
            'Sculpted volumes, noble materials and carefully crafted light reveal the unique character of each residence.',
          image: img('/images/home/story-2-architecture.jpg'),
        },
        {
          title: 'A sustainable way of living',
          description:
            'Responsible materials and energy performance designed to preserve comfort as much as the planet.',
          image: img('/images/home/story-3-durable.jpg'),
        },
        {
          title: 'Support, tailored to you',
          description:
            'From design to delivery, our team supports you at every step to bring your project to life.',
          image: img('/images/home/story-4-accompagnement.jpg'),
        },
      ],
    },
    apartments: {
      eyebrow: 'Our apartments',
      title: 'From the F4 to the Duplex, 130 to 333 m².',
      list: ['le-bosquet/f4-garden', 'le-bosquet/duplex', 'le-bosquet/d-41'],
    },
    reel: {
      eyebrow: 'Gallery',
      title: 'A tour in pictures.',
      images: [
        {
          image: img('/images/library/duplex/02-double-hauteur-1.jpg'),
          alt: 'Double-height living room of the Duplex',
          caption: 'Duplex — Double-height living room',
        },
        {
          image: img('/images/library/f4-garden/07-jardin-1.jpg'),
          alt: 'Private garden and pool of the F4-Garden, aerial view',
          caption: 'F4-Garden — Garden and pool',
        },
        {
          image: { src: '/images/library/f4-garden/10-chambre-1.jpg', x: 45, y: 50, zoom: 1 },
          alt: 'Bedroom of the F4-Garden, arched headboard',
          caption: 'F4-Garden — Bedroom',
        },
        {
          image: img('/images/library/sejour/f4-salon-2.jpg'),
          alt: 'Living room of the F4',
          caption: 'F4 — Living room',
        },
        {
          image: { src: '/images/library/f4-garden/01-salon-1.jpg', x: 22, y: 50, zoom: 1 },
          alt: 'Living room of the F4-Garden opening onto the patio',
          caption: 'F4-Garden — Living room',
        },
        {
          image: img('/images/library/duplex/10-cuisine-2.jpg'),
          alt: 'Fitted kitchen of the Duplex',
          caption: 'Duplex — Kitchen',
        },
        {
          image: img('/images/library/duplex/07-patios.jpg'),
          alt: 'Patios of the Duplex, aerial view',
          caption: 'Duplex — Patios',
        },
        {
          image: img('/images/library/chambre/f4-suite-2.jpg'),
          alt: 'Primary suite of the F4',
          caption: 'F4 — Primary suite',
        },
        {
          image: img('/images/library/duplex/05-salon-2.jpg'),
          alt: 'Lit bookshelves of the Duplex',
          caption: 'Duplex — Library',
        },
        {
          image: img('/images/library/f4-garden/03-cuisine-1.jpg'),
          alt: 'Open kitchen of the F4-Garden',
          caption: 'F4-Garden — Kitchen',
        },
        {
          image: img('/images/library/duplex/15-chambre-1.jpg'),
          alt: 'Bedroom of the Duplex',
          caption: 'Duplex — Bedroom',
        },
        {
          image: { src: '/images/library/duplex/23-salle-de-bain-1.jpg', x: 35, y: 50, zoom: 1 },
          alt: 'Marble bathroom of the Duplex',
          caption: 'Duplex — Bathroom',
        },
      ],
    },
  },

  about: {
    kicker: 'About',
    titleLines: ['Building what', 'stands the test of time.'],
    intro:
      'Batimedaf has been designing and building exceptional residences for fifteen years. A family business turned developer, without ever changing its method.',
    image: img('/images/library/about/atelier.jpg'),
    figures: [
      { value: 15, label: 'Years of expertise' },
      { value: 42, label: 'Residences delivered' },
      { value: 1200, label: 'Homes' },
      { value: 5, label: 'Cities' },
    ],
    timelineTitle: 'Fifteen years, five milestones.',
    milestones: [
      {
        year: '2010',
        image: img('/images/library/about/atelier.jpg'),
        title: 'Two partners, one studio',
        text: 'A site manager and an architect found Batimedaf on a simple conviction: quality is decided in the invisible trade-offs made before the walls are ever finished.',
      },
      {
        year: '2014',
        image: img('/images/library/exterieur/exterieur-bosquet-card.jpg'),
        title: 'First residence delivered',
        text: 'Twelve homes in the 11th arrondissement, delivered three weeks early. The contractors from that first site still work with us today.',
      },
      {
        year: '2018',
        image: img('/images/library/exterieur/exterieur-ateliers-card.jpg'),
        title: 'Regional expansion',
        text: 'The model expands to four cities without growing the structure: always two to three projects a year, followed by the same teams.',
      },
      {
        year: '2022',
        image: img('/images/library/salle-de-bain/sdb-2.jpg'),
        title: 'The material turning point',
        text: 'Structural reuse, bio-sourced materials and performance beyond RE2020 become the standard across all our programmes.',
      },
      {
        year: '2026',
        image: img('/images/library/exterieur/exterieur-balcon.jpg'),
        title: 'Le Bosquet',
        text: 'Twenty-four apartments around a 2,000 m² private park in the 16th arrondissement: our most ambitious project to date.',
      },
    ],
    principles: [
      {
        title: 'We build little.',
        text: 'Two to three projects a year. Enough to master every decision, too few to delegate a single one.',
      },
      {
        title: 'We never outsource quality.',
        text: 'Separate trade contracts, directly contracted companies, weekly on-site follow-up from groundwork to handover.',
      },
      {
        title: 'We design from the inside out.',
        text: 'Light, circulation, storage: the layouts start from how a home is lived in, not from the buildable area.',
      },
      {
        title: 'We stay after handover.',
        text: 'A ten-year structural warranty followed in-house, and a dedicated service for ten years. The relationship does not end at handover.',
      },
    ],
    ctaTitle: 'Discover our residences?',
    ctaLabel: 'See the residences',
  },

  collaboration: {
    kicker: 'Collaboration',
    title: 'You are…',
    profiles: [
      {
        id: 'architectes',
        label: 'Architect',
        headline: 'You design, we build — down to the last detail.',
        text: 'We bring an architect in from the first sketch and keep them through to handover. Two to three projects a year, designed from the inside out: light, circulation, storage.',
        criteria: [
          'Built references in collective housing',
          'Île-de-France or major cities',
          'Available over 24 to 30 months',
        ],
        figureValue: '100%',
        figureLabel: 'of projects followed by their architect',
        image: img('/images/library/collaboration/architectes.jpg'),
      },
      {
        id: 'artisans',
        label: 'Master craftsperson',
        headline: 'Your workshops make the difference that is noticed last.',
        text: 'Cabinetry, ironwork, plasterwork, stone, terrazzo. Our finishes rely on independent workshops we work with site after site, not on a one-off basis.',
        criteria: [
          'Specialised, demonstrable know-how',
          'Ability to produce in limited series',
          'Up-to-date ten-year insurance',
        ],
        figureValue: '10 years',
        figureLabel: "average length of our partners' relationships with us",
        image: img('/images/library/collaboration/artisans.jpg'),
      },
      {
        id: 'fonciers',
        label: 'Landowner',
        headline: 'A plot, a building, a brownfield site: an answer within 15 days.',
        text: 'We review every opportunity in-house and commit to a firm offer, with no marketing contingency clause. You know quickly where you stand.',
        criteria: [
          'At least 300 m² of buildable area',
          'Paris and inner suburbs',
          'Firm offer within 15 days',
        ],
        figureValue: '15 days',
        figureLabel: 'for a firm offer',
        image: img('/images/library/exterieur/exterieur-bosquet-card.jpg'),
      },
      {
        id: 'bureaux',
        label: 'Engineering firm',
        headline: 'Our environmental requirements go beyond regulation.',
        text: 'Structure, thermal, acoustic, utilities. We look for teams able to deliver on reuse and target performance, and to stay engaged through to delivery.',
        criteria: [
          'RE2020 and structural reuse',
          'A dedicated team per project',
          'Follow-through to handover',
        ],
        figureValue: '-40%',
        figureLabel: 'targeted carbon footprint',
        image: img('/images/library/exterieur/exterieur-facade.jpg'),
      },
    ],
    commitmentsTitle: 'What we guarantee our partners.',
    commitments: [
      {
        title: 'Separate trade contracts',
        text: 'Every company is contracted directly. Never cascading subcontracting or diluted responsibility.',
      },
      {
        title: 'Payment within 30 days',
        text: 'Statements validated within a week, settled within thirty days, with no retention beyond the legal framework.',
      },
      {
        title: 'A single point of contact',
        text: 'One technical manager follows your trade lot from start to handover. No changes along the way.',
      },
      {
        title: 'Relationships that last',
        text: 'We look for recurring collaborations, not one-off, lowest-bid consultations.',
      },
    ],
    stepsTitle: 'How to apply',
    steps: [
      { title: 'Write to us', text: 'Introduce your company and share a link to your references.' },
      { title: 'First conversation', text: 'We get back to you within a week, by call or in person.' },
      { title: 'Consultation', text: "You're consulted from the next project matching your profile onward." },
    ],
  },

  contact: {
    kicker: 'Contact',
    title: "Let's talk about your project.",
    sub: "Write to us: we reply personally within 48 business hours.",
    subjects: [
      'A residence',
      'Arrange a visit',
      'A collaboration',
      'Press',
      'Other',
    ],
    phone: '+33 1 00 00 00 00',
    email: 'contact@batimedaf.com',
    address: '12 avenue des Bâtisseurs\n75008 Paris',
    hours: 'Mon — Fri, 9am — 7pm\nSat, 10am — 5pm',
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        title: 'How does a visit work?',
        text: 'Visits are by appointment, Monday to Saturday. For programmes still under construction, we welcome you at our sales office with plans, material samples and 3D views, then on site as soon as the shell allows it.',
      },
      {
        title: 'Can I customise my apartment?',
        text: 'Yes, as long as the site has not gone past the partition stage. Kitchens, finishes, room layout and lot merging are decided with our architect during a dedicated customisation appointment.',
      },
      {
        title: 'What are the delivery timelines?',
        text: 'Our programmes are delivered between eighteen and thirty months after work begins. The projected date is set out in the reservation contract and updated at every stage.',
      },
      {
        title: 'Do you offer help with financing?',
        text: 'We are not brokers, but we work with several banking partners and can put you in touch. We provide all the documents needed to put together your file.',
      },
      {
        title: 'What guarantees apply after delivery?',
        text: 'A first-year completion warranty, a two-year warranty on fittings, and a ten-year structural warranty. Follow-up is handled in-house, without an external provider.',
      },
      {
        title: 'Do you work with outside architects?',
        text: 'Regularly. We review applications from agencies and master craftspeople for our future programmes — write to us and select "A collaboration".',
      },
    ],
  },

  residences: RESIDENCES_EN,
}
