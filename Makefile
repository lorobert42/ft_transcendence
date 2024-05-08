up:
	docker compose -f compose.yaml -f compose.dev.yaml up --build -d
	docker compose run --rm backend sh -c "python manage.py makemigrations"
	docker compose run --rm backend sh -c "python manage.py migrate"
	docker compose run --rm backend sh -c "python manage.py collectstatic --no-input"

mac:
	docker compose up -f compose.yaml -f compose.dev.yaml --build -d
	docker compose run --rm backend sh -c "python manage.py makemigrations"
	docker compose run --rm backend sh -c "python manage.py migrate"
	docker compose run --rm backend sh -c "python manage.py collectstatic --no-input"

prod:
	docker compose -f compose.yaml -f compose.prod.yaml up --build -d

secret:
	python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

up_only:
	docker compose up -d

build:
	docker compose build

down:
	docker compose down --remove-orphans

lb:
	docker compose logs backend

migrate:
	docker compose run --rm backend sh -c "python manage.py makemigrations"

mig:
	docker compose run --rm backend sh -c "python manage.py migrate"

db:
	docker compose run --rm backend sh -c "python manage.py dbshell"

clean:
	docker compose down --remove-orphans --rmi all

fclean: clean
	docker volume ls -q | grep database-data | xargs -r docker volume rm
	docker volume ls -q | grep redis-data | xargs -r docker volume rm
	docker volume ls -q | grep django-static | xargs -r docker volume rm
	docker volume ls -q | grep django-media | xargs -r docker volume rm
	docker volume ls -q | grep django-app | xargs -r docker volume rm

test:
	docker compose run --rm backend sh -c "python manage.py test"

typo:
	docker compose run --rm backend sh -c "flake8"

logs:
	docker compose logs

ls:
	docker compose images
	docker compose ps
	docker volume ls
