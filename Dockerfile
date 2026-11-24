# Multi-stage Docker build for ScholarHub Spring Boot Backend
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom.xml and source code from backend directory
COPY backend/pom.xml .
COPY backend/src ./src

# Build production JAR
RUN mvn clean package -DskipTests

# Stage 2: Lightweight JRE runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
