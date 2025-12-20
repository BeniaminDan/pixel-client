import { Badge } from "@/shared/ui/reusable/badge"
import { Card, CardContent } from "@/shared/ui/reusable/card"
import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline">
            <FileText className="size-3 mr-1.5" />
            Legal
          </Badge>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: December 18, 2024</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-neutral dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Pixel (&#34;the Service&#34;), you accept and agree
              to be bound by the terms and provision of this agreement. If you do
              not agree to abide by the above, please do not use this service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Pixel provides a collaborative digital canvas platform where users
              can purchase credits to place pixels, creating permanent digital
              artwork. The Service includes:
            </p>
            <ul>
              <li>A shared canvas for pixel placement</li>
              <li>Credit purchasing and management</li>
              <li>The Throne (Focal Point) bidding system</li>
              <li>Community features including galleries and leaderboards</li>
            </ul>

            <h2>3. User Accounts</h2>
            <p>
              To use certain features of the Service, you must register for an
              account. You agree to:
            </p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h2>4. Purchases and Credits</h2>
            <p>
              Credits purchased through the Service are non-transferable and
              non-refundable except as required by law. Credits do not expire.
              Pixel placement is permanent and cannot be undone after the grace
              period.
            </p>

            <h2>5. The Throne (Focal Point)</h2>
            <p>
              The Throne at coordinates (0,0) operates under a bidding system:
            </p>
            <ul>
              <li>Minimum bid increment is 20% above current value</li>
              <li>Current holders have 24 hours to match or exceed challenges</li>
              <li>Ties favor the current holder</li>
              <li>Throne transfers are final</li>
            </ul>

            <h2>6. Content Guidelines</h2>
            <p>
              Users are responsible for the content they place on the canvas.
              Prohibited content includes:
            </p>
            <ul>
              <li>Illegal, harmful, or offensive material</li>
              <li>Content that infringes intellectual property rights</li>
              <li>Spam, advertisements, or promotional content without permission</li>
              <li>Content that violates others&#39; privacy</li>
            </ul>
            <p>
              We reserve the right to remove content and suspend accounts that
              violate these guidelines.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              Users retain ownership of the original artwork they create on the
              canvas. By placing pixels, you grant Pixel a non-exclusive,
              worldwide license to display, reproduce, and distribute your
              content as part of the Service.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              Pixel shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of or
              inability to use the Service.
            </p>

            <h2>9. Modifications to Service</h2>
            <p>
              We reserve the right to modify or discontinue the Service at any
              time. We will make reasonable efforts to preserve canvas data and
              notify users of significant changes.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with
              applicable laws, without regard to conflict of law principles.
            </p>

            <h2>11. Contact</h2>
            <p>
              For questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@pixel.dev" className="text-primary">
                legal@pixel.dev
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
