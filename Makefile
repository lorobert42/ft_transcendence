up:
	docker compose -f compose.yaml -f compose.dev.yaml up --build -d
	docker compose exec backend sh -c "python manage.py makemigrations"
	docker compose exec backend sh -c "python manage.py migrate"

mac:
	docker compose up --build -d
	docker compose exec backend sh -c "python manage.py makemigrations"
	docker compose exec backend sh -c "python manage.py migrate"

up_only:
	docker compose up -d

build:
	docker compose build

down:
	docker compose down

lb:
	docker compose logs backend

migrate:
	docker compose exec backend sh -c "python manage.py makemigrations"

mig:
	docker compose exec backend sh -c "python manage.py migrate"

db:
	docker compose run --rm backend sh -c "python manage.py dbshell"

clean:
	docker compose down --rmi all

fclean: clean
	docker volume ls -q | grep database-data | xargs --no-run-if-empty docker volume rm
	docker volume ls -q | grep redis-data | xargs --no-run-if-empty docker volume rm

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
