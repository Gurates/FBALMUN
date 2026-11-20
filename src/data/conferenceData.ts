import { Speaker, Committee, DaySchedule, StatItem } from '../types';

export const CONFERENCE_INFO = {
  name: 'FBALMUN',
  edition: 'XXVI EDITION',
  year: '2026',
  tagline: 'IGNITING GLOBAL DIPLOMACY',
  subheading: 'Where diplomatic intellect meets the crucible of international crisis. Delegates unite to forge tomorrow’s sovereign resolutions.',
  dates: 'DECEMBER 04 – 06, 2026',
  location: 'THE IMPERIAL CONGRESS PALACE, İZMİR',
  coordinates: '38.4237° N, 27.1428° E',
  registrationDeadline: '2026-11-27T23:59:59',
  stats: [
    { label: 'SPECIALIZED CHAMBERS', value: '12', description: 'From General Assembly to high-intensity Crisis', iconName: 'Shield' },
    { label: 'SOVEREIGN NATIONS', value: '48', description: 'Nations actively simulated and represented', iconName: 'Globe' },
    { label: 'DAYS OF RESOLUTION', value: '03', description: 'Continuous debate, caucuses, and directive drafting', iconName: 'Flame' }
  ] as StatItem[]
};

export const SPEAKERS_DATA: Speaker[] = [
  {
    id: 'sp-1',
    name: 'Amb. Elena Rostova',
    role: 'Former UN Under-Secretary-General',
    organization: 'Global Security & Disarmament Initiative',
    topic: 'The Architecture of Modern Deterrence: Preserving Peace in Multipolar Shocks',
    bio: 'Over three decades navigating high-stakes multilateral diplomacy in Geneva and New York. Authored key peacekeeping frameworks.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    chamber: 'Opening Keynote Plenary'
  },
  {
    id: 'sp-2',
    name: 'Dr. Tariq Al-Mansoor',
    role: 'Director of Strategic Geopolitics',
    organization: 'Mediterranean Institute of International Affairs',
    topic: 'Sovereign Resources & The Spark of Conflict: Maritime Law in the 21st Century',
    bio: 'Specialist in maritime boundaries, energy corridors, and diplomatic mediation in disputed waters.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    chamber: 'Security Council Keynote'
  },
  {
    id: 'sp-3',
    name: 'Claire Beauchamp, J.D.',
    role: 'Lead Counsel for International Human Rights',
    organization: 'Hague Institute for Global Justice',
    topic: 'Humanitarian Sovereignty: Defending Civilian Corridors Amid Asymmetric Crises',
    bio: 'International jurist litigating fundamental human rights and refugee status treaties across global tribunals.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
    chamber: 'UNHRC Special Address'
  },
  {
    id: 'sp-4',
    name: 'Marcus Vance',
    role: 'Senior Fellow & Crisis Simulation Director',
    organization: 'Oxford Diplomatic Policy Forum',
    topic: 'Real-Time Crisis Management: De-escalation Under Fog of War Directives',
    bio: 'Pioneer of high-tempo strategic simulations, advising international foreign ministries on rapid consensus mechanics.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    chamber: 'Crisis Directorate Keynote'
  }
];

