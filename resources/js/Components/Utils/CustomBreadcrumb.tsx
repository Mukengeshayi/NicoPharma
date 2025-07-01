import { FC } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from '@inertiajs/react'

type BreadcrumbItem = {
  label: string
  href?: string
  icon?: React.ReactNode
}

type CustomBreadcrumbProps = {
  items: BreadcrumbItem[]
}

const CustomBreadcrumb: FC<CustomBreadcrumbProps> = ({ items }) => {
  return (
    <nav className="text-sm text-gray-600 font-medium" aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            )}

            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex items-center space-x-1 hover:underline text-gray-600 hover:text-green-600"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="inline-flex items-center space-x-1 text-gray-400">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default CustomBreadcrumb
