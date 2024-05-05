FROM gradle:7.6.1-jdk17-alpine AS builder
WORKDIR /build
COPY . .
RUN gradle bootJar


FROM eclipse-temurin:17.0.5_8-jre-alpine
WORKDIR /app
COPY --from=builder /build/build/libs/*.jar /app/application.jar
CMD java -jar /app/application.jar