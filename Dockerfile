FROM node:21-alpine3.18 AS stage_one
WORKDIR /build
COPY /ExpenseCore/core .
RUN npm install 
RUN npm run build

FROM node:21-alpine3.18 AS stage_two
ARG PATH_DIR
ARG PATH_DEST
ARG CORE
ARG COMMAND
WORKDIR /build
WORKDIR ${CORE}
COPY --from=stage_one /build/ .
RUN ${COMMAND}
WORKDIR ${PATH_DIR}
COPY ${PATH_DEST} .
RUN npm install
RUN npm run build

FROM node:21-alpine3.18 AS production
ARG PATH_DIR
ARG SERVICE_PORT
WORKDIR /app
COPY --from=stage_two ${PATH_DIR}/dist .
EXPOSE ${SERVICE_PORT}
CMD ["node", "./main.js"]
