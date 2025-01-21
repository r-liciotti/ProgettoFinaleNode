
# TougeAPI - Start2Impact

Progetto  API JSON RESTful che gestisce le informazioni degli utenti appoggiandosi ad un database SQL. Progetto per esame finale del corso Node.js di Start2Impact.


## Built With

- Node.js
- Express
- MySql
## Installation

Clone the repository
```bash
git clone https://github.com/djswalterix/orizon-api.git
```
Install NPM packages
```bash
npm install
```
Start application
```bash
node app.js
```
    
## API Reference
## User API Endpoint
Endpoint relativi alla gestione degli utenti. Gli endpoint permettono la creazione, lettura, aggiornamento ed eliminazione di utenti.


### 1. Creazione di un nuovo utente

**Descrizione:** Crea un nuovo utente.

- **Metodo:** `POST`
- **Endpoint:** `/users`

#### Corpo della richiesta (JSON):

```json
{
  "nickname": "string",
  "age": "number",
  "city": "string"
}
```

#### Risposte:

- **200:**
  ```json
  {
    "id": "number",
    "title": "string"
  }
  ```
- **400:** Nickname già esistente o campi mancanti.
- **500:** Errore interno del server.

---

### 2. Recupera tutti gli utenti

**Descrizione:** Restituisce una lista di tutti gli utenti.

- **Metodo:** `GET`
- **Endpoint:** `/users`

#### Risposte:

- **200:**
  ```json
  [
    {
      "id": "number",
      "nickname": "string",
      "age": "number",
      "city": "string"
    }
  ]
  ```
- **500:** Errore interno del server.

---

### 3. Recupera un utente specifico per ID

**Descrizione:** Restituisce i dettagli di un utente specifico dato il suo ID.

- **Metodo:** `GET`
- **Endpoint:** `/users/:id`

#### Risposte:

- **200:**
  ```json
  {
    "id": "number",
    "nickname": "string",
    "age": "number",
    "city": "string"
  }
  ```
- **404:** Utente non trovato.
- **500:** Errore interno del server.

---

### 4. Aggiorna un utente

**Descrizione:** Aggiorna i dettagli di un utente esistente.

- **Metodo:** `PUT`
- **Endpoint:** `/users/:id`

#### Corpo della richiesta (JSON):

```json
{
  "nickname": "string",
  "age": "number",
  "city": "string"
}
```

#### Note:

- Almeno uno dei campi `nickname`, `age` o `city` è obbligatorio.

#### Risposte:

- **200:**
  ```json
  {
    "message": "User updated successfully"
  }
  ```
- **400:** Campi mancanti o ID utente non trovato.
- **500:** Errore interno del server.

---

### 5. Elimina un utente

**Descrizione:** Elimina un utente esistente dato il suo ID.

- **Metodo:** `DELETE`
- **Endpoint:** `/users/:id`

#### Risposte:

- **200:**
  ```json
  {
    "message": "User deleted successfully"
  }
  ```
- **404:** Utente non trovato.
- **500:** Errore interno del server.

---

## Codici di risposta comuni

| Codice | Descrizione                     |
| ------ | ------------------------------- |
| 200    | Richiesta eseguita con successo |
| 400    | Richiesta non valida            |
| 404    | Risorsa non trovata             |
| 500    | Errore interno del server       |


## Posts API Endpoint
Endpoint relativi alla gestione dei posts. Gli endpoint permettono la creazione, lettura, la ricerca, aggiornamento ed eliminazione dei post.




### 1. Creazione di un nuovo post

**Descrizione:** Crea un nuovo post.

- **Metodo:** `POST`
- **Endpoint:** `/posts`

#### Corpo della richiesta (JSON):

```json
{
  "title": "string",
  "nickname": "string",
  "Postid": "string"
}
```

#### Risposte:

- **200:**
  ```json
  {
    "id": "number",
    "title": "string"
  }
  ```
- **400:** Errori di validazione nel corpo della richiesta
- **404:**  Utente non trovato
- **500:** Errore durante la creazione del post.

---

### 2. Recupera tutti i posts

**Descrizione:** Restituisce una lista di tutti i posts, eventualmente filtrati per intervallo di data o città dell'utente

- **Metodo:** `GET`
- **Endpoint:** `/posts`

### Parametri Query
| Nome        | Tipo      | Obbligatorio | Descrizione                                                    |
|-------------|-----------|--------------|----------------------------------------------------------------|
| startDate   | string    | No           | Filtra i post creati a partire da questa data.                |
| endDate     | string    | No           | Filtra i post creati fino a questa data.                      |
| city        | string    | No           | Filtra i post per città dell'utente.                         |

#### Risposte:

