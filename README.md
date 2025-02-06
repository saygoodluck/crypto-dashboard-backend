Full-Stack Application with NestJS, Redis, PostgreSQL, React, and Telegram Bot
Overview
This project is a full-stack application comprising:

scripts  
local

Pre
```
npm run i
```

Run backend 
```bash
docker compose -f docker-compose.local.yaml up -d --build
```
Run frontend 

Run database local (preferred because isn't creates volumes. all data will be delete after container stop)

Run redis server
```bash
docker run --name redis -p 6379:6379 -d redis
```