FROM oven/bun:alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM httpd AS runtime
COPY --from=build /app/dist /usr/local/apache2/htdocs/
EXPOSE 80