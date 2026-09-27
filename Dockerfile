FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY --chown=node:node . .
RUN chown node:node /app && chown -R node:node /app/node_modules

ENV NODE_ENV=production
USER node

# Compile only after the deployment configuration has been mounted.
ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4000", "--strictPort"]
