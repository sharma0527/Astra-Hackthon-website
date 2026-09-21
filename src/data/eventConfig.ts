export interface ChallengeTheme {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  tags: string[];
  sampleProblems: string[];
  gradient: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface PrizeItem {
  tier: string;
  title: string;
  amount: string;
  perks: string[];
  color: string;
  isPopular?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const eventConfig = {
  name: "ASTRA",
  year: 2026,
  subtitle: "NATIONAL HACKATHON",
  supportingLine: "CODE • CREATE • COLLABORATE • CHANGE",
  mainDescription: "Where bold ideas become real-world innovation.",
  aboutText: "ASTRA is a premier national hackathon where students come together to identify real-world challenges, build meaningful technology solutions, and transform ideas into measurable impact.",
  
  dates: "SEPTEMBER 21, 2026",
  eventDateISO: "2026-09-21T09:00:00+05:30",
  duration: "National Hackathon",
  venue: "NRI Institute of Technology",
  location: "Perecharla, Medikondoru Mandal, Guntur, AP",
  
  // Official NRIIT crest logo
  officialLogoUrl: "https://lh3.googleusercontent.com/aida/AEtjO1XGyUPtTHl-T3328I-NeDykDoTTx9cx2MdjYE26uTt1ySrCvcp87w7w1EIXlwWVzv_k5Gx_lO3WEQlULUgWaUJ5XUc3W1DulrZBUzugJeFb35Qoq4IND1LXZJMSTWcH28SsZ7SCTsOTKVd_k8A-IOgGcrZUcWPC54Dz-s2qwnMqEtZBc7-uYMLnmAfkFYgs4P-aIP38OVMfySkevipFPU3c12FzlFx72RR7S7ebMQ8KizDcQQpofKFWr1_O",

  // Exact Google Form URL
  googleFormEmbedUrl: "https://docs.google.com/forms/d/e/1FAIpQLSerATrTKrWCdcmzPtY2XnQzhWFTGkLyCfmIusaLfFzX-b2Aeg/viewform?embedded=true",
  googleFormDirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSerATrTKrWCdcmzPtY2XnQzhWFTGkLyCfmIusaLfFzX-b2Aeg/viewform?usp=sf_link",
  trackingUrl: "/track",
  
  partners: [
    {
      name: "NRI INSTITUTE OF TECHNOLOGY",
      role: "Host & Academic Partner",
      short: "NRIIT",
      description: "Premier engineering institution in Andhra Pradesh fostering research, innovation, and technological excellence.",
      link: "https://nriit.edu.in",
      logoBadge: "NRIIT"
    },
    {
      name: "MTX",
      role: "Industry & Innovation Partner",
      short: "MTX",
      description: "Global cloud technology and digital transformation pioneer powering enterprise-grade solutions and community enablement.",
      link: "https://mtxb2b.com",
      logoBadge: "MTX"
    },
    {
      name: "NRIIT CODING CLUB",
      role: "Student Community Partner",
      short: "NCC",
      description: "Dynamic student developer ecosystem driving peer-to-peer technical skills, hackathons, and open-source culture.",
      link: "#",
      logoBadge: "CODING CLUB"
    }
  ],

  statistics: [
    {
      value: 12,
      suffix: "H",
      label: "NON-STOP BUILDING",
      sublabel: "Intense round-the-clock creation"
    },
    {
      value: 100,
      suffix: "+",
      label: "REAL PROBLEMS",
      sublabel: "Industry & civic focused"
    },
    {
      value: 500,
      suffix: "+",
      label: "DIVERSE MINDS",
      sublabel: "Students across disciplines"
    },
    {
      value: 1,
      suffix: "M+",
      label: "LASTING IMPACT",
      sublabel: "Prototypes driven into reality"
    }
  ],

  themes: [
    {
      id: "ai",
      title: "Artificial Intelligence",
      shortDesc: "Generative AI, predictive modeling, NLP, and computer vision solving critical workflows.",
      fullDesc: "Harness modern AI agents, multimodal LLMs, and real-time computer vision to automate labor-intensive problems, boost accessibility, and innovate human-machine interfaces.",
      iconName: "BrainCircuit",
      tags: ["Agentic AI", "Computer Vision", "LLMs", "Edge AI"],
      sampleProblems: [
        "Autonomous assistive agents for low-resource Indian languages",
        "Edge AI for real-time agricultural crop disease diagnosis"
      ],
      gradient: "from-cyan-500/20 to-blue-600/20"
    },
    {
      id: "fintech",
      title: "FinTech",
      shortDesc: "Decentralized finance, automated micro-lending, fraud detection, and financial literacy.",
      fullDesc: "Democratize financial services, streamline secure cross-border settlements, prevent cyber fraud, and enable accessible micro-credit models for unbanked communities.",
      iconName: "Coins",
      tags: ["UPI Infrastructure", "Fraud Shield", "Micro-Savings", "Zero-Knowledge"],
      sampleProblems: [
        "Real-time fraud telemetry and phishing detection for rural UPI users",
        "Algorithmic credit scoring for informal sector workers"
      ],
      gradient: "from-emerald-500/20 to-cyan-600/20"
    },
    {
      id: "healthcare",
      title: "Healthcare",
      shortDesc: "Telemedicine, early diagnostics, emergency triage, and patient record interoperability.",
      fullDesc: "Bridge the rural-urban healthcare divide through rapid diagnostic aids, remote monitoring ecosystems, and scalable emergency ambulance routing platforms.",
      iconName: "Activity",
      tags: ["Telehealth", "MedTech", "EHR Interoperability", "Vitals Telemetry"],
      sampleProblems: [
        "Offline-first mobile triage system for primary health centers",
        "Predictive vitals monitoring for post-operative recovery"
      ],
      gradient: "from-rose-500/20 to-purple-600/20"
    },
    {
      id: "education",
      title: "Education",
      shortDesc: "Adaptive learning algorithms, immersive STEM labs, and accessible skilling frameworks.",
      fullDesc: "Reimagine education with personalized tutoring agents, gamified skill mastery, collaborative peer classrooms, and neuro-diverse accessible learning tools.",
      iconName: "GraduationCap",
      tags: ["EdTech", "Adaptive Pedagogy", "Gamified Learning", "Audio Labs"],
      sampleProblems: [
        "Personalized multimodal tutoring for first-generation college learners",
        "Interactive virtual STEM lab simulations for resource-constrained schools"
      ],
      gradient: "from-amber-500/20 to-orange-600/20"
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity",
      shortDesc: "Zero trust architectures, threat intelligence, privacy preservation, and identity security.",
      fullDesc: "Fortify critical digital infrastructure, safeguard citizen privacy, defend cloud pipelines against zero-day exploits, and pioneer quantum-resistant cryptography.",
      iconName: "ShieldAlert",
      tags: ["Zero-Trust", "Threat Intel", "Identity Protection", "Cryptanalysis"],
      sampleProblems: [
        "Autonomous honeypot & anomaly detection for institutional networks",
        "Decentralized verifiable credentials for academic verification"
      ],
      gradient: "from-red-500/20 to-violet-600/20"
    },
    {
      id: "sustainability",
      title: "Sustainability",
      shortDesc: "Clean energy optimization, carbon footprint tracking, circular economy, and smart grids.",
      fullDesc: "Build green technologies that monitor environmental indices, incentivize recycling, accelerate solar micro-grid efficiency, and optimize water resource distribution.",
      iconName: "Leaf",
      tags: ["CleanTech", "Smart Irrigation", "Carbon Auditing", "Renewable Microgrids"],
      sampleProblems: [
        "Smart solar grid balancing with IoT weather telemetry",
        "Reverse logistics and digital deposit return platform for plastic waste"
      ],
      gradient: "from-teal-500/20 to-emerald-600/20"
    },
    {
      id: "smart-tech",
      title: "Smart Technology",
      shortDesc: "Smart cities, intelligent transportation, IoT ecosystems, and industrial automation.",
      fullDesc: "Connect the physical and digital world with embedded systems, intelligent transit routing, automated warehouse operations, and municipal civic sensor networks.",
      iconName: "Cpu",
      tags: ["IoT Hardware", "Smart Mobility", "Urban Sensors", "Robotics"],
      sampleProblems: [
        "Dynamic traffic signal preemption for emergency vehicles",
        "Smart water utility leakage telemetry for municipal bodies"
      ],
      gradient: "from-blue-500/20 to-indigo-600/20"
    },
    {
      id: "open-innovation",
      title: "Open Innovation",
      shortDesc: "Moonshot ideas, breakthrough developer tools, space tech, and unconstrained innovation.",
      fullDesc: "Have a radical concept that doesn't fit standard categories? Bring your moonshot experiments, deep tech explorations, or unconventional creative platforms to life.",
      iconName: "Sparkles",
      tags: ["Moonshot", "DeepTech", "Developer Tooling", "SpaceTech"],
      sampleProblems: [
        "Decentralized satellite telemetry simulation platform",
        "Next-gen developer productivity tools and local compilers"
      ],
      gradient: "from-fuchsia-500/20 to-cyan-600/20"
    }
  ] as ChallengeTheme[],

  whyAstra: [
    {
      id: "real-world",
      title: "REAL-WORLD PROBLEMS",
      description: "Solve meaningful challenges backed by industry partners and societal imperatives.",
      iconName: "Globe2"
    },
    {
      id: "creative-solutions",
      title: "CREATIVE SOLUTIONS",
      description: "Turn ideas into working prototypes with rapid development support and resources.",
      iconName: "Lightbulb"
    },
    {
      id: "mentorship",
      title: "MENTORSHIP",
      description: "Learn 1-on-1 from seasoned MTX tech architects, academic leads, and industry mentors.",
      iconName: "Users"
    },
    {
      id: "networking",
      title: "NETWORKING",
      description: "Connect with the most ambitious builders, designers, and innovators across the state.",
      iconName: "Share2"
    },
    {
      id: "recognition",
      title: "RECOGNITION",
      description: "Showcase your work directly to leadership, angel investors, and hiring scouts.",
      iconName: "Award"
    },
    {
      id: "impact",
      title: "IMPACT",
      description: "Create something meaningful that lives far beyond the hackathon competition.",
      iconName: "Rocket"
    }
  ],

  timeline: [
    {
      id: "reg-open",
      title: "Registration Opens",
      date: "September 01, 2026",
      time: "10:00 AM IST",
      description: "Official portal goes live. Teams submit project interests and member rosters.",
      status: "completed"
    },
    {
      id: "reg-deadline",
      title: "Registration Deadline",
      date: "September 18, 2026",
      time: "11:59 PM IST",
      description: "Portal closes. Applications reviewed by steering and tech committees.",
      status: "active"
    },
    {
      id: "team-formation",
      title: "Shortlisting & Confirmation",
      date: "September 19, 2026",
      time: "06:00 PM IST",
      description: "Selected teams receive invitations and Discord/Slack workspace invites.",
      status: "upcoming"
    },
    {
      id: "hackathon-begins",
      title: "Hackathon Begins",
      date: "September 21, 2026",
      time: "08:00 AM IST",
      description: "Opening keynote, problem statement release, and hackathon countdown kick-off.",
      status: "upcoming"
    },
    {
      id: "development",
      title: "Sprint & Checkpoint 1",
      date: "September 21, 2026",
      time: "12:00 PM IST",
      description: "Teams deep-dive into coding. Initial architecture checkpoint with MTX mentors.",
      status: "upcoming"
    },
    {
      id: "mentor-eval",
      title: "Mentor Evaluation",
      date: "September 21, 2026",
      time: "04:00 PM IST",
      description: "Midway technical review, debugging sprints, and fast-paced mentor feedback.",
      status: "upcoming"
    },
    {
      id: "final-submission",
      title: "Final Submission",
      date: "September 21, 2026",
      time: "08:00 PM IST",
      description: "Code freeze! GitHub repositories locked and video demonstrations submitted.",
      status: "upcoming"
    },
    {
      id: "judging",
      title: "Grand Jury Judging",
      date: "September 21, 2026",
      time: "08:30 PM IST",
      description: "Top teams pitch live on stage before executive leadership and technical jury.",
      status: "upcoming"
    },
    {
      id: "results",
      title: "Valedictory & Results",
      date: "September 21, 2026",
      time: "09:30 PM IST",
      description: "Announcement of winners, distribution of cash prizes, and closing ceremonies.",
      status: "upcoming"
    }
  ] as TimelineItem[],

  prizes: {
    podium: [
      {
        tier: "WINNER",
        title: "Grand Champion",
        amount: "₹50,000",
        perks: [
          "Champion Trophy & Gold Medals",
          "Fast-Track Interview Opportunities",
          "MTX & NRIIT Innovation Incubation",
          "Exclusive ASTRA Champion Swag Kit",
          "Cloud Credits & Pro Tool Subscriptions"
        ],
        color: "from-amber-400 via-yellow-300 to-amber-500",
        isPopular: true
      },
      {
        tier: "1ST RUNNER-UP",
        title: "First Runner-Up",
        amount: "₹30,000",
        perks: [
          "Silver Trophy & Medals",
          "Mentorship from Tech Architects",
          "ASTRA Premium Swag Kit",
          "Award of Excellence"
        ],
        color: "from-slate-300 via-slate-100 to-slate-400"
      },
      {
        tier: "2ND RUNNER-UP",
        title: "Second Runner-Up",
        amount: "₹15,000",
        perks: [
          "Bronze Trophy & Medals",
          "Industry Recognition & Badges",
          "ASTRA Hacker Swag Kit",
          "Award of Excellence"
        ],
        color: "from-amber-700 via-amber-600 to-amber-800"
      }
    ] as PrizeItem[],

    specialAwards: [
      {
        category: "BEST INNOVATION",
        amount: "₹7,500",
        description: "Awarded to the team delivering the most ingenious, out-of-the-box conceptual breakthrough."
      },
      {
        category: "BEST AI SOLUTION",
        amount: "₹7,500",
        description: "Recognizing outstanding engineering in generative models, agentic workflows, or ML accuracy."
      },
      {
        category: "BEST SOCIAL IMPACT",
        amount: "₹7,500",
        description: "Honoring technology that provides tangible upliftment to rural, civic, or healthcare needs."
      },
      {
        category: "BEST UI/UX",
        amount: "₹7,500",
        description: "Celebrating stunning visual craftsmanship, intuitive ergonomics, and accessible design."
      }
    ]
  },

  eligibility: {
    title: "WHO CAN JOIN ASTRA?",
    teamSize: {
      min: 4,
      max: 5,
      note: "Teams can be formed across different departments or disciplines (min 4 and max 5 members)."
    },
    qualifications: [
      "Open to all enrolled undergraduate (B.Tech / B.E / BCA / B.Sc) & postgraduate (M.Tech / MCA) students.",
      "Inter-disciplinary and cross-year teams are highly encouraged.",
      "Participants must carry an authentic college identity card during reporting."
    ],
    rules: [
      "All code and prototypes must be freshly written during the hackathon window.",
      "Open-source libraries, APIs, and boilerplate packages are permitted with proper attribution.",
      "Plagiarism or submission of pre-built commercial projects will lead to immediate disqualification.",
      "Every hacker is expected to abide by the official ASTRA Code of Conduct with respect and integrity."
    ]
  },

  faqs: [
    {
      category: "General",
      question: "What is ASTRA?",
      answer: "ASTRA is a premier national hackathon organized collaboratively by NRI Institute of Technology, MTX, and NRIIT Coding Club. It is designed to empower student engineers to build high-impact tech prototypes in a high-octane cosmic environment."
    },
    {
      category: "Registration",
      question: "Is there any registration fee to participate in ASTRA?",
      answer: "No, participation in ASTRA is 100% free of cost. Selected participants will also receive food, drinks, hackathon swag, and high-speed campus internet access."
    },
    {
      category: "Teams",
      question: "Can team members be from different colleges or branches?",
      answer: "Yes! Cross-college and cross-departmental collaboration is strongly encouraged. Bring diverse skills in design, frontend, backend, and domain expertise."
    },
    {
      category: "Application",
      question: "How does the Application Tracking system work?",
      answer: "Once you complete the embedded official Google Form, our automated backend issues a unique Application ID (format: ASTRA-2026-XXXXXX) directly to your registered email. You can visit the 'Track Application' tab anytime to monitor your review, shortlisting, and confirmation status in real time."
    },
    {
      category: "Logistics",
      question: "What equipment should we bring to the venue?",
      answer: "Each team member should bring their own laptop, chargers, extension cord (recommended), personal toiletries, and valid college ID card. Hardware hack participants must bring their own development boards and sensors."
    },
    {
      category: "Mentorship",
      question: "Will mentors be available during the hackathon?",
      answer: "Yes, experienced software architects and engineers from MTX and faculty leads will conduct scheduled mentorship checkpoints, provide debugging support, and offer architectural guidance."
    }
  ] as FaqItem[]
};
