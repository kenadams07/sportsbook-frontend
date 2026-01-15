@echo off
echo Cleaning up database and resetting schema...

echo Stopping all services...
taskkill /f /im "npm" >nul 2>&1
taskkill /f /im "node" >nul 2>&1

echo Removing compiled files...
rmdir /s /q user-service\dist 2>nul
rmdir /s /q admin-service\dist 2>nul

echo Setting environment variables to disable synchronization...
set DB_SYNCHRONIZE=false

echo Running TypeORM migrations to recreate database schema properly...
cd user-service
npm run build

REM Build the ormconfig.ts file first
npx typeorm migration:run -d ./ormconfig.ts

cd ..

echo Database cleanup and reset complete!
echo You can now start your services with DB_SYNCHRONIZE=false to prevent future issues.
pause