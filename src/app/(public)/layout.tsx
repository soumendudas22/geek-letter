import { Header, Footer } from '@/components/shared'
import { ScrollToTop } from '@/components/shared/scroll-to-top'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 animate-page-enter">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
