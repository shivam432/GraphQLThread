import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import dotenv from "dotenv";
import prismaClient from "../src/lib/db.js";
import typedefs from "./graphql/users/typedef.js";
import UserService,{createPayload} from "./services/user.js";
dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
  app.use(cors());
  app.use(express.json());

  
async function run() {

  const gqserver = new ApolloServer({
    typeDefs: typedefs
    , // Schema of the response
    resolvers: {
        Query: {
            hello:()=> `Hey there.... I am on graphQL Server`,
            say:(_,{name})=> `Hey ${name}!!! How are you???`
        },
        Mutation:{
          createUser: async(_,{payload:createPayload})=>{
            const result= await UserService.createUser(payload);
            return (await prismaClient.user.findMany()).toString();
          }
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
