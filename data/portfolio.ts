export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

export interface PlanetData {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  color: string;
  projects?: Project[];
  type: 'planet' | 'station' | 'wormhole' | 'satellite';
  modelPath?: string;
}

export const planets: PlanetData[] = [
  {
    id: 'home',
    name: 'Home Planet',
    description: 'Vishwa Patel - AI / Machine Learning Engineer from Surat, India. Building AI systems, breaking them, improving them and repeating the cycle until something cool happens.',
    position: [0, 0, 0],
    color: '#00f2ff',
    type: 'planet',
    modelPath: '/elements/water.glb'
  },
  {
    id: 'ai-agents',
    name: 'Agentic AI Systems',
    description: 'Deployed multi-agent customer support chatbots orchestrating across 10+ systems using LangChain, LangGraph, and Pydantic. Implemented dynamic routing with RAG and multilingual capabilities.',
    position: [60, 0, -100],
    color: '#7000ff',
    type: 'planet',
    modelPath: '/elements/metallic.glb',
    projects: [
      {
        title: 'Multi-Agent Customer Support Chatbot',
        description: 'Designed and deployed a multi-agent customer support chatbot for a casino platform using LangChain, LangGraph, Pydantic, and enabling LLM-powered RAG, multilingual conversations, and orchestration across 10+ systems.',
        tags: ['LangChain', 'LangGraph', 'Python', 'RAG']
      },
      {
        title: 'Chat Reply Recommendation System',
        description: 'Developed a chat reply recommendation engine leveraging NLP, semantic similarity, and a LoRA fine-tuned BERT model.',
        tags: ['BERT', 'NLP', 'PyTorch']
      },
      {
        title: 'Shruti AI Engine Core Modules',
        description: 'Developed core modules for Shruti AI Engine, an LLM-powered business analysis assistant integrating Smart Search Engines (SSE) for intelligent data retrieval and insights.',
        tags: ['LLM', 'RAG', 'Data Retrieval']
      }
    ]
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision & ML',
    description: 'Enhanced image recognition systems for facial matching across massive datasets. Built StudyBot AI using GPT/LLaMA for automated grading.',
    position: [-70, 0, -180],
    color: '#00ffaa',
    type: 'planet',
    modelPath: '/elements/air.glb',
    projects: [
      {
        title: 'Facial Recognition System',
        description: 'Enhanced an image recognition system for facial matching across large datasets, significantly improving model accuracy.',
        tags: ['OpenCV', 'Deep Learning', 'Facial Recognition']
      },
      {
        title: 'StudyBot AI',
        description: 'Developed and enhanced StudyBot AI, an intelligent education assistant for IELTS and SSC exam modules using GPT and LLaMA.',
        tags: ['FastAPI', 'LLaMA', 'GPT']
      }
    ]
  },
  {
    id: 'trading-ai',
    name: 'Trading AI & Predictive Models',
    description: 'Led development of an agentic AI autonomous trading bot using real-time market data. Trained GRU, LSTM, and CNN architectures for cryptocurrency price prediction using TensorFlow/Keras.',
    position: [40, 0, -280],
    color: '#ffcc00',
    type: 'planet',
    modelPath: '/elements/fire.glb',
    projects: [
      {
        title: 'Agentic AI Trading Bot',
        description: 'Led development of an agentic AI trading bot, integrating LLMs with real-time market data for autonomous trading and decision-making.',
        tags: ['LLM', 'Finance', 'Agents']
      },
      {
        title: 'Cryptocurrency Price Prediction',
        description: 'Trained and evaluated deep learning architectures (GRU, LSTM, GRU-LSTM hybrid, CNN) for cryptocurrency price prediction using TensorFlow and Keras, conducting comparative performance analysis.',
        tags: ['LSTM', 'GRU', 'CNN', 'Finance', 'TensorFlow']
      }
    ]
  },
  {
    id: 'nlp-genai',
    name: 'NLP & Live GenAI Projects',
    description: 'Live Project: Text-Centre – a modern NLP text utility suite. Live Project: AI Jewellery Media Generation for Tiash Jewels. Also developed Dari-to-English translation MVPs.',
    position: [-80, 0, -380],
    color: '#ff0066',
    type: 'planet',
    modelPath: '/elements/wooden.glb',
    projects: [
      {
        title: 'Text-Centre (Live Fullstack NLP App)',
        description: 'A minimal, modern, and powerful suite of text utility tools designed for the modern web. Text Centre provides an all-in-one workspace for your daily text processing needs, from simple word counting to advanced AI-powered grammar correction.',
        tags: ['NLP', 'Web', 'Text Analytics', 'GenAI'],
        link: 'https://text-centre.vercel.app/'
      },
      {
        title: 'Jewellry Images & Video Generation',
        description: 'Client-based project generating high fidelity images and promotional videos of jewelry for social media using cutting-edge Generative AI models.',
        tags: ['GenAI', 'Computer Vision', 'Video Generation', 'Client Project'],
        link: 'https://www.instagram.com/tiash.jewels?igsh=MXQwMW9ndnU1bTgxYg=='
      },
      {
        title: 'English ↔ Dari Speech Translator',
        description: 'Built an MVP for English to Dari and Dari to English speech and text translation using libraries and models.',
        tags: ['Speech-to-Text', 'Translation', 'NLP']
      }
    ]
  },
  {
    id: 'research',
    name: 'IEEE Research Publication',
    description: 'Accepted in IEEE EDUCON 2025: "Predict Student Learning Using a Virtual Educational Game". Achieved 0.83 F1-score outperforming baselines using MLP/CNN/LSTM models.',
    position: [100, 0, -480],
    color: '#ffffff',
    type: 'planet',
    modelPath: '/elements/snow.glb',
    projects: [
      {
        title: 'IEEE EDUCON 2025: Predict Student Learning',
        description: 'Conducted research on predicting student performance through machine learning in a virtual educational game environment. Developed and evaluated six predictive models including KNN, Random Forest, MLP, CNN, and LSTM to analyze gameplay and clickstream data. Achieved an F1-score of 0.83 and accuracy of 0.74 using an MLP model.',
        tags: ['Research', 'IEEE', 'Education', 'MLP', 'LSTM']
      }
    ]
  },
  {
    id: 'experience',
    name: 'Experience & Qualifications',
    description: 'Jr. AI Engineer @ Elaunch Solutions. Internships @ Wellorgs, Tntra, and Pinnacle Works. Oracle Certified Java SE 11 Developer & AWS AI Scientist (2025).',
    position: [-45, 0, -600],
    color: '#444444',
    type: 'station',
    modelPath: '/elements/nature forest.glb',
    projects: [
      {
        title: 'Jr. AI Engineer @ Elaunch Solutions Pvt. Ltd',
        description: 'February 2025 - Present. Worked on Player churn prediction system, deployed multi-agent customer support chatbot, built robust orchestration pipelines, led development of agentic AI trading bot, enhanced image recognition system, developed chat reply recommendation engine, trained deep learning architectures for crypto price prediction, and built MVP for speech translation.',
        tags: ['AI Engineer', 'LangChain', 'LLMs', 'PyTorch']
      },
      {
        title: 'AI/ML Intern @ Wellorgs Infotech',
        description: 'Nov 2024 - Jan 2025. Developed StudyBot AI for IELTS and SSC exam modules. Built RESTful APIs with Flask, FastAPI, and Uvicorn integrating GPT and LLaMA models. Engaged in Prompt Engineering, NLP, and web scraping.',
        tags: ['Internship', 'FastAPI', 'GPT', 'LLaMA']
      },
      {
        title: 'AI/ML Intern @ Tntra Innovation',
        description: 'May 2024 - Aug 2024. Developed core modules for Shruti AI Engine. Implemented feature engineering, data validation, and RAG pipelines. Collaborated within Agile teams using Git, GitHub, JIRA.',
        tags: ['Internship', 'RAG', 'Agile']
      },
      {
        title: 'ASR Vetting Intern @ Pinnacle Works',
        description: 'June 2023 - July 2023. Validated ASR outputs for Super Bot. Performed quality control and data curation on NLP datasets.',
        tags: ['Internship', 'ASR', 'NLP']
      }
    ]
  },
  {
    id: 'contact',
    name: 'Contact & Leadership',
    description: 'Email: vishva3254@gmail.com | Phone: +91 9427120625. National-Level Athlete (Kho-Kho & Athletics), NSS Volunteer, and Team Leader for Women Startup Meet.',
    position: [0, 0, -750],
    color: '#00ffff',
    type: 'wormhole',
    modelPath: '/elements/dessert.glb'
  }
];

export const skills = {
  programming: ['Python', 'Basic Java'],
  ml: ['LLMs', 'LangChain', 'LangGraph', 'RAG', 'Deep Learning', 'NLP', 'Model Fine-tuning'],
  frameworks: ['Pandas', 'Numpy', 'PyTorch', 'Keras', 'TensorFlow', 'Scikit-learn', 'OpenCV', 'Transformers', 'Hugging-Face'],
  apis: ['FastAPI', 'Flask', 'Uvicorn', 'Gunicorn', 'RESTful API design', 'Postman'],
  databases: ['MySQL', 'NoSQL', 'MongoDB', 'Data Preprocessing', 'Feature Engineering', 'ETL Pipelines'],
  tools: ['VSCode', 'PyCharm', 'Google Colab', 'Hugging Face', 'LmArena', 'Jupyter', 'Git', 'Jira', 'Github', 'Antigravity']
};
