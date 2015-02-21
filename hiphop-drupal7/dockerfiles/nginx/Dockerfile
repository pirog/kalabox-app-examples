# docker build -t kalabox/nginx .

FROM kalabox/nginx:stable

RUN ln -s /src/config/nginx/start.sh /start.sh

# Define default command.
CMD ["/start.sh"]

# Expose ports.
EXPOSE 80
EXPOSE 443
