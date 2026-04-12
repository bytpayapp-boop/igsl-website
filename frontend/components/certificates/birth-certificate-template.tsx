'use client'

import { useRef } from "react"
import dayjs from 'dayjs'

interface BirthCertificateTemplateProps {
  data: any
  referenceNumber: string
  printableArea: HTMLDivElement
}

function LargeCenterBackground() {
  return (
    <div className="absolute inset-0 opacity-[0.08] pointer-events-none overflow-hidden flex items-center justify-center">
      <img
        src="/coatOfArm.png"
        alt="Background Watermark"
        className="w-96 h-96 object-contain"
        aria-hidden="true"
      />
    </div>
  )
}

function TopLogo() {
  return (
    <div className="relative mb-1 h-[72px] w-[96px] flex items-center justify-center">
      <img
        src="/coatOfArm.png"
        alt="Enugu State Coat of Arms"
        className="h-full w-full object-contain"
      />
    </div>
  )
}

export function BirthCertificateTemplate({
  data,
  referenceNumber,
  printableArea
}: BirthCertificateTemplateProps) {
  const issueDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const formatDateOfBirth = (date: any) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })
  }

  const calculateAge = (birthDate: any) => {
    if (!birthDate) return ""
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const rows = [
    ["1.", "No.IGSL/AD/", calculateAge(data.dateOfBirth) || ""],
    ["2.", "Date of Birth.", formatDateOfBirth(data.dateOfBirth)],
    ["3.", "Place of Birth.", data.placeOfBirth || ""],
    ["4.", "Sex of Child.", data.gender || ""],
    ["5.", "Full Name of Child (if any)", data.childFullName || ""],
    ["6.", "Full Name and Tribe of Father.", (data.fatherName ? data.fatherName + "\n" : "") + (data.fatherTribe || "")],
    ["7.", "Full Maiden Name and Tribe of Mother.", (data.motherName ? data.motherName + "\n" : "") + (data.motherTribe || "")],
    ["8.", "Occupation of Father.", data.fatherOccupation || ""],
    ["9.", "Occupation of Mother.", data.motherOccupation || ""],
    ["10.", "Signature, description and address of informant.", ""],
    ["11.", "Date of Registration.", issueDate],
    ["12.", "Signature of Registrar.", ""],
    ["13.", "Name of Child (if added after date of registration)", data.childNameAdded || ""],
  ] as const

  return (
    <div
      ref={printableArea}
      className="min-h-screen bg-[#e9ecef] flex items-center justify-center p-6"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Montserrat:wght@400;700&display=swap');
      `}</style>
      <div
        className="relative w-full max-w-[860px] aspect-[0.82] bg-[#f3f1ea] shadow-2xl overflow-hidden border border-[#9aa39c] text-[#2b2b2b]"
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        <LargeCenterBackground />

        <div
          className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #000 0.7px, transparent 0.8px)",
            backgroundSize: "14px 14px",
          }}
        />

        {/* Decorative Borders */}
        <div className="absolute inset-[16px] border-[10px] border-[#0c8b72]" />
        <div className="absolute inset-[36px] border-[3px] border-[#0c8b72]" />

        {/* Decorative Corner Triangles */}
        {/* <div className="absolute left-[19px] top-[90px] w-0 h-0 border-t-[24px] border-t-transparent border-b-[24px] border-b-transparent border-r-[16px] border-r-[#d5d8d4]" />
        <div className="absolute left-[19px] bottom-[110px] w-0 h-0 border-t-[24px] border-t-transparent border-b-[24px] border-b-transparent border-r-[16px] border-r-[#d5d8d4]" />
        
        <div className="absolute right-[19px] top-[90px] w-0 h-0 border-t-[24px] border-t-transparent border-b-[24px] border-b-transparent border-l-[16px] border-l-[#d5d8d4]" />
        <div className="absolute right-[19px] bottom-[110px] w-0 h-0 border-t-[24px] border-t-transparent border-b-[24px] border-b-transparent border-l-[16px] border-l-[#d5d8d4]" />
        */}

        <div className="relative z-10 h-full px-12 pt-8 pb-8 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="w-16" />
            <div className="flex-1 flex flex-col pt-4 items-center">
              <TopLogo />
              <p className="text-[14px] font-bold tracking-[0.01em]">
                Government of Enugu State of Nigeria
              </p>
            </div>
            <div className="text-right leading-tight pt-1">
              <div
                className="text-[18px] font-bold pt-4 pr-2 tracking-tight"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                FORM D
              </div>
              <div className="text-[14px] mt-2 mr-2 font-semibold">
                No. <span className="font-normal">{referenceNumber.slice(-5)}</span>
              </div>
            </div>
          </div>

          <h1
            className="text-center text-[#107e66] font-bold text-[27px] tracking-[0.02em] leading-none mt-1 uppercase"
            style={{
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            IGBO-EZE SOUTH LOCAL GOVERNMENT
          </h1>

          <div className="text-center mt-1">
            <div
              className="text-[#b24a43] text-[30px] leading-none"
              style={{
                fontFamily: 'UnifrakturMaguntia, serif',
              }}
            >
              Birth Certificate
            </div>
          </div>

          <div className="mt-2 flex justify-center">
            <div className="bg-[#4b4f55] text-white px-5 py-1 w-full text-center flex items-center justify-center rounded-sm text-[14px] italic font-semibold shadow-sm">
              Bye-laws 3 and 5
            </div>
          </div>

          {/* Form Fields */}
          <div className="mt-5 text-[15px] flex-1 p-4">
            {rows.map(([num, label, value], idx) => (
              <div
                key={idx}
                className={`grid grid-cols-[24px_auto_1fr] items-end gap-2 border-b border-dotted border-[#8c8c8c] ${
                  idx === 9 || idx === 12 ? "min-h-[58px]" : "min-h-[34px]"
                }`}
              >
                <div className="pb-1 text-[15px]">{num}</div>
                <div className="pb-1 whitespace-nowrap">{label}</div>
                <div className="relative min-h-[28px] flex items-end pb-1">
                  <span
                    className="whitespace-pre-line text-[#3d77a6] text-[17px] tracking-wide"
                    style={{
                      fontFamily: '"Comic Sans MS", "Segoe Print", cursive',
                      transform: "rotate(-2deg)",
                    }}
                  >
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Official Seal */}
          <div className="absolute right-[80px] bottom-[130px] -mt-24 rotate-[-15deg]">
            <img
              src="/chairmanStamp1.1.png"
              alt="Chairman Stamp"
              className="w-[240px] h-auto object-contain"
              style={{ opacity: 0.9 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
