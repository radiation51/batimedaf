import { newImage as img } from '../lib/imageStyle'

/**
 * Static English mirror of `src/data/residences.js`. Slugs, apartment ids
 * and image paths stay identical to French so routing and the CMS-driven
 * French tree keep working unchanged — only display text is translated.
 */
export const RESIDENCES_EN = [
  {
    slug: 'le-bosquet',
    name: 'Le Bosquet',
    tagline: 'Live at the heart of greenery',
    description:
      'Generous volumes opening onto a wooded park, where light and nature set the pace of the day.',
    meta: ['24 apartments', 'Paris 16th', 'Delivery 2026'],
    image: img('/images/library/exterieur/exterieur-bosquet-card.jpg'),

    location: 'Paris 16th — Avenue Mozart',
    presentation:
      "In the heart of Hussein Dey, Le Bosquet invites you to discover a way of living that blends elegance, comfort and serenity. Ideally located close to major roads and amenities, the residence offers a privileged setting where every moment is savoured in calm and convenience. With apartments ranging from 130 m² to 333 m², Le Bosquet offers spaces designed to meet your standards of comfort and quality of life. The perfect balance between urban living, wellbeing and elegance.",
    intro:
      'Tucked back from the avenue, Le Bosquet is organised around a 2,000 m² private park. Every apartment enjoys dual aspect and an outdoor extension — a running balcony, a loggia or a ground-floor garden.',
    body: [
      'The architecture favours cut stone and oak joinery, in keeping with the townhouses of the neighbourhood. Large glazed bays blur the line between the living room and the greenery.',
      'The communal areas were designed as living spaces in their own right: a travertine hall, concierge service, a gym and a secured bike room.',
    ],
    specs: [
      { label: 'Layouts', value: '2 to 5 rooms' },
      { label: 'Sizes', value: '48 to 180 m²' },
      { label: 'Floors', value: '6 levels' },
      { label: 'Private park', value: '2,000 m²' },
      { label: 'Delivery', value: 'Q3 2026' },
      { label: 'Performance', value: 'RE2020 · NF Habitat HQE' },
    ],
    features: [
      'Private wooded park',
      'Concierge, 7 days a week',
      'Gym',
      'Underground parking',
      'Secure private access, 24/7',
      'Private pool',
    ],
    stats: [
      { value: 24, suffix: '', label: 'Apartments' },
      { value: 2000, suffix: ' m²', label: 'Private park' },
      { value: 6, suffix: '', label: 'Levels' },
      { value: 2026, suffix: '', label: 'Delivery', raw: true },
    ],
    place: {
      address: '18 avenue Mozart, 75016 Paris',
      summary:
        'A quiet residential address between square Lamartine and the Bois de Boulogne, served by three metro lines.',
      transports: [
        { line: 'Bus', detail: 'Urban transport network' },
        { line: 'Tramway', detail: 'Travel across Algiers' },
        { line: 'Car', detail: 'Access to major roads' },
        { line: 'Metro', detail: 'Metropolitan rail network' },
      ],
      nearby: [
        'Algiers’ main roads — Nearby',
        'Coastline & seafront — Nearby',
        'Shops & amenities — Nearby',
        'Neighbourhood being modernised — Ongoing',
      ],
    },
    apartments: [
      {
        id: 'd-41',
        reference: 'D-41',
        type: 'F4',
        surface: 112,
        floor: '4th floor',
        orientation: 'South-East',
        outdoor: 'Terrace, 24 m²',
        price: 1750000,
        status: 'Last opportunity',
        image: img('/images/library/sejour/f4-salon-1.png'),
        description:
          'A high floor with clear views over the treetops, and a corner terrace catching the morning sun.',
        features: [
          'Corner terrace',
          'Three bedrooms',
          'Primary suite',
          'Parking included',
        ],
        gallery: [
          {
            image: img('/images/library/sejour/f4-salon-1.png'),
            alt: 'Living room of the F4',
            category: 'Living room',
          },
          {
            image: img('/images/library/sejour/f4-salon-2.jpg'),
            alt: 'Living room of the F4, another angle',
            category: 'Living room',
          },
          {
            image: img('/images/library/cuisine/f4-cuisine-1.png'),
            alt: 'Fitted kitchen of the F4',
            category: 'Kitchen',
          },
          {
            image: img('/images/library/cuisine/f4-cuisine-2.png'),
            alt: 'Kitchen of the F4, another angle',
            category: 'Kitchen',
          },
          {
            image: img('/images/library/exterieur/f4-piscine.png'),
            alt: 'Private pool of the F4',
            category: 'Pool',
          },
          {
            image: img('/images/library/chambre/f4-suite-2.jpg'),
            alt: 'Primary suite, another angle',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/chambre/f4-dressing.png'),
            alt: 'Dressing room of the primary suite',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/chambre/f4-chambre-1.png'),
            alt: 'Bedroom of the F4',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/chambre/f4-chambre-2.png'),
            alt: 'Bedroom of the F4, another angle',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/salle-de-bain/f4-sdb.png'),
            alt: 'Bathroom of the F4',
            category: 'Bathroom',
          },
        ],
      },
      {
        id: 'f4-garden',
        reference: 'F4-GARDEN',
        type: 'F4-Garden',
        surface: 0,
        floor: '',
        orientation: '',
        outdoor: 'Private garden & pool',
        price: 0,
        status: 'On request',
        image: {
          src: '/images/library/f4-garden/07-jardin-1.jpg',
          x: 38,
          y: 50,
          zoom: 1,
        },
        description:
          'An F4 opening onto its private garden and pool, with a bright living room, an open kitchen and carefully finished bedrooms.',
        features: [
          'Private garden',
          'Private pool',
          'Kitchen open to the living room',
          'Several bedrooms',
        ],
        gallery: [
          {
            image: img('/images/library/f4-garden/01-salon-1.jpg'),
            alt: 'Living room of the F4-Garden',
            category: 'Living room',
          },
          {
            image: img('/images/library/f4-garden/02-salon-2.jpg'),
            alt: 'Living room of the F4-Garden, another angle',
            category: 'Living room',
          },
          {
            image: img('/images/library/f4-garden/03-cuisine-1.jpg'),
            alt: 'Open kitchen of the F4-Garden',
            category: 'Kitchen',
          },
          {
            image: img('/images/library/f4-garden/04-cuisine-2.jpg'),
            alt: 'Kitchen of the F4-Garden, another angle',
            category: 'Kitchen',
          },
          {
            image: img('/images/library/f4-garden/05-cuisine-3.jpg'),
            alt: 'Kitchen of the F4-Garden, island and dining area',
            category: 'Kitchen',
          },
          {
            image: img('/images/library/f4-garden/06-cuisine-4.jpg'),
            alt: 'Kitchen of the F4-Garden, storage and appliances',
            category: 'Kitchen',
          },
          {
            image: img('/images/library/f4-garden/07-jardin-1.jpg'),
            alt: 'Private garden and pool of the F4-Garden, aerial view',
            category: 'Garden',
          },
          {
            image: img('/images/library/f4-garden/08-jardin-2.jpg'),
            alt: 'Terrace and pool of the F4-Garden, aerial view',
            category: 'Garden',
          },
          {
            image: img('/images/library/f4-garden/09-piscine.jpg'),
            alt: 'Private pool of the F4-Garden',
            category: 'Garden',
          },
          {
            image: img('/images/library/f4-garden/10-chambre-1.jpg'),
            alt: 'Bedroom of the F4-Garden, arched headboard',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/f4-garden/11-chambre-2.jpg'),
            alt: 'Bedroom with an arched headboard, front view',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/f4-garden/12-chambre-3.jpg'),
            alt: 'Bedroom with an arched headboard, another angle',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/f4-garden/13-chambre-4.jpg'),
            alt: 'Bedroom of the F4-Garden, desk and television',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/f4-garden/14-chambre-5.jpg'),
            alt: 'Bedroom of the F4-Garden and its dressing room',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/f4-garden/15-chambre-6.jpg'),
            alt: 'Bedroom of the F4-Garden, marble television wall',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/f4-garden/16-chambre-7.jpg'),
            alt: 'Bedroom of the F4-Garden, large picture window',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/f4-garden/17-chambre-8.jpg'),
            alt: 'Twin-bed bedroom of the F4-Garden',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/f4-garden/18-salle-de-bain.jpg'),
            alt: 'Bathroom of the F4-Garden',
            category: 'Bathroom',
          },
        ],
      },
      {
        id: 'duplex',
        reference: 'DUPLEX',
        type: 'Duplex',
        surface: 0,
        floor: '',
        orientation: '',
        outdoor: '',
        price: 0,
        status: 'On request',
        image: img('/images/library/duplex/02-double-hauteur-1.jpg'),
        description:
          'A double-height duplex with a bright living room, a fitted kitchen, a dressing room and several bedrooms.',
        features: [
          'Double-height living room',
          'Fitted kitchen',
          'Dressing room',
          'Several bedrooms',
        ],
        gallery: [
          {
            image: img('/images/library/duplex/01-salon-vue-dessus.jpg'),
            alt: 'Living room of the Duplex, overhead view',
            category: 'Living room',
          },
          {
            image: img('/images/library/duplex/02-double-hauteur-1.jpg'),
            alt: 'Double-height living room of the Duplex',
            category: 'Living room',
          },
          {
            image: img('/images/library/duplex/03-double-hauteur-2.jpg'),
            alt: 'Double-height living room, large picture window',
            category: 'Living room',
          },
          {
            image: img('/images/library/duplex/04-salon-1.jpg'),
            alt: 'Living room of the Duplex, lounge area',
            category: 'Living room',
          },
          {
            image: img('/images/library/duplex/05-salon-2.jpg'),
            alt: 'Living room of the Duplex, lit bookcase',
            category: 'Living room',
          },
          {
            image: img('/images/library/duplex/06-salon-3.jpg'),
            alt: 'Reading corner of the Duplex',
            category: 'Living room',
          },
          {
            image: img('/images/library/duplex/07-patios.jpg'),
            alt: 'Courtyards of the residence, aerial view',
            category: 'Outdoor',
          },
          {
            image: img('/images/library/duplex/08-mezzanine.jpg'),
            alt: 'Mezzanine and double-height living room',
            category: 'Living room',
          },
          {
            image: img('/images/library/duplex/09-cuisine-1.jpg'),
            alt: 'Kitchen of the Duplex',
            category: 'Kitchen',
          },
          {
            image: img('/images/library/duplex/10-cuisine-2.jpg'),
            alt: 'Kitchen of the Duplex, another angle',
            category: 'Kitchen',
          },
          {
            image: img('/images/library/duplex/11-cuisine-3.jpg'),
            alt: 'Kitchen of the Duplex, central island',
            category: 'Kitchen',
          },
          {
            image: img('/images/library/duplex/12-repas-1.jpg'),
            alt: 'Dining room of the Duplex',
            category: 'Living room',
          },
          {
            image: img('/images/library/duplex/13-repas-2.jpg'),
            alt: 'Dining room of the Duplex, another angle',
            category: 'Living room',
          },
          {
            image: img('/images/library/duplex/14-repas-3.jpg'),
            alt: 'Table and island of the Duplex',
            category: 'Living room',
          },
          {
            image: img('/images/library/duplex/15-chambre-1.jpg'),
            alt: 'Bedroom of the Duplex',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/duplex/16-chambre-2.jpg'),
            alt: 'Bedroom of the Duplex, another angle',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/duplex/17-chambre-3.jpg'),
            alt: 'Bedroom of the Duplex, television and picture window',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/duplex/18-dressing-1.jpg'),
            alt: 'Dressing room of the Duplex',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/duplex/19-dressing-2.jpg'),
            alt: 'Dressing room of the Duplex, corridor',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/duplex/20-chambre-4.jpg'),
            alt: 'Bedroom of the Duplex, light palette',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/duplex/21-chambre-5.jpg'),
            alt: 'Bedroom of the Duplex, another view',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/duplex/22-chambre-6.jpg'),
            alt: 'Bedroom of the Duplex with storage',
            category: 'Bedroom',
          },
          {
            image: img('/images/library/duplex/23-salle-de-bain-1.jpg'),
            alt: 'Bathroom of the Duplex, bathtub',
            category: 'Bathroom',
          },
          {
            image: img('/images/library/duplex/24-salle-de-bain-2.jpg'),
            alt: 'Bathroom of the Duplex, shower',
            category: 'Bathroom',
          },
          {
            image: img('/images/library/duplex/25-salle-de-bain-3.jpg'),
            alt: 'Bathroom of the Duplex, vanity and shower',
            category: 'Bathroom',
          },
        ],
      },
    ],
    gallery: [
      {
        image: img('/images/library/sejour/sejour-1.jpg'),
        alt: 'Bright living room open onto the park',
        category: 'Living room',
      },
      {
        image: img('/images/library/cuisine/cuisine-1.jpg'),
        alt: 'Kitchen open to the living space',
        category: 'Kitchen',
      },
      {
        image: img('/images/library/chambre/chambre-1.jpg'),
        alt: 'Main bedroom with refined finishes',
        category: 'Bedroom',
      },
      {
        image: img('/images/library/salle-de-bain/sdb-1.jpg'),
        alt: 'Natural stone bathroom',
        category: 'Bathroom',
      },
      {
        image: img('/images/library/parties-communes/hall.jpg'),
        alt: 'Travertine entrance hall',
        category: 'Communal areas',
      },
      {
        image: img('/images/library/exterieur/exterieur-balcon.jpg'),
        alt: 'Running balcony open onto the wooded park',
        category: 'Outdoor',
      },
      {
        image: img('/images/library/exterieur/exterieur-facade.jpg'),
        alt: 'Cut-stone façade of the residence',
        category: 'Outdoor',
      },
      {
        image: img('/images/library/chambre/chambre-2.jpg'),
        alt: 'Primary suite with fitted dressing room',
        category: 'Bedroom',
      },
      {
        image: img('/images/library/parties-communes/sport.jpg'),
        alt: 'Residence gym',
        category: 'Communal areas',
      },
      {
        image: img('/images/library/exterieur/exterieur-rooftop-sunset.jpg'),
        alt: 'Shared roof terrace at sunset',
        category: 'Outdoor',
      },
    ],
  },
  {
    slug: 'les-ateliers',
    name: 'Les Ateliers',
    tagline: 'Industrial elegance, reinvented',
    description:
      'Skylights, raw materials and spectacular ceiling heights, for a resolutely contemporary way of living.',
    meta: ['18 lofts', 'Paris 11th', 'Delivery 2025'],
    image: img('/images/library/exterieur/exterieur-ateliers-card.jpg'),

    location: 'Paris 11th — Rue de la Roquette',
    intro:
      'A former metalworks converted into eighteen lofts, Les Ateliers keeps the original structure: riveted framework, exposed brick and zenithal skylights.',
    body: [
      'The floor plates, delivered with a 4.20 m ceiling height, lend themselves to any layout. Custom kitchens and terrazzo bathrooms extend the industrial vocabulary of the place.',
      'At the centre, a paved courtyard planted with birch trees serves all the lofts and extends the living spaces on fine days.',
    ],
    specs: [
      { label: 'Layouts', value: 'Lofts, 2 to 4 rooms' },
      { label: 'Sizes', value: '62 to 210 m²' },
      { label: 'Ceiling height', value: '4.20 m' },
      { label: 'Inner courtyard', value: '600 m²' },
      { label: 'Delivery', value: 'Q4 2025' },
      { label: 'Performance', value: 'RE2020 · BBC Renovation' },
    ],
    features: [
      'Restored original skylights',
      'Planted paved courtyard',
      'Artists’ workshops at courtyard level',
      'Underground parking',
      'Secured bike room',
      'Custom kitchens',
    ],
    stats: [
      { value: 18, suffix: '', label: 'Lofts' },
      { value: 420, suffix: ' cm', label: 'Ceiling height' },
      { value: 600, suffix: ' m²', label: 'Inner courtyard' },
      { value: 2025, suffix: '', label: 'Delivery', raw: true },
    ],
    place: {
      address: '74 rue de la Roquette, 75011 Paris',
      summary:
        'At the heart of the 11th, between Bastille and Père-Lachaise, in a neighbourhood of workshops, galleries and local bistros.',
      transports: [
        { line: 'Line 9', detail: 'Voltaire — 3 min walk' },
        { line: 'Line 8', detail: 'Ledru-Rollin — 9 min walk' },
        { line: 'Line 1', detail: 'Bastille — 12 min walk' },
      ],
      nearby: [
        'Bastille market — 7 min',
        'Père-Lachaise — 10 min',
        'Cirque d’Hiver — 8 min',
        'Canal Saint-Martin — 15 min',
      ],
    },
    apartments: [
      {
        id: 'loft-03',
        reference: 'Loft 03',
        type: '2-room',
        surface: 62,
        floor: 'Courtyard level',
        orientation: 'North — skylight',
        outdoor: 'Private courtyard, 12 m²',
        price: 820000,
        status: 'Available',
        image: img('/images/library/sejour/sejour-2.jpg'),
        description:
          'A workshop floor plate at courtyard level, lit by an original zenithal skylight and extended by a private paved courtyard.',
        features: [
          'Zenithal skylight',
          'Exposed brick',
          'Custom kitchen',
          'Private courtyard',
        ],
        gallery: [
          {
            image: img('/images/library/sejour/sejour-2.jpg'),
            alt: 'Workshop floor plate under a zenithal skylight',
            category: 'Living room',
          },
          {
            image: img('/images/library/cuisine/cuisine-2.jpg'),
            alt: 'Custom kitchen set against the brick',
            category: 'Kitchen',
          },
          {
            image: img('/images/library/sejour/sejour-5.jpg'),
            alt: 'Living space lit by the skylight',
            category: 'Living room',
          },
          {
            image: img('/images/library/salle-de-bain/sdb-2.jpg'),
            alt: 'Terrazzo bathroom',
            category: 'Bathroom',
          },
          {
            image: img('/images/library/exterieur/exterieur-cour.jpg'),
            alt: '12 m² private paved courtyard',
            category: 'Outdoor',
          },
          {
            image: img('/images/library/exterieur/exterieur-ateliers-card.jpg'),
            alt: 'Preserved riveted metal framework',
            category: 'Communal areas',
          },
        ],
      },
      {
        id: 'loft-07',
        reference: 'Loft 07',
        type: '3-room',
        surface: 118,
        floor: '2nd floor',
        orientation: 'East-West',
        outdoor: 'Balcony, 8 m²',
        price: 1580000,
        status: 'Available',
        image: img('/images/library/sejour/sejour-5.jpg'),
        description:
          'A dual-aspect volume with a 4.20 m ceiling height, structured by the preserved riveted metal framework.',
        features: [
          '4.20 m ceiling height',
          'Exposed framework',
          'Convertible mezzanine',
          'Terrazzo bathroom',
        ],
        gallery: [
          {
            image: img('/images/library/sejour/sejour-5.jpg'),
            alt: 'Dual-aspect volume with a 4.20 m ceiling height',
            category: 'Living room',
          },
          {
            image: img('/images/library/sejour/sejour-3.jpg'),
            alt: 'Living room structured by the exposed framework',
            category: 'Living room',
          },
          {
            image: img('/images/library/cuisine/cuisine-2.jpg'),
            alt: 'Custom kitchen in stainless steel and oak',
            category: 'Kitchen',
          },
          {
            image: img('/images/library/salle-de-bain/sdb-2.jpg'),
            alt: 'Terrazzo bathroom',
            category: 'Bathroom',
          },
          {
            image: img('/images/library/sejour/sejour-4.jpg'),
            alt: 'Convertible mezzanine above the living room',
            category: 'Living room',
          },
          {
            image: img('/images/library/exterieur/exterieur-cour.jpg'),
            alt: '8 m² balcony over the courtyard',
            category: 'Outdoor',
          },
        ],
      },
      {
        id: 'loft-12',
        reference: 'Loft 12',
        type: '4-room',
        surface: 210,
        floor: '3rd floor',
        orientation: 'Dual-aspect',
        outdoor: 'Terrace, 32 m²',
        price: 2950000,
        status: 'Last opportunity',
        image: img('/images/library/sejour/sejour-6.jpg'),
        description:
          'The largest floor plate in the manufacture, with a rooftop terrace and a double-height space above the living room.',
        features: [
          'Double height',
          'Rooftop terrace',
          'Three bedrooms',
          'Two parking spaces',
        ],
        gallery: [
          {
            image: img('/images/library/sejour/sejour-6.jpg'),
            alt: 'The largest floor plate in the manufacture',
            category: 'Living room',
          },
          {
            image: img('/images/library/sejour/sejour-3.jpg'),
            alt: 'Double height above the living room',
            category: 'Living room',
          },
          {
            image: img('/images/library/sejour/sejour-4.jpg'),
            alt: 'Mezzanine open to the living space',
            category: 'Living room',
          },
          {
            image: img('/images/library/cuisine/cuisine-2.jpg'),
            alt: 'Custom kitchen set against the brick',
            category: 'Kitchen',
          },
          {
            image: img('/images/library/salle-de-bain/sdb-2.jpg'),
            alt: 'Terrazzo bathroom',
            category: 'Bathroom',
          },
          {
            image: img('/images/library/exterieur/exterieur-terrasse.jpg'),
            alt: '32 m² rooftop terrace',
            category: 'Outdoor',
          },
        ],
      },
    ],
    gallery: [
      {
        image: img('/images/library/sejour/sejour-2.jpg'),
        alt: 'Contemporary lounge in natural tones',
        category: 'Living room',
      },
      {
        image: img('/images/library/exterieur/exterieur-terrasse.jpg'),
        alt: 'Private terrace with open views',
        category: 'Outdoor',
      },
      {
        image: img('/images/library/exterieur/exterieur-ateliers-card.jpg'),
        alt: 'Façade of the residence',
        category: 'Outdoor',
      },
      {
        image: img('/images/library/sejour/sejour-5.jpg'),
        alt: 'Living space under the skylight',
        category: 'Living room',
      },
      {
        image: img('/images/library/exterieur/exterieur-ateliers-card.jpg'),
        alt: 'Preserved riveted metal framework',
        category: 'Communal areas',
      },
      {
        image: img('/images/library/sejour/sejour-3.jpg'),
        alt: 'Dual-aspect loft under a 4.20 m ceiling height',
        category: 'Living room',
      },
      {
        image: img('/images/library/cuisine/cuisine-2.jpg'),
        alt: 'Custom kitchen set against exposed brick',
        category: 'Kitchen',
      },
      {
        image: img('/images/library/salle-de-bain/sdb-2.jpg'),
        alt: 'Terrazzo bathroom',
        category: 'Bathroom',
      },
      {
        image: img('/images/library/exterieur/exterieur-cour.jpg'),
        alt: 'Paved courtyard planted with birch trees',
        category: 'Outdoor',
      },
      {
        image: img('/images/library/sejour/sejour-4.jpg'),
        alt: 'Mezzanine open to the living space',
        category: 'Living room',
      },
    ],
  },
]
