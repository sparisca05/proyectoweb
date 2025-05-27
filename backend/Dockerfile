FROM openjdk:19-jdk-alpine

# Instalar Maven
RUN apk add --no-cache maven

WORKDIR /app

# Copiar archivos de configuración de Maven primero para aprovechar cache de Docker
COPY pom.xml .

# Descargar dependencias
RUN mvn dependency:go-offline -B

# Copiar el código fuente
COPY src ./src

# Construir la aplicación
RUN mvn clean package -DskipTests

# Exponer el puerto
EXPOSE 8080

# Ejecutar la aplicación
CMD ["java", "-jar", "target/proyectoWeb-0.0.1-SNAPSHOT.jar"]