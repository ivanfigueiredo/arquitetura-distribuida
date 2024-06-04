FROM maven:3.9.0 AS maven
ARG APP_BUILD
WORKDIR /build
COPY . .
RUN mvn clean
RUN mvn package

FROM eclipse-temurin:17-jdk-jammy
ARG APP_BUILD
WORKDIR /app
COPY --from=maven /build/${APP_BUILD}/core/target/*.jar app.jar
EXPOSE 8081
CMD java -jar /app/app.jar