# 第一階段：用 Maven 編譯打包
FROM maven:3.9.0-eclipse-temurin-17 AS builder

WORKDIR /app

# 複製 pom.xml 和 src 目錄
COPY pom.xml .
COPY src ./src

# 打包跳過測試，加快速度
RUN mvn clean package -DskipTests

# 第二階段：用 OpenJDK 執行 jar
FROM openjdk:17-slim

WORKDIR /app

# 從 builder 階段複製打包好的 jar
COPY --from=builder /app/target/shopping-0.0.1-SNAPSHOT.jar ./shopping.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "shopping.jar"]
