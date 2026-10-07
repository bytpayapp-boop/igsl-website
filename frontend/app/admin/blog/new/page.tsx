import { redirect } from 'next/navigation'

export default function BlogNewRedirectPage() {
  redirect('/admin/posts/new')
}
