import { Badge } from "@/shared/ui/reusable/badge"
import { Card, CardContent } from "@/shared/ui/reusable/card"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline">
            <Shield className="size-3 mr-1.5" />
            Legal
          </Badge>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: December 18, 2024</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-neutral dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              At Pixel, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our service.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>Information You Provide</h3>
            <ul>
              <li>Account information (email, username, password)</li>
              <li>Profile information (display name, avatar)</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Content you create (pixel placements, comments)</li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <ul>
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, features used, timestamps)</li>
              <li>IP address and approximate location</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide and maintain the Service</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative notifications</li>
              <li>Respond to inquiries and provide support</li>
              <li>Improve and personalize the Service</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>
                <strong>Service Providers:</strong> Third parties that help us
                operate the Service (payment processors, hosting, analytics)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect our rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger,
                acquisition, or sale of assets
              </li>
            </ul>
            <p>
              We do not sell your personal information to third parties for
              marketing purposes.
            </p>

            <h2>5. Public Information</h2>
            <p>
              Certain information is publicly visible on the canvas and in the
              community:
            </p>
            <ul>
              <li>Your username and profile avatar</li>
              <li>Pixels you have placed and their locations</li>
              <li>Throne holding history and leaderboard rankings</li>
              <li>Gallery submissions and associated metadata</li>
            </ul>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your information, including:
            </p>
            <ul>
              <li>Encryption in transit and at rest</li>
              <li>Secure authentication practices</li>
              <li>Regular security assessments</li>
              <li>Access controls and monitoring</li>
            </ul>

            <h2>7. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or
              as needed to provide services. Canvas data (pixels placed) is
              retained permanently as part of the collaborative artwork. You may
              request deletion of your account data by contacting us.
            </p>

            <h2>8. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent where applicable</li>
            </ul>

            <h2>9. Cookies</h2>
            <p>
              We use cookies and similar technologies to remember your
              preferences, authenticate sessions, and analyze usage. You can
              control cookie preferences through our cookie consent banner and
              your browser settings.
            </p>

            <h2>10. Children&#39;s Privacy</h2>
            <p>
              The Service is not intended for children under 13. We do not
              knowingly collect information from children under 13. If you believe
              we have collected such information, please contact us immediately.
            </p>

            <h2>11. International Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              for such transfers.
            </p>

            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify
              you of significant changes by posting the new policy on this page
              and updating the &#34;Last updated&#34; date.
            </p>

            <h2>13. Contact Us</h2>
            <p>
              For questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@pixel.dev" className="text-primary">
                privacy@pixel.dev
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
