# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json tsconfig.json craco.config.ts ./
COPY package-lock.json ./

RUN npm install --frozen-lockfile

COPY . .

# Inject environment variables at runtime
ARG REACT_APP_API_URL
ARG REACT_APP_AUTH_URL

RUN REACT_APP_API_URL=$REACT_APP_API_URL REACT_APP_AUTH_URL=$REACT_APP_AUTH_URL yarn build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/build ./

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
