up:
	docker compose up --build -d

build:
	docker compose build

down:
	docker compose down
	docker volume ls -qf dangling=true | xargs --no-run-if-empty docker volume rm

clean:
	docker compose down --rmi all
	docker volume ls -qf dangling=true | xargs --no-run-if-empty docker volume rm

fclean: clean
	docker volume ls -q | grep database-data | xargs --no-run-if-empty docker volume rm

ls:
	docker compose images
	docker compose ps
	docker volume ls
