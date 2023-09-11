# Use a minimal Linux base image
FROM alpine:latest

# Copy your custom shell script into the container
COPY insert.sh .

# Make the script executable
RUN apk add bash
RUN apk add curl
RUN chmod +x insert.sh

# Define the entry point for your script
CMD ["./insert.sh"]
