up:
	docker compose up --build -d

build:
	docker compose build

down:
	docker compose down

clean:
	docker compose down --rmi all

ls:
	docker compose images ls
	docker compose ps
	docker volume ls
