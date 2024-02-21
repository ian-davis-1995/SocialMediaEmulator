# Overview

This is the CherryPy-based web server hosting the social media emulator.
The social media emulator is a framework for designing experiments that mimic a social media page, similar to Facebook or Twitter.
It includes a modifiable and extensible feed of predefined "posts" in several various formats (images, stories, infographics, youtube videos).
Posts can then include a list of comments, randomized from a bank.
Comments can be further randomized using a bank of author names to attribute the comment to.
Several other social media like features are extensible, including popup views, popup interactions such as knowledge questions, and more.
The frontend uses ReactJS to create a component hierarchy allowing for easy customization and addition of new features.
From the research perspective, we collect a battery of different user interaction events as they happen with the page,
storing a recreatable log of how the user interacts with the page over time.

A short preview of the types of events available includes:

-   ExperimentFinished
-   MouseClickedElement
-   MouseEnteredElement
-   MouseLeftElement
-   MouseMove
-   MulitChoiceAnswerChanged
-   PostCameIntoView
-   PostLeftView
-   PostRepliesOpened
-   PostRepliesClosed
-   PriorKnowledgeAnswerChanged (no longer used)
-   ReplyCameIntoView
-   ReplyLeftView
-   RequiredResponseCriteriaMet: used for Qualtrics. A message is sent to the Qualtrics window and is used to enable the next page button in qualtrics when the required emulator criteria is met.
-   StorySegmentRead
-   UnhandledError: Raised whenever an unhandled error happens in the emulator
-   UserScrolledFeed
-   UserScrolledPopup
-   UserScrolledReplies

All user interaction handling is done inside [user_interaction_tracker.js](digital_deception_emulator/frontend/emulator/src/user_interaction_tracker.js#L88)

## Getting Started

To get started developing with this repository, follow this checklist:

1. Ensure you have python 3.6+ installed, along with `pip`.
1. Clone the repository.
1. Install the `cherrypy_utils` python package. This should have been provided to you as a zip or git repository.
1. Install third party required packages: `pip install -r requirements.txt`.
1. Build the reactjs bundle: `cd digital_deception_emulator/frontend/emulator/; npm run build`
1. Ensure your PYTHONPATH environment variable includes the root of the git repository (the location of this README).
    1. If you are using VSCode, the integrated terminal and run configurations should be configured to include the correct pythonpath automatically.
1. Running the web server for just this project can be done with this command: `python digital_deception_emulator/application.py`

As shell commands (macos, linux):

```sh
# Clone the repo
git clone https://git.mindmodeling.org/ian.davis/SocialMediaEmulator.git

cd SocialMediaEmulator

# Install required python packages.
pip install -r requirements.txt

# Build the frontend ReactJS distribution bundle.
cd digital_deception_emulator/frontend/emulator/
npm run build
cd ../../../

# Setting python path is required as we use relative imports.
export $PYTHONPATH=$PYTHONPATH:$(pwd)

python digital_deception_emulator/application.py
```

# Database

With the default configuration, the cherrypy server will initialize a `sqlite` database file at `{shared_data_location}/digital_deception.db`.
`shared_data_location` is a command line argument passed to the `application.py` script at startup, or an environment variable set in the docker container (`ENV MNT_DIR`). It controls where all the data created by the web server at runtime should be saved. This folder should be persisted if running via Docker, either via a volume mount or other shared drive approach.
The cherrypy server uses `SQLAlchemy` ORM under the hood for all database manipulations, so migration to a different system should be low effort.
In our production server, we used MySQL by looking for a `mysql.credentials` file which was a JSON structure containing the server, username and password.
For more information, see [application.py](digital_deception_emulator/application.py#L83).

# Stimuli Manipulation

Basic stimuli data are contained in these JSON files, located at [digital_deception_emulator/frontend/emulator/src/stimuli/](digital_deception_emulator/frontend/emulator/src/stimuli/):

1. [post_data.json](digital_deception_emulator/frontend/emulator/src/stimuli/post_data.json): This contains the major feed content as a JSON array of objects. For more information on how this is used, see [post_layouts.js](digital_deception_emulator/frontend/emulator/src/posts/post_layouts.js#L113).
1. [comment_bank.json](digital_deception_emulator/frontend/emulator/src/stimuli/comment_bank.json): This contains the available comments that can be assigned randomly to stories. For more information on how this is used, see [experiment.js](digital_deception_emulator/frontend/emulator/src/experiment.js#L221) and [comment_provider.js](digital_deception_emulator/frontend/emulator/src/stimuli/comment_provider.js#L59).
1. [author_bank.json](digital_deception_emulator/frontend/emulator/src/stimuli/author_bank.json): This contains the available authors that can be assigned randomly to comments (currently, authors are only randomized on comments, but could be adapted to posts as well). For more information on how this is used, see [comment_provider.js](digital_deception_emulator/frontend/emulator/src/stimuli/comment_provider.js#L133).

# Creating new post types.

Rendering of posts is controlled in the ReactJS frontend in the [PostBody component](digital_deception_emulator/frontend/emulator/src/posts/post_layouts.js#L113).
You will see here a large if block branching out by the post `type` field.
At this time, this is the easiest way to decipher what currently supported post types are available, and what their required and optional fields are.
This is also where new post types can be added as required.

Note that there are several parent components that handle styling of some of the outer layers of each post card on the page. The highest level component is the [SocialMediaPost component](digital_deception_emulator/frontend/emulator/src/posts/post_layouts.js#L239).

# Data Export

A researcher dashboard page does exist which allows easy data export, but was built around an existing LDAP system requiring a user login.
Currently, changing the LDAP server would require modifying views and creating your own LDAP login using the
`python-ldap` package (or whatever authentication is preferred).

Here is a snippet of the existing ldap authentication implementation (which may be specific to our ldap server configuration):

```
import ldap
import cherrypy

server_address = "ldap://192.168.1.4:3899"
server = ldap.initialize(server_address)


def ldap_login(username, password):
    try:
        user = "uid={0}".format(username)
        cherrypy.log("Logging into LDAP server with credentials {0}".format(user))
        server.simple_bind_s(user, password)
        cherrypy.log("Login succeeded")
        return True
    except ldap.INVALID_CREDENTIALS:
        cherrypy.log("Login failed")
        return False

```

Then, you can use the `cherrypy.session` reference to store an authentication flag in your http session, like this:

```
# Setting the authentication flag to true
cherrypy.session["ldap_authenticated"] = 1

# checking the current authentication flag
# Recommend using this existing session variable name
# as other views in the application will reference it.
cherrypy.session.get("ldap_authenticated", 0) == 1
```

The necessary modifications would need to be made in: `backend/login/views.py:14`.

# Source Code Overview

While the web server backend logic is CherryPy, the primary application logic and rendering is done in a ReactJS frontend.

To that end, the overall source code architecture is separated as follows:

-   [backend](digital_deception_emulator/frontend/emulator/): The CherryPy backend code
-   [emulator](digital_deception_emulator/frontend/emulator): The ReactJS frontend code.
-   [templates](digital_deception_emulator/frontend/templates): These are Jinja2 templates rendered by cherrypy which primarily aid in passing configuration from the cherrypy webserver to the ReactJS frontend.
-   [assets](digital_deception_emulator/frontend/assets): This folder is configured to be statically hosted by the cherrypy frontend and is referenced in [post_data.json](digital_deception_emulator/frontend/emulator/src/stimuli/post_data.json) for images, videos and other static assets to be displayed.
