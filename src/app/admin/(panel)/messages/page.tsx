import { AdminClientMessages } from '@/components/admin/AdminClientMessages'

export default function AdminMessagesPage() {
  return (
    <div>
      <h1 className="admin-page-title">Messages</h1>
      <p className="admin-page-lead">
        Read posts from logged-in clients and reply below each message. Replies appear on the
        client&apos;s message page.
      </p>
      <AdminClientMessages />
    </div>
  )
}
