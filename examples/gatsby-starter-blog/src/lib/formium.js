import { createClient } from "@formium/client"

export default createClient(process.env.GATSBY_FORMIUM_PROJECT_ID)
