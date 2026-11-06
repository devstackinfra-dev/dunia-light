import { redirect } from "next/navigation"
import { REVISTA_ARTICLES } from "@/data/revista-posts"

export async function generateStaticParams() {
  return REVISTA_ARTICLES.map((article) => ({
    slug: article.slug,
  }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  redirect(`/revista/${params.slug}`)
}
