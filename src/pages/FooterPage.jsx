import { Link } from "react-router"

const FooterPage = () => {
  return (
    <footer className="mt-10 border-t border-borders px-5 py-8 text-center text-sm text-secondary-text">
        <Link 
            to={'/'}
            className="flex items-center justify-center gap-2"
        >
            <img 
                src="/public/logo.svg" 
                alt="logo" 
                className="w-12 h-12"
            />
            <h1 className="text-xl font-extrabold tracking-tight text-main-text">
                Fiirso<span className="text-primary-accent">App</span>
            </h1>
        </Link>
        <p className="mt-2">Movie information and authorized viewing options coming soon.</p>
    </footer>
  )
}

export default FooterPage