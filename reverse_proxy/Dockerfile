FROM nginx:latest

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		openssl \
	&& rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/ssl
RUN openssl req -x509 -nodes \
    -out /etc/nginx/ssl/transcendence.crt \
    -keyout /etc/nginx/ssl/transcendence.key \
    -subj "/C=CH/ST=VD/L=Renens/O=42/OU=42/CN=42"

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD [ "nginx", "-g", "daemon off;" ]