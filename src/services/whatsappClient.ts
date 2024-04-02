import { Client, LocalAuth, Location } from "whatsapp-web.js"

export const whatsappclient = new Client({
  authStrategy: new LocalAuth(),
})

export const location = new Location(
  Number(process.env.LATITUDE),
  Number(process.env.LONGITUDE)
)
