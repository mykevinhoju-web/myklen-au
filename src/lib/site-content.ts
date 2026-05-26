/** Marketing copy — home cleaning business launch platform (en-AU) */

export const sitePositioning = {
  tagline: '',
  headlineLines: [
    { lead: 'Start with ', accent: 'heart.' },
    { lead: 'Grow through ', accent: 'trust.' },
  ],
  subhead: [
    'It started with one person delivering catalogs door to door.',
    [
      'Today, we help cleaners build trusted businesses',
      'through sincerity, effort, and real connection.',
    ],
  ],
} as const

export const homeOfferings = [
  {
    title: 'Booking system',
    body: 'Let customers book online while you stay in control of your schedule and service area.',
  },
  {
    title: 'Reviews & feedback',
    body: 'Build trust with ratings and follow-ups — repeat work comes from reputation.',
  },
  {
    title: 'Business cards & flyers',
    body: 'Print-ready branding so you look professional from day one in your neighbourhood.',
  },
  {
    title: 'Uniforms & supplies',
    body: 'Guidance on apparel and cleaning kits that signal a reliable, organised team.',
  },
  {
    title: 'Cleaning training',
    body: 'Step-by-step know-how for homes, offices, safety, and quality standards.',
  },
  {
    title: 'Winning local clients',
    body: 'Practical lessons on quoting, outreach, and growing a steady client base.',
  },
] as const

export const homeOpportunity = {
  eyebrow: 'Opportunity',
  title: 'A new income stream — without starting from zero',
  lead: 'No prior cleaning experience required. We help you with the skills, systems, and brand presence so you can focus on serving customers and growing revenue.',
  bullets: [
    'How to clean to a professional standard',
    'Customer communication and quoting',
    'Managing bookings and your calendar',
    'Branding that wins local trust',
    'Ways to find and retain clients',
  ],
  closing: 'You bring the commitment — we provide the playbook.',
} as const

/** Split headline + 2×2 card grid (investment-style layer) */
export const homeLaunchBoard = {
  eyebrow: 'Launch planning',
  title: 'What it takes to start',
  lead: 'Starting a cleaning business is an investment in tools, training, and local trust — not guesswork.',
  cards: [
    {
      title: 'Package & tools',
      body: 'Your Starter, Growth, or Premium tier covers training, branding assets, and the systems to take bookings.',
      tone: 'light' as const,
    },
    {
      title: 'Time to learn',
      body: 'Plan time for modules and practice cleans before you scale — skill and confidence come first.',
      tone: 'dark' as const,
    },
    {
      title: 'Local marketing',
      body: 'Flyers, your booking link, and neighbourhood outreach — growth happens where people know your name.',
      tone: 'light' as const,
    },
    {
      title: 'Steady cash flow',
      body: 'Price jobs clearly, collect reviews, and reinvest wisely. Sustainable growth beats burning out early.',
      tone: 'light' as const,
    },
  ],
} as const

export const homeSteps = [
  { step: '1', title: 'Choose your package', body: 'Pick Starter, Growth, or Premium to match how fast you want to launch.' },
  { step: '2', title: 'Start training', body: 'Work through modules on cleaning, safety, and running your business.' },
  { step: '3', title: 'Get your brand kit', body: 'Templates, uniform guidance, and supply lists aligned to your tier.' },
  { step: '4', title: 'Share your booking link', body: 'Customers book through your branded URL — you own the relationship.' },
  { step: '5', title: 'Collect reviews', body: 'Feedback tools help you improve service and win the next job.' },
  { step: '6', title: 'Grow your income', body: 'Repeat bookings, referrals, and upsells compound over time.' },
] as const

export const homeTestimonials = [
  {
    quote: 'I had never run a business before. The training and booking link made the first month feel manageable.',
    name: 'Sarah M.',
    role: 'Manager, Melbourne',
    stars: 5,
  },
  {
    quote: 'Having flyers and a uniform-ready brand helped me look established before I had a big client list.',
    name: 'James T.',
    role: 'Manager, Brisbane',
    stars: 5,
  },
  {
    quote: 'Reviews on my own page matter more than being lost on a giant marketplace. Customers trust me directly.',
    name: 'Priya K.',
    role: 'Manager, Sydney',
    stars: 5,
  },
] as const

export const homeCta = {
  title: 'Start your home cleaning business today',
  body: 'Join managers across Australia who launch with training, tools, and branding — not guesswork.',
  primary: 'View packages',
  secondary: 'Become a partner',
} as const

export const partnerPage = {
  title: 'No cleaning experience? You can still start.',
  lead: 'myklen is built for Australians who want their own cleaning company — we supply the systems, education, and brand support so you can win and keep customers.',
  includes: [
    'Online booking link for your business',
    'Client management path (phased rollout)',
    'Cleaning & business training',
    'Business cards, flyers, and marketing templates',
    'Uniform and supplies guidance',
    'Review and feedback tools',
    'Local customer acquisition training',
  ],
} as const

export const customersPage = {
  title: 'Book a professional home clean',
  lead: 'When you book through a myklen manager’s link, you’re hiring an independent local business — trained, branded, and accountable.',
  services: [
    { title: 'Regular home cleaning', body: 'Ongoing maintenance cleans tailored to your home and schedule.' },
    { title: 'Deep cleaning', body: 'Detailed kitchen, bathroom, and living areas for a fresh reset.' },
    { title: 'Move-in / move-out', body: 'End-of-lease and relocation cleans that meet agent expectations.' },
    { title: 'Scheduled recurring', body: 'Weekly or fortnightly visits with the same trusted team.' },
  ],
  trust: [
    'Managers trained through myklen programs',
    'Reviews and feedback on your cleaner’s booking page',
    'Clear service scope before you confirm',
  ],
} as const
