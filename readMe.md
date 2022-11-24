Ejecutar el servidor (modos FORK y CLUSTER) con nodemon verificando el número de procesos tomados por node.
Comando Cluster: nodemon app.js 8080 'Cluster'
Comando Fork: nodemon app.js 8080

Ejecutar el servidor (con los parámetros adecuados) utilizando Forever, verificando su correcta operación. Listar los procesos por Forever y por sistema operativo.
Comando ejecutar serve: forever start app.js 8080
Comando listar por forever: forever list

Ejecutar el servidor (con los parámetros adecuados: modo FORK) utilizando PM2 en sus modos modo fork y cluster. Listar los procesos por PM2 y por sistema operativo.
Comando Fork: pm2 start app.js --name="App" --watch  -- 8080
Comando cluster: pm2 start app.js --name="App1" --watch -i 2 -- 8080

Hacer pruebas de finalización de procesos fork y cluster en los casos que corresponda.
Comando fork: pm2 stop App
Comando cluster: pm2 stop App1

Configurar Nginx para balancear cargas de nuestro servidor.
Comandos para crear instancias:
pm2 start nginx.js --name="Prueba" --watch  -- 8082
pm2 start nginx.js --name="Prueba1" --watch  -- 8083
pm2 start nginx.js --name="Prueba2" --watch  -- 8084
pm2 start nginx.js --name="Prueba3" --watch  -- 8085

Comando para ejecutar nginx en Mac (Ubicados en la carpeta de nginx):
Inicio:nginx
Cargar cambios:nginx -s reload
Detener:nginx -s quit