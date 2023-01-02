import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Users from "./dbUsers.js";

const app = express();
const port = process.env.PORT || 8001;
const connection_url = 'mongodb+srv://admin:8sLVu0tKtOFkePYO@cluster0.4mckewu.mongodb.net/?retryWrites=true&w=majority'

app.use(express.json());
app.use(cors());

mongoose.set('strictQuery', false);

mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/', (req, res) => {
    res.send("APP IS RUNNING");
});

app.post('/add', async (req, res) => {
    try {
        const {email, data} = req.body;
        const user = await Users.findOne({ email });

        if(user) {
            const movieAlreadyLiked = user.likedMovies.find(({ id }) => (id == data.id));
            if (!movieAlreadyLiked) {
                await Users.findByIdAndUpdate(user._id, { likedMovies: [...user.likedMovies, data]});
                res.json({ msg: "Movie added to watchlist"});
            } else {
                res.json({ msg: "Movie already exists"});
            }
        } else {
            await Users.create(req.body);
            res.json({ msg: "New user movie collection added"});
        }
    } catch (err) {
        res.json({ msg: "Error adding movie"});
    }
});

app.get('/liked/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await Users.findOne({ email });
        if (user) {
            res.json({ msg: "success", movies: user.likedMovies});
        } else {
            res.json({ msg: "User not found"});
        }
    } catch (err) {
        res.json({ msg: "Error adding movie"});
    }
});

app.put('/delete', async (req, res) => {
    try {
        const { email, movieId } = req.body;
        const user = await Users.findOne({ email });

        if(user) {
            const movieIndex = user.likedMovies.findIndex(({ id }) => (id == movieId));
            if (movieIndex > -1) {
                user.likedMovies.splice(movieIndex, 1);
                await Users.findByIdAndUpdate(user._id, { likedMovies: user.likedMovies});
                res.json({ msg: "Movie deleted", movies: user.likedMovies});
            } else {
                res.json({ msg: "Movie not found"});
            }
        }
    } catch (err) {
        res.json({ msg: "Error removing movie"});
    }
});

app.listen(port, console.log("Server Started"));