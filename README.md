# FT_TRANSCENDENCE
1. Fill the information needed in [.env_example](.env_example)
2. Copy it as `.env`
3. Start with `make`

# COMMAND 
1. make         -> build and start
2. make mac     -> start without hot reloading, when not admin
3. make prod    -> deploy in production mode
4. make build   -> create the containers
5. make down    -> stop the containers
6. make clean   -> clean all the container
7. make fclean  -> clean all the container and remove the volume
8. make test    -> launch Django tests
9. make typo    -> run Flake8 on Django
10. make logs    -> print containers logs
11. make ls     -> show the images, containers and volumes

# COMMAND BACKEND
run all commands through docker compose docker-compose run --rm backend sh -c "python manage.py connectstatic"

3. create django project via docker ?? a bit strange docker compose run --rm backend sh -c "django-admin startproject app ."
4. create super users docker compose run --rm backend sh -c "python manage.py createsuperuser"
5. create a new project within the app docker compose run --rm backend sh -c "python manage.py startapp recipe"
6. after model updates docker compose run --rm backend sh -c "python manage.py makemigrations" docker compose run --rm backend sh -c "python manage.py migrate"
7. docker up docker compose up
8. import channels.layers channel_layer = channels.layers.get_channel_layer() from asgiref.sync import async_to_sync async_to_sync(channel_layer.send)('test_channel', {'type': 'hello'})     
   async_to_sync(channel_layer.receive)('test_channel')
9. docker compose run --rm backend sh -c 'python manage.py shell -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"'

# Board Miro
https://miro.com/app/board/uXjVN3xjpxg=/
