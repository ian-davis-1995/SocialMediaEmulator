import subprocess
import pathlib

from setuptools import find_packages, setup
from setuptools.command.install import install

frontend = pathlib.Path("digital_deception_emulator", "frontend")


class NPMInstall(install):
    def run(self):
        subprocess.run(["npm", "install"], cwd=frontend.resolve())
        subprocess.run(["npm", "run-script", "build"], cwd=frontend.resolve())
        install.run(self)


class PostInstallCommand(install):
    def run(self):
        print("Building ReactJS Frontend...")
        self.run_command("npm_install")
        install.run(self)


setup(
    cmdclass={
        "install": PostInstallCommand,
        "npm_install": NPMInstall,
    },
    name="digital_deception_emulator",
    packages=find_packages(),
    version="0.9.2",
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
