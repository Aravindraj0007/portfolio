export const personalInfo = {
  name: "Aravindraj M",
  initials: "AM",
  role: "AI Engineer",
  email: "aravind040806@gmail.com",
  location: "Coimbatore, India",
  resumePath: "/resume/Aravindraj_M.pdf",
  availability: "Open to opportunities",
  headline: "I build AI agents and intelligent systems that solve real problems.",
  heroText:
    "AI agents, RAG pipelines, machine learning and computer vision, taken from prototype to working applications.",
  about: [
    "I'm a B.Tech Artificial Intelligence and Data Science student at Kumaraguru College of Technology, Coimbatore, with hands-on experience in AI agents, REST APIs and data-driven applications.",
    "As an AI/ML Member at iQube Innovation Center, I develop AI-powered applications using AI agents, RAG, LLMs, machine learning, deep learning and computer vision. I build the AI pipelines and backend/API integrations behind them, and collaborate on research, prototyping and end-to-end project development.",
    "I have a strong foundation in Python, C++, data structures and algorithms (150+ LeetCode problems), OOP and SQL.",
  ],
};

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const highlights = [
  {
    title: "AI/ML Member, iQube Innovation Center",
    detail: "Kumaraguru College of Technology · 2025 – Present",
    icon: "BrainCircuit",
  },
  {
    title: "B.Tech, Artificial Intelligence and Data Science",
    detail: "Kumaraguru College of Technology, Coimbatore · 2024 – Present",
    icon: "GraduationCap",
  },
  {
    title: "Runner-up, Maatram Hackforge 2.0",
    detail: "Hackathon",
    icon: "Trophy",
  },
];

// The first group is shown as the large featured card; the last as a full-width strip.
export const skillGroups = [
  {
    title: "AI / ML",
    icon: "BrainCircuit",
    description: "Building AI agents and RAG pipelines, and training deep-learning models.",
    items: [
      "Machine Learning",
      "Deep Learning",
      "Gen AI",
      "RAG",
      "LangChain",
      "LangGraph",
    ],
  },
  {
    title: "Computer Vision",
    icon: "Eye",
    description: "Real-time detection and gesture recognition.",
    items: ["OpenCV", "MediaPipe", "YOLO", "CNN"],
  },
  {
    title: "Software Development",
    icon: "Server",
    description: "APIs and tooling around the models.",
    items: ["REST APIs", "FastAPI", "Git", "GitHub", "Docker"],
  },
  {
    title: "Web",
    icon: "Monitor",
    description: "Dashboards and interfaces people actually use.",
    items: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    title: "Databases",
    icon: "Database",
    description: "Relational and document storage.",
    items: ["MySQL", "SQLite", "Supabase", "MongoDB"],
  },
  {
    title: "Languages & Core Concepts",
    icon: "Code2",
    items: ["Python", "C++", "C", "SQL", "DSA (150+ LeetCode)", "OOP", "DBMS"],
  },
];

