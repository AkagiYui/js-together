import { http } from "./_base"

interface NewsResponse {
  TimeStamp: string
  Title: string
  Type: string
  URL: string
}

export async function getNews(): Promise<News[]> {
  const response = await http.get<RYSuccessResponse<NewsResponse[]>>("/news")
  return response.data.data.map((item) => ({
    time: new Date(item.TimeStamp),
    title: item.Title,
    type: item.Type as News["type"],
    url: item.URL,
  }))
}
