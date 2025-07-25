import './globals.css'

export const metadata = {
  title: 'SecureSight CCTV Monitoring Dashboard',
  description: 'Professional CCTV monitoring and incident management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}