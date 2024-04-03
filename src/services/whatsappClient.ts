import { Client, LocalAuth, Location } from "whatsapp-web.js"
import qrcode from "qrcode-terminal"

export const whatsappclient = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html',
  }
})

export const location = new Location(
  Number(process.env.LATITUDE),
  Number(process.env.LONGITUDE)
)

whatsappclient.on("qr", async (qr) => {
  qrcode.generate(qr, { small: true })
})

whatsappclient.on("disconnected", (reason) => {
  console.log("Disconnected:", reason)
  whatsappclient.initialize()
})
