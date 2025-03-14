**Dynamisk web**

# Web applikation - MyMovie

Du skal i praktisk web perioden lave applikationene my movie. Data skal hentes fra "The Movie Database".

### **Mål**
Målet med opgaven er at vise hvad du har lært i skoleperioden om listevisning og detaljevisning ved brug af url-parametre(query-strings). Det forventes, at den afleverede opgave fremstår som et "færdigt produkt".


### **Materialer**
Der udleveres en figma fil til opgaven, som dit produkt skal ligne.

### **Opgaven**

I listevisning fetches der som minimum fra to forskellie endpoints, som dermed resulterer i to forskellige visninger. En med horisontalt scroll og en som "bare" fortsætter ned ad siden. 

Der skal implementeres darkmode. Switch-knappen i øverste højre hjørne skal skifte imellem dark-mode og light-mode. Applikationen skal huske mit foretrukne farvevalg (fx i localStorage), så brugeren præsenteres for samme oplevelse næste gang applikationen bruges.


### **Aflevering**: 
Du afleverer ved at lave et **pull-request** hvor du sætter din lærer på som *reviewer*. Vent med at lave et pull-request, til du er færdig med opgaven. 

### **Deadline**: 
Opgaven skal afleveres **senest torsdag den 14. marts 2025.** 

### **Feedback**: 
Du får mundtlig feedback fra din lærer i en 1-til-1 session, hvor i gennemgår dit projekt.

### **Ekstraopgaver**
Hvis du bliver hurgigt færdig, må du gerne fx. tilføje ekstra views eller features. Gå på opdagelse i api'et og prøv at se om du kan finde nogle interessante data at præsentere.

Tilføj fx. en mulighed for at afspille traileren til en film (hvis den findes i databasen).

---

### **The Movie Database - introduktion**

For at bruge data fra The Movie Database skal du have en api-nøgle som skal sendes med alle requests til databasen. Det skal du gøre med et url-parameter, så det ved du godt hvordan fungerer.
En forespørgsel (fetch) til databasen kunne fx. se sådan ud:

```js
fetch("https://api.themoviedb.org/3/trending/movie/week", {
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer //indsæt din token her...'
  }
  }
// Det henter alle film som trender i denne uge.
```




Du får en api nøgle ved at registrere en bruger. Det er gratis, men du skal oplyse en del ting for at få nøglen. Hvis du ikke er vild med at oplyse din egen adresse kan du jo oplyse en fiktiv adresse i nærheden af hvor du bor, eller i nærheden af skolen. Brug dog din skole email, da du skal verificere din bruger for at få nøglen.

Du kan læse mere om oprettelse, og oprette dig som bruger her:
```
https://developers.themoviedb.org/3/getting-started/authentication
```

Når du skal bruge billeder, sender dataobjektet kun navnet på billedet. Læs mere om, hvilken sti du skal bruge for at få fat på billedet her: 

```
https://developers.themoviedb.org/3/getting-started/images
```


https://nataskiflix.netlify.app/ 