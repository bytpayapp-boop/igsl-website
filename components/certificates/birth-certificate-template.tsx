interface BirthCertificateTemplateProps {
  data: any
  referenceNumber: string
}

export function BirthCertificateTemplate({
  data = {},
  referenceNumber,
}: BirthCertificateTemplateProps) {
  const registrationNumber = `IGSL-BC-2024-${referenceNumber.slice(-6)}`
  const issueDate = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="w-full bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-lg border-4 border-double border-primary">
      {/* Header with Decorative Elements */}
      <div className="text-center mb-8 pb-6 border-b-4 border-primary">
        <div className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
          FEDERAL REPUBLIC OF NIGERIA
        </div>
        <h1 className="text-4xl font-bold text-primary mb-2">
          CERTIFICATE OF BIRTH
        </h1>
        <p className="text-foreground/70 text-sm">
          IGSL LOCAL GOVERNMENT AREA
        </p>
      </div>

      {/* Main Information Section */}
      <div className="bg-white p-8 rounded border-2 border-primary/20 mb-8">
        <div className="space-y-6">
          {/* Entry Number */}
          <div className="text-center pb-4 border-b border-primary/20">
            <p className="text-foreground/70 text-sm font-semibold">ENTRY NUMBER</p>
            <p className="font-mono font-bold text-2xl text-primary">
              {registrationNumber}
            </p>
          </div>

          {/* Child Information */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-foreground/70 text-xs font-semibold mb-1">
                  1. NAME OF CHILD
                </p>
                <p className="font-bold text-lg text-foreground border-b-2 border-primary/20 pb-2">
                  {data.childFullName || '_____________________________'}
                </p>
              </div>

              <div>
                <p className="text-foreground/70 text-xs font-semibold mb-1">
                  2. DATE OF BIRTH
                </p>
                <p className="font-medium text-foreground border-b-2 border-primary/20 pb-2">
                  {data.dateOfBirth
                    ? new Date(data.dateOfBirth).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '_________________________'}
                </p>
              </div>

              <div>
                <p className="text-foreground/70 text-xs font-semibold mb-1">
                  3. PLACE OF BIRTH
                </p>
                <p className="font-medium text-foreground border-b-2 border-primary/20 pb-2">
                  {data.placeOfBirth || '_________________________'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-foreground/70 text-xs font-semibold mb-1">
                    4. GENDER
                  </p>
                  <p className="font-medium text-foreground border-b border-primary/20 pb-1 capitalize">
                    {data.gender || '____'}
                  </p>
                </div>
                <div>
                  <p className="text-foreground/70 text-xs font-semibold mb-1">
                    5. WARD
                  </p>
                  <p className="font-medium text-foreground border-b border-primary/20 pb-1">
                    {data.ward || '____'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-foreground/70 text-xs font-semibold mb-1">
                  6. FATHER&apos;S NAME
                </p>
                <p className="font-medium text-foreground border-b-2 border-primary/20 pb-2">
                  {data.fatherName || '_________________________'}
                </p>
              </div>

              <div>
                <p className="text-foreground/70 text-xs font-semibold mb-1">
                  7. FATHER&apos;S OCCUPATION
                </p>
                <p className="font-medium text-foreground border-b-2 border-primary/20 pb-2">
                  {data.fatherOccupation || '_________________________'}
                </p>
              </div>

              <div>
                <p className="text-foreground/70 text-xs font-semibold mb-1">
                  8. MOTHER&apos;S NAME
                </p>
                <p className="font-medium text-foreground border-b-2 border-primary/20 pb-2">
                  {data.motherName || '_________________________'}
                </p>
              </div>

              <div>
                <p className="text-foreground/70 text-xs font-semibold mb-1">
                  9. MOTHER&apos;S OCCUPATION
                </p>
                <p className="font-medium text-foreground border-b-2 border-primary/20 pb-2">
                  {data.motherOccupation || '_________________________'}
                </p>
              </div>
            </div>
          </div>

          {/* Registration Details */}
          <div className="border-t-2 border-primary/20 pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-foreground/70 text-xs font-semibold mb-1">
                  REGISTRATION DATE
                </p>
                <p className="font-medium text-foreground">{issueDate}</p>
              </div>
              <div>
                <p className="text-foreground/70 text-xs font-semibold mb-1">
                  REFERENCE NO.
                </p>
                <p className="font-mono font-medium text-foreground text-sm">
                  {referenceNumber}
                </p>
              </div>
              <div>
                <p className="text-foreground/70 text-xs font-semibold mb-1">
                  REGISTRAR
                </p>
                <p className="font-medium text-foreground">IGSL Vital Records</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Left Signature Box */}
        <div className="border-2 border-primary/20 p-6 rounded text-center">
          <div className="h-12 border-b-2 border-foreground mb-3"></div>
          <p className="text-xs font-semibold text-foreground/70">
            SIGNATURE OF REGISTRAR
          </p>
          <p className="text-xs text-foreground/70 mt-2">
            {issueDate}
          </p>
        </div>

        {/* Right Seal Box */}
        <div className="border-2 border-primary/20 p-6 rounded flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-4 border-accent rounded-full flex items-center justify-center mb-3">
            <span className="text-accent text-3xl">⚜</span>
          </div>
          <p className="text-xs font-semibold text-foreground/70">
            OFFICIAL SEAL
          </p>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="bg-accent/10 border-l-4 border-accent p-4 rounded text-xs text-foreground/70">
        <p className="font-semibold text-accent mb-1">CERTIFIED TRUE COPY</p>
        <p>
          This is a certified true copy of an entry in the register of births kept at the office
          of the Registrar of Vital Records, IGSL Local Government Area. Any alterations will
          render this certificate invalid.
        </p>
      </div>
    </div>
  )
}
