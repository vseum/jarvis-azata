FROM node:20-alpine
WORKDIR /app
# ffmpeg — записи суфлёра в mp3 для игры (web/igra-voice.js)
RUN apk add --no-cache ffmpeg
COPY web/package.json web/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY web/ ./
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
USER node
CMD ["node", "server.js"]
