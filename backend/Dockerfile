FROM python:3

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		postgresql-client \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 443
RUN python ./api/manage.py migrate
CMD [ "python", "./api/manage.py", "runserver", "0.0.0.0:443" ]