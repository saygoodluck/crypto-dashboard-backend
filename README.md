Full-Stack Application with NestJS, Redis, PostgreSQL, React, and Telegram Bot
Overview
This project is a full-stack application comprising:

scripts

Pre
```
npm run i
```
Run database local (preferred because isn't creates volumes. all data will be delete after container stop)
```bash
docker compose -f docker-compose-db.local.yaml up -d --build
```
Run backend 
```bash
docker compose -f docker-compose.stage.yaml up -d --build
```
Frontend  
https://github.com/saygoodluck/crypto-dashboard-frontend
