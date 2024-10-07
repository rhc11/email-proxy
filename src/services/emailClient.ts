import Imap from "imap"
import { simpleParser } from "mailparser"
import { whatsappclient, location } from "./whatsappClient"

const imapConfig = {
  user: process.env.EMAIL ?? "",
  password: process.env.EMAIL_PASSWORD ?? "",
  host: "imap.zoho.eu",
  port: 993,
  tls: true,
}

const getEmailString = (input: string) => {
  const regex = /<([^>]*)>/
  const match = regex.exec(input)

  if (!match || match.length < 2) {
    console.log("Email:", input)

    return input
  }

  const emailAddress = match[1]
  console.log("Email: ", emailAddress)

  return emailAddress
}

const isValidEmail = (email: string) => {
  return process.env.VALID_EMAILS?.includes(email)
}

const buildMessage = (msgValues: MsgValues) =>
  `Bienvenido a ${process.env.NAME_HOME}. Aquí tienes el código ${msgValues.code} para coger las llaves de la ${msgValues.room}. Se activa el día ${msgValues.day} a las ${msgValues.checkinTime}. Cualquier problema llámame :)`

const buildErrorFormatMessage = (text: string) =>
  `Error de formato al enviar el mensaje. Es posible que falte el signo | en el mensaje: ${text}`

const buildErrorCodeMessage = (code: string) =>
  `Error de código al enviar el mensaje. La longitud del código debe ser 8: ${code}`

type MsgValues = {
  day: string
  checkinTime: string
  phone: string
  room: string
  code: string
}

const getMessageValues = (text: string): MsgValues | undefined => {
  const values = text.split("|")

  if (values.length !== 5) {
    console.log("Invalid object", text)
    const msgError = buildErrorFormatMessage(text)
    whatsappclient.sendMessage(`${process.env.OWNER_PHONE}@c.us`, msgError)
    return undefined
  }

  const code = values[4].trim()

  if (code.length !== 8) {
    console.log("Invalid code ", code, "from text ", text)
    const msgError = buildErrorCodeMessage(code)
    whatsappclient.sendMessage(`${process.env.OWNER_PHONE}@c.us`, msgError)
    return undefined
  }

  const phoneParse = values[2].trim()
  const phoneWithoutPlus =
    phoneParse[0] === "+" ? phoneParse.slice(1) : phoneParse

  const notPrefixCondition = phoneWithoutPlus.length === 9 && (phoneWithoutPlus.charAt(0) === '6' || phoneWithoutPlus.charAt(0) === '7')

  const phoneWithPrefix = notPrefixCondition ? `34${phoneWithoutPlus}` : phoneWithoutPlus

  return {
    day: values[0].trim(),
    checkinTime: values[1].trim(),
    phone: phoneWithPrefix,
    room: values[3],
    code
  }
}

const processEmailAndMsg = async (
  imap: Imap | null
) => {
  if (!imap) {
    console.log('Not imap to process')
    return
  }

  console.log("Fetching new emails", imap.state)

  imap.openBox("INBOX", false, () => {
    imap.search(["UNSEEN"], (_err, results) => {
      if (results.length > 0) {
        const f = imap.fetch(results, { bodies: "" })

        f?.on("message", (msg) => {
          msg.on("body", (stream) => {
            var buffer = ""

            stream.on("data", function (chunk) {
              buffer += chunk.toString("utf8")
            })

            stream.once("end", function () {
              simpleParser(buffer, async (_err, parsed) => {
                const emailText = getEmailString(parsed.from?.text ?? "")

                const email = isValidEmail(emailText)
                  ? emailText
                  : undefined

                if (email) {
                  const msgValues = getMessageValues(parsed.text ?? "")

                  if (msgValues) {
                    const msg = buildMessage(msgValues)
                    whatsappclient.sendMessage(
                      `${msgValues.phone}@c.us`,
                      msg
                    )
                    console.log("Msg: ", msg)
                    whatsappclient.sendMessage(
                      `${msgValues.phone}@c.us`,
                      location
                    )
                  }
                } else {
                  console.log("Not valid email: ", emailText)
                }
              })
            })
          })

          msg.once("attributes", (attrs) => {
            const { uid, date } = attrs
            imap.addFlags(uid, ["\\Seen"], () => {
              console.log("Marked as read ", uid, date)
            })
          })
        })

        f.once("error", (ex) => {
          return Promise.reject(ex)
        })

        f.once("end", () => {
          console.log("Done fetching all messages")
        })
      } else {
        console.log("Not new emails found")
      }
    })
  })
}

let imap: Imap | null = null

export const getEmailsAndSendMsg = async () => {
  console.log('start getEmailsAndSendMsg')
  try {
    const waState = await whatsappclient.getState()
    console.log('WhatsApp state:', waState)

    if (waState !== "CONNECTED") {
      console.log("State not conected ", waState)
      return
    }

    if (imap) {
      console.log('Imap exist', imap.state)
      await processEmailAndMsg(imap)
    } else {
      console.log('new Imap')
      imap = new Imap(imapConfig)

      imap.once("ready", async () => {
        console.log("IMAP connection ready.")
        await processEmailAndMsg(imap)
      })

      imap.once("error", (ex: any) => {
        console.error("IMAP error: ", ex)
        imap?.end()
        imap = null
      })

      imap.once("end", () => {
        console.log("IMAP connection ended.")
        imap = null
      })

      imap.connect()
    }
  } catch (error) {
    console.log("An error has been occured", error)
  }
}
