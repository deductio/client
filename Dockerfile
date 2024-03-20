FROM node:alpine AS builder 

WORKDIR /app
COPY package.json . 
COPY package-lock.json . 
RUN npm install 
COPY src src
COPY public public
COPY *.json ./
RUN npm run build 

FROM nginx:alpine AS production 
COPY nginx.conf .
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]