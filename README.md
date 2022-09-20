# Tarea 1 - Sistemas Distribuidos
Los archivos y codigos de este repositorio son utilizados en la Tarea 1 de Sistemas Distribuidos para el periodo 2022-02 de la Universidad Diego Portales.

## Dataset Download Link: 

http://www.cim.mcgill.ca/~dudek/206/Logs/AOL-user-ct-collection/


## Dataset Download Commands:
```bash
cd Crawler/files/

wget http://www.cim.mcgill.ca/~dudek/206/Logs/AOL-user-ct-collection/user-ct-test-collection-09.txt.gz

gunzip user-ct-test-collection-09.txt.gz

rm -f user-ct-test-collection-09.txt.gz

mv user-ct-test-collection-09.txt file.txt

cd ..

python3 crawler.py <input name>.txt test-init.sql <lines>
```

 
## Docker Compose Run:
```bash
docker docker-compose up --build
```
En caso de querer remover memoria cache, e ingresar nueva base de datos:
```bash  
sudo docker system prune -a
``` 
Para ingresar a redis usar:
```bash
sudo docker exec -it <id/nombre> sh
```
 
## Comandos Redis:

```bash
redis-cli monitor
  
redis-cli --stat
```
# Video
Video explicativo del funcionamiento:

[![Video](https://img.youtube.com/vi/8L00K7jyPCs/0.jpg)](https://www.youtube.com/watch?v=8L00K7jyPCs)
