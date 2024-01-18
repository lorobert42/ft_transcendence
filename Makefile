up:
	docker-compose up --build -d

build:
	docker-compose build

down:
	docker-compose down

clean:
	docker system prune -a -f

ls:
	docker image ls
	docker ps
	docker volume ls