export const COMMITTEES_DATA: Committee[] = [
  {
    id: 'us-criminal-court',
    image: '/images/fbalfoto/us%20renk.jpg.jpeg',
    imageAlt: 'A crowded U.S. legislative chamber',
    acronym: 'U.S. Criminal Court',
    name: 'U.S. Criminal Court',
    agenda: 'Open Agenda',
    description: 'U.S. criminal courts hear cases involving alleged violations of federal or state criminal law. They ensure due process and presume defendants innocent unless the prosecution proves guilt beyond a reasonable doubt.',
    usg: ['Güldeniz Kılınç', 'Ada Akamca'],
  },
  {
    id: 'unwomen',
    image: '/images/fbalfoto/unwomen%20renkli.jpg.jpeg',
    imageAlt: 'Women marching in a crowded demonstration',
    acronym: 'UN Women',
    name: 'United Nations Entity for Gender Equality and the Empowerment of Women (UN Women)',
    agenda: 'Ways to Achieve the Goals of Beijing+30',
    description: 'UN Women advances gender equality and the rights of women and girls. It works with governments and civil society to end discrimination and expand women’s participation in public and economic life.',
    usg: 'Yusuf Say',
    acas: 'Duru Söylemezoglu',
  },
  {
    id: 'ohchr',
    image: '/images/fbalfoto/ohchr%20renkli.jpg.jpeg',
    imageAlt: 'A protest banner about migration draped over a monument in France',
    acronym: 'OHCHR',
    name: 'Office of the United Nations High Commissioner for Human Rights (OHCHR)',
    agenda: 'Addressing Human Rights Risks in the Context of Protests in Europe, with a Focus on France',
    description: 'OHCHR promotes and protects human rights worldwide. It monitors violations, advises governments, and supports civil society in upholding international human rights standards.',
    usg: 'Mehmet Ege Çöloglu',
    acas: 'Derin Deniz Kulaç',
  },
  {
    id: 'unodc',
    image: '/images/fbalfoto/unodc%20renkli.jpg.jpeg',
    imageAlt: 'A working dog and officers beside rows of seized packages',
    acronym: 'UNODC',
    name: 'United Nations Office on Drugs and Crime (UNODC)',
    agenda: 'Preventing the Expansion of International Drug Trafficking and Disrupting Transnational Drug Cartel Networks',
    description: 'UNODC helps countries address illicit drugs, organized crime, corruption, and terrorism. It supports international cooperation and helps strengthen justice systems and the rule of law.',
    usg: 'Yağmur Erdem',
    acas: 'Barış Babayiğit',
  },
  {
    id: 'san-francisco',
    image: '/images/fbalfoto/san%20fransisco%20renkli.jpg.jpeg',
    imageAlt: 'Delegates gathered around a signing table in front of national flags',
    acronym: 'San Francisco',
    name: 'San Francisco Conference',
    agenda: 'Open Agenda',
    description: 'In 1945, delegates from 50 nations met in San Francisco to draft and adopt the United Nations Charter. The conference established the foundations of the United Nations and its system of collective security.',
    usg: ['Bahar Uymaz', 'Görkem İlhan'],
  },
  {
    id: 'cia',
    image: '/images/fbalfoto/CIA%20RENKLI.jpg.jpeg',
    imageAlt: 'A silhouette overlaid with fragments of the CIA seal',
    acronym: 'CIA',
    name: 'Central Intelligence Agency (CIA)',
    agenda: 'To be announced',
    description: 'The CIA collects and analyzes foreign intelligence to inform U.S. national security decisions. It also carries out covert actions when directed by the President.',
    usg: 'Eylül Dur',
    acas: 'Ada Narin Koç',
  },
  {
    id: 'g20',
    image: '/images/fbalfoto/g20%20renkli.jpg.jpeg',
    imageAlt: 'A row of national flags extending down a corridor',
    acronym: 'G20',
    name: 'Group of 20 (G20)',
    agenda: 'Open Agenda',
    description: 'The G20 brings together major advanced and emerging economies. Through summits and ministerial meetings, its members coordinate on economic growth, financial stability, and sustainable development.',
    usg: 'Nira Kamil',
    acas: 'Selin Şavkal',
  },
  {
    id: 'unsc',
    image: '/images/fbalfoto/unsc%20renkli.jpg.jpeg',
    imageAlt: 'People gathered outdoors among rows of small flags',
    acronym: 'UNSC',
    name: 'United Nations Security Council (UNSC)',
    agenda: 'The Russia–Ukraine War',
    description: 'The UN Security Council is responsible for maintaining international peace and security. Its 15 members can adopt binding resolutions, impose sanctions, and authorize peacekeeping operations.',
    usg: 'Beril Korkmaz',
  },
  {
    id: 'french-national-convention',
    image: '/images/fbalfoto/french%20renk.jpg.jpeg',
    imageAlt: 'Historical artwork of a crowded French revolutionary assembly',
    acronym: 'French National Convention',
    name: 'French National Convention',
    agenda: 'Open Agenda',
    description: 'The National Convention governed France from 1792 to 1795. It abolished the monarchy, established the First French Republic, and adopted the constitution that paved the way for the Directory.',
    usg: ['Sabri Yigit Pune', 'Yiğit Karabıyik'],
  },
];

