#!/bin/bash
echo "*** client-todo-envvars begins ****"

prefix="VITE_" # Prefix for environment variables

# # Parse command-line options
# while getopts o: flag
# do
#     case "${flag}" in
#         o) output_path=${OPTARG};;
#     esac
# done

# echo "client-todo-envvars path: $output_path"

# # Start the file content
# echo "window.ENV_CONFIG = {" > $output_path

# # Get all environment variables
# printenv | grep "^$prefix" | while IFS='=' read -r name value
# do
#   # Add each environment variable to the file
#   echo "client-todo-envvars name: $name, value: $value"
#   echo "  $name: \"${value//\"/\\\"}\"," >> $output_path
# done

# # End the file content
# echo "}" >> $output_path
exit 0