# Models Dashboard

A full-stack dashboard for exploring and comparing machine learning training metrics. Built with **React, Chart.js, FastAPI, and MongoDB**, it combines an overview of model records with detailed accuracy and loss comparisons.

The repository includes synthetic example records for computer vision categories such as 3D object detection, sign detection, obstacle detection, and lane detection. It visualizes stored metrics; it does not train, serve, or benchmark the named models.

## Features

### Overview dashboard

- Total number of filtered model records.
- Model distribution by category, shown in a pie chart.
- Average final accuracy and loss.
- Top three models ranked by final accuracy.
- Distribution of records by GPU label in a doughnut chart.
- Total and average training time, displayed in hours.

### Comparison view

- Select individual models or all currently filtered models.
- Search model names.
- Filter the model list by category and training date.
- Compare accuracy and loss curves across epochs.
- Compare final accuracy and loss in bar charts.
- Show or hide the four comparison charts independently.

The GPU chart counts records associated with each GPU label; it is not live GPU utilization monitoring.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite 6, JavaScript, Axios |
| Charts | Chart.js 4, react-chartjs-2 |
| API | FastAPI, Pydantic, Uvicorn |
| Database access | MongoDB, Motor for the API, PyMongo for seeding |
| Example data | NumPy, Python datetime |

## Repository structure

| Path | Purpose |
| --- | --- |
| `main.py` | FastAPI application, model listing, comparison endpoint, async database client |
| `link_mongoDB.py` | Synchronous MongoDB connection used by the seed script |
| `insert_data.py` | Generate synthetic records and replace the collection contents |
| `Models_dashboard/package.json` | Frontend dependencies and scripts |
| `Models_dashboard/src/App.jsx` | Dashboard, charts, filters, and model selection |
| `Models_dashboard/src/main.jsx` | Active React entry point |
| `Models_dashboard/src/index.css` | Global styles |
| `Models_dashboard/vite.config.js` | Vite configuration |

## Local setup

### Requirements

- Python with virtual environment support.
- Node.js and npm compatible with the supplied frontend packages; Node.js 22 is a reasonable starting point.
- A running MongoDB server reachable at `mongodb://localhost:27017`.

The following setup is derived from the source and has not been verified through a full application run. The archive has no backend requirements file or frontend lockfile.

### 1. Clone the project

```bash
git clone https://github.com/ShacMuSe/Models_Dashboard.git
cd Models_Dashboard
```

Alternatively, extract the ZIP and open its root directory, containing `main.py`.

### 2. Install Python dependencies

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Linux/macOS:

```bash
source .venv/bin/activate
```

Then install the imported backend and seed-script dependencies:

```bash
python -m pip install fastapi uvicorn motor pymongo numpy
```

This installs unpinned packages. After establishing a working environment, record compatible versions for reproducible setup.

### 3. Start MongoDB and optionally seed demo data

Ensure MongoDB is running before continuing. Both Python connection files use:

```text
URI: mongodb://localhost:27017
Database: models_db
Collection: models
```

For a disposable local demo database, populate the collection:

```bash
python insert_data.py
```

**This script deletes every document in `models_db.models` before inserting its sample records.** Do not run it against data you want to retain. Review or change its target database first if necessary.

The script generates 12 records, each with 100 accuracy values and 100 loss values. Curves are generated mathematically with NumPy, GPU labels are illustrative, and dates are relative to the day the script runs. These are demonstration values, not measured training results.

### 4. Start the API

From the repository root:

```bash
python -m uvicorn main:app --reload --port 8000
```

Local endpoints:

- API: `http://localhost:8000`
- Interactive API documentation: `http://localhost:8000/docs`
- Model records: `http://localhost:8000/models`

Keep the backend terminal running.

### 5. Start the frontend

Open another terminal at the repository root:

```bash
cd Models_dashboard
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. The frontend currently sends requests to the hard-coded API address `http://localhost:8000`.

## Using the dashboard

1. Open the overview using the dashboard icon in the left sidebar.
2. Choose a project category and date range in the right sidebar.
3. Inspect counts, final-metric averages, rankings, GPU labels, and training-time totals.
4. Switch to the analytics view using the second sidebar icon.
5. Search and select models to compare.
6. Toggle Training Accuracy, Training Loss, Final Accuracy, and Final Loss charts as needed.

## API reference

### `GET /models`

Returns every document in the `models` collection, with MongoDB IDs serialized as strings.

Each record contains:

| Field | Expected value |
| --- | --- |
| `_id` | MongoDB document ID serialized as a string |
| `name` | Model name, used as the selection identifier |
| `category` | Project/category label |
| `epochs` | Number of epochs |
| `accuracy` | Array of per-epoch accuracy values; UI expects percentages |
| `loss` | Array of per-epoch loss values |
| `training_time` | Training duration, interpreted by the UI as hours |
| `gpu_used` | GPU label |
| `training_date` | Date string, e.g. `2025-02-06` |

### `POST /compare`

Request body:

```json
{
  "models": ["VIT", "LaneNet"]
}
```

Returns an object with `epochs: 100` plus an entry for each matching model name containing its `accuracy` and `loss` arrays.

## Frontend commands

Run these inside `Models_dashboard/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Generate production frontend files in `dist/` |
| `npm run preview` | Preview the production frontend build locally |
| `npm run lint` | Run the configured ESLint checks |

## Configuration and deployment

No `.env` loading is implemented in the current application.

- Change the MongoDB URI in both `main.py` and `link_mongoDB.py` if using a different database.
- Change the Axios URLs in `Models_dashboard/src/App.jsx` if the API is hosted elsewhere.
- For a frontend-only hosting service, the frontend root is `Models_dashboard`, build command is `npm run build`, and output directory is `dist`.
- Host the FastAPI backend and MongoDB separately. A deployed frontend pointing to `localhost:8000` would attempt to reach the visitor's own computer.
- Restrict the current permissive CORS configuration to the intended frontend origin before public deployment, and add access controls if records should not be public.
