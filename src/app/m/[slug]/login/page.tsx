type Props = { params: Promise<{ slug: string }> }

export default async function TenantCustomerLoginPage({ params }: Props) {
  const { slug } = await params

  return (
    <>
      <h1 className="text-xl font-bold text-teal-950">Customer login</h1>
      <p className="mt-2 text-sm text-teal-900/75">
        Separate from manager and admin logins. Registration will be invite or email link from your
        cleaner (Phase 3).
      </p>
      <p className="mt-4 text-sm text-teal-700">
        Tenant: <span className="font-mono">{slug}</span>
      </p>
    </>
  )
}
