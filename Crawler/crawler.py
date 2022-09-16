import sys
from time import time
from unicodedata import name
import requests
from bs4 import BeautifulSoup

# ------------------- READ_TXT ------------------- #
def write_csv(path, write_path,  max_lines):
    with open(path, 'r') as f:
        cont = 0
        lines = f.readlines()[1:]
        sys.stdout = open(write_path, "w")
        print(f'CREATE TABLE Dataset(Id SERIAL, Title VARCHAR(100), Description VARCHAR(500), Keywords VARCHAR(500), Url VARCHAR(200));')
        for line in lines:
            if (cont == max_lines):
                return
            tab = line.split('\t')
            #print(tab)
            # ------------------Evitamos las url en blanco. Es \n porque es el último término antes de un salto de linea.------------------ #
            if tab[4] == '\n':
                continue
            url = tab[4]
            #print(url)
            # ------------------Evitamos el salto de linea.------------------ #
            c_url = url[:-1]
            #print(c_url)
            
            data = getDataFromUrl(c_url)
            
            if data is not None:
                title = str(repr(data["title"])).replace("'","").replace("\\n","").replace("  ","").replace("\"","")
                description = str(repr(data["description"])).replace("'","").replace("\\n","").replace("  ","")
                keywords = str(repr(data["keywords"])).replace("'","").replace("\\n","").replace("  ","").replace("\"","")
                url = data["url"]
                print(f'INSERT INTO dataset(Id, Title, Description, Keywords, Url) VALUES ( default , \'{title}\' , \'{description}\' , \'{keywords}\' , \'{url}\');')
                cont += 1

    return 

# ------------------- SCRAPING ------------------- #
def getDataFromUrl(url):
    collected_data = {'url': url, 'title': None, 'description': None, 'keywords': None}
    try:
        r = requests.get(url, timeout=1)
    except Exception:
        return None

    if r.status_code == 200:
        
        # Se puede usar BeautifulSoap u otra librería que parsee la metadata de los docuementos HTML.
        source = requests.get(url).text
        soup = BeautifulSoup(source, features='html.parser')

        # Se otienes las etiquetas meta
        meta = soup.find("meta")
            
        # Obtenemos el título
        title = soup.find('title')
        #title = title['content'] if title else None
        
        # Obtenemos la descripción
        description = soup.find("meta", {'name': "description"})
        #description = description['content'] if description else None
        
        # Obtenemos la keywords y las limpiamos
        keywords = soup.find("meta", {'name': "keywords"})
        #keywords = keywords['content'] if keywords else None
        

        try:
            if keywords is None:
                return None
            else:
        
                description = description['content'] if description else None
                keywords = keywords['content'] if keywords else None
                
                keywords = keywords.replace(" ", "") if keywords else None
                keywords = keywords.replace(".", "") if keywords else None
                #keywords = keywords.split(",") if keywords else None  
                    
                
        except Exception:
            return None
        collected_data['title'] = title.get_text()
        collected_data['description'] = description
        collected_data['keywords'] = keywords 
        if collected_data['keywords'] is None:
                return None
        return collected_data
          
    return None


# ------------------- MAIN ------------------- #
if __name__ == '__main__':
    if len(sys.argv) != 4:
        print('No arguments passed - python3 crawler.py (Input file name) (Output file Name) (Files Number)')
        sys.exit()

    read_path = './files/' + sys.argv[1]
    write_path = './files/' + sys.argv[2]
    ammount = int(sys.argv[3])
    write_csv(read_path, write_path , ammount)
    
    #url = 'https://www.styleweekly.com'
    #data = getDataFromUrl(url)
    #print(data)