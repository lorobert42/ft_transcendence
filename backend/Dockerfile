FROM python:3

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		postgresql-client \
		# supervisor \
		# wget \
	&& rm -rf /var/lib/apt/lists/*

# # Prometheus
# RUN wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
# RUN tar xvfz node_exporter-1.7.0.linux-amd64.tar.gz
# RUN mv node_exporter-1.7.0.linux-amd64/node_exporter node_exporter

# # Supervisor
# RUN mkdir -p /var/log/supervisor
# COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# EXPOSE 9100
EXPOSE 443

RUN python ./api/manage.py migrate

# CMD [ "/usr/bin/supervisord" ]
CMD [ "python", "./api/manage.py", "runserver", "0.0.0.0:8000" ]