import { A } from "@solidjs/router"

export const BreadCrumbs = (props) => {
    return <nav class="mb-4" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm" itemscope itemtype="https://schema.org/BreadcrumbList">
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <A
                    href="/courses"
                    class="inline-flex items-center text-gray-600 hover:text-gray-900"
                    itemprop="item"
                >
                    <span itemprop="name" class="font-gsans font-normal">კურსები</span>
                </A>
                <meta itemprop="position" content="1" />
            </li>
            <li class="text-gray-400">/</li>
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <A
                    href={`${import.meta.env.VITE_URL}/courses/?category=${props.category_slug}`}
                    class="inline-flex items-center text-gray-600 hover:text-gray-900"
                    itemprop="item"
                >
                    <span itemprop="name" class="font-gsans font-normal">{props.category_name}</span>
                </A>
                <meta itemprop="position" content="2" />
            </li>
            <li class="text-gray-400">/</li>
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <span itemprop="name" class="font-gsans font-normal">{props.title}</span>
                <meta itemprop="position" content="3" />
            </li>
        </ol>
    </nav>
}