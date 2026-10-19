import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial seed data
const initialData = {
  users: [
    {
      id: 'candidate_1',
      role: 'candidate',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      headline: 'Senior Full-Stack Engineer | React, Node.js, Distributed Cloud Architecture',
      location: 'Bengaluru, India',
      preferredRemote: 'Hybrid',
      yearsOfExperience: 5,
      currentRole: 'Senior Software Engineer at NexaTech',
      bio: 'Passionate software craftsman with 5+ years building high-throughput cloud web applications. Enthusiastic about micro-frontends, event-driven backends, and AI developer tooling.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'React', level: 'Expert', verified: true, endorsements: 24 },
        { name: 'Node.js', level: 'Expert', verified: true, endorsements: 19 },
        { name: 'TypeScript', level: 'Expert', verified: true, endorsements: 22 },
        { name: 'PostgreSQL', level: 'Intermediate', verified: true, endorsements: 14 },
        { name: 'AWS Cloud', level: 'Intermediate', verified: true, endorsements: 12 },
        { name: 'System Design', level: 'Intermediate', verified: true, endorsements: 18 },
        { name: 'Docker & Kubernetes', level: 'Intermediate', verified: false, endorsements: 7 }
      ],
      experience: [
        {
          id: 'exp_1',
          role: 'Senior Software Engineer',
          company: 'NexaTech Innovations',
          period: '2022 - Present',
          description: 'Architected and scaled real-time analytics microservices serving 1.5M monthly active users. Reduced latency by 42% through query optimization and Redis caching.'
        },
        {
          id: 'exp_2',
          role: 'Full Stack Developer',
          company: 'InnoByte Labs',
          period: '2019 - 2022',
          description: 'Developed scalable client dashboards using React, Redux, and Express. Automated CI/CD deployment pipelines on AWS ECS.'
        }
      ],
      education: [
        {
          id: 'edu_1',
          degree: 'B.Tech in Computer Science & Engineering',
          institution: 'National Institute of Technology',
          year: '2015 - 2019'
        }
      ],
      certifications: [
        { id: 'cert_1', name: 'AWS Certified Solutions Architect', year: '2023', issuer: 'Amazon Web Services' },
        { id: 'cert_2', name: 'Certified Kubernetes Administrator (CKA)', year: '2024', issuer: 'CNCF' }
      ],
      projects: [
        {
          id: 'proj_1',
          title: 'HyperQueue - Distributed Task Broker',
          description: 'High-performance Go and Node.js asynchronous message broker handling 40k req/sec with guaranteed at-least-once delivery.',
          link: 'https://github.com/example/hyperqueue'
        },
        {
          id: 'proj_2',
          title: 'CareerLens - AI Resume Diagnostic Tool',
          description: 'Web application leveraging LLMs to evaluate resume bullet impact and suggest quantified metrics.',
          link: 'https://github.com/example/careerlens'
        }
      ],
      targetSalary: '₹28,00,000 - ₹38,00,000 / year',
      careerGoals: 'Aspiring to transition to Staff/Principal Engineer leading core cloud platform infrastructure.',
      subscriptionTier: 'Pro'
    },
    {
      id: 'candidate_2',
      role: 'candidate',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      headline: 'AI & Machine Learning Engineer | Generative AI, RAG Systems, Python & PyTorch',
      location: 'Hyderabad, India',
      preferredRemote: 'Remote',
      yearsOfExperience: 3,
      currentRole: 'AI Research Engineer at DataMind Labs',
      bio: 'Machine Learning specialist focused on productionizing LLMs, agentic workflows, and semantic search systems. Passionate about ethical AI and real-time retrieval architectures.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'Python', level: 'Expert', verified: true, endorsements: 31 },
        { name: 'PyTorch', level: 'Expert', verified: true, endorsements: 20 },
        { name: 'LangChain / LlamaIndex', level: 'Expert', verified: true, endorsements: 18 },
        { name: 'Vector Databases (Pinecone/Milvus)', level: 'Intermediate', verified: true, endorsements: 15 },
        { name: 'FastAPI', level: 'Intermediate', verified: true, endorsements: 12 },
        { name: 'Docker', level: 'Intermediate', verified: false, endorsements: 8 }
      ],
      experience: [
        {
          id: 'exp_p1',
          role: 'AI Engineer',
          company: 'DataMind Labs',
          period: '2022 - Present',
          description: 'Engineered multimodal RAG pipelines with hybrid keyword-vector search, reducing model hallucinations by 68% for enterprise clients.'
        }
      ],
      education: [
        {
          id: 'edu_p1',
          degree: 'M.Tech in Data Science & Artificial Intelligence',
          institution: 'IIT Hyderabad',
          year: '2020 - 2022'
        }
      ],
      certifications: [
        { id: 'cert_p1', name: 'DeepLearning.AI Generative AI for LLMs', year: '2023', issuer: 'Coursera / DeepLearning.AI' }
      ],
      projects: [
        {
          id: 'proj_p1',
          title: 'DocSynth - Autonomous Research Agent',
          description: 'Multi-agent tool that synthesizes 100+ PDF papers into structured executive briefs with citation validation.',
          link: 'https://github.com/example/docsynth'
        }
      ],
      targetSalary: '₹24,00,000 - ₹34,00,000 / year',
      careerGoals: 'Lead generative AI product engineering and fine-tuning domain-specific foundational models.',
      subscriptionTier: 'Free'
    },
    {
      id: 'employer_1',
      role: 'employer',
      name: 'Vikramaditya Rao',
      email: 'vikram.rao@cloudscale.io',
      headline: 'VP of Engineering & Talent Partner',
      company: 'CloudScale Technologies',
      location: 'Bengaluru, India',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Leading high-growth engineering teams across India & Southeast Asia. Passionate about technical excellence, transparent hiring, and engineering culture.',
      companyDetails: {
        name: 'CloudScale Technologies',
        size: '250 - 500 Employees',
        industry: 'Cloud Infrastructure & Developer Tools',
        founded: '2019',
        website: 'https://cloudscale.io',
        culture: 'Asynchronous first, radical transparency, continuous learning stipend, high autonomy.',
        mission: 'Empowering software teams worldwide with zero-friction, self-healing cloud infrastructure.'
      }
    }
  ],
  jobs: [
    {
      id: 'job_1',
      title: 'Senior Full-Stack Cloud Architect',
      company: 'CloudScale Technologies',
      postedBy: 'employer_1',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      domain: 'Software & Technology',
      location: 'Bengaluru, India',
      workCondition: 'Hybrid',
      jobType: 'Full-Time',
      experienceLevel: '4-6 years',
      minExpYears: 4,
      maxExpYears: 6,
      salaryMin: 2800000,
      salaryMax: 4200000,
      salaryFormatted: '₹28,00,000 - ₹42,00,000 / year',
      isSalaryTransparent: true,
      postedDate: '2026-10-15',
      deadline: '2026-11-15',
      isFeatured: true,
      qualityScore: 96,
      qualityRating: 'A+',
      qualityBreakdown: {
        responsibilitiesClarity: 20,
        compensationTransparency: 20,
        qualificationsDistinction: 20,
        cultureAndMission: 14,
        deiCommitment: 10,
        processTransparency: 12
      },
      summary: 'We are seeking an experienced Senior Full-Stack Cloud Architect to design and implement resilient, multi-tenant distributed cloud services for our developer platform.',
      responsibilities: [
        'Architect and implement scalable Node.js and React full-stack microservices handling over 5M API calls daily.',
        'Partner closely with Product Managers and Platform Architects to define architectural roadmaps and high-availability SLAs.',
        'Optimize PostgreSQL query execution plans, caching layers with Redis, and containerized deployments on Kubernetes.',
        'Champion code quality, automated test coverage (>85%), and conduct insightful peer architecture reviews.'
      ],
      mustHaveSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS Cloud', 'System Design'],
      niceToHaveSkills: ['Docker & Kubernetes', 'GraphQL', 'Terraform', 'Kafka'],
      workConditionsDetail: {
        weeklyHours: 40,
        schedule: 'Flexible core hours (11 AM - 4 PM IST)',
        travelRequirements: 'None',
        perks: ['Comprehensive Health & Life Insurance for family', 'Annual Learning & Conference Allowance (₹1,50,000)', 'WFH Equipment Stipend', 'Generous Stock Equity (ESOPs)']
      },
      cultureMission: {
        mission: 'Eliminating deployment stress for 10M developers worldwide.',
        values: ['Radical Candor & Humility', 'Bias for Action', 'Customer Obsessed Quality', 'Inclusive Teamwork']
      },
      deiStatement: 'CloudScale is an Equal Opportunity Employer. We celebrate diversity across gender identity, ethnicity, neurodivergence, and age.',
      interviewProcess: [
        { stage: 1, title: 'Initial Screening & Profile Match', duration: '30 mins' },
        { stage: 2, title: 'Technical Architecture & Deep-Dive', duration: '60 mins' },
        { stage: 3, title: 'Live System Design & Code Review', duration: '60 mins' },
        { stage: 4, title: 'Culture Alignment & Leadership Chat', duration: '45 mins' }
      ]
    },
    {
      id: 'job_2',
      title: 'Lead Generative AI & LLM Engineer',
      company: 'NeuroSynth Labs',
      postedBy: 'employer_1',
      logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=80',
      domain: 'Artificial Intelligence',
      location: 'Remote (Global)',
      workCondition: 'Remote',
      jobType: 'Full-Time',
      experienceLevel: '3-5 years',
      minExpYears: 3,
      maxExpYears: 5,
      salaryMin: 3200000,
      salaryMax: 4800000,
      salaryFormatted: '₹32,00,000 - ₹48,00,000 / year ($110,000 - $145,000)',
      isSalaryTransparent: true,
      postedDate: '2026-10-17',
      deadline: '2026-11-20',
      isFeatured: true,
      qualityScore: 94,
      qualityRating: 'A+',
      qualityBreakdown: {
        responsibilitiesClarity: 19,
        compensationTransparency: 20,
        qualificationsDistinction: 19,
        cultureAndMission: 15,
        deiCommitment: 9,
        processTransparency: 12
      },
      summary: 'NeuroSynth Labs is looking for a Lead AI/LLM Engineer to pioneer autonomous reasoning agents and fine-tuned retrieval systems.',
      responsibilities: [
        'Design and deploy production-grade RAG and Agentic workflows with low latency and high factual precision.',
        'Fine-tune open-source models (Llama 3, Mistral) using LoRA/QLoRA on domain-specific datasets.',
        'Benchmark inference speed and cost-per-token optimization on vLLM and TensorRT-LLM.',
        'Evaluate hallucinations, bias, and output safety against automated eval benchmarks.'
      ],
      mustHaveSkills: ['Python', 'PyTorch', 'LangChain / LlamaIndex', 'Vector Databases (Pinecone/Milvus)', 'FastAPI'],
      niceToHaveSkills: ['vLLM', 'Triton Inference Server', 'Hugging Face Transformers', 'Docker'],
      workConditionsDetail: {
        weeklyHours: 40,
        schedule: '100% Async Remote (Any timezone within +/- 4 hrs of UTC+5:30)',
        travelRequirements: 'Optional semi-annual team retreats in Bali / Lisbon',
        perks: ['Unlimited PTO', 'Top-tier M3 Max MacBook Pro + 4K setup', 'Wellness and fitness subscription']
      },
      cultureMission: {
        mission: 'Democratizing reliable intelligence through transparent and explainable AI.',
        values: ['Curiosity First', 'Intellectual Honesty', 'Craftsmanship', 'Empathy']
      },
      deiStatement: 'We actively recruit across global borders and welcome candidates of all backgrounds.',
      interviewProcess: [
        { stage: 1, title: 'AI Portfolio & Paper Review', duration: '30 mins' },
        { stage: 2, title: 'Practical Model Inference & Retrieval Exercise', duration: '90 mins' },
        { stage: 3, title: 'Founder Alignment & Vision', duration: '45 mins' }
      ]
    },
    {
      id: 'job_3',
      title: 'B2B SaaS Growth Marketing Manager',
      company: 'FinEdge Global',
      postedBy: 'employer_1',
      logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80',
      domain: 'Marketing & Growth',
      location: 'Mumbai, India',
      workCondition: 'In-Office',
      jobType: 'Full-Time',
      experienceLevel: '2-4 years',
      minExpYears: 2,
      maxExpYears: 4,
      salaryMin: 1800000,
      salaryMax: 2600000,
      salaryFormatted: '₹18,00,000 - ₹26,00,000 / year',
      isSalaryTransparent: true,
      postedDate: '2026-10-12',
      deadline: '2026-11-10',
      isFeatured: false,
      qualityScore: 91,
      qualityRating: 'A',
      qualityBreakdown: {
        responsibilitiesClarity: 18,
        compensationTransparency: 20,
        qualificationsDistinction: 18,
        cultureAndMission: 14,
        deiCommitment: 9,
        processTransparency: 12
      },
      summary: 'Drive outbound demand generation, product-led inbound pipelines, and community growth for our next-generation fintech platform.',
      responsibilities: [
        'Own customer acquisition funnel across paid search, LinkedIn sponsored campaigns, and organic SEO channels.',
        'Analyze conversion drop-offs using Mixpanel and Google Analytics 4, improving sign-up conversion by >25%.',
        'Collaborate with Sales engineering to design high-converting product interactive demos and webinars.'
      ],
      mustHaveSkills: ['Growth Hacking', 'SEO', 'Analytics', 'B2B SaaS', 'Content Strategy'],
      niceToHaveSkills: ['HubSpot CRM', 'Mixpanel', 'Copywriting', 'Webflow'],
      workConditionsDetail: {
        weeklyHours: 42,
        schedule: 'Monday to Friday, 9:30 AM - 6:30 PM',
        travelRequirements: 'Occasional industry conference travel',
        perks: ['Performance Bonus (up to 20%)', 'Health Cover', 'Catered Gourmet Lunches']
      },
      cultureMission: {
        mission: 'Empowering mid-market enterprises with borderless treasury tools.',
        values: ['Velocity with Rigor', 'Data-driven Truth', 'Integrity Above All']
      },
      deiStatement: 'FinEdge is committed to fostering a workplace that reflects the diverse customers we serve.',
      interviewProcess: [
        { stage: 1, title: 'Hiring Manager Connect', duration: '30 mins' },
        { stage: 2, title: 'Growth Strategy Case Presentation', duration: '60 mins' },
        { stage: 3, title: 'Executive Team Meet', duration: '45 mins' }
      ]
    },
    {
      id: 'job_4',
      title: 'Principal Design Systems & UX Lead',
      company: 'Prisma Studio',
      postedBy: 'employer_1',
      logo: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=100&auto=format&fit=crop&q=80',
      domain: 'Product & Design',
      location: 'Pune / Remote',
      workCondition: 'Hybrid',
      jobType: 'Full-Time',
      experienceLevel: '5+ years',
      minExpYears: 5,
      maxExpYears: 9,
      salaryMin: 2600000,
      salaryMax: 3800000,
      salaryFormatted: '₹26,00,000 - ₹38,00,000 / year',
      isSalaryTransparent: true,
      postedDate: '2026-10-18',
      deadline: '2026-11-25',
      isFeatured: false,
      qualityScore: 95,
      qualityRating: 'A+',
      qualityBreakdown: {
        responsibilitiesClarity: 20,
        compensationTransparency: 20,
        qualificationsDistinction: 19,
        cultureAndMission: 15,
        deiCommitment: 9,
        processTransparency: 12
      },
      summary: 'Shape the next decade of design excellence at Prisma Studio by leading our cross-platform design token architecture and accessibility standards.',
      responsibilities: [
        'Lead our unified multi-brand design system in Figma and synchronize tokens with React component libraries.',
        'Conduct rigorous WCAG 2.1 AAA accessibility audits and ensure seamless keyboard navigation.',
        'Mentor junior & senior product designers while collaborating tightly with Frontend engineering.'
      ],
      mustHaveSkills: ['Design Systems', 'Figma', 'UI/UX Design', 'Design Ops', 'Accessibility (a11y)'],
      niceToHaveSkills: ['CSS & React Tokens', 'Storybook', 'User Research', 'Motion Design'],
      workConditionsDetail: {
        weeklyHours: 38,
        schedule: 'Flexible hours with 2 office days/week or fully remote option',
        travelRequirements: 'None',
        perks: ['Wellness stipend', 'Ergonomic home office budget', 'Design conference tickets']
      },
      cultureMission: {
        mission: 'Transforming complex software into intuitive, joyful everyday experiences.',
        values: ['Design as a Strategy', 'Obsession with Micro-interactions', 'Empathy for Every User']
      },
      deiStatement: 'We believe exceptional design requires diverse perspectives and inclusive minds.',
      interviewProcess: [
        { stage: 1, title: 'Design Portfolio Walkthrough', duration: '45 mins' },
        { stage: 2, title: 'Design Systems Exercise & Collaboration', duration: '60 mins' },
        { stage: 3, title: 'Cross-functional Partner Round', duration: '45 mins' }
      ]
    },
    {
      id: 'job_5',
      title: 'Healthcare Systems Data Analyst',
      company: 'MedPulse Health',
      postedBy: 'employer_1',
      logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&auto=format&fit=crop&q=80',
      domain: 'Healthcare & Biotech',
      location: 'Hyderabad, India',
      workCondition: 'Hybrid',
      jobType: 'Full-Time',
      experienceLevel: '1-3 years',
      minExpYears: 1,
      maxExpYears: 3,
      salaryMin: 1200000,
      salaryMax: 1800000,
      salaryFormatted: '₹12,00,000 - ₹18,00,000 / year',
      isSalaryTransparent: true,
      postedDate: '2026-10-14',
      deadline: '2026-11-12',
      isFeatured: false,
      qualityScore: 89,
      qualityRating: 'B+',
      qualityBreakdown: {
        responsibilitiesClarity: 18,
        compensationTransparency: 20,
        qualificationsDistinction: 17,
        cultureAndMission: 14,
        deiCommitment: 8,
        processTransparency: 12
      },
      summary: 'Analyze patient outcomes, EHR operational efficiencies, and hospital logistics using SQL and advanced business intelligence dashboards.',
      responsibilities: [
        'Build and maintain clinical telemetry dashboards in Tableau and PowerBI for hospital administrators.',
        'Perform cohort analysis and survival modeling on anonymized health datasets with SQL and Python.',
        'Ensure HIPAA and national healthcare data compliance across all reporting pipelines.'
      ],
      mustHaveSkills: ['SQL', 'Python', 'Tableau', 'Data Analysis', 'Healthcare Systems'],
      niceToHaveSkills: ['PowerBI', 'FHIR Standards', 'EHR Systems', 'R Programming'],
      workConditionsDetail: {
        weeklyHours: 40,
        schedule: 'Hybrid: 3 days on-site, 2 days remote',
        travelRequirements: 'None',
        perks: ['Comprehensive Medical Coverage including OPD', 'Annual health checkup voucher', 'Provident Fund']
      },
      cultureMission: {
        mission: 'Improving clinical outcomes through actionable real-time healthcare intelligence.',
        values: ['Patient First', 'Data Integrity', 'Compassion', 'Continuous Learning']
      },
      deiStatement: 'MedPulse is committed to creating an inclusive healthcare analytics ecosystem.',
      interviewProcess: [
        { stage: 1, title: 'Initial Screening', duration: '30 mins' },
        { stage: 2, title: 'SQL & Data Analysis Case Test', duration: '60 mins' },
        { stage: 3, title: 'Team Fit & Discussion', duration: '45 mins' }
      ]
    }
  ],
  applications: [
    {
      id: 'app_1',
      jobId: 'job_1',
      candidateId: 'candidate_1',
      appliedDate: '2026-10-16',
      status: 'Interview Scheduled', // Applied, Screening, Interview Scheduled, Offer Extended, Rejected
      candidateNotes: 'Very excited about CloudScale’s distributed architecture. Attached portfolio includes HyperQueue system.',
      matchScore: 94,
      interviewDate: '2026-10-22T14:00:00.000Z',
      interviewStage: 'Technical Architecture & Deep-Dive',
      interviewLink: 'https://meet.google.com/pba-tech-eval',
      employerFeedback: {
        technicalScore: 9,
        cultureScore: 9,
        communicationScore: 8,
        strengths: 'Outstanding grasp of microservices, distributed concurrency, and database indexing.',
        areasOfImprovement: 'Could delve deeper into automated canary deployments on Kubernetes.',
        summary: 'Strong candidate. Recommended moving forward to the final System Design & Code Review round.'
      }
    },
    {
      id: 'app_2',
      jobId: 'job_2',
      candidateId: 'candidate_2',
      appliedDate: '2026-10-18',
      status: 'Screening',
      candidateNotes: 'Extensive hands-on expertise building production RAG systems with LangChain and LlamaIndex.',
      matchScore: 96,
      employerFeedback: null
    }
  ],
  notifications: [
    {
      id: 'notif_1',
      userId: 'candidate_1',
      title: 'Interview Scheduled: Technical Architecture',
      message: 'CloudScale Technologies scheduled your interview for Senior Full-Stack Cloud Architect on Oct 22 at 2:00 PM IST.',
      type: 'interview',
      timestamp: '2026-10-18T10:30:00.000Z',
      read: false,
      actionUrl: '/applications'
    },
    {
      id: 'notif_2',
      userId: 'candidate_1',
      title: 'New High-Fit Job Match (94% Fit)',
      message: 'DevOps & Platform Reliability Engineer role at CloudScale matches your skills in AWS, TypeScript, and Docker.',
      type: 'job_match',
      timestamp: '2026-10-17T15:20:00.000Z',
      read: false,
      actionUrl: '/jobs'
    },
    {
      id: 'notif_3',
      userId: 'employer_1',
      title: 'New High-Quality Candidate Applied',
      message: 'Aarav Sharma (94% Match) applied for Senior Full-Stack Cloud Architect with verified credentials.',
      type: 'application',
      timestamp: '2026-10-16T11:45:00.000Z',
      read: true,
      actionUrl: '/ats'
    }
  ],
  mockInterviews: [
    {
      id: 'mock_1',
      candidateId: 'candidate_1',
      jobId: 'job_1',
      jobTitle: 'Senior Full-Stack Cloud Architect',
      date: '2026-10-17',
      overallScore: 88,
      status: 'Completed',
      questions: [
        {
          id: 'q1',
          question: 'How do you prevent cascade failures in distributed Node.js microservices when a downstream PostgreSQL database experiences sudden connection exhaustion?',
          userAnswer: 'I implement connection pool boundaries, circuit breaker patterns using Opossum or Envoy, aggressive short-timeout configs, and graceful degradation by serving stale cache from Redis or queuing non-critical writes in RabbitMQ/Kafka.',
          score: 92,
          strengths: 'Mentioned circuit breakers, connection pooling, and multi-tier degradation.',
          improvements: 'Could also mention backpressure handling and automated database autoscaling/read-replicas routing.',
          jdAlignment: 'Directly aligns with the "design and implement resilient distributed services" requirement.'
        },
        {
          id: 'q2',
          question: 'In React 19, how do you handle state sharing and performance optimization across deeply nested dashboard components without triggering unnecessary re-renders?',
          userAnswer: 'I utilize fine-grained reactive state stores or React Context split into state vs dispatch contexts, combined with memoization and Server Components for static parts to reduce client bundle footprint.',
          score: 86,
          strengths: 'Clear separation of state and dispatch contexts to prevent re-render cascades.',
          improvements: 'Can touch upon modern signals or concurrent transition hooks (`useTransition`).',
          jdAlignment: 'Matches the React architecture and frontend performance criteria in the JD.'
        }
      ]
    }
  ]
};

// Database helper functions
export const getStore = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading store.json, resetting to default:', err);
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
};

export const saveStore = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  return data;
};
