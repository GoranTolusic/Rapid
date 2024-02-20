FROM node:16.14.0

# Create books directory
WORKDIR /usr/src/sunbird

#copy application files to workdir
COPY . .

#install dependencies
RUN npm ci

# create DB, run migrations, seeders etc...
RUN npm run dockerInstall

#expose application port
EXPOSE 3000

#run application 
CMD [ "npm", "start" ]