import { FC } from 'react'

const Footer: FC = () => {
    return (
        <footer className="bg-white text-center py-4 text-sm text-gray-500">
            © {new Date().getFullYear()} NicolePharma. Tous droits réservés.
        </footer>
    );
}

export default Footer;
