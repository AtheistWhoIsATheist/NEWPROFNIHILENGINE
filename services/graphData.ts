export interface CustomGraphNode {
  id: string;
  type: 'THINKER' | 'QUOTE' | 'THEME' | 'CLAIM';
  position: { x: number; y: number; z: number };
  properties: Record<string, any>;
}

export interface CustomGraphEdge {
  source: string;
  target: string;
  type: string;
  score?: number;
  properties?: Record<string, any>;
}

export const graphData: { nodes: CustomGraphNode[]; edges: CustomGraphEdge[] } = {
  nodes: [
    { id: 'THINKER_emile_cioran', type: 'THINKER', position: { x: -0.33, y: 2.0, z: 0.67 }, properties: { label: 'Emile Cioran', void_quotient: 0.548, absorption: 0.483, aperture: 0.600, dread: 0.533, quote_count: 470 } },
    { id: 'THINKER_ernest_becker', type: 'THINKER', position: { x: 0.0, y: -1.33, z: 2.0 }, properties: { label: 'Ernest Becker', void_quotient: 0.473, absorption: 0.500, aperture: 0.433, dread: 0.600, quote_count: 326 } },
    { id: 'THINKER_thomas_a_kempis', type: 'THINKER', position: { x: 0.33, y: -0.33, z: 0.67 }, properties: { label: 'Thomas a Kempis', void_quotient: 0.462, absorption: 0.517, aperture: 0.483, dread: 0.533, quote_count: 181 } },
    { id: 'THINKER_evelyn_underhill', type: 'THINKER', position: { x: -1.0, y: 2.33, z: -1.67 }, properties: { label: 'Evelyn Underhill', void_quotient: 0.565, absorption: 0.450, aperture: 0.617, dread: 0.417, quote_count: 179 } },
    { id: 'THINKER_kierkegaard', type: 'THINKER', position: { x: 0.0, y: -0.67, z: 1.33 }, properties: { label: 'Kierkegaard', void_quotient: 0.475, absorption: 0.500, aperture: 0.467, dread: 0.567, quote_count: 174 } },
    { id: 'THINKER_st_john_of_the_cross', type: 'THINKER', position: { x: -0.67, y: 3.33, z: -0.67 }, properties: { label: 'St. John of the Cross', void_quotient: 0.545, absorption: 0.467, aperture: 0.667, dread: 0.467, quote_count: 158 } },
    { id: 'THINKER_nietzsche', type: 'THINKER', position: { x: 0.33, y: -0.33, z: 0.67 }, properties: { label: 'Nietzsche', void_quotient: 0.462, absorption: 0.517, aperture: 0.483, dread: 0.533, quote_count: 146 } },
    { id: 'THINKER_lev_shestov', type: 'THINKER', position: { x: 0.0, y: -0.67, z: 1.33 }, properties: { label: 'Lev Shestov', void_quotient: 0.475, absorption: 0.500, aperture: 0.467, dread: 0.567, quote_count: 142 } },
    { id: 'THINKER_teresa_of_avila', type: 'THINKER', position: { x: -0.67, y: 3.33, z: -0.67 }, properties: { label: 'Teresa of Avila', void_quotient: 0.545, absorption: 0.467, aperture: 0.667, dread: 0.467, quote_count: 141 } },
    { id: 'THINKER_paul_tillich', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Paul Tillich', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 134 } },
    { id: 'THINKER_aldous_huxley', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Aldous Huxley', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 131 } },
    { id: 'THINKER_mitchell_heisman', type: 'THINKER', position: { x: 1.0, y: -2.33, z: 0.67 }, properties: { label: 'Mitchell Heisman', void_quotient: 0.438, absorption: 0.550, aperture: 0.383, dread: 0.533, quote_count: 116 } },
    { id: 'THINKER_martin_heidegger', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Martin Heidegger', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 105 } },
    { id: 'THINKER_tolstoy', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Tolstoy', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 103 } },
    { id: 'THINKER_thomas_ligotti', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Thomas Ligotti', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 84 } },
    { id: 'THINKER_fr_seraphim_rose', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Fr. Seraphim Rose', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 83 } },
    { id: 'THINKER_miguel_de_molinos', type: 'THINKER', position: { x: -2.0, y: 4.0, z: -2.0 }, properties: { label: 'Miguel de Molinos', void_quotient: 0.583, absorption: 0.400, aperture: 0.700, dread: 0.400, quote_count: 77 } },
    { id: 'THINKER_a_w_tozer', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'A.W. Tozer', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 77 } },
    { id: 'THINKER_pascal', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Pascal', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 76 } },
    { id: 'THINKER_edgar_saltus', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Edgar Saltus', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 72 } },
    { id: 'THINKER_miguel_de_unamuno', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Miguel de Unamuno', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 69 } },
    { id: 'THINKER_augustine', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Augustine', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 64 } },
    { id: 'THINKER_plato_socrates', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Plato/Socrates', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 63 } },
    { id: 'THINKER_william_james', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'William James', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 59 } },
    { id: 'THINKER_taoism', type: 'THINKER', position: { x: -1.33, y: 3.67, z: -2.0 }, properties: { label: 'Taoism', void_quotient: 0.600, absorption: 0.433, aperture: 0.683, dread: 0.400, quote_count: 54 } },
    { id: 'THINKER_buddhism', type: 'THINKER', position: { x: -2.0, y: 4.0, z: -2.0 }, properties: { label: 'Buddhism', void_quotient: 0.583, absorption: 0.400, aperture: 0.700, dread: 0.400, quote_count: 50 } },
    { id: 'THINKER_jesus_christ', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Jesus Christ', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 44 } },
    { id: 'THINKER_meister_eckhart', type: 'THINKER', position: { x: -0.67, y: 3.33, z: -0.67 }, properties: { label: 'Meister Eckhart', void_quotient: 0.545, absorption: 0.467, aperture: 0.667, dread: 0.467, quote_count: 39 } },
    { id: 'THINKER_gk_chesterton', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'GK Chesterton', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 38 } },
    { id: 'THINKER_therese_of_lisieux', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Therese of Lisieux', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 34 } },
    { id: 'THINKER_martin_luther', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Martin Luther', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 33 } },
    { id: 'THINKER_albert_camus', type: 'THINKER', position: { x: 1.0, y: -2.33, z: 0.67 }, properties: { label: 'Albert Camus', void_quotient: 0.438, absorption: 0.550, aperture: 0.383, dread: 0.533, quote_count: 33 } },
    { id: 'THINKER_swami_vivekananda', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Swami Vivekananda', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 30 } },
    { id: 'THINKER_peter_wessel_zapffe', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Peter Wessel Zapffe', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 28 } },
    { id: 'THINKER_herman_tonnessen', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Herman Tonnessen', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 27 } },
    { id: 'THINKER_bertrand_russell', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Bertrand Russell', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 26 } },
    { id: 'THINKER_thomas_keating', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Thomas Keating', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 26 } },
    { id: 'THINKER_thomas_merton', type: 'THINKER', position: { x: -2.0, y: 4.0, z: -2.0 }, properties: { label: 'Thomas Merton', void_quotient: 0.583, absorption: 0.400, aperture: 0.700, dread: 0.400, quote_count: 26 } },
    { id: 'THINKER_john_shelby_spong', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'John Shelby Spong', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 26 } },
    { id: 'THINKER_hinduism', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Hinduism', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 25 } },
    { id: 'THINKER_schopenhauer', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Schopenhauer', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 23 } },
    { id: 'THINKER_ecclesiastes', type: 'THINKER', position: { x: 1.0, y: -2.33, z: 0.67 }, properties: { label: 'Ecclesiastes', void_quotient: 0.438, absorption: 0.550, aperture: 0.383, dread: 0.533, quote_count: 17 } },
    { id: 'THINKER_will_durant', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Will Durant', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 17 } },
    { id: 'THINKER_c_s_lewis', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'C.S. Lewis', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 17 } },
    { id: 'THINKER_montaigne', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Montaigne', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 15 } },
    { id: 'THINKER_huston_smith', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Huston Smith', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 14 } },
    { id: 'THINKER_timothy_leary', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Timothy Leary', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 8 } },
    { id: 'THINKER_john_bunyan', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'John Bunyan', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 5 } },
    { id: 'THINKER_angela_of_foligno', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Angela of Foligno', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 3 } },
    { id: 'THINKER_thomas_aquinas', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Thomas Aquinas', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 2 } },
    { id: 'THINKER_william_lane_craig', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'William Lane Craig', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 2 } },
    { id: 'THINKER_pseudo_dionysius', type: 'THINKER', position: { x: 0.0, y: 0.0, z: 0.0 }, properties: { label: 'Pseudo-Dionysius', void_quotient: 0.500, absorption: 0.500, aperture: 0.500, dread: 0.500, quote_count: 1 } },

    { id: 'THEME_existential_dread', type: 'THEME', position: { x: 8, y: 4, z: 12 }, properties: { label: 'Existential Dread', quote_count: 100 } },
    { id: 'THEME_anxiety', type: 'THEME', position: { x: 6, y: 2, z: 10 }, properties: { label: 'Anxiety', quote_count: 100 } },
    { id: 'THEME_lack_of_objective_meaning', type: 'THEME', position: { x: -4, y: 8, z: 6 }, properties: { label: 'Lack of Objective Meaning, Value, Purpose', quote_count: 100 } },
    { id: 'THEME_skepticism_of_knowledge', type: 'THEME', position: { x: 4, y: -4, z: 6 }, properties: { label: 'Skepticism of Knowledge', quote_count: 100 } },
    { id: 'THEME_limitations_of_language', type: 'THEME', position: { x: 2, y: -6, z: 4 }, properties: { label: 'Limitations of Language', quote_count: 100 } },
    { id: 'THEME_dual_nature_of_humans', type: 'THEME', position: { x: 0, y: 4, z: 4 }, properties: { label: 'Dual Nature of Humans', quote_count: 100 } },
    { id: 'THEME_renunciation', type: 'THEME', position: { x: -6, y: 10, z: 2 }, properties: { label: 'Renunciation of Worldly Endeavors/Contemplative Lifestyle', quote_count: 100 } },
    { id: 'THEME_ego_dissolution', type: 'THEME', position: { x: -10, y: 8, z: -4 }, properties: { label: 'Ego Dissolution, Authenticity, True-Self, Oneness/Union', quote_count: 100 } },
    { id: 'THEME_mystical_experiences', type: 'THEME', position: { x: -8, y: 12, z: 4 }, properties: { label: 'Mystical and Nihilistic Experiences', quote_count: 100 } },
    { id: 'THEME_divine_presence', type: 'THEME', position: { x: -4, y: 14, z: 6 }, properties: { label: 'Divine Presence and Suffering', quote_count: 100 } },
    { id: 'THEME_senses_and_silence', type: 'THEME', position: { x: 2, y: 10, z: -4 }, properties: { label: 'Role of Senses and Silence', quote_count: 100 } },
    { id: 'THEME_conceptualization_of_god', type: 'THEME', position: { x: -2, y: 12, z: 2 }, properties: { label: 'Conceptualization of God', quote_count: 100 } },
    { id: 'THEME_inner_turmoil', type: 'THEME', position: { x: 0, y: 6, z: 8 }, properties: { label: 'Inner Turmoil and Growth', quote_count: 100 } },
    { id: 'THEME_human_nature', type: 'THEME', position: { x: 0, y: 2, z: 6 }, properties: { label: 'Human Nature and Temptation', quote_count: 100 } },
    { id: 'THEME_righteousness', type: 'THEME', position: { x: -2, y: 8, z: 4 }, properties: { label: 'Righteousness and Purification', quote_count: 100 } },
    { id: 'THEME_internal_recollection', type: 'THEME', position: { x: -4, y: 6, z: 0 }, properties: { label: 'Internal Recollection', quote_count: 100 } },
    { id: 'THEME_challenges_in_spiritual_path', type: 'THEME', position: { x: 2, y: 4, z: 8 }, properties: { label: 'Challenges in Spiritual Path', quote_count: 100 } },
    { id: 'THEME_perseverance', type: 'THEME', position: { x: -2, y: 4, z: 2 }, properties: { label: 'Perseverance in Recollection', quote_count: 100 } },
    { id: 'THEME_benefits_of_recollection', type: 'THEME', position: { x: -6, y: 4, z: -2 }, properties: { label: 'Benefits of Recollection Over Physical Penances', quote_count: 100 } },
    { id: 'THEME_caution_against_penances', type: 'THEME', position: { x: 0, y: 2, z: 0 }, properties: { label: 'Caution Against Rigid Penances', quote_count: 100 } },
    { id: 'THEME_misconceptions', type: 'THEME', position: { x: 4, y: 0, z: 6 }, properties: { label: 'Misconceptions About Spiritual Practices', quote_count: 100 } },
    { id: 'THEME_pursuit_of_gods_will', type: 'THEME', position: { x: -4, y: 10, z: 4 }, properties: { label: 'Pursuit of God\'s Will and Humility', quote_count: 100 } },
    { id: 'THEME_approach_to_spiritual_practices', type: 'THEME', position: { x: 0, y: 8, z: -2 }, properties: { label: 'Approach to Spiritual Practices', quote_count: 100 } },
    { id: 'THEME_divine_presence_imperfection', type: 'THEME', position: { x: -6, y: 12, z: 6 }, properties: { label: 'Divine Presence in Human Imperfection', quote_count: 100 } },
    { id: 'THEME_avoiding_sensible_pleasures', type: 'THEME', position: { x: 6, y: 2, z: 4 }, properties: { label: 'Avoiding Sensible Pleasures', quote_count: 100 } }
  ],
  edges: [
    {"source": "THINKER_emile_cioran", "target": "THEME_existential_dread", "type": "RESONANCE", "score": 0.81},
    {"source": "THINKER_kierkegaard", "target": "THEME_anxiety", "type": "RESONANCE", "score": 0.79},
    {"source": "THINKER_st_john_of_the_cross", "target": "THEME_divine_presence", "type": "RESONANCE", "score": 0.85},
    {"source": "THINKER_meister_eckhart", "target": "THEME_ego_dissolution", "type": "RESONANCE", "score": 0.83},
    {"source": "THINKER_buddhism", "target": "THEME_mystical_experiences", "type": "RESONANCE", "score": 0.78},
    {"source": "THINKER_pascal", "target": "THEME_anxiety", "type": "RESONANCE", "score": 0.76},
    {"source": "THINKER_nietzsche", "target": "THEME_lack_of_objective_meaning", "type": "TENSION", "score": 0.72},
    {"source": "THINKER_tolstoy", "target": "THEME_divine_presence", "type": "RESONANCE", "score": 0.74}
  ]
};
