FROM python:3.11

WORKDIR /app

# Copiar requirements primero (cache eficiente)
COPY requirements.txt .
RUN apt-get update && apt-get install -y netcat-openbsd
RUN pip install --no-cache-dir -r requirements.txt

# 🔥 ADD THIS → cache config (before downloading model)
ENV TRANSFORMERS_CACHE=/app/cache
ENV HF_HOME=/app/cache

# 🔥 ADD THIS → preload model (IMPORTANT)
RUN python -c "from transformers import AutoModelForImageClassification, AutoImageProcessor; \
AutoModelForImageClassification.from_pretrained('jetrxx/rd'); \
AutoImageProcessor.from_pretrained('jetrxx/rd')"

# Copiar todo el proyecto
COPY . .

# 🔥 Copiar entrypoint
COPY entrypoint.sh /entrypoint.sh

# 🔥 Dar permisos (dentro de Linux container)
RUN chmod +x /entrypoint.sh

EXPOSE 8000

# 🔥 Usar entrypoint en vez de CMD
ENTRYPOINT ["/entrypoint.sh"]