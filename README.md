# Overview

This is the CherryPy-based web server hosting the Digital Deception research projects, primarily the Social Media Emulator.
It also houses the web based implementations of the Oswald Shortened Reading Span and (WIP) Operation Span tasks.
It is currently hosted on MindModeling as part of a larger web server project, OnlineExperiments: https://git.mindmodeling.org/ian.davis/OnlineExperiments

## Getting Started

To get started developing with this repository, follow this checklist:

1. Ensure you have python 3.6+ installed, along with `pip`.
1. Clone the repository. `git clone https://git.mindmodeling.org/ian.davis/DigitalDeceptionEmulator.git`
1. Install the `cherrypy_utils` python package. This should have been provided to you as a zip or git repository.
1. Install third party required packages: `pip install -r requirements.txt`.
1. Build the reactjs bundle: `cd digital_deception_emulator/frontend/emulator/; npm run build`
1. Ensure your PYTHONPATH environment variable includes the root of the git repository (the location of this README).
    1. If you are using VSCode, the integrated terminal and run configurations should be configured to include the correct pythonpath automatically.
1. Running the web server for just this project can be done with this command: `python digital_deception_emulator/application.py`
