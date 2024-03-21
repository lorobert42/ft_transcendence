FROM nginx:latest

COPY public /var/www/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

CMD [ "nginx", "-g", "daemon off;" ]