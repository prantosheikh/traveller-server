require("dotenv").config();
const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3000;



const corsOptions = {
  origin: true,
};

app.use(cors(corsOptions));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.efhcwjr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});




async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // Send a ping to confirm a successful connection
    // await client.connect();

    const featuredTripsCollections = client
      .db("TravelerDB")
      .collection("FeaturedTrips");


    // Get Featured Trips Collections
    app.get("/featuredtrips", async (req, res) => {
      const result = await featuredTripsCollections.find().toArray();
      res.send(result);
    });

    // Search All Destination
   app.get('/search/:query', async (req, res) => {
    const searchQuery = req.params.query;
    console.log(searchQuery);
  
    try {
     
      const results = await featuredTripsCollections.find({
        title
        
        : { $regex: new RegExp(searchQuery, 'i') },
      }).toArray(); 
  
      res.json(results);
    } catch (error) {
      console.error('Error searching in MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Get Specific Featured Trips 
  app.get("/featured-details/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: new ObjectId(id) };
    const result = await featuredTripsCollections.findOne(query);
    res.send(result);
  });

  app.get('/destinations/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Received id:', id);
  
    try {
      const result = await featuredTripsCollections.find({ destinations: id }).toArray();

      console.log('Result:', result);
  
      res.send(result);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Traveller Server Site Running");
});

app.listen(port, () => {
  console.log(`Server Running On PORT ${port}`);
});
