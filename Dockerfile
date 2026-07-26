# Use an official Node runtime as a parent image
# FROM node:18-alpine|
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files first to leverage Docker's cache layers
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend source code
COPY . .

# Expose the port your backend runs on (e.g., 5000)
EXPOSE 5000

# Command to run your app
CMD ["npm", "start"]