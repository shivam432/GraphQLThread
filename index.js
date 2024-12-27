import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8000;


const app = express();
  app.use(cors());
  app.use(express.json());

  
async function run() {

  const gqserver = new ApolloServer({
    typeDefs: `type Query{
        hello: String,
        say(name:String): String
    }`, // Schema of the response
    resolvers: {
        Query: {
            hello:()=> `Hey there.... I am on graphQL Server`,
            say:(_,{name})=> `Hey ${name}!!! How are you???`
        }
    }, // logic to get the resposne in the desired manner
  });

  

  await gqserver.start();
  

  app.use('/graphql',expressMiddleware(gqserver));


  app.get("/", (req, res) => {
    res.status(200).send({
      Status: "Hey there!!!",
    });
    return;
  });


  app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
  });
}

run();
