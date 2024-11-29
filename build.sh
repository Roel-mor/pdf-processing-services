#!/bin/bash

# Update package list and install ghostscript with logging
echo "Updating package list..."
apt-get update -y && echo "Package list updated."

echo "Installing Ghostscript..."
apt-get install -y ghostscript

# Check if Ghostscript is installed and print the version
if command -v gs &> /dev/null
then
    echo "Ghostscript successfully installed! Version: $(gs --version)"
else
    echo "Ghostscript installation failed."
fi

