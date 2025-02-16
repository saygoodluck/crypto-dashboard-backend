# Base image
FROM node:23-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY /etc/letsencrypt/live/crypto-dashboard.site/cert.pem ./ssl
COPY /etc/letsencrypt/live/crypto-dashboard.site/privkey.pem ./ssl

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]