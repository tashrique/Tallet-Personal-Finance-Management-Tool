# Use the official Node.js 16 image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the app port
EXPOSE 5000

# Set the command to start the app
CMD ["npm", "start"]
