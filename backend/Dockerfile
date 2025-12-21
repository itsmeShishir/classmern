# node Setup
FROM node:20-alpine

#set working directory
WORKDIR /app

#copy package.json and package-lock.json
COPY package*.json ./

#install dependencies
RUN npm install

#copy the rest of the application code
COPY . .

#Change ownership of the project files
RUN chown -R node:node /app

#switch to non-root user
USER node

#expose the application port
EXPOSE 5000

#start the application
CMD ["npm", "start"]