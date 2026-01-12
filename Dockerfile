FROM alpine:latest AS pb_builder

RUN apk add --no-cache \
    go

COPY database /database
RUN cd /database && go build .

FROM oven/bun:latest AS nuxt_builder

COPY . /nuxt
RUN cd /nuxt && bun i && bun run generate

FROM alpine:latest

COPY --from=pb_builder /database/database /app/pocketbase
COPY --from=nuxt_builder /nuxt/.output/public /pb_public

CMD ["/app/pocketbase", "serve", "--http=0.0.0.0:8080"]
