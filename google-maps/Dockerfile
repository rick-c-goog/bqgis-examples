FROM node:16 as build
RUN mkdir -p /usr/src/app

WORKDIR "/usr/app/"

COPY ["package.json", "yarn.lock*", "./"]
#RUN npm install --save-dev webpack
RUN yarn cache clean && yarn install --non-interactive --force

COPY . . 

RUN yarn build
EXPOSE 8080

CMD ["yarn", "start"]