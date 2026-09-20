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
    gallery: {
      eyebrow: 'Gallery',
      title: 'Our apartments',
      images: [
        {
          image: img('/images/home/gallery-1-sejour.jpg'),
          alt: 'Bright living room in a Batimedaf apartment',
          caption: 'Living room — Le Bosquet',
        },
        {
          image: img('/images/home/gallery-2-salon.jpg'),
          alt: 'Contemporary lounge in natural tones',
          caption: 'Lounge — Les Ateliers',
        },
        {
          image: img('/images/home/gallery-3-cuisine.jpg'),
          alt: 'Kitchen open to the living space',
          caption: 'Kitchen — Le Bosquet',
        },
        {
          image: img('/images/home/gallery-4-chambre.jpg'),
          alt: 'Main bedroom with refined finishes',
          caption: 'Primary suite — Le Bosquet',
        },
        {
          image: img('/images/home/gallery-5-salledebain.jpg'),
          alt: 'Natural stone bathroom',
          caption: 'Bathroom — Le Bosquet',
        },
        {
          image: img('/images/home/gallery-6-terrasse.jpg'),
          alt: 'Private garden with open views',
          caption: 'Private garden — Le Bosquet',
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
