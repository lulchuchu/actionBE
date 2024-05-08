FROM node

WORKDIR /app

COPY package.json .

RUN npm install pm2 -g
RUN npm install

# Create log directory and file
RUN mkdir -p logs && touch logs/access.log

COPY . .

EXPOSE 80

ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=1411
ENV MONGO_CONNECTION_STRING=mongodb+srv://root:1411@cluster0.tfzlkyn.mongodb.net/
ENV LISTENING_PORT=80

CMD ["npm", "start"]
# CMD ["npm", "run", "start-pm2"]
# CMD ["npm", "run", "start-pm2-cluster"]

