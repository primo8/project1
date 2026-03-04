# Run Aquel Bridge System

Write-Host "Starting Aquel Bridge Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn main:app --reload --port 8000"

Write-Host "Starting Aquel Bridge Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "System is starting! Access the frontend at http://localhost:5173" -ForegroundColor Green
