## This docker image allows you to create neural networks to detect spoken language

You need to setup datasets locally, to do this please look at the readme in shared-area/datasets

# create image as usual:
```
sudo docker build -t creation-image .
```

# then run it like so:
```
sudo docker run --net=host -v <localdirectory/shared-area>:/app/shared-area -d --name container-name creation-image
```