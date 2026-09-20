import { newImage as img } from '../lib/imageStyle'

// Single source of truth for the residences chooser, the detail pages and
// the admin panel's defaults.
export const RESIDENCES = [
  {
    slug: 'le-bosquet',
    name: 'Le Bosquet',
    tagline: 'Vivre au cœur de la verdure',
    description:
      "Des volumes généreux ouverts sur un parc arboré, où la lumière et la nature dictent le rythme des journées.",
    meta: ['24 appartements', 'Paris 16ᵉ', 'Livraison 2026'],
    image: img('/images/home/hero-2-salon.jpg'),

    location: 'Paris 16ᵉ — Avenue Mozart',
    presentation:
      "Au cœur de Hussein Dey, Le Bosquet vous invite à découvrir un art de vivre alliant élégance, confort et sérénité. Idéalement située à proximité des principaux axes et commodités, la résidence offre un cadre de vie privilégié, où chaque instant se savoure dans le calme et la proximité. Avec des appartements allant de 130 m² à 333 m², Le Bosquet propose des espaces pensés pour répondre à vos exigences de confort et de qualité de vie. L'équilibre parfait entre vie urbaine, bien-être et élégance.",
    intro:
      "Niché en retrait de l'avenue, Le Bosquet s'organise autour d'un parc privatif de 2 000 m². Chaque appartement bénéficie d'une double orientation et d'un prolongement extérieur — balcon filant, loggia ou jardin en rez-de-chaussée.",
    body: [
      "L'architecture privilégie la pierre de taille et les menuiseries en chêne, dans la continuité des hôtels particuliers du quartier. Les grandes baies vitrées effacent la limite entre le séjour et la végétation.",
      "Les parties communes ont été dessinées comme des espaces de vie à part entière : hall en travertin, conciergerie, salle de sport et local vélos sécurisé.",
    ],
    specs: [
      { label: 'Typologies', value: 'Du 2 au 5 pièces' },
      { label: 'Surfaces', value: '48 à 180 m²' },
      { label: 'Étages', value: '6 niveaux' },
      { label: 'Parc privatif', value: '2 000 m²' },
      { label: 'Livraison', value: '3ᵉ trimestre 2026' },
      { label: 'Performance', value: 'RE2020 · NF Habitat HQE' },
    ],
    features: [
      'Parc arboré privatif',
      'Conciergerie 7j/7',
      'Salle de sport',
      'Parking souterrain',
      'Accès privé sécurisé 7j/7',
      'Piscine privée',
    ],
    stats: [
      { value: 24, suffix: '', label: 'Appartements' },
      { value: 2000, suffix: ' m²', label: 'Parc privatif' },
      { value: 6, suffix: '', label: 'Niveaux' },
      { value: 2026, suffix: '', label: 'Livraison', raw: true },
    ],
    place: {
      address: '18 avenue Mozart, 75016 Paris',
      summary:
        "Une adresse résidentielle au calme, entre le square Lamartine et le bois de Boulogne, desservie par trois lignes de métro.",
      transports: [
        { line: 'Bus', detail: 'Réseau de transport urbain' },
        { line: 'Tramway', detail: 'Déplacements à travers Alger' },
        { line: 'Voiture', detail: 'Accès aux principaux axes' },
        { line: 'Métro', detail: 'Réseau de transport métropolitain' },
      ],
      nearby: [
        'Principaux axes d’Alger — À proximité',
        'Littoral & front de mer — À proximité',
        'Commerces & commodités — À proximité',
        'Quartier en modernisation — En évolution',
      ],
    },
    apartments: [
      {
        id: 'd-41',
        reference: 'D-41',
        type: 'F4',
        surface: 112,
        floor: '4ᵉ étage',
        orientation: 'Sud-Est',
        outdoor: 'Terrasse 24 m²',
        price: 1750000,
        status: 'Dernière opportunité',
        image: img('/images/library/sejour/f4-salon-1.png'),
        description:
          'Un étage élevé dégagé sur les frondaisons, avec une terrasse d’angle exposée au soleil du matin.',
        features: [
          'Terrasse d’angle',
          'Trois chambres',
          'Suite parentale',
          'Parking inclus',
        ],
        gallery: [
          {
            image: img('/images/library/sejour/f4-salon-1.png'),
            alt: 'Salon du F4',
            category: 'Salon',
          },
          {
            image: img('/images/library/sejour/f4-salon-2.jpg'),
            alt: 'Salon du F4, autre angle',
            category: 'Salon',
          },
          {
            image: img('/images/library/cuisine/f4-cuisine-1.png'),
            alt: 'Cuisine équipée du F4',
            category: 'Cuisine',
          },
          {
            image: img('/images/library/cuisine/f4-cuisine-2.png'),
            alt: 'Cuisine du F4, autre angle',
            category: 'Cuisine',
          },
          {
            image: img('/images/library/exterieur/f4-piscine.png'),
            alt: 'Piscine privée du F4',
            category: 'Piscine',
          },
          {
            image: img('/images/library/chambre/f4-suite-2.jpg'),
            alt: 'Suite parentale, autre angle',
            category: 'Chambre',
          },
          {
            image: img('/images/library/chambre/f4-dressing.png'),
            alt: 'Dressing de la suite parentale',
            category: 'Chambre',
          },
          {
            image: img('/images/library/chambre/f4-chambre-1.png'),
            alt: 'Chambre du F4',
            category: 'Chambre',
          },
          {
            image: img('/images/library/chambre/f4-chambre-2.png'),
            alt: 'Chambre du F4, autre angle',
            category: 'Chambre',
          },
          {
            image: img('/images/library/salle-de-bain/f4-sdb.png'),
            alt: 'Salle de bain du F4',
            category: 'Salle de bain',
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
        outdoor: 'Jardin privatif & piscine',
        price: 0,
        status: 'Sur demande',
        image: {
          src: '/images/library/f4-garden/07-jardin-1.jpg',
          x: 38,
          y: 50,
          zoom: 1,
        },
        description:
          'Un F4 ouvert sur son jardin privatif et sa piscine, avec un séjour lumineux, une cuisine ouverte et des chambres soignées.',
        features: [
          'Jardin privatif',
          'Piscine privée',
          'Cuisine ouverte sur le séjour',
          'Plusieurs chambres',
        ],
        gallery: [
          {
            image: img('/images/library/f4-garden/01-salon-1.jpg'),
            alt: 'Salon du F4-Garden',
            category: 'Salon',
          },
          {
            image: img('/images/library/f4-garden/02-salon-2.jpg'),
            alt: 'Salon du F4-Garden, autre angle',
            category: 'Salon',
          },
          {
            image: img('/images/library/f4-garden/03-cuisine-1.jpg'),
            alt: 'Cuisine ouverte du F4-Garden',
            category: 'Cuisine',
          },
          {
            image: img('/images/library/f4-garden/04-cuisine-2.jpg'),
            alt: 'Cuisine du F4-Garden, autre angle',
            category: 'Cuisine',
          },
          {
            image: img('/images/library/f4-garden/05-cuisine-3.jpg'),
            alt: 'Cuisine du F4-Garden, îlot et coin repas',
            category: 'Cuisine',
          },
          {
            image: img('/images/library/f4-garden/06-cuisine-4.jpg'),
            alt: 'Cuisine du F4-Garden, rangements et électroménager',
            category: 'Cuisine',
          },
          {
            image: img('/images/library/f4-garden/07-jardin-1.jpg'),
            alt: 'Jardin et piscine privée du F4-Garden, vue aérienne',
            category: 'Jardin',
          },
          {
            image: img('/images/library/f4-garden/08-jardin-2.jpg'),
            alt: 'Terrasse et piscine du F4-Garden, vue aérienne',
            category: 'Jardin',
          },
          {
            image: img('/images/library/f4-garden/09-piscine.jpg'),
            alt: 'Piscine privée du F4-Garden',
            category: 'Jardin',
          },
          {
            image: img('/images/library/f4-garden/10-chambre-1.jpg'),
            alt: 'Chambre du F4-Garden, tête de lit en arche',
            category: 'Chambre',
          },
          {
            image: img('/images/library/f4-garden/11-chambre-2.jpg'),
            alt: 'Chambre à la tête de lit en arche, vue de face',
            category: 'Chambre',
          },
          {
            image: img('/images/library/f4-garden/12-chambre-3.jpg'),
            alt: 'Chambre à la tête de lit en arche, autre angle',
            category: 'Chambre',
          },
          {
            image: img('/images/library/f4-garden/13-chambre-4.jpg'),
            alt: 'Chambre du F4-Garden, coin bureau et télévision',
            category: 'Chambre',
          },
          {
            image: img('/images/library/f4-garden/14-chambre-5.jpg'),
            alt: 'Chambre du F4-Garden et son dressing',
            category: 'Chambre',
          },
          {
            image: img('/images/library/f4-garden/15-chambre-6.jpg'),
            alt: 'Chambre du F4-Garden, mur télévision en marbre',
            category: 'Chambre',
          },
          {
            image: img('/images/library/f4-garden/16-chambre-7.jpg'),
            alt: 'Chambre du F4-Garden, grande baie vitrée',
            category: 'Chambre',
          },
          {
            image: img('/images/library/f4-garden/17-chambre-8.jpg'),
            alt: 'Chambre à deux lits du F4-Garden',
            category: 'Chambre',
          },
          {
            image: img('/images/library/f4-garden/18-salle-de-bain.jpg'),
            alt: 'Salle de bain du F4-Garden',
            category: 'Salle de bain',
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
        status: 'Sur demande',
        image: img('/images/library/duplex/02-double-hauteur-1.jpg'),
        description:
          'Un duplex en double hauteur, avec un séjour lumineux, une cuisine équipée, un dressing et plusieurs chambres.',
        features: [
          'Séjour en double hauteur',
          'Cuisine équipée',
          'Dressing',
          'Plusieurs chambres',
        ],
        gallery: [
          {
            image: img('/images/library/duplex/01-salon-vue-dessus.jpg'),
            alt: 'Salon du Duplex, vue plongeante',
            category: 'Salon',
          },
          {
            image: img('/images/library/duplex/02-double-hauteur-1.jpg'),
            alt: 'Séjour en double hauteur du Duplex',
            category: 'Salon',
          },
          {
            image: img('/images/library/duplex/03-double-hauteur-2.jpg'),
            alt: 'Séjour en double hauteur, grande baie vitrée',
            category: 'Salon',
          },
          {
            image: img('/images/library/duplex/04-salon-1.jpg'),
            alt: 'Salon du Duplex, coin détente',
            category: 'Salon',
          },
          {
            image: img('/images/library/duplex/05-salon-2.jpg'),
            alt: 'Salon du Duplex, bibliothèque éclairée',
            category: 'Salon',
          },
          {
            image: img('/images/library/duplex/06-salon-3.jpg'),
            alt: 'Coin lecture du Duplex',
            category: 'Salon',
          },
          {
            image: img('/images/library/duplex/07-patios.jpg'),
            alt: 'Patios de la résidence, vue aérienne',
            category: 'Extérieur',
          },
          {
            image: img('/images/library/duplex/08-mezzanine.jpg'),
            alt: 'Mezzanine et séjour en double hauteur',
            category: 'Salon',
          },
          {
            image: img('/images/library/duplex/09-cuisine-1.jpg'),
            alt: 'Cuisine du Duplex',
            category: 'Cuisine',
          },
          {
            image: img('/images/library/duplex/10-cuisine-2.jpg'),
            alt: 'Cuisine du Duplex, autre angle',
            category: 'Cuisine',
          },
          {
            image: img('/images/library/duplex/11-cuisine-3.jpg'),
            alt: 'Cuisine du Duplex, îlot central',
            category: 'Cuisine',
          },
          {
            image: img('/images/library/duplex/12-repas-1.jpg'),
            alt: 'Salle à manger du Duplex',
            category: 'Salon',
          },
          {
            image: img('/images/library/duplex/13-repas-2.jpg'),
            alt: 'Salle à manger du Duplex, autre angle',
            category: 'Salon',
          },
          {
            image: img('/images/library/duplex/14-repas-3.jpg'),
            alt: 'Table et îlot du Duplex',
            category: 'Salon',
          },
          {
            image: img('/images/library/duplex/15-chambre-1.jpg'),
            alt: 'Chambre du Duplex',
            category: 'Chambre',
          },
          {
            image: img('/images/library/duplex/16-chambre-2.jpg'),
            alt: 'Chambre du Duplex, autre angle',
            category: 'Chambre',
          },
          {
            image: img('/images/library/duplex/17-chambre-3.jpg'),
            alt: 'Chambre du Duplex, télévision et baie vitrée',
            category: 'Chambre',
          },
          {
            image: img('/images/library/duplex/18-dressing-1.jpg'),
            alt: 'Dressing du Duplex',
            category: 'Chambre',
          },
          {
            image: img('/images/library/duplex/19-dressing-2.jpg'),
            alt: 'Dressing du Duplex, couloir',
            category: 'Chambre',
          },
          {
            image: img('/images/library/duplex/20-chambre-4.jpg'),
            alt: 'Chambre du Duplex, ambiance claire',
            category: 'Chambre',
          },
          {
            image: img('/images/library/duplex/21-chambre-5.jpg'),
            alt: 'Chambre du Duplex, autre vue',
            category: 'Chambre',
          },
          {
            image: img('/images/library/duplex/22-chambre-6.jpg'),
            alt: 'Chambre du Duplex avec rangements',
            category: 'Chambre',
          },
          {
            image: img('/images/library/duplex/23-salle-de-bain-1.jpg'),
            alt: 'Salle de bain du Duplex, baignoire',
            category: 'Salle de bain',
          },
          {
            image: img('/images/library/duplex/24-salle-de-bain-2.jpg'),
            alt: 'Salle de bain du Duplex, douche',
            category: 'Salle de bain',
          },
          {
            image: img('/images/library/duplex/25-salle-de-bain-3.jpg'),
            alt: 'Salle de bain du Duplex, vasque et douche',
            category: 'Salle de bain',
          },
        ],
      },
    ],
    gallery: [
      {
        image: img('/images/library/sejour/sejour-1.jpg'),
        alt: 'Séjour lumineux ouvert sur le parc',
        category: 'Séjour',
      },
      {
        image: img('/images/library/cuisine/cuisine-1.jpg'),
        alt: 'Cuisine ouverte sur la pièce de vie',
        category: 'Cuisine',
      },
      {
        image: img('/images/library/chambre/chambre-1.jpg'),
        alt: 'Chambre principale aux finitions soignées',
        category: 'Chambre',
      },
      {
        image: img('/images/library/salle-de-bain/sdb-1.jpg'),
        alt: 'Salle de bain en pierre naturelle',
        category: 'Salle de bain',
      },
      {
        image: img('/images/library/parties-communes/hall.jpg'),
        alt: 'Hall d’entrée en travertin',
        category: 'Parties communes',
      },
      {
        image: img('/images/library/exterieur/exterieur-balcon.jpg'),
        alt: 'Balcon filant ouvert sur le parc arboré',
        category: 'Extérieur',
      },
      {
        image: img('/images/library/exterieur/exterieur-facade.jpg'),
        alt: 'Façade en pierre de taille de la résidence',
        category: 'Extérieur',
      },
      {
        image: img('/images/library/chambre/chambre-2.jpg'),
        alt: 'Suite parentale et son dressing aménagé',
        category: 'Chambre',
      },
      {
        image: img('/images/library/parties-communes/sport.jpg'),
        alt: 'Salle de sport de la résidence',
        category: 'Parties communes',
      },
      {
        image: img('/images/library/exterieur/exterieur-rooftop-sunset.jpg'),
        alt: 'Toiture-terrasse partagée au coucher du soleil',
        category: 'Extérieur',
      },
    ],
  },
  {
    slug: 'les-ateliers',
    name: 'Les Ateliers',
    tagline: "L'élégance industrielle réinventée",
    description:
      'Verrières, matières brutes et hauteurs sous plafond spectaculaires, pour un art de vivre résolument contemporain.',
    meta: ['18 lofts', 'Paris 11ᵉ', 'Livraison 2025'],
    image: img('/images/library/exterieur/exterieur-ateliers-card.jpg'),

    location: 'Paris 11ᵉ — Rue de la Roquette',
    intro:
      "Ancienne manufacture de métallurgie reconvertie en dix-huit lofts, Les Ateliers conservent la structure d'origine : charpente rivetée, briques apparentes et verrières zénithales.",
    body: [
      "Les plateaux, livrés avec 4,20 m sous plafond, se prêtent à toutes les configurations. Les cuisines sur mesure et les salles de bain en terrazzo prolongent le vocabulaire industriel du lieu.",
      "Au centre, une cour pavée plantée de bouleaux dessert l'ensemble des lofts et prolonge les espaces de vie aux beaux jours.",
    ],
    specs: [
      { label: 'Typologies', value: 'Lofts 2 à 4 pièces' },
      { label: 'Surfaces', value: '62 à 210 m²' },
      { label: 'Hauteur', value: '4,20 m sous plafond' },
      { label: 'Cour intérieure', value: '600 m²' },
      { label: 'Livraison', value: '4ᵉ trimestre 2025' },
      { label: 'Performance', value: 'RE2020 · BBC Rénovation' },
    ],
    features: [
      'Verrières d’origine restaurées',
      'Cour pavée arborée',
      'Ateliers d’artistes en rez-de-cour',
      'Parking souterrain',
      'Local vélos sécurisé',
      'Cuisines sur mesure',
    ],
    stats: [
      { value: 18, suffix: '', label: 'Lofts' },
      { value: 420, suffix: ' cm', label: 'Sous plafond' },
      { value: 600, suffix: ' m²', label: 'Cour intérieure' },
      { value: 2025, suffix: '', label: 'Livraison', raw: true },
    ],
    place: {
      address: '74 rue de la Roquette, 75011 Paris',
      summary:
        "Au cœur du 11ᵉ, entre Bastille et Père-Lachaise, dans un quartier d'ateliers, de galeries et de tables de quartier.",
      transports: [
        { line: 'Ligne 9', detail: 'Voltaire — 3 min à pied' },
        { line: 'Ligne 8', detail: 'Ledru-Rollin — 9 min à pied' },
        { line: 'Ligne 1', detail: 'Bastille — 12 min à pied' },
      ],
      nearby: [
        'Marché Bastille — 7 min',
        'Père-Lachaise — 10 min',
        'Cirque d’Hiver — 8 min',
        'Canal Saint-Martin — 15 min',
      ],
    },
    apartments: [
      {
        id: 'loft-03',
        reference: 'Loft 03',
        type: '2 pièces',
        surface: 62,
        floor: 'Rez-de-cour',
        orientation: 'Nord — verrière',
        outdoor: 'Cour privative 12 m²',
        price: 820000,
        status: 'Disponible',
        image: img('/images/library/sejour/sejour-2.jpg'),
        description:
          "Un plateau d'atelier en rez-de-cour, éclairé par une verrière zénithale d'origine et prolongé par une cour pavée privative.",
        features: [
          'Verrière zénithale',
          'Briques apparentes',
          'Cuisine sur mesure',
          'Cour privative',
        ],
        gallery: [
          {
            image: img('/images/library/sejour/sejour-2.jpg'),
            alt: 'Plateau d’atelier sous verrière zénithale',
            category: 'Séjour',
          },
          {
            image: img('/images/library/cuisine/cuisine-2.jpg'),
            alt: 'Cuisine sur mesure adossée à la brique',
            category: 'Cuisine',
          },
          {
            image: img('/images/library/sejour/sejour-5.jpg'),
            alt: 'Pièce de vie éclairée par la verrière',
            category: 'Séjour',
          },
          {
            image: img('/images/library/salle-de-bain/sdb-2.jpg'),
            alt: 'Salle de bain en terrazzo',
            category: 'Salle de bain',
          },
          {
            image: img('/images/library/exterieur/exterieur-cour.jpg'),
            alt: 'Cour privative pavée de 12 m²',
            category: 'Extérieur',
          },
          {
            image: img('/images/library/exterieur/exterieur-ateliers-card.jpg'),
            alt: 'Charpente métallique rivetée conservée',
            category: 'Parties communes',
          },
        ],
      },
      {
        id: 'loft-07',
        reference: 'Loft 07',
        type: '3 pièces',
        surface: 118,
        floor: '2ᵉ étage',
        orientation: 'Est-Ouest',
        outdoor: 'Balcon 8 m²',
        price: 1580000,
        status: 'Disponible',
        image: img('/images/library/sejour/sejour-5.jpg'),
        description:
          'Un volume traversant de 4,20 m sous plafond, structuré par la charpente métallique rivetée conservée.',
        features: [
          '4,20 m sous plafond',
          'Charpente apparente',
          'Mezzanine aménageable',
          'Salle de bain terrazzo',
        ],
        gallery: [
          {
            image: img('/images/library/sejour/sejour-5.jpg'),
            alt: 'Volume traversant de 4,20 m sous plafond',
            category: 'Séjour',
          },
          {
            image: img('/images/library/sejour/sejour-3.jpg'),
            alt: 'Séjour structuré par la charpente apparente',
            category: 'Séjour',
          },
          {
            image: img('/images/library/cuisine/cuisine-2.jpg'),
            alt: 'Cuisine sur mesure en inox et chêne',
            category: 'Cuisine',
          },
          {
            image: img('/images/library/salle-de-bain/sdb-2.jpg'),
            alt: 'Salle de bain en terrazzo',
            category: 'Salle de bain',
          },
          {
            image: img('/images/library/sejour/sejour-4.jpg'),
            alt: 'Mezzanine aménageable au-dessus du séjour',
            category: 'Séjour',
          },
          {
            image: img('/images/library/exterieur/exterieur-cour.jpg'),
            alt: 'Balcon de 8 m² sur la cour',
            category: 'Extérieur',
          },
        ],
      },
      {
        id: 'loft-12',
        reference: 'Loft 12',
        type: '4 pièces',
        surface: 210,
        floor: '3ᵉ étage',
        orientation: 'Traversant',
        outdoor: 'Terrasse 32 m²',
        price: 2950000,
        status: 'Dernière opportunité',
        image: img('/images/library/sejour/sejour-6.jpg'),
        description:
          "Le plateau le plus vaste de la manufacture, avec sa terrasse ouverte sur les toits et une double hauteur au-dessus du séjour.",
        features: [
          'Double hauteur',
          'Terrasse sur les toits',
          'Trois chambres',
          'Deux places de parking',
        ],
        gallery: [
          {
            image: img('/images/library/sejour/sejour-6.jpg'),
            alt: 'Le plateau le plus vaste de la manufacture',
            category: 'Séjour',
          },
          {
            image: img('/images/library/sejour/sejour-3.jpg'),
            alt: 'Double hauteur au-dessus du séjour',
            category: 'Séjour',
          },
          {
            image: img('/images/library/sejour/sejour-4.jpg'),
            alt: 'Mezzanine ouverte sur la pièce de vie',
            category: 'Séjour',
          },
          {
            image: img('/images/library/cuisine/cuisine-2.jpg'),
            alt: 'Cuisine sur mesure adossée à la brique',
            category: 'Cuisine',
          },
          {
            image: img('/images/library/salle-de-bain/sdb-2.jpg'),
            alt: 'Salle de bain en terrazzo',
            category: 'Salle de bain',
          },
          {
            image: img('/images/library/exterieur/exterieur-terrasse.jpg'),
            alt: 'Terrasse de 32 m² ouverte sur les toits',
            category: 'Extérieur',
          },
        ],
      },
    ],
    gallery: [
      {
        image: img('/images/library/sejour/sejour-2.jpg'),
        alt: 'Salon contemporain aux tons naturels',
        category: 'Séjour',
      },
      {
        image: img('/images/library/exterieur/exterieur-terrasse.jpg'),
        alt: 'Terrasse privative avec vue dégagée',
        category: 'Extérieur',
      },
      {
        image: img('/images/library/exterieur/exterieur-ateliers-card.jpg'),
        alt: 'Façade de la résidence',
        category: 'Extérieur',
      },
      {
        image: img('/images/library/sejour/sejour-5.jpg'),
        alt: 'Pièce de vie sous verrière',
        category: 'Séjour',
      },
      {
        image: img('/images/library/exterieur/exterieur-ateliers-card.jpg'),
        alt: 'Charpente métallique rivetée conservée',
        category: 'Parties communes',
      },
      {
        image: img('/images/library/sejour/sejour-3.jpg'),
        alt: 'Loft traversant sous 4,20 m de hauteur',
        category: 'Séjour',
      },
      {
        image: img('/images/library/cuisine/cuisine-2.jpg'),
        alt: 'Cuisine sur mesure adossée à la brique apparente',
        category: 'Cuisine',
      },
      {
        image: img('/images/library/salle-de-bain/sdb-2.jpg'),
        alt: 'Salle de bain en terrazzo',
        category: 'Salle de bain',
      },
      {
        image: img('/images/library/exterieur/exterieur-cour.jpg'),
        alt: 'Cour pavée plantée de bouleaux',
        category: 'Extérieur',
      },
      {
        image: img('/images/library/sejour/sejour-4.jpg'),
        alt: 'Mezzanine ouverte sur la pièce de vie',
        category: 'Séjour',
      },
    ],
  },
]

export const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
