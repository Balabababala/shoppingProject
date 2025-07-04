# 第一階段：用 Maven 編譯打包
FROM maven:3.9.0-eclipse-temurin-17 AS builder

WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 第二階段：用完整 OpenJDK
openjdk17-jdk-slim

WORKDIR /app

# 安裝最基本的字型與 fontconfig，Kaptcha 需要
RUN apt-get update && \
    apt-get install -y --no-install-recommends fonts-dejavu fontconfig && \
    rm -rf /var/lib/apt/lists/*


# 環境變數
ENV JAVA_OPTS="-Djava.awt.headless=true"

# jar 複製與啟動
COPY --from=builder /app/target/shopping-0.0.1-SNAPSHOT.jar ./shopping.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar shopping.jar"]