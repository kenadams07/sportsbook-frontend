Write-Host "Cleaning up database and resetting schema..." -ForegroundColor Green

Write-Host "Stopping all services..." -ForegroundColor Yellow
Get-Process -Name "npm","node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Removing compiled files..." -ForegroundColor Yellow
Remove-Item -Path "user-service\dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "admin-service\dist" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Setting environment variables to disable synchronization..." -ForegroundColor Yellow
$env:DB_SYNCHRONIZE = "false"

Write-Host "Running TypeORM migrations to recreate database schema properly..." -ForegroundColor Yellow
Set-Location -Path "user-service"
npm run build

# Build the ormconfig.ts file first
npx typeorm migration:run -d ./ormconfig.ts

Set-Location ..

Write-Host "Database cleanup and reset complete!" -ForegroundColor Green
Write-Host "You can now start your services with DB_SYNCHRONIZE=false to prevent future issues." -ForegroundColor Cyan
Read-Host "Press Enter to continue"