up:
	docker compose up --build -d

up_only:
	docker compose up -d

build:
	docker compose build

down:
	docker compose down

test:
	docker compose run --rm backend sh -c "python manage.py test"

migrate:
	docker compose run --rm backend sh -c "python manage.py makemigrations"

mig:
	docker compose run --rm backend sh -c "python manage.py migrate"

db:
	docker compose run --rm backend sh -c "python manage.py dbshell"

clean:
	docker compose down --rmi all

fclean: clean
	docker volume ls -q | grep database-data | xargs --no-run-if-empty docker volume rm
	docker volume ls -q | grep backend-source-code | xargs --no-run-if-empty docker volume rm

typo:
	docker compose run --rm backend sh -c "flake8"

ls:
	docker compose images
	docker compose ps
	docker volume ls
