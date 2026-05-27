import { AdminContactInquiries } from '@/components/admin/AdminContactInquiries'

export default function AdminContactInquiriesPage() {
  return (
    <div>
      <h1 className="admin-page-title">Contact</h1>
      <p className="admin-page-lead">
        Messages submitted from the public <strong>/contact</strong> page. Open an inquiry to mark it as read and
        save a reply note (status becomes Replied).
      </p>
      <AdminContactInquiries />
    </div>
  )
}

