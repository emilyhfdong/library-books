import { Client } from "@notionhq/client"
import { config } from "./environment"

export const notion = new Client({
  auth: config.notion.token,
})
