# Stage 1: build stage

# Base image
FROM node:22 AS builder

# Create app directory
WORKDIR /redqueen-backend

# Now get the monorepo's package files
COPY package*.json ./

# Copy the RedQueen data layer dependency first
COPY ./redqueen-data /redqueen-backend/redqueen-data

# Now copy the RedQueen API source
COPY ./redqueen-api /redqueen-backend/redqueen-api

# Install NestJS CLI
RUN npm i -g @nestjs/cli

# Install redqueen-data's dependencies
WORKDIR /redqueen-backend/redqueen-data
COPY package-lock.json ./
RUN npm ci
RUN rm -f ./package-lock.json

# Build redqueen-data
WORKDIR /redqueen-backend
RUN npm run build --workspace @redqueen-backend/redqueen-data

# Install redqueen-api's dependencies
RUN npm ci

# Build the API layer
RUN npm run build --workspace @redqueen-backend/redqueen-api

# Stage 2: package (runtime)
FROM node:22-slim
WORKDIR /redqueen-backend
COPY --from=builder /redqueen-backend .

# Start the server
CMD ["node", "redqueen-api/dist/src/main.js"]
