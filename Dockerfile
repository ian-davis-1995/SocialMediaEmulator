FROM cherrypy:latest

ENV PYTHONPATH "${PYTHONPATH}:/DigitalDeception/"

WORKDIR /DigitalDeception/

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

CMD ["python3.6", "-m", "digital_deception_emulator.application", "--shared_data_location", "/digital_deception_data/", "--port", "5001", "--subdomain", "/digital-deception/", "--production"]
