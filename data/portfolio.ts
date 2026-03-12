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
    description: 'Vishwa Patel - AI / Machine Learning Engineer from Surat, India. Passionate about building intelligent systems that solve real-world problems.',
    position: [0, 0, 0],
    color: '#00f2ff',
    type: 'planet'
  },
  {
    id: 'ai-agents',
    name: 'AI Agents Planet',
    description: 'Agentic AI systems and LLM orchestration.',
    position: [15, 5, -20],
    color: '#7000ff',
    type: 'planet',
    projects: [
      {
        title: 'Multi-Agent Customer Support Chatbot',
        description: 'Built using LangChain and LangGraph with multilingual orchestration.',
        tags: ['LangChain', 'LangGraph', 'Python']
      },
      {
        title: 'Agentic AI Trading Bot',
        description: 'LLM powered system that analyzes market data and generates trading insights.',
        tags: ['LLM', 'Finance', 'Agents']
      },
      {
        title: 'Chat Reply Recommendation System',
        description: 'NLP model using BERT to automatically suggest responses.',
        tags: ['BERT', 'NLP', 'PyTorch']
      }
    ]
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision Planet',
    description: 'Vision projects and image models.',
    position: [-20, -5, -40],
    color: '#00ffaa',
    type: 'planet',
    projects: [
      {
        title: 'Facial Recognition System',
        description: 'Image similarity detection using deep learning and OpenCV.',
        tags: ['OpenCV', 'Deep Learning']
      },
      {
        title: 'Real-Time Object Detection',
        description: 'YOLO based detection pipeline using PyTorch.',
        tags: ['YOLO', 'PyTorch', 'Real-time']
      }
    ]
  },
  {
    id: 'trading-ai',
    name: 'Trading AI Planet',
    description: 'Financial prediction and time series ML.',
    position: [25, -10, -60],
    color: '#ffcc00',
    type: 'planet',
    projects: [
      {
        title: 'Cryptocurrency Price Prediction',
        description: 'Deep learning models using GRU, LSTM and CNN architectures.',
        tags: ['LSTM', 'GRU', 'CNN', 'Finance']
      }
    ]
  },
  {
    id: 'speech-ai',
    name: 'Speech AI Planet',
    description: 'Speech recognition and translation.',
    position: [-10, 15, -80],
    color: '#ff0066',
    type: 'planet',
    projects: [
      {
        title: 'English ↔ Dari Speech Translator',
        description: 'Speech recognition and translation pipeline.',
        tags: ['Speech-to-Text', 'Translation']
      }
    ]
  },
  {
    id: 'research',
    name: 'Research Planet',
    description: 'IEEE research and experiments.',
    position: [5, -20, -100],
    color: '#ffffff',
    type: 'planet',
    projects: [
      {
        title: 'Predict Student Learning Using a Virtual Educational Game',
        description: 'IEEE EDUCON 2025 research. Models tested: KNN, Random Forest, MLP, CNN, LSTM. Best model achieved F1 score of 0.83.',
        tags: ['Research', 'IEEE', 'Education']
      }
    ]
  },
  {
    id: 'experience',
    name: 'Experience Station',
    description: 'Professional experience timeline.',
    position: [-30, 20, -120],
    color: '#444444',
    type: 'station'
  },
  {
    id: 'contact',
    name: 'Contact Wormhole',
    description: 'Connect with me via GitHub, LinkedIn or Email.',
    position: [0, 0, -150],
    color: '#00ffff',
    type: 'wormhole'
  }
];

export const skills = {
  programming: ['Python', 'Java'],
  ml: ['LLMs', 'LangChain', 'LangGraph', 'RAG', 'Deep Learning', 'NLP', 'Model Fine-tuning'],
  frameworks: ['PyTorch', 'TensorFlow', 'Keras', 'Transformers', 'Scikit-learn', 'OpenCV'],
  apis: ['FastAPI', 'Flask', 'REST APIs'],
  databases: ['MySQL', 'MongoDB', 'NoSQL'],
  tools: ['Git', 'Jupyter', 'HuggingFace', 'VSCode', 'PyCharm', 'Google Colab']
};
