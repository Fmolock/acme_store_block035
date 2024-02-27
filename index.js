const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const {client, createTables, createUser, createProduct, fetchUsers, fetchProducts, createFavorite, fetchFavorites, destroyFavorite, fetchAllFavorites} = require("./db");

app.use(express.json());

// ROUTE - /api/users  localhost:8080/api/users

app.get("/api/users", async (req, res, next)=>{
   try{
       const results = await fetchUsers();
       res.status(200).send(results);
   }
   catch(err){
       next(err)
   } 
});

app.get("/api/products", async (req, res, next)=>{
   try{
       const results = await fetchProducts();
       res.status(200).send(results);
   }
   catch(err){
       next(err)
   } 
});

//ROUTE - /api/users/:id/favorites

app.get("/api/users/:id/favorites", async (req, res, next)=> {
    try{
        const id = req.params.id;
        const results = await fetchFavorites(id);
        res.status(200).send(results);
    }
    catch(err){
        next(err)
    }
});

app.get("/api/favorites", async (req, res, next)=> {
    try{
        const results = await fetchAllFavorites();
        res.status(200).send(results);
    }
    catch(err){
        next(err);
    }
});

// ROUTE - /api/users/:userId/favorites/:id

app.post("/api/users/:userId/favorites/:id", async (req, res, next)=>{
    try{
        const user_id = req.params.userId;
        const product_id = req.params.id;
        const result = await createFavorite({ user_id, product_id })
        res.status(201).send(result);
    }
    catch(err){
        next(err)
    }
});

app.delete("/api/users/:userId/favorites/:id", async (req,res, next)=> {
    try{
        const id = req.params.id;
        const user_id = req.params.userId;
        await destroyFavorite({ id, user_id });
        res.sendStatus(204);
    }
    catch(err){
        next(err);
    }
});

const init = async ()=> {
    console.log('connecting to database');
    client.connect();
    console.log('connected to database');
    // call createTables here
    console.log('dropping and creating tables...');
    await createTables();
    console.log('tables created');
    const [moe, lucy, ethyl, hat, coat, shirt, tie] = await Promise.all([
            createUser({ username: 'moe', password: 's3cr3t' }),
            createUser({ username: 'lucy', password: 's3cr3t!!' }),
            createUser({ username: 'ethyl', password: 'shhh' }),
            createProduct({ name: 'hat'}),
            createProduct({ name: 'coat'}),
            createProduct({ name: 'shirt'}),
            createProduct({ name: 'tie'}),
        ]);
        const users = await fetchUsers();
        const products = await fetchProducts();
        const favorites = await Promise.all([
            createFavorite({ user_id: moe.id, product_id: tie.id}),
            createFavorite({ user_id: moe.id, product_id: shirt.id}),
            createFavorite({ user_id: ethyl.id, product_id: shirt.id}),
            createFavorite({ user_id: lucy.id, product_id: coat.id}),
  ]);
  const fetchedFavorites = await fetchAllFavorites();
  await destroyFavorite({id:fetchedFavorites[0].id, user_id:fetchedFavorites[0].user_id});
  const fetchedFavoritesUpdated = await fetchAllFavorites();
  
  app.listen(PORT, ()=>{
      console.log(`server listening on PORT ${PORT}!`);
  });
};

init();