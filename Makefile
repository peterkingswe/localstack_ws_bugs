SHELL := /bin/bash

APP_NAME=ls_bug_demo
AWS_REGION=us-west-2
ENV=ls_local
STACK=$(APP_NAME).$(ENV)
PULUMI_CONFIG_PASSPHRASE=test
PULUMI_BACKEND_URL=file://
ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY=test
AWS_SECRET_ACCESS_KEY=test
LOCALSTACK_HOSTNAME=localhost.localstack.cloud

.PHONY: all cleanup get-logs-aws run-test


# ==========
# Usage
# ==============================

# build everything && install dependencies
all: up install-iac-deps install-test-deps build-pulumi #run-test
# tears down everything
cleanup: down reset-iac remove-test-deps
# get the localstack logs
get-logs-aws:
	docker logs localstack -f
# run the test -> will come back as pass since we dont check for return but print from within lambda should show up in logs
run-test:
	export LOCALSTACK_HOSTNAME=$(LOCALSTACK_HOSTNAME); \
	source ./venv/bin/activate; \
	cd tests; \
	pytest -s;

#get-docker-logs:

# =======
# localstack aws profile
# ============================
# profile localstack config looks like this
#[profile localstack]
#region = us-west-2
#output = json
# ============================
# profile localstack credentials looks like this
#[localstack]
#aws_access_key_id = test
#aws_secret_access_key = test
# ============================
## TODO must have jq installed for usage
#get-logs-s3-on-object-created:
#	export AWS_REGION=$(AWS_REGION); MSYS_NO_PATHCONV=1 aws --profile localstack --endpoint-url=$(ENDPOINT) logs tail $(shell jq -rcM '.s3_on_object_created_lambda.name|"/aws/lambda/"+.' pulumi_output.json) --follow


# ========================================================================================================================
# Raw recipes
# ==============================
up:
	export LOCALSTACK_HOSTNAME=$(LOCALSTACK_HOSTNAME); \
	docker-compose up -d;

install-iac-deps:
	cd ./iac/ && yarn install;

build-pulumi:
	cd ./iac/; \
	export PULUMI_BACKEND_URL=$(PULUMI_BACKEND_URL); export PULUMI_CONFIG_PASSPHRASE=$(PULUMI_CONFIG_PASSPHRASE); export P_STACK=$(STACK); \
	pulumi stack init $(STACK) || pulumi stack select $(STACK); \
	pulumi config set aws_region $(AWS_REGION); \
	pulumi up -y -s $(STACK); \
	pulumi stack output -s $(STACK) -j > ./../pulumi_output.json;

down:
	docker-compose down -v; \
	docker system prune -f;

reset-iac:
	rm pulumi_output.json || true; \
	rm -rf ls_volume || true; \
	cd ./iac/ && rm -rf .pulumi Pulumi.*.ls_local.yaml node_modules || true;

install-test-deps:
	python3 -m venv --clear venv
	( \
	source ./venv/bin/activate;\
	python3 -m pip install --upgrade pip;\
	pip3 install -r requierments-test.txt;\
	);

remove-test-deps:
	rm -rf ./venv
