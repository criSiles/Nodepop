# NodePop

## Commands

### Deploying the app:

Installs all of the dependencies listed in the package.json file.

```sh
npm install
```

### Load initial data to database:

Runs the script that is specified in the package.json file under the init-db key in the scripts object.
This script is responsible for loading initial data into the database.

```sh
npm run init-db
```

### Start the application in production with:

Runs the script that is specified in the package.json file under the start key in the scripts object.
This script is used to start the application in production.

```sh
npm start
```

### Start the application in development with:

Runs the script that is specified in the package.json file under the dev key in the scripts object.
This script is used to start the application in development mode.

```sh
npm run dev
```

## API Documentation

The API has three middleware:

1) POST request to the /api/advertisements, **creates an advertisement**.

When a client makes a POST request to this endpoint with a JSON object in the request body, the server will create an advertisement object in memory using the Advertisement model and the data from the request body (adData). The server will save this advertisement object to the database and return the saved object to the client in the response.

The ad has the following schema, and the client must fill the fields:
```
{
    name: String,
    sale: Boolean,
    price: Number,
    photo: String,
    tag: [String],
}
```

The object created will have this aspect in the response:
```
{
  "response": [
    {
        "name": "bike",
        "sale": false,
        "price": 230.15,
        "photo": "bike.jpg",
        "tag": ["lifestyle", "motor"]
    },
  ]
}
```

2) GET request to the /api/advertisements, **returns a list of advertisements**.

    When a client makes this GET request, it will run the function contained in the route handler.

    This route handler has the following behavior:

    1) It declares several variables by destructuring the req object. These variables are the query parameters from the request, which can be used to filter the advertisements that are returned. There are the following filters:
        - Filter by sale or wanted, if sale=true is a product for sale and if sale=false is a wanted product.
        - Filter by name, will add a regular expression to the filter object that matches the beggining of the name parameter.
        - Filter by range of price, the client can search by the following range of prices:
            * x-y, which will search for ads with a price included between these values.
            * -x, which will look for products that will have a price lower than "x".
            * x-, which will look for products that will have a price greater than "x".
            * x, which will look for products that will have a price of "x" value.
        - Filter by tag, the client can search just one tag, or several using an $or condition.

    2) It calls the *Advertisement.lista* method, passing in the filter, skip, limit, fields, and sort variables as arguments. This method will retrieve a list of advertisements from the database based on the provided filter and pagination/sorting arguments.

    3) It calls the *Advertisement.countDocuments* method to count how many advertisements are in the database.
    If the list of advertisements is empty, it sends a response with the message "Product not found". Otherwise, it renders the "listItems" view and passes the list of advertisements as the "items" local variable.

    For example, the call for search the list of ads could be this one:

    ```
    http://localhost:3000/api/advertisements?name=bike&sale=false&price=-250&tag=motor%20lifestyle&limit=3&skip=0&sort=price
    ```

    **EXTRA**: There is an optional parameter **web** in which the system responses with HTML instead of JSON message.

    For example:
    ```
    http://localhost:3000/api/advertisements?name=bike&sale=false&price=-250&tag=motor%20lifestyle&limit=3&skip=0&sort=price&web=true
    ```

3) GET request to the /api/advertisements/tags, returns a list of existent tags

    When a client makes this GET request, it will iterate the advertisemnts created and will add in an empty list the tags,
    if the tag is already in the list it will not be added. Then it renders the list with the list of existent tags.

    **EXTRA**: There is an optional parameter **web** in which the system responses with HTML instead of JSON message.