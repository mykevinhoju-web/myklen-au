import { LayerSection } from '@/components/layer-section'

export const metadata = { title: 'Training' }

export default function TrainingPage() {
  return (
    <div className="site-stack mx-auto w-full max-w-[90rem] px-3 py-3 sm:px-4 md:px-5">
      <LayerSection className="layer-inner mx-auto max-w-3xl">
        <p className="type-eyebrow">Education</p>
        <h1 className="type-display mt-3 text-3xl sm:text-4xl">Training that gets you job-ready</h1>
        <p className="type-lead mt-5">
          Even with no prior experience, you can learn how to clean professionally, win local clients, and
          run bookings with confidence. Every package includes core modules; Premium adds live onboarding.
        </p>
        <ul className="mt-10 space-y-4 border-t border-black/8 pt-8 text-[#0a0a0a]/85">
          {[
            'Residential & office cleaning standards and safety',
            'Quoting, scheduling, and customer communication',
            'Using your branded booking link (phased rollout)',
            'Reviews, feedback, and repeat-booking habits',
            'Local marketing: flyers, referrals, and neighbourhood presence',
          ].map((item) => (
            <li key={item} className="flex gap-3 text-base leading-relaxed">
              <span className="text-[#0a0a0a]">—</span>
              {item}
            </li>
          ))}
        </ul>
      </LayerSection>
    </div>
  )
}
