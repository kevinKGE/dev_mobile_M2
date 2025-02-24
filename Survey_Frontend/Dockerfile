# Étape 1 : Construction de l'application Expo pour le web
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Génère la version web statique de l'application
RUN npx expo export:web

# Étape 2 : Servir les fichiers statiques avec Nginx
FROM nginx:alpine
# Copie le build statique dans le dossier de Nginx
COPY --from=builder /app/web-build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
