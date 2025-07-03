# 使用官方 OpenJDK 17 作為基底映像
FROM openjdk:17-slim

# 設定工作目錄
WORKDIR app

# 複製打包好的 jar 到容器中
COPY target/shopping.jar shopping.jar

# 對外暴露 8080 端口（Spring Boot 預設端口）
EXPOSE 8080

# 執行 Spring Boot jar
ENTRYPOINT [java, -jar, shopping.jar]