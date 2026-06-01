import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 px-4 pb-10">
      <div className="max-w-6xl mx-auto glass-card p-8 flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex-1">
          <Logo />
          <p className="mt-3 text-sm text-ink/70 max-w-md">
            Practical, project-first courses to master the exact skills Yasir uses to build
            AI automation, web apps and growth systems for clients.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <a href="https://yasirbashiraisite.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-teal">Services site ↗</a>
          <a href="https://chatwithyasir.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-teal">Chat with Yasir ↗</a>
          <a href="mailto:hello@yasirbashir.com" className="hover:text-teal">Contact</a>
        </div>
      </div>
      <p className="text-center text-xs text-ink/50 mt-6">
        © {new Date().getFullYear()} Yasir Bashir · learnfromyasir
      </p>
    </footer>
  );
}