export const projects = [
  {
    slug: "patientpath-ai",
    title: "PatientPath AI",
    subtitle: "Hospital flow optimization",
    category: "Computer Vision · Machine Learning",
    summary:
      "Real-time hospital monitoring across 7 departments, using YOLO occupancy tracking and ML models that predict wait times and raise alerts.",
    github: "https://github.com/Aravindraj0007/Sankara-Innovation-Challenge-2026.git",
    techStack: ["YOLO", "OpenCV", "FastAPI", "MySQL", "WebSockets", "Chart.js", "n8n"],
    outcomes: ["7 departments monitored", "Wait-time prediction", "Automated alerts"],
    caseStudy: {
      context: "Finalist, Sankara Innovation Challenge 2026.",
      problem:
        "Hospitals rarely see where patients are piling up in real time. Wait times grow and staff get reallocated only after a bottleneck has already formed.",
      approach: [
        "YOLO-based person detection on camera feeds (OpenCV) to estimate live occupancy per department.",
        "ML models for wait-time prediction, bottleneck detection, staff allocation and patient risk scoring.",
        "A FastAPI backend with MySQL storage, pushing live updates to the dashboard over WebSockets.",
        "n8n workflows that send automated alerts and recommendations when thresholds are crossed.",
      ],
      result:
        "A live Chart.js dashboard covering 7 departments, with risk scores and automated alerts so staff can act before queues build up.",
    },
  },
  {
    slug: "mudra-detection",
    title: "Bharatanatyam Mudra Detection",
    subtitle: "Real-time gesture recognition",
    category: "Computer Vision · Deep Learning",
    summary:
      "Recognizes Bharatanatyam hand gestures from a live webcam feed and gives learners instant feedback through an interactive practice mode.",
    github: "https://github.com/Aravindraj0007/mudra-identification",
    techStack: ["Python", "OpenCV", "MediaPipe", "TensorFlow", "YOLO"],
    outcomes: ["Real-time feedback", "Custom dataset", "Multi-class classification"],
    caseStudy: {
      problem:
        "Learning mudras normally needs a teacher checking every hand position. Students practising alone have no way to know whether a gesture is correct.",
      approach: [
        "MediaPipe hand-landmark detection on live webcam frames processed with OpenCV.",
        "Collected and labelled a custom dataset covering multiple mudra classes.",
        "Trained a deep learning classifier in TensorFlow for multi-class mudra recognition, with YOLO for detection.",
        "An interactive learning mode that checks the learner's gesture against the target mudra in real time.",
      ],
      result:
        "Learners get real-time, per-gesture feedback while practising, without needing a teacher present.",
    },
  },
  {
    slug: "smart-exam-cell",
    title: "Smart Exam Cell Management",
    subtitle: "Full-stack academic records system",
    category: "Full-stack Web",
    summary:
      "A web app for managing students, exams and results, with role-based access, multi-field search, pagination and a normalized database.",
    github: "https://github.com/Aravindraj0007/SMART-EXAM-CELL-MANAGEMENT-SYSTEM.git",
    techStack: ["HTML", "CSS", "JavaScript", "MySQL"],
    outcomes: ["Role-based access", "Search & pagination", "Normalized schema"],
    caseStudy: {
      problem:
        "Exam cells juggle student, exam and result data across scattered files, which makes lookups slow and access hard to control.",
      approach: [
        "A normalized MySQL schema linking students, exams and results.",
        "Role-based access control so each type of user sees only what they should.",
        "Full CRUD flows with multi-field search and pagination for large record sets.",
        "A lightweight HTML, CSS and JavaScript frontend.",
      ],
      result: "One place for the exam cell's academic data, with controlled access and fast search across records.",
    },
  },
  {
    slug: "whatsapp-booking-automation",
    title: "WhatsApp Booking Automation",
    subtitle: "Workflow automation",
    category: "Automation",
    summary:
      "An n8n workflow that automates booking conversations over WhatsApp, driven by incoming webhooks.",
    github: "https://github.com/Aravindraj0007/n8n-automation-booking.git",
    techStack: ["n8n", "Webhooks", "WhatsApp"],
    outcomes: ["Workflow automation", "Webhook triggers", "Booking messages"],
    caseStudy: {
      problem: "Handling booking requests by hand on WhatsApp is repetitive, and messages are easy to miss.",
      approach: [
        "An n8n workflow triggered by incoming webhooks.",
        "Automated booking replies and confirmations sent over WhatsApp.",
        "Workflow logic that routes each request through the booking steps.",
      ],
      result: "Booking communication runs automatically instead of relying on manual replies.",
    },
  },
];

export const socialLinks = [
  {
    label: "GitHub",
    handle: "Aravindraj0007",
    url: "https://github.com/Aravindraj0007",
    icon: "Github",
  },
  {
    label: "LinkedIn",
    handle: "aravindraj-m-35714632a",
    url: "https://linkedin.com/in/aravindraj-m-35714632a",
    icon: "Linkedin",
  },
  {
    label: "LeetCode",
    handle: "aravindraj4131",
    url: "https://leetcode.com/u/aravindraj4131/",
    icon: "Code2",
  },
];
