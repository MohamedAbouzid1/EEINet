"use client";

import { X, GitHub, Web } from "@mui/icons-material";

const FooterComponent = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="mx-auto max-w-screen-xl px-4 py-8">
                <div className="w-full">
                    <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                        <div className="mb-6 md:mb-0">
                            <a href="https://eeinet.org" className="flex flex-col items-center">
                                <img
                                    src="logo_colored.png"
                                    className="w-20 h-20 mb-2"
                                    alt="EEINet Logo"
                                />
                                <span className="text-3xl font-semibold whitespace-nowrap text-gray-900">
                                    EEINet
                                </span>
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                                    About
                                </h2>
                                <ul className="text-gray-500 font-medium">
                                    <li className="mb-4">
                                        <a href="https://eeinet.org/about" className="hover:underline hover:text-gray-700 transition-colors">
                                            EEINet
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                                    Follow us
                                </h2>
                                <ul className="text-gray-500 font-medium">
                                    <li className="mb-4">
                                        <a href="#" className="hover:underline hover:text-gray-700 transition-colors">
                                            CosyBio
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:underline hover:text-gray-700 transition-colors">
                                            X
                                        </a>
                                    </li>

                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                                    Legal
                                </h2>
                                <ul className="text-gray-500 font-medium">
                                    <li className="mb-4">
                                        <a href="#" className="hover:underline hover:text-gray-700 transition-colors">
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:underline hover:text-gray-700 transition-colors">
                                            Terms & Conditions
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                    <div className="w-full sm:flex sm:items-center sm:justify-between">
                        <span className="text-sm text-gray-500 sm:text-center">
                            © {new Date().getFullYear()}{" "}
                            <a href="#" className="hover:underline hover:text-gray-700 transition-colors">
                                EEINet
                            </a>
                            . All Rights Reserved.

                        </span>
                        <div className="flex mt-4 space-x-5 sm:justify-flex sm:mt-0">


                            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                                <X className="w-4 h-4" />
                                <span className="sr-only">X</span>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                                <GitHub className="w-4 h-4" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                                <Web className="w-4 h-4" />
                                <span className="sr-only">Website</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterComponent;