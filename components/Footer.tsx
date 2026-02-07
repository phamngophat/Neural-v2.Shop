import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full bg-neutral-50 border-t border-neutral-200 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">

                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                                N
                            </div>
                            <span className="text-xl font-bold text-neutral-900">NeuralShop</span>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                            Your one-stop destination for premium AI tools and creative software.
                            Unlock your potential today.
                        </p>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-bold text-neutral-900 mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-neutral-500">
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">Press</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">News</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-bold text-neutral-900 mb-4">Resources</h3>
                        <ul className="space-y-3 text-sm text-neutral-500">
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">Newsletter</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">Events</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-neutral-900 mb-4">Stay Up to Date</h3>
                        <p className="text-sm text-neutral-500 mb-4">
                            Subscribe to our newsletter for the latest AI updates and deals.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center">
                    <p className="text-sm text-neutral-500">
                        &copy; 2026 NeuralShop Inc. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-sm text-neutral-500">
                        <Link href="#" className="hover:text-indigo-600">Privacy Policy</Link>
                        <Link href="#" className="hover:text-indigo-600">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
