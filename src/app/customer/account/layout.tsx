import { redirect } from 'next/navigation'
import { getCurrentClientUser } from '@/lib/auth'

export default async function CustomerAccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentClientUser()
  if (!user) {
    redirect('/customer/login?from=/customer/account')
  }
  return children
}
