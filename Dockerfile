FROM node:latest
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN cd frontend && npm install && npm run build
EXPOSE 4000
CMD ["npm", "start"]