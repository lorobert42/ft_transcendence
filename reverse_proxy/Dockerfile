FROM nginx:latest

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		openssl \
		# supervisor \
		# wget \
	&& rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/ssl
RUN openssl req -x509 -nodes \
    -out /etc/nginx/ssl/transcendence.crt \
    -keyout /etc/nginx/ssl/transcendence.key \
    -subj "/C=CH/ST=VD/L=Renens/O=42/OU=42/CN=42"

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# # Prometheus
# RUN wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
# RUN tar xvfz node_exporter-1.7.0.linux-amd64.tar.gz
# RUN mv node_exporter-1.7.0.linux-amd64/node_exporter node_exporter

# # Supervisor
# RUN mkdir -p /var/log/supervisor
# COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# EXPOSE 9100

# CMD [ "/usr/bin/supervisord" ]
CMD [ "nginx", "-g", "daemon off;" ]