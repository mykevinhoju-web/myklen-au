import Link from 'next/link'
import { AdminClientMessages } from '@/components/admin/AdminClientMessages'

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-lead">
        Manage client logins and cleaning schedules. Clients sign in at{' '}
        <strong className="font-medium text-slate-200">/customer/login</strong> to view visits and
        send you notes.
      </p>

      <div className="admin-dash-grid">
        <Link href="/admin/users" className="admin-dash-card">
          <span className="admin-dash-card__title">Client logins →</span>
          <span className="admin-dash-card__desc">
            Create usernames and passwords for your cleaning clients
          </span>
        </Link>
        <Link href="/admin/appointments" className="admin-dash-card">
          <span className="admin-dash-card__title">Cleaning schedule →</span>
          <span className="admin-dash-card__desc">Assign visits and see all clients on one calendar</span>
        </Link>
      </div>

      <AdminClientMessages />
    </div>
  )
}
