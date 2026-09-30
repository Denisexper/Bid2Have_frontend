interface ComingSoonPageProps {
  title: string
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <span className="text-4xl">🚧</span>
      <h1 className="text-lg font-bold">{title}</h1>
      <p className="text-sm text-base-content/60">Todavía estamos construyendo esta parte.</p>
    </div>
  )
}
