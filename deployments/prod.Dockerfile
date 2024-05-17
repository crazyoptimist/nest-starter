# Use a Node.js base image with the desired version
FROM node:20-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Use a separate stage to build the TypeScript code
FROM base AS build

# Install the prod and dev dependencies
RUN npm install --include=dev

# Copy the entire project to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Remove the dependencies folder
RUN rm -rf node_modules

# Use a final stage to package the built code into a smaller image
FROM base AS prod

# Install the prod dependencies only
RUN npm install --omit=dev --ignore-scripts

# Build bcrypt package - this is an issue with bcrypt
RUN cd node_modules/bcrypt && \
    npm install --omit=dev && \
    cd ../..

# Copy the compiled code from the build stage to the working directory
COPY --from=build /app .

# Set the Node.js env to production
ENV NODE_ENV production

# Expose the port that the application listens on
EXPOSE 8080

# Set a non-root user to run the application
USER node

# Run the application when the container starts
CMD ["npm", "run", "start:prod"]
