'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { fetchStaffMembers } from '@/lib/api/staffApi'
import { StaffMember } from '@/lib/types'
import { useRouter } from 'next/navigation'

function buildStaffRows(members: StaffMember[]) {
  return [
    members.slice(0, 1),
    members.slice(1, 3),
    members.slice(3, 6),
    members.slice(6, 9),
    members.slice(9, 12),
    members.slice(12, 15),
    members.slice(15, 18),
    members.slice(18, 21),
    members.slice(21),
  ].filter((row) => row.length > 0)
}

export default function StaffPage() {
  const router = useRouter()
  const [members, setMembers] = useState<StaffMember[]>([])

  useEffect(() => {
    fetchStaffMembers()
      .then((data) => {
        if (data.length) {setMembers(data);console.log('Staff members;',data);}
      })
      .catch(() => {});

      


  }, [])

  const staffRows = useMemo(() => buildStaffRows(members), [members])
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
          <h1 className="mt-4 text-4xl md:text-5xl font-bold">Our Staff</h1>
          <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
            The leadership and staff of the local government council, working together to serve
            our communities with integrity, dedication, and attention to public needs.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl pb-10">
          {members.length === 0 && (
            <p className="text-center text-foreground/60 py-12">Loading staff...</p>
          )}

          {staffRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className='mb-10 gap-8 md:gap-16 flex items-center justify-center flex-row'
              // className={`relative flex justify-center ${
              //   rowIndex === 0 ? 'mb-10 md:mb-12' : rowIndex === 1 ? 'mb-10 gap-8 md:gap-16' : 'gap-6 md:gap-12'
              // }`}
            >
              {row.map((member) => {
                if(!member.profileImage)return;
                return(
                <div
                onClick={()=>{localStorage.setItem('staff',JSON.stringify(member));router.push(`/staff/${member.name}?`)}}
                  key={member.id}
                  
                  className="group flex cursor-pointer w-40 flex-col items-center text-center transition-transform duration-200 hover:-translate-y-2 md:w-48"
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
                    <h2 className="text-base font-bold md:text-lg">{member.name}</h2>
                    <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
                  </div>
                </div>
              )})}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
