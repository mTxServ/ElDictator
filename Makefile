FIG=docker-compose
RUN=$(FIG) exec -T
EXEC=$(FIG) exec -Tx

.PHONY: help start stop build up reset

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  reload   clear cache, reload database schema and load fixtures (only for dev environment)"

##
## Docker
##---------------------------------------------------------------------------

start:          ## Install and start the project
start: build up

stop:           ## Remove docker containers
	$(FIG) kill
	$(FIG) rm -v --force

reset:          ## Reset the whole project
reset: stop start

build:
	$(FIG) build

up:
	$(FIG) up -d
