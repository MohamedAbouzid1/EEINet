"use client";

import { X, GitHub, Web, LinkedIn } from "@mui/icons-material";

const FooterComponent = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="mx-auto max-w-screen-xl px-4 py-8">
                <div className="w-full">
                    <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                        <div className="mb-6 md:mb-0">

                            <a href="https://apps.cosy.bio/eeinet/" className="flex flex-col items-center">
                                <img
                                    src="logo_colored.png"
                                    className="w-32 h-32 mb-2"
                                    alt="EEINet Logo"
                                    style={{ marginLeft: '40px' }}
                                />
                                <span className="text-3xl font-semibold whitespace-nowrap text-gray-900">
                                    &nbsp; &nbsp; EEINet
                                </span>
                            </a>

                        </div>
                        <div style={{ marginRight: '20px' }}>
                            <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase text-center">
                                Imprint
                            </h2>

                            <p>Prof. Dr. Jan Baumbach</p>
                            <p>Chair of Computational Systems Biology</p>
                            <p>Phone: +49-40-42838-7313</p>
                            <p>E-Mail: <a href="mailto:cosy[at)zbh.uni-hamburg.de" className="hover:underline hover:text-gray-700 transition-colors">cosy[at)zbh.uni-hamburg.de</a></p>
                            <p>Address: Prof. Dr. Jan Baumbach</p>
                            <p>University of Hamburg</p>
                            <p>Notkestraße 9</p>
                            <p>22607 Hamburg, Germany</p>

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
                            Follow us on: &nbsp;
                            <a href="https://www.linkedin.com/company/cosy-bio/" className="text-gray-500 hover:text-gray-900 transition-colors">
                                <LinkedIn className="w-4 h-4" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                            <a href="https://x.com/cosybio_UHH" className="text-gray-500 hover:text-gray-900 transition-colors">
                                <X className="w-4 h-4" />
                                <span className="sr-only">X</span>
                            </a>

                            <a href="https://www.cosy.bio/" className="text-gray-500 hover:text-gray-900 transition-colors">
                                <Web className="w-4 h-4" />
                                <span className="sr-only">Website</span>
                                &nbsp; &nbsp; &nbsp;&nbsp;
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer >
    );
};

export default FooterComponent;