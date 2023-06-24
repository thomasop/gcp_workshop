# NodeJS and npm already installed in the base image
FROM node:lts

# Create app directory inside the container
WORKDIR /usr/src/app

# Copying the package.*json files to the container (to include lock file)
COPY package*.json ./

# ! you need to have built your code at this point
# installing production dependencies and code
RUN npm ci --omit=dev
COPY dist/src/. dist/.

EXPOSE 8080

CMD [ "npm", "run", "start" ]