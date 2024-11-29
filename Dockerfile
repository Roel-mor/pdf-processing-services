# Use official Node.js image as the base
FROM node:16

# Install Ghostscript
RUN apt-get update && \
    apt-get install -y ghostscript

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app
RUN npm install

# Copy the rest of your application code
COPY . /app

# Expose port for the app (Adjust according to your setup)
EXPOSE 3000

# Command to run the app
CMD ["node", "index.js"]

