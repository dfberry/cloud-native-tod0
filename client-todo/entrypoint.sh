#!/bin/sh
# This script generates a JavaScript configuration file from environment variables.

# Exit the script as soon as a command fails.
# Treat unset variables as an error and exit immediately.
set -eu

# Default values for the environment file path, configuration root, and output file.
ENV_FILE_PATH=".env"
CONFIG_ROOT="ENV_CONFIG"
OUTPUT_FILE="./public/env-config.js"

# Function to generate the output JavaScript configuration file.
generateOutput() {
    # Log the output file path.
    echo "Generating JS configuration output to: $OUTPUT_FILE"

    # Start the JavaScript object.
    echo "window.$CONFIG_ROOT = {" >"$OUTPUT_FILE"

    # Loop over each line in the input.
    for line in $1; do
        
        # Split the line into a key and a value.
        key=${line%%=*}
        value=${line#*=}

        # Log the key.
        printf " - Found '%s'" "$key"

        # Write the key and value to the output file.
        printf "\t%s: '%s',\n" "$key" "$value" >>"$OUTPUT_FILE"

    done

    # End the JavaScript object.
    echo "}" >>"$OUTPUT_FILE"
}

# Function to check if a string begins with a given substring.
beginswith() { case $2 in "$1"*) true;; *) false;; esac; }

# Function to display usage information.
usage() {
    printf
    printf "Arguments:"
    printf "\t-e\t Sets the .env file to use (default: .env)"
    printf "\t-o\t Sets the output filename (default: ./public/env-config.js)"
    printf "\t-c\t Sets the JS configuration key (default: ENV_CONFIG)"
    printf
    printf "Example:"
    printf "\tbash entrypoint.sh -e .env -o env-config.js"
}

# Process command-line options.
while getopts "e:o:c:" opt; do
    case $opt in
    e) ENV_FILE_PATH=$OPTARG ;;  # Set the environment file path.
    o) OUTPUT_FILE=$OPTARG ;;    # Set the output file path.
    c) CONFIG_ROOT=$OPTARG ;;    # Set the configuration root.
    :)
        # An option was missing an argument.
        echo "Error: -${OPTARG} requires a value"
        exit 1
        ;;
    *)
        # An unknown option was provided.
        usage
        exit 1
        ;;
    esac
done

# Load the environment file if it exists.
ENV_FILE=""
if [ -f "$ENV_FILE_PATH" ]; then
    echo "Loading environment file from '$ENV_FILE_PATH'"
    ENV_FILE="$(cat "$ENV_FILE_PATH")"
fi