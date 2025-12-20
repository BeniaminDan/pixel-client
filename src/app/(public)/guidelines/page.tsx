import { Badge } from "@/shared/ui/reusable/badge"
import { Card, CardContent } from "@/shared/ui/reusable/card"
import { Users, Check, X, AlertTriangle } from "lucide-react"

export default function GuidelinesPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline">
            <Users className="size-3 mr-1.5" />
            Community
          </Badge>
          <h1 className="text-4xl font-bold">Community Guidelines</h1>
          <p className="text-muted-foreground">Last updated: December 18, 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Community Values</h2>
              <p className="text-muted-foreground mb-6">
                Pixel is a collaborative space where creativity thrives. These
                guidelines help ensure everyone can enjoy and contribute to our
                shared canvas. By using Pixel, you agree to follow these
                guidelines.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 text-green-600">
                    <Check className="size-5" />
                    Do
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="size-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Create original artwork and express yourself</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Respect other creators and their work</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Collaborate and coordinate with others</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Report violations through proper channels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Be kind and supportive in community spaces</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 text-red-600">
                    <X className="size-5" />
                    Don&#39;t
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <X className="size-4 text-red-600 mt-0.5 shrink-0" />
                      <span>Post offensive, hateful, or illegal content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="size-4 text-red-600 mt-0.5 shrink-0" />
                      <span>Harass, bully, or threaten other users</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="size-4 text-red-600 mt-0.5 shrink-0" />
                      <span>Use bots or automation to place pixels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="size-4 text-red-600 mt-0.5 shrink-0" />
                      <span>Spam or place disruptive patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="size-4 text-red-600 mt-0.5 shrink-0" />
                      <span>Impersonate others or create fake accounts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 prose prose-neutral dark:prose-invert max-w-none">
              <h2>Content Standards</h2>

              <h3>Prohibited Content</h3>
              <p>
                The following types of content are not allowed on the canvas:
              </p>
              <ul>
                <li>
                  <strong>Hate speech:</strong> Content that promotes violence or
                  hatred against individuals or groups based on race, ethnicity,
                  religion, gender, sexual orientation, disability, or other
                  protected characteristics.
                </li>
                <li>
                  <strong>Explicit content:</strong> Pornographic, sexually
                  explicit, or gratuitously violent imagery.
                </li>
                <li>
                  <strong>Illegal content:</strong> Content that promotes or
                  depicts illegal activities.
                </li>
                <li>
                  <strong>Personal information:</strong> Sharing others&#39; private
                  information without consent (doxxing).
                </li>
                <li>
                  <strong>Intellectual property violations:</strong> Unauthorized
                  use of copyrighted or trademarked material.
                </li>
              </ul>

              <h3>Acceptable Content</h3>
              <p>We encourage:</p>
              <ul>
                <li>Original pixel art and creative designs</li>
                <li>Collaborative community projects</li>
                <li>Fan art (where fair use applies)</li>
                <li>Memes and internet culture references</li>
                <li>Personal expression and artistic statements</li>
              </ul>

              <h2>Fair Play</h2>

              <h3>Pixel Placement</h3>
              <ul>
                <li>
                  Each user must place pixels manually. Automated placement tools
                  are prohibited.
                </li>
                <li>
                  Coordination between users for collaborative art is allowed and
                  encouraged.
                </li>
                <li>
                  Intentionally disrupting or vandalizing others&#39; work may result
                  in account suspension.
                </li>
              </ul>

              <h3>Throne Competition</h3>
              <ul>
                <li>Bidding manipulation or collusion is prohibited.</li>
                <li>
                  Throne holders must maintain appropriate content at the Focal
                  Point.
                </li>
                <li>
                  Abusing the bidding system may result in disqualification.
                </li>
              </ul>

              <h2>Enforcement</h2>

              <div className="not-prose my-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="size-5 text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-600">
                      Violations may result in:
                    </p>
                    <ul className="mt-2 text-sm space-y-1 text-muted-foreground">
                      <li>• Warning and content removal</li>
                      <li>• Temporary suspension</li>
                      <li>• Permanent account ban</li>
                      <li>• Removal of pixels without refund</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3>Reporting</h3>
              <p>
                If you see content or behavior that violates these guidelines:
              </p>
              <ul>
                <li>
                  Use the in-app report feature by clicking on a pixel and
                  selecting &#34;Report&#34;
                </li>
                <li>
                  Contact us directly at{" "}
                  <a href="mailto:moderation@pixel.dev" className="text-primary">
                    moderation@pixel.dev
                  </a>
                </li>
                <li>Report serious violations in our Discord #reports channel</li>
              </ul>

              <h3>Appeals</h3>
              <p>
                If you believe your account was suspended in error, you may appeal
                by emailing{" "}
                <a href="mailto:appeals@pixel.dev" className="text-primary">
                  appeals@pixel.dev
                </a>{" "}
                with your username and explanation.
              </p>

              <h2>Updates</h2>
              <p>
                These guidelines may be updated as our community grows. We will
                notify users of significant changes through in-app notifications
                and email.
              </p>

              <p className="text-muted-foreground">
                Thank you for being part of the Pixel community and helping us
                maintain a creative, welcoming space for everyone.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