- **200:**
  ```json
  {
    "status": "success",
    "data": [
        {
            "id": number,
            "title": string,
            "created_at": date,
            "Post_id": number,
            "nickname": string,
            "interactions": [
                {
                    "type": enum["like"/"comment"],
                    "count": number
                }
            ],
            "detailed_interactions":  [
                {
                    "city": string,
                    "type": enum["like"/"comment"],
                    "Post_id": number,
                    "nickname": string,
                    "interaction_date": date
                }
			]
        }
    ]
}
  ```
- **500:** Errore interno del server.

---

### 3. Recupera un post specifico per ID

**Descrizione:** Restituisce i dettagli di un post specifico dato il suo ID.

- **Metodo:** `GET`
- **Endpoint:** `/posts/:id`

#### Risposte:

- **200:**
  ```json
  {
      "id": number,
      "title": string,
      "created_at": date
  }
  ```
- **404:** post non trovato.
- **500:** Errore interno del server.

---

### 4. Aggiorna un post

**Descrizione:** Aggiorna i dettagli di un post esistente.

- **Metodo:** `PUT`
- **Endpoint:** `/posts/:id`

#### Corpo della richiesta (JSON):

```json
{
  "title": "string"  
}
```

#### Risposte:

- **200:**
  ```json
  {
    "message": "Post updated successfully"
  }
  ```
- **400:** Campi mancanti o ID post non trovato.
- **500:** Errore interno del server.

---

### 5. Elimina un post

**Descrizione:** Elimina un post esistente dato il suo ID.

- **Metodo:** `DELETE`
- **Endpoint:** `/posts/:id`

#### Risposte:

- **200:**
  ```json
  {
    "message": "Post deleted successfully"
  }
  ```
- **404:** post non trovato.
- **500:** Errore interno del server.

---

## Codici di risposta comuni

| Codice | Descrizione                     |
| ------ | ------------------------------- |
| 200    | Richiesta eseguita con successo |
| 400    | Richiesta non valida            |
| 404    | Risorsa non trovata             |
| 500    | Errore interno del server       |

----

## Interactions API Endpoint
Endpoint relativi alla gestione delle iterazioni che hanno gli utenti nei post, possono essere relativi a dei like oppure a dei commenti. Gli endpoint permettono la creazione, lettura, aggiornamento ed eliminazione delle interaction.

### 1. Creazione di un nuovo interaction

**Descrizione:** Crea un nuovo interaction.

- **Metodo:** `interaction`
- **Endpoint:** `/interactions`

#### Corpo della richiesta (JSON):

```json
{
  "type": enum["like", "comment"],
  "postid": "string",
  "userId": "string"  
}
```

#### Risposte:

- **200:**
  ```json
  {
    "message": string,
    "interactionId": number
  }
  ```
- **400:** Errori di validazione nel corpo della richiesta
- **500:** Errore durante la creazione del interaction.

---

### 2. Recupera tutti i interactions

**Descrizione:** Restituisce una lista di tutti le interactions.

- **Metodo:** `GET`
- **Endpoint:** `/interactions`


#### Risposte:

- **200:**
  ```json
  {
    "status": "success",
    "data": [
          "id": number,
            "type": enum["like","comment"],
            "created_at": date,
            "post_id": number,
            "user_id": number,
            "updated_at": date
    ]
}
  ```
- **500:** Errore interno del server.

---

### 3. Recupera un interaction specifico per ID

**Descrizione:** Restituisce una interaction dato il suo ID.

- **Metodo:** `GET`
- **Endpoint:** `/interactions/:id`

#### Risposte:

- **200:**
  ```json
  {
      "type": enum["like","comment"],
      "created_at": darte,
      "post_id": number,
      "user_id": number,
      "updated_at": date
  }
  ```
- **400:** Erorre nei parametri.
- **500:** Errore interno del server.

---

### 4. Aggiorna un interaction

**Descrizione:** Aggiorna i dettagli di un interaction esistente.

- **Metodo:** `PUT`
- **Endpoint:** `/interactions/:id`

#### Corpo della richiesta (JSON):

```json
{
  "type": enum["like","comment"]
}
```

#### Risposte:

- **200:**
  ```json
  {
    "message": "interaction updated successfully"
  }
  ```
- **400:** Campi mancanti o ID interaction non trovato.
- **500:** Errore interno del server.

---

### 5. Elimina un interaction

**Descrizione:** Elimina un interaction esistente dato il suo ID.

- **Metodo:** `DELETE`
- **Endpoint:** `/interactions/:id`

#### Risposte:

- **200:**
  ```json
  {
    "message": "interaction deleted successfully"
  }
  ```
- **404:** interaction non trovato.
- **500:** Errore interno del server.

---

## Codici di risinteractiona comuni

| Codice | Descrizione                     |
| ------ | ------------------------------- |
| 200    | Richiesta eseguita con successo |
| 400    | Richiesta non valida            |
| 404    | Risorsa non trovata             |
| 500    | Errore interno del server       |


