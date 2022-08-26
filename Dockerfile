# start by pulling the python image
FROM ubuntu:22.04

# copy the requirements file into the image
COPY ./requirements.txt /app/requirements.txt

# switch working directory
WORKDIR /app

# update ubuntu package manager
RUN apt-get update

# install python, python package installer, and a library needed for the soundfile module
RUN apt-get install python3-pip python3 libsndfile1 -y

# install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt

# copy every content from the local file to the image
COPY . /app

# configure the container to run in an executed manner
#ENTRYPOINT [ "python3" ]

CMD [ "python3", "view.py" ]
