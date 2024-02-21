## NodeJS Build Image
FROM cgr.dev/chainguard/node:latest-dev as node-builder

WORKDIR /app/

COPY ./social_media_emulator/frontend/emulator/public /app/public
COPY ./social_media_emulator/frontend/emulator/src /app/src
COPY ./social_media_emulator/frontend/emulator/.babelrc /app/
COPY ./social_media_emulator/frontend/emulator/package.json /app/
COPY ./social_media_emulator/frontend/emulator/webpack.config.js /app/

RUN npm i
RUN npm run build

## Python Build Image
FROM cgr.dev/chainguard/python:latest-dev as python-builder

WORKDIR /DigitalDeception/

COPY ./cherrypy_utils ./cherrypy_utils

WORKDIR /DigitalDeception/cherrypy_utils

RUN pip install .

WORKDIR /DigitalDeception/

COPY ./requirements.txt ./

RUN pip install -r requirements.txt --user

## Main Server Image
FROM cgr.dev/chainguard/python:latest

WORKDIR /DigitalDeception/

ENV PYTHONPATH "${PYTHONPATH}:/DigitalDeception/:/DigitalDeception/site-packages/"
ENV PORT=8080
ENV MNT_DIR /DigitalDeception/data/

COPY ./social_media_emulator/frontend/assets ./social_media_emulator/frontend

# Move pip packages from builder
# Make sure you update Python version in path
COPY --from=python-builder /home/nonroot/.local/lib/python3.12/site-packages /DigitalDeception/site-packages/

# Move webpack build from builder
COPY --from=node-builder /app/dist ./social_media_emulator/frontend/emulator/dist

COPY ./social_media_emulator/frontend/assets ./social_media_emulator/frontend/assets
COPY ./social_media_emulator/frontend/templates ./social_media_emulator/frontend/templates
COPY ./social_media_emulator/__init__.py /DigitalDeception/social_media_emulator
COPY ./social_media_emulator/application.py /DigitalDeception/social_media_emulator
COPY ./social_media_emulator/backend /DigitalDeception/social_media_emulator/backend
COPY ./docker/run_server.py ./run_server.py

EXPOSE $PORT

CMD ["./run_server.py"]
