# Étape 1 : Construction de l'application Expo pour le web
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Installe les dépendances web requises par Expo
RUN npx expo install react-native-web react-dom @expo/metro-runtime

# Génère la version web statique de l'application
RUN npx expo export:web

# Étape 2 : Servir les fichiers statiques avec Nginx
FROM nginx:alpine
COPY --from=builder /app/web-build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
