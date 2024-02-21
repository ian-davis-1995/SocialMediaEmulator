## NodeJS Build Image
FROM cgr.dev/chainguard/node:latest-dev as node-builder

WORKDIR /app/

COPY ./digital_deception_emulator/frontend/emulator/public /app/public
COPY ./digital_deception_emulator/frontend/emulator/src /app/src
COPY ./digital_deception_emulator/frontend/emulator/.babelrc /app/
COPY ./digital_deception_emulator/frontend/emulator/package.json /app/
COPY ./digital_deception_emulator/frontend/emulator/webpack.config.js /app/

RUN npm i
RUN npm run build

## Python Build Image
FROM cgr.dev/chainguard/python:latest-dev as python-builder

ARG ARTIFACT_URL

WORKDIR /DigitalDeception/

COPY ./requirements.txt ./
COPY ./gcp.requirements.txt ./

RUN pip install -r requirements.txt --user
RUN pip install -r gcp.requirements.txt --user --extra-index-url $ARTIFACT_URL

## Main Server Image
FROM cgr.dev/chainguard/wolfi-base:latest

WORKDIR /DigitalDeception/

ARG GCSFUSE_ENABLED=0

RUN apk add --update gcsfuse python-3.12

COPY ./digital_deception.db /DigitalDeception/data/

ENV PYTHONPATH "${PYTHONPATH}:/DigitalDeception/:/DigitalDeception/site-packages/"
ENV PORT=5001
ENV BUCKET digital_deception_data
ENV MNT_DIR /DigitalDeception/data/

COPY ./digital_deception_emulator/frontend/assets ./digital_deception_emulator/frontend

# Move pip packages from builder
# Make sure you update Python version in path
COPY --from=python-builder /home/nonroot/.local/lib/python3.12/site-packages /DigitalDeception/site-packages/

# Move webpack build from builder
COPY --from=node-builder /app/dist ./digital_deception_emulator/frontend/emulator/dist

COPY ./digital_deception_emulator/frontend/assets ./digital_deception_emulator/frontend/assets
COPY ./digital_deception_emulator/frontend/templates ./digital_deception_emulator/frontend/templates
COPY ./digital_deception_emulator/__init__.py /DigitalDeception/digital_deception_emulator
COPY ./digital_deception_emulator/application.py /DigitalDeception/digital_deception_emulator
COPY ./digital_deception_emulator/backend /DigitalDeception/digital_deception_emulator/backend
COPY ./scripts/gcp/run_gcp_service.py ./run_server.py

EXPOSE $PORT

CMD ["python", "./run_server.py"]
