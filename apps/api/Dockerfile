FROM node:26-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/contract/package.json packages/contract/package.json
RUN npm ci --omit=dev --workspace apps/api --workspace packages/contract
RUN addgroup -S api && adduser -S api -G api
COPY --chown=api:api apps/api apps/api
COPY --chown=api:api packages/contract packages/contract
USER api
EXPOSE 8080
CMD ["node", "apps/api/src/main.ts"]
