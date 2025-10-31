# Sistema en donde se hace la app
FROM node:24.5.0-alpine
#Directorio en donde runea la app, se crea uno nuevo
WORKDIR /WEB
#Copia los archivos con los requerimientos específicamente para que Docker no tenga que volver a instalar todas las dependencias.
COPY package.json ./
COPY package-lock.json ./

# Copia a dicho directorio todo lo necesario
COPY . .
#Ejecuta este comando al final para instalar las dependencias
RUN npm install
#Documenta que usará el puerto 5173 (el puerto del contenedor definido en el docker compose)
EXPOSE 5173
# Lo que se debe ejecutar cuando arranque el docker
CMD ["npm", "run", "dev"]

