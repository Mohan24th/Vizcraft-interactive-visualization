# VizCraft

> Intelligent Full-Stack Data Visualization Platform

VizCraft is a full-stack data visualization system that transforms structured datasets into customizable, production-ready visual insights using an intelligent backend-driven architecture.

It enables users to upload datasets, automatically infer schema types, validate chart compatibility, and generate high-quality visualizations with minimal configuration.

The platform emphasizes:
- Automated schema detection
- Visualization compatibility validation
- Deterministic plot rendering
- Clean separation of frontend and backend responsibilities

##  Features

###  Data Upload
- CSV support
- Excel (.xlsx) support

###  Intelligent Processing
- Automatic numeric/categorical detection
- Column compatibility validation before rendering
- Backend-driven plot safety checks

###  Supported Visualizations
- Histogram  
- Scatter Plot  
- Bar Chart  
- Box Plot  
- Heatmap  
- Pairplot  

###  Customization Controls
- Color selection
- Histogram bin adjustment
- Marker size & style
- Transparency (alpha)
- Figure size configuration

###  Output
- Server-side image generation
- PNG streaming response
- Downloadable visualizations

###  Deployment Ready
- Docker support
- Docker Compose orchestration
- Decoupled frontend/backend architecture



##  Architecture

```
Frontend (React + Vite)
        ↓
FastAPI REST API
        ↓
Pandas (Data Processing)
        ↓
Matplotlib / Seaborn (Visualization Engine)
        ↓
PNG Image Response
```
### Backend Responsibilities
- Dataset parsing
- Schema inference
- Validation of visualization compatibility
- Plot rendering
- Image serialization

### Frontend Responsibilities
- User interaction
- Chart configuration
- Visualization compatibility feedback
- Plot rendering & download handling



##  Technology Stack

### Backend
- FastAPI
- Pandas
- Matplotlib
- Seaborn

### Frontend
- React (Vite)
- CSS

### Deployment
- Docker
- Docker Compose



##  Project Structure

```
vizcraft/
│
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── package.json
│
└── docker-compose.yml
```


##  Local Development

### 1️ Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:
```
http://localhost:8000
```



###  Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```


##  Run with Docker

```bash
docker-compose up --build
```

This command builds and starts both frontend and backend containers.

##  Future Enhancements

- User authentication & session management
- Persistent dataset storage
- Dashboard save/load capability
- Interactive plotting (Plotly integration)
- ML-based visualization recommendation engine
- Role-based access control



