up:
	docker compose up --build -d

build:
	docker compose build

down:
	docker compose down

clean:
	docker compose down --rmi all

fclean: clean
	docker volume ls -q | grep database-data | xargs --no-run-if-empty docker volume rm
	docker volume ls -q | grep backend-source-code | xargs --no-run-if-empty docker volume rm

ls:
	docker compose images
	docker compose ps
	docker volume ls
