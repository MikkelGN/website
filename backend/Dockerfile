# ---- Dev stage (used by docker-compose.override.yml) ----
FROM maven:3.9-eclipse-temurin-21 AS dev
WORKDIR /app
EXPOSE 8080
CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.jvmArguments=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"]

# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first (layer cache)
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B package -DskipTests

# ---- Production stage ----
FROM eclipse-temurin:21-jre-alpine AS production
WORKDIR /app
RUN addgroup -S wordblitz && adduser -S wordblitz -G wordblitz
COPY --from=build /app/target/*.jar app.jar
RUN chown wordblitz:wordblitz app.jar
USER wordblitz
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
