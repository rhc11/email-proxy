import { getEmailsAndSendMsg } from "./services/emailClient"
import { whatsappclient } from "./services/whatsappClient"
import fastify from "fastify"
import helmet from "@fastify/helmet"
import cors from "@fastify/cors"

const app = fastify({
  maxParamLength: 5000,
})

app.register(helmet)
app.register(cors, { origin: "*", exposedHeaders: ["x-total-count"] })

whatsappclient.initialize()
whatsappclient.on("ready", () => {
  app.listen({ port: Number(process.env.PORT), host: "0.0.0.0" }, () => {
    console.log("Listening in port: ", process.env.PORT)
  })
  
  getEmailsAndSendMsg()
  setInterval(getEmailsAndSendMsg, 60000)
})

app.get("/health", (_, reply) => {
  const state = whatsappclient.getState()
  reply.code(200).send({ ok: true, wState: state })
})
