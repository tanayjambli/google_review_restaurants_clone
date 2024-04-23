require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const db = require('./db');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
//get all restaurants
app.get('/api/v1/restaurants', async (req, res) => {
    try{
        //const results = await db.query("select * from restaurants;");
        const restaurantRatingsData = await db.query("select * from restaurants left join (select restaurant_id, count(*), trunc(avg(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;");
        res.status(200).json({
            status: "success",
            results: restaurantRatingsData.rows.length,
            data: {
                restaurants: restaurantRatingsData.rows
            },
        });
    }catch (err){
        console.log(err);
    }
});

//get individual restaurant
app.get('/api/v1/restaurants/:id', async (req, res) => {
    try{
        const restaurant = await db.query("select * from restaurants left join (select restaurant_id, count(*), trunc(avg(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1;", [req.params.id]);
        const reviews = await db.query('select * from reviews where restaurant_id = $1;', [req.params.id]);

        res.status(200).json({
            status: "success",
            data: {
                restaurant: restaurant.rows[0],
                reviews: reviews.rows
            },
        });
    }catch (err){
        console.log(err);
    }
});

//create a restaurant
app.post('/api/v1/restaurants', async (req, res) => {
    try{
        const results = await db.query('insert into restaurants (name, location, price_range) values ($1, $2, $3) returning *;', [req.body.name, req.body.location, req.body.price_range]);
        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows[0]
            },
        });
    }catch (err){
        console.log(err);
    }    
});

//update restaurant
app.put('/api/v1/restaurants/:id', async (req, res) => {
    try{
        const results = await db.query('update restaurants set name = $1, location = $2, price_range = $3 where id = $4 returning *;', [req.body.name, req.body.location, req.body.price_range, req.params.id]);
        res.status(200).json({
            status: "success",
            data: {
                restaurants: results.rows[0]
            },
        });
    }catch (err){
        console.log(err);
    }    
});

//delete restaurant
app.delete('/api/v1/restaurants/:id', async (req, res) => {
    try{
        const results = await db.query('delete from restaurants where id = $1;', [req.params.id]);
        res.status(204).json({
            status: "success"
        });
    }catch (err){
        console.log(err);
    }  
});

//add a review
app.post('/api/v1/restaurants/:id/addReview', async (req, res) => {
    try{
        const newReview = await db.query('insert into reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;', [req.params.id, req.body.name, req.body.review, req.body.rating]);
        res.status(201).json({
            status: "success",
            data: {
                review: newReview.rows[0]
            },
        });
    }catch (err){
        console.log(err);
    }  
});

//port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
