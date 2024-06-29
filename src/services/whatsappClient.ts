import { Client, LocalAuth, Location } from "whatsapp-web.js"
import qrcode from "qrcode-terminal"

const WEB_VERSION = '2.3000.1014576526-alpha'

export const whatsappclient = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: 'remote',
    remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${WEB_VERSION}.html`,
  },
})

export const location = new Location(
  Number(process.env.LATITUDE),
  Number(process.env.LONGITUDE)
)

whatsappclient.on("qr", async (qr) => {
  const waState = await whatsappclient.getState()

  if (waState !== "CONNECTED") {
    qrcode.generate(qr, { small: true })
  }
})

whatsappclient.on("disconnected", (reason) => {
  console.log("Disconnected:", reason)
  whatsappclient.initialize()
})
