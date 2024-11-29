#!/bin/bash

# Update and install Ghostscript
apt-get update -y
apt-get install -y ghostscript

# Run npm install to install Node.js dependencies
npm install

