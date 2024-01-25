up:
	docker compose up --build -d

build:
	docker compose build

down:
	docker compose down

clean:
	docker compose down --rmi all

fclean: clean
	docker volume rm transcendence_database-data 

ls:
	docker compose images ls
	docker compose ps
	docker volume ls
