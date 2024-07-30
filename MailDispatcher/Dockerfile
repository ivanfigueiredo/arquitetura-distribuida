FROM maven:3.9.0 AS maven
WORKDIR /build
COPY . .
RUN mvn clean
RUN mvn package

FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=maven /build/core/target/*.jar app.jar
EXPOSE 8081
CMD java -jar /app/app.jar