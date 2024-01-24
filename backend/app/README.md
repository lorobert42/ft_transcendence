# transcendence

run all commands through docker compose
docker-compose run --rm backend sh -c "python manage.py connectstatic"

#lint files
docker compose run --rm backend sh -c "flake8"

#create django project via docker ?? a bit strange
docker compose run --rm backend sh -c "django-admin startproject app ."

#create super users
docker compose run --rm backend sh -c "python manage.py createsuperuser"

#create a new project within the app
docker compose run --rm backend sh -c "python manage.py startapp recipe"

#after model updates
docker compose run --rm backend sh -c "python manage.py makemigrations"
docker compose run --rm backend sh -c "python manage.py migrate"

#docker up
docker compose up

import channels.layers
channel_layer = channels.layers.get_channel_layer()
from asgiref.sync import async_to_sync
async_to_sync(channel_layer.send)('test_channel', {'type': 'hello'})
async_to_sync(channel_layer.receive)('test_channel')

# transtemp
