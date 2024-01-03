echo "*** client-todo-start begins ****"

echo "args: $@"

while getopts o: flag
do
    case "${flag}" in
        o) output_path=${OPTARG};;
    esac
done

echo "client-todo-start path: $output_path"

# Start the file content
output="window.ENV_CONFIG = {\n"

# Get all environment variables
while IFS='=' read -r name value
do
    echo "client-todo-start name: $name, value: $value"
    # Add each environment variable to the string
    output+="$name: \"${value//\"/\\\"}\",\n"
done < <(printenv)

# End the file content
output+="}\n"

# Write the file
echo -e $output > $output_path

exit 0
