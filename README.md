# VizCraft

VizCraft is an intelligent full-stack data visualization platform that turns structured datasets into visual insights with minimal configuration.

Users can upload CSV or Excel datasets, automatically analyze their structure, generate AI-assisted insights, create visualizations through natural-language requests or manual configuration, and export the resulting charts.

## Live Application

https://vizcraft-visualization.vercel.app/

## Overview

VizCraft combines deterministic data processing with AI-assisted visualization.

The platform automatically:

- Parses uploaded datasets
- Detects numeric and categorical columns
- Profiles dataset quality and structure
- Generates dataset-level insights
- Validates chart configurations before rendering
- Converts natural-language requests into chart configurations
- Generates visualizations on the backend
- Provides downloadable chart outputs

The goal is to make data exploration accessible without requiring users to manually configure every aspect of a visualization.

## Core Features

### Dataset Upload

Upload structured datasets directly through the web interface.

Supported formats:

- CSV
- Excel (`.xlsx`, `.xls`)

After upload, VizCraft identifies the dataset structure and prepares it for analysis.

### Dataset Profiling

VizCraft automatically analyzes uploaded datasets and provides:

- Row and column counts
- Numeric and categorical column detection
- Missing-value analysis
- Duplicate-row detection
- Numeric statistics
- Categorical summaries
- Correlation analysis
- Dataset quality scoring
- Dataset-type detection

### AI Data Insights

The platform generates AI-assisted observations from the dataset profile.

Insights are organized into:

- Overview
- Data Quality
- Patterns
- Recommendations

The AI receives a lightweight dataset context rather than the complete dataset, reducing unnecessary data transfer and keeping the visualization pipeline efficient.

### Natural-Language Visualization

Users can describe the visualization they want using plain English.

Examples:

```text
Show the value by year as a line chart
```

```text
Compare value across industries
```

```text
Create a histogram of value
```

VizCraft analyzes the dataset schema and converts the request into a validated chart configuration.

The generated configuration contains:

- Chart type
- X-axis column
- Y-axis column
- Optional grouping column

The backend validates the configuration before generating the visualization.

### Manual Visualization Builder

Users can also configure visualizations manually by selecting:

- Chart type
- X-axis
- Y-axis
- Color
- Marker
- Point size
- Line width
- Transparency
- Histogram bins

### Supported Visualizations

VizCraft currently supports:

- Bar Chart
- Line Chart
- Scatter Plot
- Histogram
- Box Plot
- Heatmap
- Pair Plot

Additional chart types can be added through the backend visualization engine.

### Smart Recommendations

VizCraft analyzes the dataset schema and recommends potentially useful visualizations based on the available columns and their detected types.

Users can select recommended charts and generate them directly.

### Dataset Preview

Users can inspect the first rows of the uploaded dataset when required rather than displaying the complete dataset by default.

### Export

Generated visualizations can be exported as:

- PNG
- PDF

## Architecture

```text
                         VizCraft
                            |
             +--------------+--------------+
             |                             |
        React Frontend                FastAPI Backend
             |                             |
             |                    +--------+--------+
             |                    |                 |
             |               Dataset Layer      AI Layer
             |                    |                 |
             |                 Pandas          Gemini API
             |                    |                 |
             |                    +--------+--------+
             |                             |
             |                     Visualization Engine
             |                             |
             |                    Matplotlib / Seaborn
             |                             |
             +------------- REST API -------+
```

## Application Flow

```text
Upload Dataset
      |
      v
Dataset Validation
      |
      v
Schema Detection
      |
      v
Dataset Profiling
      |
      +--------------------+
      |                    |
      v                    v
AI Data Insights     Visualization
                          |
              +-----------+-----------+
              |                       |
              v                       v
       Natural Language        Manual Builder
              |                       |
              v                       |
       AI Chart Configuration         |
              |                       |
              +-----------+-----------+
                          |
                          v
                  Backend Validation
                          |
                          v
                  Plot Generation
                          |
                          v
                    Visualization
                          |
                          v
                    Export / Download
```

## AI Architecture

VizCraft uses AI selectively rather than sending the complete dataset to the language model.

The general flow is:

```text
Dataset
   |
   v
Pandas Profiling
   |
   v
Lightweight Dataset Context
   |
   v
Gemini
   |
   +----------------------+
   |                      |
   v                      v
AI Insights        Chart Configuration
                          |
                          v
                   Backend Validation
                          |
                          v
                    Plot Generation
```

For natural-language visualization, Gemini does not generate the actual chart.

Instead, it interprets the user's request and returns a structured chart configuration.

For example:

```json
{
  "chart_type": "line",
  "x": "Year",
  "y": "Value",
  "hue": null
}
```

The backend then validates the configuration and uses the deterministic visualization engine to generate the actual chart.

This separation keeps AI responsible for interpretation while keeping data processing, validation, and rendering under application control.

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Framer Motion

### Backend

- Python
- FastAPI
- Pandas
- Matplotlib
- Seaborn

### AI

- Google Gemini API

### Deployment

- Vercel for the frontend
- FastAPI-compatible backend hosting

## Project Structure

```text
VizCraft/
|
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── api/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
|
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   ├── storage/
│   │   └── utils/
│   ├── requirements.txt
│   └── ...
|
└── README.md
```

## Local Development

### Backend

Create and activate a virtual environment:

```bash
cd backend

python -m venv ai_env
source ai_env/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables, including the Gemini API key if AI features are enabled.

Start the backend:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

### Frontend

Install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

Configure the frontend API endpoint through:

```text
VITE_API_BASE_URL
```

## API Responsibilities

The backend is responsible for:

- Dataset upload and loading
- Dataset profiling
- Schema detection
- Visualization validation
- AI insight generation
- Natural-language visualization interpretation
- Chart recommendation generation
- Plot rendering
- Image generation and serving

The frontend is responsible for:

- User interaction
- Dataset upload interface
- Dataset summaries
- AI insight presentation
- Natural-language visualization requests
- Chart configuration
- Visualization preview
- Export controls
- Dataset preview

## Design Principles

VizCraft follows a separation-of-concerns approach:

**AI interprets.**

**Python analyzes.**

**Validation protects.**

**Matplotlib and Seaborn render.**

**React presents.**

This prevents the language model from directly controlling the visualization engine and keeps chart generation deterministic and reproducible.

## Current Limitations

- Dataset storage is currently application-managed rather than a persistent user workspace.
- AI features depend on Gemini API availability and quota.
- Visualization output is currently server-rendered rather than fully interactive.
- Authentication and multi-user workspaces are not currently implemented.
- Large datasets may require additional optimization for more complex visualizations.

## Future Improvements

Planned improvements include:

- Persistent user workspaces
- Authentication and authorization
- Saved dashboards
- Interactive Plotly visualizations
- Advanced visualization recommendation models
- Visualization history
- Dataset versioning
- Dashboard sharing
- Background processing for large datasets
- Improved AI-assisted exploratory analysis
