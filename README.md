# Стек технологий
##Серверная часть:
PHP - 8.0.11
Laravel - 9.18.0

##Клиентская часть:
HTML, CSS, JavaScript, axios

## СУБД
MySQL - 10.4.21-MariaDB

# Требования
## Cервер
- Установленный и настроенный веб-сервер (напр. Nginx/Apache);
- Веб-сервер имеет следующую минимальную версию PHP и расширения:
PHP >= 7.3
Расширение PHP BCMath;
Расширение PHP Ctype;
Расширение PHP Fileinfo;
Расширение PHP JSON;
Расширение PHP Mbstring;
Расширение PHP OpenSSL;
Расширение PHP PDO;
Расширение PHP Tokenizer;
Расширение PHP XML.
- Установленный Node.js
## СУБД
- Должен быть установлен и настроен сервер СУБД (напр. MYSQL).

# Инструкция (OS Windows)
- Запустить настроенный web-сервер (напр. Nginx/Apache);
- Запустить настроенный сервер СУБД (напр. MySQL);
- Последовательно выполнить команды в командой строке:
##- Выгрузить проект с github:
- Выполнить команды в командной строке:
```
git init .
git add .
git clone https://github.com/Cripson23/guestbook.git
```
Загрузка и установка composer
```
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === '55ce33d7678c5a611085589f1f3ddf8b3c52d662cd01d4ba75c0ee0459970c2200a51f492d557530c71c15d8dba01eae') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
php composer.phar install
```
Установка зависимостей (front)
```
npm init
npm install
```
```
Создание файла окружения
```
copy .env.example .env
```
Очистка конфига и кэша, создание ключа приложения
```
php artisan config:clear
php artisan cache:clear
php artisan key:generate
```
Настройте подключение к СУБД в конфиге (файл .env), создайте базу с именем, указанным в конфиге
Загузите в базу дамп базы ИЛИ выполните миграции
```
php artisan migrate
```
Запуск сервера
```
php artisan serve
```
