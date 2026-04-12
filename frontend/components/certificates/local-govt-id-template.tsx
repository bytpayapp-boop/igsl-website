'use client'

interface LocalGovtIdTemplateProps {
  data: any
  referenceNumber: string
}

function TopLogo() {
  return (
    <div className="relative mb-1 h-[72px] w-[96px] flex items-center justify-center">
      <img
        src="/coatOfArm.png"
        alt="Nigerian Coat of Arms"
        className="h-full w-full object-contain"
      />
    </div>
  )
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

export function LocalGovtIdTemplate({
  data = {},
  referenceNumber,
}: LocalGovtIdTemplateProps) {
  const idNumber = `IGSL/AD/${referenceNumber.slice(-5)}`
  const issueDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#e9ecef] flex items-center justify-center p-6">
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

        <div className="relative z-10 h-full px-12 pt-8 pb-8 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-center mb-2">
            <div className="flex flex-col pt-4 items-center">
              <TopLogo />
              <p className="text-[14px] font-bold tracking-[0.01em]">
                Government of Enugu State of Nigeria
              </p>
            </div>
            <div className="absolute right-12 text-right leading-tight pt-6">
               <div className="text-[14px] mt-2 mr-2 font-semibold">
                No. <span className="font-normal">{referenceNumber.slice(-5)}</span>
              </div>
             
            </div>
          </div>

          <h1
            className="text-center text-[#107e66] font-bold text-[27px] tracking-[0.02em] leading-none uppercase"
            style={{
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            IGBO-EZE SOUTH LOCAL GOVERNMENT
          </h1>

          <div className="text-center mt-2 mb-2">
            <div
              className="text-[#b24a43] text-[36px] leading-none font-bold"
              style={{
                fontFamily: 'UnifrakturMaguntia, serif',
              }}
            >
              Identification Certificate
            </div>
          </div>

          {/* TO WHOM IT MAY CONCERN */}
          <div className="mt-4 text-center mb-4">
            <p className="text-[16px] font-bold tracking-[0.05em]">TO WHOM IT MAY CONCERN</p>
          </div>

          {/* Certificate Body */}
          <div className="mt-2 text-[14px] flex-1 px-4 space-y-3">
            <p className="flex items-baseline gap-1">
              <span>This is to certify that</span>
              <span
                className="text-[#3d77a6] text-[15px] tracking-wide flex-1 border-b border-solid border-[#3d77a6] pb-0"
                style={{
                  fontFamily: '"Comic Sans MS", "Segoe Print", cursive',
                }}
              >
                {data.fullName || '_'.repeat(30)}
              </span>
            </p>

            <p className="flex items-baseline gap-1">
              <span>Hails from</span>
              <span
                className="text-[#3d77a6] text-[15px] tracking-wide flex-1 border-b border-solid border-[#3d77a6] pb-0"
                style={{
                  fontFamily: '"Comic Sans MS", "Segoe Print", cursive',
                }}
              >
                {data.originTown || '_'.repeat(20)}
              </span>
              <span>Village</span>
              <span
                className="text-[#3d77a6] text-[15px] tracking-wide flex-1 border-b border-solid border-[#3d77a6] pb-0"
                style={{
                  fontFamily: '"Comic Sans MS", "Segoe Print", cursive',
                }}
              >
                {data.village || '_'.repeat(15)}
              </span>
            </p>

            <p className="font-bold text-md">
              in Igbo-Eze South Local Government Area of Enugu State.
            </p>

            <p className="flex items-baseline gap-1">
              <span>He/She lives at:</span>
              <span
                className="text-[#3d77a6] text-[15px] tracking-wide flex-1 border-b border-solid border-[#3d77a6] pb-0"
                style={{
                  fontFamily: '"Comic Sans MS", "Segoe Print", cursive',
                }}
              >
                {data.residentialAddress || '_'.repeat(40)}
              </span>
            </p>

            <p className="flex items-baseline gap-1">
              <span>Ward:</span>
              <span
                className="text-[#3d77a6] text-[15px] tracking-wide flex-1 border-b border-solid border-[#3d77a6] pb-0"
                style={{
                  fontFamily: '"Comic Sans MS", "Segoe Print", cursive',
                }}
              >
                {data.ward || '_'.repeat(20)}
              </span>
            </p>

            <p className="flex items-baseline gap-1">
              <span>Dated this:</span>
              <span 
                className="text-[#3d77a6] text-[15px] tracking-wide flex-1 border-b border-solid border-[#3d77a6] pb-0"
                style={{
                  fontFamily: '"Comic Sans MS", "Segoe Print", cursive',
                }}
              >
                {new Date().getDate()} day of {issueDate.split(' ')[1]} {issueDate.split(' ')[2]}.
              </span>
            </p>

            <div className="mt-6">
              <p className="font-bold text-center">THE PURPOSE FOR THIS CERTIFICATION</p>
              <p className="mt-2 text-center border-b border-dotted border-[#8c8c8c] min-h-[24px]">
                <span
                  className="text-[#3d77a6] text-[15px] tracking-wide"
                  style={{
                    fontFamily: '"Comic Sans MS", "Segoe Print", cursive',
                  }}
                >
                  {data.purpose || 'All Official Purposes'}
                </span>
              </p>
            </div>

            <p className="text-[12px] text-foreground/70 mt-4 text-center leading-relaxed">
              <span className="font-semibold">NOTE:</span> This certificate of identification is valid only for the purpose stated above.
            </p>
          </div>

          {/* Date and Signatures */}
          <div className="mt-6 px-4 text-[13px]">
           

            <div className="flex justify-between mb-[250px] items-end mt-12">
              <div className="text-center">
                <div className="h-12 border-b border-foreground/50 w-32 mb-1"></div>
                <p className="text-[12px] font-semibold">SECRETARY</p>
                <p className="text-[10px]">Igbo-Eze South L.G</p>
              </div>
          
            </div>
          </div>

          {/* Official Stamp */}
          <div className="absolute right-[60px] bottom-[250px] -mt-24 rotate-[-15deg]">
            <img
              src="/chairmanStamp1.1.png"
              alt="Official Stamp"
              className="w-[200px] h-auto object-contain"
              style={{ opacity: 0.85 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
