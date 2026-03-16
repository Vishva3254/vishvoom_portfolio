export interface Project {
  title: string;
  description: string;
  tags: string[];
}

export interface PlanetData {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  color: string;
  projects?: Project[];
  type: 'planet' | 'station' | 'wormhole' | 'satellite';
}

export const planets: PlanetData[] = [
  {
    id: 'home',
    name: 'Home Planet',
    description: 'Vishwa Patel - AI / Machine Learning Engineer from Surat, India. Building AI systems, breaking them, improving them and repeating the cycle until something cool happens.',
    position: [0, 0, 0],
    color: '#00f2ff',
    type: 'planet'
  },
  {
    id: 'ai-agents',
    name: 'AI Agents Planet',
    description: 'Agentic AI systems and LLM orchestration.',
    position: [15, 0, -20],
    color: '#7000ff',
    type: 'planet',
    projects: [
      {
        title: 'Multi-Agent Customer Support Chatbot',
        description: 'Designed and deployed a multi-agent customer support chatbot for a casino platform using LangChain, LangGraph, Pydantic, and enabling LLM-powered RAG, multilingual conversations, and orchestration across 10+ systems.',
        tags: ['LangChain', 'LangGraph', 'Python', 'RAG']
      },
      {
        title: 'Agentic AI Trading Bot',
        description: 'Led development of an agentic AI trading bot, integrating LLMs with real-time market data for autonomous trading and decision-making.',
        tags: ['LLM', 'Finance', 'Agents']
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
    name: 'Computer Vision Planet',
    description: 'Vision projects and image models.',
    position: [-20, 0, -40],
    color: '#00ffaa',
    type: 'planet',
    projects: [
      {
        title: 'Facial Recognition System',
        description: 'Enhanced an image recognition system for facial matching across large datasets, significantly improving model accuracy.',
        tags: ['OpenCV', 'Deep Learning', 'Facial Recognition']
      }
    ]
  },
  {
    id: 'trading-ai',
    name: 'Trading AI Planet',
    description: 'Financial prediction and time series ML.',
    position: [25, 0, -60],
    color: '#ffcc00',
    type: 'planet',
    projects: [
      {
        title: 'Cryptocurrency Price Prediction',
        description: 'Trained and evaluated deep learning architectures (GRU, LSTM, GRU-LSTM hybrid, CNN) for cryptocurrency price prediction using TensorFlow and Keras, conducting comparative performance analysis.',
        tags: ['LSTM', 'GRU', 'CNN', 'Finance', 'TensorFlow']
      }
    ]
  },
  {
    id: 'speech-ai',
    name: 'Speech AI Planet',
    description: 'Speech recognition and translation.',
    position: [-10, 0, -80],
    color: '#ff0066',
    type: 'planet',
    projects: [
      {
        title: 'English ↔ Dari Speech Translator',
        description: 'Built an MVP for English to Dari and Dari to English speech and text translation using libraries and models.',
        tags: ['Speech-to-Text', 'Translation', 'NLP']
      },
      {
        title: 'ASR Vetting for Super Bot',
        description: 'Validated ASR (Automatic Speech Recognition) outputs for Super Bot, ensuring high transcription accuracy between audio inputs and generated text.',
        tags: ['ASR', 'Quality Control', 'NLP']
      }
    ]
  },
  {
    id: 'research',
    name: 'Research Planet',
    description: 'IEEE research and experiments.',
    position: [5, 0, -100],
    color: '#ffffff',
    type: 'planet',
    projects: [
      {
        title: 'Predict Student Learning Using a Virtual Educational Game',
        description: 'IEEE EDUCON 2025 research. Developed and evaluated six predictive models including KNN, Random Forest, MLP, CNN, and LSTM to analyze gameplay and clickstream data. Achieved an F1-score of 0.83 and accuracy of 0.74 using an MLP model.',
        tags: ['Research', 'IEEE', 'Education', 'MLP', 'LSTM']
      }
    ]
  },
  {
    id: 'experience',
    name: 'Experience Station',
    description: 'Professional experience timeline.',
    position: [-30, 0, -120],
    color: '#444444',
    type: 'station',
    projects: [
      {
        title: 'Jr. AI Engineer @ Elaunch Solutions Pvt. Ltd',
        description: 'February 2025 - Present. Worked on Player churn prediction system, deployed multi-agent customer support chatbot, built robust orchestration pipelines, led development of agentic AI trading bot, enhanced image recognition system, developed chat reply recommendation engine, trained deep learning architectures for crypto price prediction, and built MVP for speech translation.',
        tags: ['AI Engineer', 'LangChain', 'LLMs', 'PyTorch']
      },
      {
        title: 'AI/ML Intern @ Wellorgs Infotech Pvt. Ltd.',
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
    name: 'Contact Wormhole',
    description: 'Connect with me via GitHub, LinkedIn or Email. Email: vishva3254@gmail.com | Phone: +91 9427120625',
    position: [0, 0, -150],
    color: '#00ffff',
    type: 'wormhole'
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
