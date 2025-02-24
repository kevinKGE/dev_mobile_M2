# Étape 1 : Build de l'application Expo pour le web
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx expo export:web

# Étape 2 : Servir les fichiers statiques avec un serveur léger
FROM nginx:alpine
COPY --from=builder /app/web-build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
