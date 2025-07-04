# 第一階段：用 Maven 編譯打包
FROM maven:3.9.0-eclipse-temurin-17 AS builder

WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 第二階段：用完整 OpenJDK
FROM openjdk:17

WORKDIR /app

# 安裝字型與 X11 套件
RUN apt-get update && apt-get install -y \
    fonts-dejavu \
    libxext6 libxrender1 libxtst6 libxi6 \
    x11-utils x11-xserver-utils xfonts-base xfonts-100dpi xfonts-75dpi xfonts-scalable \
    && rm -rf /var/lib/apt/lists/*

# 環境變數
ENV JAVA_OPTS="-Djava.awt.headless=true"

# jar 複製與啟動
COPY --from=builder /app/target/shopping-0.0.1-SNAPSHOT.jar ./shopping.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar shopping.jar"]