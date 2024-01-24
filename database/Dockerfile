FROM postgres:bookworm

# RUN apt-get update \
# 	&& apt-get install -y --no-install-recommends \
# 		ca-certificates \
# 		wget \
# 		supervisor \
# 	&& rm -rf /var/lib/apt/lists/*

# # Prometheus
# RUN wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
# RUN tar xvfz node_exporter-1.7.0.linux-amd64.tar.gz
# RUN mv node_exporter-1.7.0.linux-amd64/node_exporter node_exporter

# # Supervisor
# RUN mkdir -p /var/log/supervisor
# COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# EXPOSE 5432
# EXPOSE 9100

# CMD [ "/usr/bin/supervisord" ]