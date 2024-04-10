FROM python:alpine3.19
LABEL maintainer="Stuart Rapoport"

EXPOSE 8000
ARG DEV=false
ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt

RUN python -m pip install --upgrade pip && \
	apk add --update --no-cache --virtual .tmp-build-deps \
	build-base postgresql-dev musl-dev postgresql-client libffi libffi-dev && \
	python -m pip install -r /tmp/requirements.txt && \
	python -m pip install Pillow && \
	if [ "$DEV" = "true" ] ; then \
		python -m pip install -r /tmp/requirements.dev.txt ; \
	fi && \
	rm -rf /tmp && \
	apk del .tmp-build-deps

RUN adduser --disabled-password --no-create-home django-user
USER django-user

WORKDIR /app
COPY ./app /app
RUN mkdir -p media/user_avatars

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]