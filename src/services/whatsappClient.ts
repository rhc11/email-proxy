import { Client, LocalAuth, Location } from "whatsapp-web.js"
import qrcode from "qrcode-terminal"

export const whatsappclient = new Client({
  authStrategy: new LocalAuth(),
})

whatsappclient.on("qr", (qr) => qrcode.generate(qr, { small: true }))
whatsappclient.on("ready", () => console.log("Whataspp client is ready!"))

whatsappclient.on("disconnected", (reason) => {
  console.log("Disconnected:", reason)
  whatsappclient.initialize()
})

export const location = new Location(
  Number(process.env.LATITUDE),
  Number(process.env.LONGITUDE)
)
