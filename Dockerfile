FROM cherrypy:latest

ENV PYTHONPATH "${PYTHONPATH}:/DigitalDeception/"

WORKDIR /DigitalDeception/

RUN apt-get update -y

RUN set -e; \
    apt-get update -y && apt-get install -y tini lsb-release; \
    gcsFuseRepo=gcsfuse-`lsb_release -c -s`; \
    echo "deb http://packages.cloud.google.com/apt $gcsFuseRepo main" | \
    tee /etc/apt/sources.list.d/gcsfuse.list; \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | \
    apt-key add -; \
    apt-get update; \
    apt-get install -y gcsfuse \
    && apt-get clean

COPY ./digital_deception_emulator/frontend /DigitalDeception/digital_deception_emulator/frontend

WORKDIR /DigitalDeception/digital_deception_emulator/frontend/emulator

RUN npm install --production
RUN npm run build

WORKDIR /DigitalDeception/

COPY ./requirements.txt /DigitalDeception/

RUN pip3 install -r requirements.txt

COPY ./digital_deception_emulator/__init__.py /DigitalDeception/digital_deception_emulator
COPY ./digital_deception_emulator/application.py /DigitalDeception/digital_deception_emulator
COPY ./digital_deception_emulator/backend /DigitalDeception/digital_deception_emulator/backend

EXPOSE 5001

CMD ["python3", "-m", "digital_deception_emulator.application", "--shared_data_location", "/digital_deception_data/", "--port", "5001", "--subdomain", "/digital-deception/", "--production"]
