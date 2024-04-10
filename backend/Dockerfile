FROM python:3.9-alpine3.13
LABEL maintainer="Stuart Rapoport"

EXPOSE 8000
ARG DEV=false
ENV PYTHONUNBUFFERED 1
ENV PATH="/py/bin:$PATH"

COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt

RUN apk add --no-cache postgresql-client
# next two lines to get make to work on Stuart's mac
RUN apk add libffi
RUN apk add libffi-dev
RUN python -m venv /py && \
	/py/bin/pip install --upgrade pip && \
	apk add --update --no-cache --virtual .tmp-build-deps build-base postgresql-dev musl-dev && \
	/py/bin/pip install -r /tmp/requirements.txt && \
	/py/bin/pip install Pillow && \
	if [ "$DEV" = "true" ] ; then \
		/py/bin/pip install -r /tmp/requirements.dev.txt ; \
	fi && \
	rm -rf /tmp && \
	apk del .tmp-build-deps
RUN adduser --disabled-password --no-create-home django-user
USER django-user

WORKDIR /app
COPY ./app /app

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]