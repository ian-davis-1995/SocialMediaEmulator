from setuptools import find_packages, setup

setup(
    name="digital_deception_emulator",
    packages=find_packages(),
    version="0.7.4",
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
