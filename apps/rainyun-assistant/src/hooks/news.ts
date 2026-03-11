import { useQuery } from "@tanstack/react-query"
import { getNews } from "@/api/rainyun"

export function useNews() {
  return useQuery<News[], Error>({
    queryKey: ["news"],
    queryFn: getNews,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
