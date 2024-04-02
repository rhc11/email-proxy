import { Client, LocalAuth, Location } from "whatsapp-web.js"
import qrcode from "qrcode-terminal"

export const whatsappclient = new Client({
  authStrategy: new LocalAuth(),
})

whatsappclient.on("qr", async (qr) => {
  const waState = await whatsappclient.getState()
  if (waState !== "CONNECTED") {
    console.log("State not conected, generate qr ", waState)
    qrcode.generate(qr, { small: true })
  }
})

whatsappclient.on("disconnected", (reason) => {
  console.log("Disconnected:", reason)
  whatsappclient.initialize()
})

export const location = new Location(
  Number(process.env.LATITUDE),
  Number(process.env.LONGITUDE)
)
