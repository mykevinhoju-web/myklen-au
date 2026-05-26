import { redirect } from 'next/navigation'
import { CustomerAccountNav } from '@/components/customer/customer-account-nav'
import { ClientLogout } from '@/components/ClientLogout'
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

  return (
    <div className="page">
      <div className="schedule-page__header">
        <div>
          <p className="eyebrow">My page</p>
          <h1 className="display-title text-3xl" style={{ marginBottom: '8px' }}>
            Hello, {user.displayName}
          </h1>
        </div>
        <ClientLogout />
      </div>

      <CustomerAccountNav />
      {children}
    </div>
  )
}
