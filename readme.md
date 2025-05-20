# Project Setup Instructions

## Backend Setup
1. Create and activate Python virtual environment:
python3 -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

2. Install Python dependencies:
pip install -r requirements.txt

## Frontend Setup
1. Navigate to frontend directory:
cd frontend

2. Install Node.js dependencies:
npm install

## Running the Application
You'll need two terminal windows to run both servers.

Terminal 1 - Frontend:
cd frontend
npm run dev
Frontend will be at http://localhost:5173

Terminal 2 - Backend:
# Make sure virtual environment is activated
python3 run.py
Backend will be at http://localhost:5000

## Project Structure
/frontend - Vite.js frontend application
/backend - Flask backend application
requirements.txt - Python dependencies
run.py - Backend entry point

## Required Software
- Python 3.x
- Node.js & npm
- PostgreSQL

## Database Config
PostgreSQL database settings:
- Database: hello_world
- User: student
- Password: rpstudent
- Host: 34.125.49.223
- Port: 5432
