FROM node:alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

# For development
CMD [ "npm", "run", "start:dev" ]

# For production
# CMD [ "npm", "run", "start:prod" ]