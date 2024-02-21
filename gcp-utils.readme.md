# Overview

This package provides several utility scripts and functions to manage experiments and services hosted on Google cloud using Google Cloud Run, Google Cloud Storage and potentially Google Big Query.

The main requirements for this package are as follows:

-   Python 3.7+
-   pip
-   If installing this package from a google artifact registry, you will need to install the google cloud cli tools and authenticate.

# Main Utility

The main utility provided by this package is the script `gcp-utils`. This script combines several different command line functions centered around manipulating GCP projects into one utility.
Run `gcp-utils -h` for a directory of commands available. Each command has more help available with `gcp-utils {command} -h`.

# Cloud Run Project Management

This package exposes several tools to facilitate creating and deploying web services via Cloud Run, tying in with Artifact Registry for Docker image hosting, and GCS Storage Buckets for filesystem persistence.
This system is powered by a project configuration file that contains all of the necessary project specific settings.
This guide assumes you have a project configured on GCP and all authentication configured properly.

## Initializing a Project

To get started, run the command `gcp-utils project init` in your project directory. This will create the following files:

-   `google-cloud-config.toml`
-   `Dockerfile.sample` (if it doesn't already exist) which will serve as a reference for the docker interplay with the tool). Can safely be deleted if not needed.
-   `mount_gcsfuse.sh` (if it doesn't already exist) which is a template shell script that will mount a storage bucket using gcsfuse. Can safely be deleted if not needed.
-   `gcp-utils.readme.md` a copy of this readme for easier reference. Can safely be deleted if not needed.

## Configure Project

1. Open `google-cloud-config.toml` and adjust configuration as necessary.
1. Does your project depend on python packages in an Artifact Registry on GCP? The command `gcp-utils python install` can generate a preauthenticated `pip install` command that you can run to install packages from the artifact registry specified in the `[artifact-registry.python-package-index]` section of `google-cloud-config.toml`.
1. Create a `Dockerfile` for your web service, referencing `Dockerfile.sample` to determine how to interplay with the project configuration tools.
    1. The tools will provide several build args to your `Dockerfile` which is the primary mechanism to interact between the two.
1. Determine if you need `gcsfuse` for your web service, and ensure that you install, start and mount `gcsfuse` as necessary. The `Dockerfile.sample` provides references on suggested avenues to accomplish this, along with `mount_gcsfuse.sh` for simple usage of `gcsfuse` once installed.

## Deploy Project to GCP

Now that you have configured and dockerized your web service, you're ready to deploy to cloud run.

1. You'll first need to build and deploy your docker image to the `Artifact Registry`. You achieve this with the command `gcp-utils docker build {version}`, replacing {version} with the version of your deployment.
1. Now you can create and start your `Cloud Run` service, pointing to the {version} used in the previous step: `gcp-utils docker deploy {version}` If all goes correctly, you should see your instance running in your GCP Project and can adjust as needed.

Since a docker build and docker deploy are so commonly used together, the `gcp-utils docker publish {version}` command combines them together in order to limit repeated commands.

# Python Package Management

This tools also exposes several utilities related to python packages stored/deployed to the Artifact Registry.

## Installing shared packages

When using packages that are deployed to an Artifact Registry, this library provides two utilities to help manage those tools.
When installing packages in your development environment locally, you can run the command `gcp-utils python install`, which will print out a `pip install` command that you can copy/paste
in order to retrieve packages both from the standard PIP indices and frmo your private GCP index, as configured in the `[artifact-registry.python-package-index]` section of your project config file.

When including shared packages in a python project that is dockerized and running on Artifact Registry/Cloud Run, the `[artifact-registry.python-package-index]` section of your project config file can be enabled
to expose a build argument to your docker container, `ARTIFACT_URL` which will be the same authenticated url which can be used by `pip install` inside the docker container. This is a secure one-time use way to pass the authenticated build secret to your docker container. These configurations are automatically parsed and read by the `gcp-utils docker build` command and included if enabled. More information is included in the `Dockerfile.sample` included with `gcp-utils project init`.

## Deploying shared package

When developing a shared python package to be deployed to Artifact Registry, this library can be configured to manage the build and deploy step of your package automatically, using the `Hatch` build system.
Once you have properly configured your project to build and deploy using Hatch, use the `gcp-utils python deploy` command to deploy the package. This will use the configuration specified in the `[artifact-regstry.python-package-deploy]` section of your project config file.

The command accepts two arguments, `--release_type` and `--key-file`. More information on these arguments can be found by running `gcp-utils python deploy -h`

# General Tools

There are a number of generalized tools exposed by this library that pertain to gcp but do not fall into one of the major categories above.

## SQLite

The `gcp-utils sqlite` command contains utilities related to dealing with SQLite database files. Currently, it only has one command: `export` which will export all the rows of a given database table to a specified format (CSV is the currently only supported format).

## GCP Cloud Storage

The `gcp-utils storage` command contains utilities related to dealing with storage buckets in GCP Cloud Storage. Currently, it only has one command: `upload` which will upload a given file to a GCP Cloud Storage Bucket as specified by the command arguments.

## BigQuery Utilities

Several utility functions are exposed by the `google_cloud_utils.bigquery` module to facilitate managing a bigquery database connection.

The `auto_increment` module exposes functions `get_next_autoincrement` and `update_entity_autoincrements` which provide pseudo-support for autoincrement fields in bigquery in python.
These work by querying the DB for the latest value of a given field, caching that value, and autoincrementing the value in cache whenever queried.
NOTE: It assumes that the application is the primary producer of data for the db in question, as the cache will not auto update when new records are added by other sources.
If this isn't the case, handling for external updates can be added and the internal cache can be updated using the `update_cached_autoincrement` function.

# Development Requirements

Install pip package dependencies:

`pip install -r requirements.txt`

Using a venv is recommended to prevent site package confusion.
The `initialize_environment` shell scripts are provided to automate this process.

If using VSCode, you will need to point it to the virtualenv interpreter after setting up.
If you run the initialize script from within VSCode, it should auto-detect the new venv and prompt to switch to it.

# Packaging Information

This project is packaged with `Hatch` and `Hatchling`. More info on those tools and generic python packaging here:

-   https://hatch.pypa.io/latest/intro/#pyprojecttoml
-   https://packaging.python.org/en/latest/tutorials/packaging-projects/
