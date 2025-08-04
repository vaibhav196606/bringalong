FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE $PORT

# Start the server
CMD ["npm", "run", "server"]
