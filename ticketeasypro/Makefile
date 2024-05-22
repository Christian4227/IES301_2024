# Makefile

# Variáveis
DOCKER_COMPOSE := docker-compose

# Comandos

# Iniciar os serviços definidos no docker-compose.yaml
start:
	$(DOCKER_COMPOSE) up

# Parar os serviços definidos no docker-compose.yaml
stop:
	$(DOCKER_COMPOSE) down

# Executar migrações de banco de dados com o Prisma dentro do contêiner Docker
migrate:
	$(DOCKER_COMPOSE) exec backend npx prisma db push

# Rollback da última migração de banco de dados com o Prisma dentro do contêiner Docker
rollback:
	$(DOCKER_COMPOSE) exec backend npx prisma migrate reset

# Visualizar o status das migrações de banco de dados com o Prisma dentro do contêiner Docker
status:
	$(DOCKER_COMPOSE) exec backend npx prisma migrate status