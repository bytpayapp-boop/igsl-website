interface LocalGovtIdTemplateProps {
  data: any
  referenceNumber: string
}

export function LocalGovtIdTemplate({
  data = {},
  referenceNumber,
}: LocalGovtIdTemplateProps) {
  const idNumber = `IGSL-LGI-2024-${referenceNumber.slice(-6)}`
  const issueDate = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="w-full bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-lg border-2 border-primary">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-primary/30">
        <div className="inline-block bg-primary text-white px-3 py-1 rounded text-sm font-bold mb-3">
          IGSL LOCAL GOVERNMENT AREA
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Official Identification Document
        </h1>
        <p className="text-foreground/70 text-sm">
          Federal Republic of Nigeria
        </p>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Left: Holder Information */}
        <div>
          <div className="bg-white p-6 rounded border-2 border-primary/20 mb-4">
            <h3 className="text-primary font-bold text-sm mb-4 pb-2 border-b border-primary/20">
              HOLDER INFORMATION
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-foreground/70 text-xs font-semibold">FULL NAME</p>
                <p className="font-bold text-foreground text-lg">
                  {data.fullName || '____________________'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-foreground/70 text-xs font-semibold">DATE OF BIRTH</p>
                  <p className="font-medium text-foreground">
                    {data.dateOfBirth
                      ? new Date(data.dateOfBirth).toLocaleDateString()
                      : '__/__/____'}
                  </p>
                </div>
                <div>
                  <p className="text-foreground/70 text-xs font-semibold">GENDER</p>
                  <p className="font-medium text-foreground capitalize">
                    {data.gender || '___'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-foreground/70 text-xs font-semibold">WARD</p>
                <p className="font-medium text-foreground">
                  {data.ward || '____________________'}
                </p>
              </div>
              <div>
                <p className="text-foreground/70 text-xs font-semibold">CONTACT</p>
                <p className="font-medium text-foreground">
                  {data.phone || '+234________________'}
                </p>
              </div>
            </div>
          </div>

          {/* Photo Placeholder */}
          <div className="bg-muted border-2 border-dashed border-primary/30 aspect-square flex items-center justify-center rounded">
            <div className="text-center">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-xs text-foreground/50 font-semibold">PHOTOGRAPH</p>
            </div>
          </div>
        </div>

        {/* Right: Official Details */}
        <div>
          <div className="bg-white p-6 rounded border-2 border-primary/20 mb-4 h-full">
            <h3 className="text-primary font-bold text-sm mb-4 pb-2 border-b border-primary/20">
              DOCUMENT DETAILS
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-foreground/70 text-xs font-semibold">ID NUMBER</p>
                <p className="font-mono font-bold text-lg text-primary">
                  {idNumber}
                </p>
              </div>
              <div>
                <p className="text-foreground/70 text-xs font-semibold">REFERENCE NUMBER</p>
                <p className="font-mono font-medium text-foreground text-sm">
                  {referenceNumber}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-foreground/70 text-xs font-semibold">ISSUE DATE</p>
                  <p className="font-medium text-foreground">{issueDate}</p>
                </div>
                <div>
                  <p className="text-foreground/70 text-xs font-semibold">VALIDITY</p>
                  <p className="font-medium text-foreground">Permanent</p>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="flex justify-center py-4">
                <div className="w-24 h-24 border-2 border-dashed border-primary/30 flex items-center justify-center rounded">
                  <p className="text-xs text-foreground/50">QR CODE</p>
                </div>
              </div>

              {/* Official Seal */}
              <div className="text-center">
                <div className="inline-block">
                  <div className="w-16 h-16 border-4 border-accent rounded-full flex items-center justify-center">
                    <span className="text-accent font-bold text-xl">⚜</span>
                  </div>
                  <p className="text-xs text-foreground/50 font-semibold mt-1">
                    OFFICIAL SEAL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-primary/30 pt-6 text-center">
        <p className="text-xs text-foreground/70 mb-3">
          This is an official document issued by IGSL Local Government Area. For verification,
          visit our portal.
        </p>
        <div className="flex justify-around text-center text-sm">
          <div>
            <p className="text-foreground/70 text-xs mb-2">AUTHORIZED BY</p>
            <div className="h-8 border-b border-foreground/50 w-32"></div>
            <p className="text-xs text-foreground/70 mt-1 font-semibold">Chairman, IGSL</p>
          </div>
          <div>
            <p className="text-foreground/70 text-xs mb-2">CERTIFIED BY</p>
            <div className="h-8 border-b border-foreground/50 w-32"></div>
            <p className="text-xs text-foreground/70 mt-1 font-semibold">Registrar</p>
          </div>
        </div>
      </div>
    </div>
  )
}