export const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: 1,
    title: 'DAY 01',
    theme: 'THE SPARK',
    date: 'Friday, December 04, 2026',
    sessions: [
      { time: '08:30 – 10:00', title: 'Delegate Registration & Badge Accreditation', location: 'Grand Atrium Hall', type: 'break', description: 'Arrival of international delegations, verification of credentials, delegate packet collection.' },
      { time: '10:00 – 11:45', title: 'Solemn Opening Ceremony & Torch Lighting', location: 'Plenary Grand Amphitheater', type: 'plenary', description: 'Opening address by Secretary-General, keynote speeches by guest diplomats, inaugural ceremony.' },
      { time: '12:00 – 13:30', title: 'Diplomatic Luncheon & Networking', location: 'Aegean Terrace', type: 'break', description: 'Informal delegate reception, bloc consultations, and faculty advisor briefing.' },
      { time: '13:30 – 16:00', title: 'Committee Session I: Roll Call & Agenda Setting', location: 'Assigned Committee Chambers', type: 'caucus', description: 'Formal establishment of quorum, introductory speeches, opening of the speakers list.' },
      { time: '16:15 – 18:30', title: 'Committee Session II: Moderated Debate & Initial Blocs', location: 'Assigned Committee Chambers', type: 'caucus', description: 'Substantive debates on primary sub-topics, unmoderated caucus, and initial working paper frameworks.' },
      { time: '19:30 – 21:30', title: 'Delegate Welcome Soirée & Cultural Exchange', location: 'The Sovereign Ballroom', type: 'gala', description: 'An evening of cultural camaraderie, diplomatic social networking, and live ambient music.' }
    ]
  },
  {
    day: 2,
    title: 'DAY 02',
    theme: 'THE CRUCIBLE',
    date: 'Saturday, December 05, 2026',
    sessions: [
      { time: '09:00 – 11:30', title: 'Committee Session III: Draft Resolution Mergers', location: 'Assigned Committee Chambers', type: 'caucus', description: 'Intensive unmoderated caucusing, clause-by-clause drafting, coalition alignment.' },
      { time: '11:30 – 13:00', title: 'Flashpoint Crisis Directive 01 / UNSC Emergency Order', location: 'Crisis & Security Chambers', type: 'crisis', description: 'Breaking news broadcast: Sudden geopolitical escalation requiring rapid cabinet response.' },
      { time: '13:00 – 14:15', title: 'Executive Working Lunch', location: 'Imperial Dining Suite', type: 'break', description: 'Delegates negotiate bilateral compromises over luncheon.' },
      { time: '14:15 – 17:00', title: 'Committee Session IV: Amendments & Chair Verification', location: 'Assigned Committee Chambers', type: 'caucus', description: 'Introduction of friendly and unfriendly amendments, formal review of draft resolutions.' },
      { time: '17:15 – 19:30', title: 'Committee Session V: Midnight Crisis Climax', location: 'Crisis Hub / JCC', type: 'crisis', description: 'High-intensity strategic showdown. Simultaneous joint directives deployed.' },
      { time: '20:30 – 23:00', title: 'The Flame Gala & Diplomatic Ball', location: 'Palace Waterfront Pavilion', type: 'gala', description: 'Black-tie evening celebrating international youth leadership with panoramic Aegean Sea views.' }
    ]
  },
  {
    day: 3,
    title: 'DAY 03',
    theme: 'THE BEACON',
    date: 'Sunday, December 06, 2026',
    sessions: [
      { time: '09:30 – 12:00', title: 'Committee Session VI: Final Voting Procedure', location: 'Assigned Committee Chambers', type: 'caucus', description: 'Roll call votes on draft resolutions. Passage of historic conference treaties.' },
      { time: '12:15 – 13:30', title: 'Farewell Luncheon & Commemorative Photo', location: 'Palace Courtyard', type: 'break', description: 'Delegation photography and informal closing conversations.' },
      { time: '14:00 – 16:30', title: 'Grand Closing Ceremony & Plenary Assembly', location: 'Plenary Grand Amphitheater', type: 'plenary', description: 'Presentation of passed resolutions, Secretary-General closing decree, delegation roll of honor.' },
      { time: '16:30 – 17:30', title: 'Distinguished Awards & Torch Passing Ceremony', location: 'Plenary Grand Amphitheater', type: 'plenary', description: 'Best Delegate, Outstanding Delegation awards, and symbolic passing of the diplomatic torch.' }
    ]
  }
];

export const VENUE_INFO = {
  title: 'THE IMPERIAL CONGRESS PALACE',
  subtitle: 'A Masterpiece of Heritage & Modern Diplomatic Grandeur',
  city: 'İzmir, Turkey',
  address: 'Alsancak, Konak, İzmir',
  description: 'Situated on the historic shores of the Aegean Sea, the Imperial Congress Palace provides world-class plenary amphitheaters, acoustic-engineered committee chambers, and panoramic diplomatic lounges.',
  highlights: [
    { title: 'Plenary Amphitheater', desc: 'State-of-the-art 1,200 seat acoustic auditorium for ceremonies and General Assembly debate.' },
    { title: '12 Soundproof Chambers', desc: 'Individual committee rooms equipped with broadcast feeds and digital directive consoles.' },
    { title: 'Diplomatic Waterfront Terrace', desc: 'Historic waterfront promenade for informal caucus discussions and evening galas.' },
    { title: 'Direct Transit & 5-Star Accommodations', desc: 'Within walking distance to historic landmarks, premium hotels, and metro links.' }
  ]
};

// Temporary welcome copy; replace these paragraphs with the hosts' final letters.
export const CONFERENCE_LETTERS = [
  {
    name: 'Buse',
    role: 'Conference Host · FBALMUN 2026',
    title: 'A stage for every voice.',
    paragraphs: [
      'Dear Delegates, Advisors, and Distinguished Guests,',
      'It is a pleasure to welcome you to FBALMUN 2026. Our conference begins with a simple belief: every voice can bring a new perspective, and every conversation can become the start of meaningful change.',
      'As the curtains open in İzmir, we invite you to challenge your assumptions, listen with curiosity, and approach each debate with courage and respect. The ideas you share and the friendships you build will make this experience your own.',
      'We look forward to welcoming you to our stage and writing this chapter together.'
    ]
  },
  {
    name: 'Damla',
    role: 'Conference Host · FBALMUN 2026',
    title: 'Together, beyond the debate.',
    paragraphs: [
      'Dear Members of the FBALMUN Community,',
      'Welcome to a gathering built on collaboration, imagination, and the willingness to understand one another. FBALMUN 2026 is an invitation to explore difficult questions and discover what we can achieve together.',
      'Whether this is your first committee or your next diplomatic adventure, we hope you find the confidence to speak, the patience to listen, and the inspiration to keep learning. Every resolution begins with people choosing to work side by side.',
      'We are excited to meet you in İzmir and share three memorable days of debate, discovery, and friendship.'
    ]
  }
];
