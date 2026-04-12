import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">About IGSL</h1>
          <p className="text-lg text-foreground/70">
            Learn more about our local government and the services we provide to our community.
          </p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Our Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80 leading-relaxed">
                IGSL Local Government is dedicated to the development and welfare of our community. With a focus on transparency, accountability, and citizen participation, we work tirelessly to improve the quality of life for all residents within our jurisdiction.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Our administration comprises experienced professionals committed to implementing policies that promote economic development, social welfare, and infrastructure advancement.
              </p>
            </CardContent>
          </Card>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">
                  A prosperous, peaceful, and progressive local government where all citizens have equal opportunities for social and economic advancement.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">
                  To provide efficient and responsive governance, deliver quality services, and foster community participation in development initiatives.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Core Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Integrity', desc: 'Honesty and ethical conduct in all dealings' },
                  { title: 'Transparency', desc: 'Open and accountable government operations' },
                  { title: 'Inclusivity', desc: 'Equal representation and participation for all' },
                  { title: 'Excellence', desc: 'Commitment to high-quality service delivery' },
                  { title: 'Sustainability', desc: 'Focus on long-term community development' },
                  { title: 'Innovation', desc: 'Embracing modern solutions and best practices' },
                ].map((value) => (
                  <div key={value.title}>
                    <h4 className="font-bold text-primary mb-2">{value.title}</h4>
                    <p className="text-foreground/70">{value.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Facts */}
          <Card className="border-border bg-secondary/5">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Quick Facts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">●</span>
                  <span className="text-foreground/80">Population: Over 45,000 citizens</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">●</span>
                  <span className="text-foreground/80">Number of Wards: 12 local government wards</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">●</span>
                  <span className="text-foreground/80">Departments: 8 functional departments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">●</span>
                  <span className="text-foreground/80">Year Established: Established with long history of service</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">●</span>
                  <span className="text-foreground/80">Office Location: Government House, IGSL</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
