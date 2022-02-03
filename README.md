# Overview

This is the CherryPy-based web server hosting the Digital Deception research projects, primarily the Social Media Emulator.
It also houses the web based implementations of the Oswald Shortened Reading Span and (WIP) Operation Span tasks.
It is currently hosted on MindModeling as part of a larger web server project, OnlineExperiments: https://git.mindmodeling.org/ian.davis/OnlineExperiments

## Getting Started

To get started developing with this repository, follow this checklist:

1. Clone the repository. `git clone https://git.mindmodeling.org/ian.davis/DigitalDeceptionEmulator.git`
1. Install pipenv. `pip install pipenv`
1. Setup the pipenv environment. `pipenv install`. This will install all required packages.
1. Now, to ensure you are running the pipenv environment python, `pipenv shell` which will activate pipenv for your terminal session.
1. Running the web server for just this project can be done with this command: `python digital_deception_emulator/application.py`

This project is also packaged up and can be installed and ran by simply using pip!

1. Clone the repository. `git clone https://git.mindmodeling.org/ian.davis/DigitalDeceptionEmulator.git`
1. Install the repository using pip: `pip install .`
1. Run the application: `python -m digital_deception_emulator.application`
1. Enjoy!
