import subprocess
import pathlib

from setuptools import find_packages, setup

frontend = pathlib.Path("digital_deception_emulator", "frontend")


def install_and_build(path):
    subprocess.run(["npm", "install"], cwd=path, capture_output=True)
    subprocess.run(["npm", "run-script", "build"], cwd=path, capture_output=True)


print("Building ReactJS Frontend for Social Media Emulator...")
install_and_build(frontend.joinpath("emulator"))

print("Building ReactJS Frontend for RSPAN Task")
install_and_build(frontend.joinpath("rspan"))

setup(
    name="digital_deception_emulator",
    packages=find_packages(),
    version="0.7.18",
    description="Cherrypy web server plugin for the digital deception emulator backend",
    author="Me",
    license="MIT",
    include_package_data=True,
    install_requires=[
        "cherrypy",
        "python-ldap",
        "sqlalchemy",
        "jinja2",
    ],
)
