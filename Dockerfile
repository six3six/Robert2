FROM php:fpm-alpine as build
RUN apk add bash jq zip nodejs npm
RUN npm install --global yarn


RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && php composer-setup.php && php -r "unlink('composer-setup.php');" && mv composer.phar /usr/local/bin/composer

COPY . /src
WORKDIR /src

RUN ./bin/release -v testing && mv ./dist/* ./src.zip

RUN unzip ./src.zip -d /src/extract 

FROM php:apache as run
RUN apt update && apt install libicu-dev -y && apt clean
RUN a2enmod rewrite && docker-php-ext-install pdo pdo_mysql intl
COPY --chown=www-data:www-data --chmod=755 --from=build /src/extract /extract
RUN rm -rf /var/www/html/ && mv /extract/*/ /var/www/html/

CMD "apache2-foreground"