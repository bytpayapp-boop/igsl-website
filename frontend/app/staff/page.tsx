'use client'
import Link from 'next/link'
import { mockStaffMembers } from '@/lib/mock-data'
import { useRouter } from 'next/navigation'

const staffRows = [
  mockStaffMembers.slice(0, 1),
  mockStaffMembers.slice(1, 3),
  mockStaffMembers.slice(3, 6),
]

export default function StaffPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100/60 via-background to-gray-100/40 dark:from-gray-800 dark:via-background/50 dark:to-gray-700">
      <Link href="/" className="flex items-center gap-3 font-bold text-xl top-3 md:top-5 left-5 md:left-10 absolute md:block md:flex hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-md">
              <img 
                src="/coatOfArm.png" 
                alt="Nigerian Coat of Arms" 
                className="w-5 md:w-10 h-5 md:h-10"
              />
            </div>
            <span className="sm:inline text-gray-700 dark:text-gray-300">IGSL</span>
          </Link> 
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-16">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary/80">
           Igbo-Eze South Local Government 
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-primary">Our Staff</h1>
          <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
            The leadership and staff of the local government council, working together to serve
            our communities with integrity, dedication, and attention to public needs.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl pb-10">
          {/* <div className="absolute left-1/2 top-12 hidden h-[72%] w-px -translate-x-1/2 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20 md:block" /> */}

          {staffRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`relative flex justify-center ${
                rowIndex === 0 ? 'mb-10 md:mb-12' : rowIndex === 1 ? 'mb-10 gap-8 md:gap-16' : 'gap-6 md:gap-12'
              }`}
            >
              {row.map((member) => (
                <div
                onClick={()=>{localStorage.setItem('staff',JSON.stringify(member));router.push(`/staff/${member.name}?`)}}
                  key={member.id}
                  
                  className="group flex w-40 flex-col items-center text-center transition-transform duration-200 hover:-translate-y-2 md:w-48"
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/15 blur-xl" />
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      className="relative h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-lg shadow-primary/10 md:h-32 md:w-32"
                    />
                  </div>

                  <div className="mt-4 text-center">
                    <h2 className="text-base font-bold text-primary md:text-lg">{member.name}</h2>
                    <p className="mt-1 text-sm font-medium text-foreground/80">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
