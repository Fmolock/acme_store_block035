const {client, createTables, createUser, createProduct, fetchUsers, fetchProducts, createFavorite, fetchFavorites, destroyFavorite, fetchAllFavorites} = require("./db");

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
        console.log(moe)
        const users = await fetchUsers();
        const products = await fetchProducts();
        const favorites = await Promise.all([
            createFavorite({ user_id: moe.id, product_id: tie.id}),
            createFavorite({ user_id: moe.id, product_id: shirt.id}),
            createFavorite({ user_id: ethyl.id, product_id: shirt.id}),
            createFavorite({ user_id: lucy.id, product_id: coat.id}),
  ]);
  const fetchedFavorites = await fetchAllFavorites();
    console.log('before delete');
  console.log(fetchedFavorites);
  await destroyFavorite({id:fetchedFavorites[0].id, user_id:fetchedFavorites[0].user_id});
  const fetchedFavoritesUpdated = await fetchAllFavorites();
    console.log('after delete');
  console.log(fetchedFavoritesUpdated);
}

init();